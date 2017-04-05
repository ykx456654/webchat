<template>
	<div class="recommond-wrap">
		<loadmore :autoFill="false" :bottom-method="load" :bottom-all-loaded="allLoaded" ref="loadmore">
			<div class="recommond flex" v-for="r in recommondList">
				<section>
					<div class="header" @click="linkStudio(r.studioId)">
						<img :src="r.studioImg" v-if="r.studioImg !== ''">
						<img src="../../assets/images/shared_icon.jpg" v-else>
					</div>
				</section>
				<section class="flex flex-direction-column">
					<div class="content-title flex align-items-center justify-space-between">
						<h4>{{r.studioTitle}}</h4>
						<a class="btn" v-if="r.isFan" @click="focus(r.studioId)">关注</a>
					</div>
					<div class="content-box" @click="linkSubject(r.studioId,r.subjectId)">
						<div class="img-box">
							<img class="page" src="../../assets/images/pic_ht_mr.png">	
							<span class="tag status">{{ r.liveStatus | status}}</span>
							<div class="bottom-tag flex">
								<span class="price" v-if="r.fee != 0">{{(r.fee/100).toFixed(2)}}</span>
								<span class="num">{{r.uvNum}}人次</span>
							</div>
						</div>
						<h4>{{r.subjectTitle}}</h4>
						<p>{{ r.startTime | time }}</p>
					</div>
				</section>
				<div class="no-more" v-if="allLoaded">
					没有更多了
				</div>
			</div>
		</loadmore>
	</div>
</template>
<script>
import { mapMutations,mapGetters } from 'vuex'
import { Loadmore } from 'mint-ui';
import { api } from '../../utils/api'
	export default {
		name:'Recommond',
		components:{
			Loadmore
		},
		created () {
			this.load()
			.then(()=>{
				window.scroll(0,0)
			})
		},
		data () {
			return {
				recommondList:[],
				start:0,
				limit:5,
				is_end:false,
				allLoaded:false
			}
		},
		methods:{
			...mapMutations([
				'showLoad','hideLoad'
			]),
			load () {
				return api(this.uid,{cmd:'get_recommend_subject',srv:'studio_studio'},{start:this.start,limit:this.limit})
				.then(res=>{
					res = res.data
					if (res.result != 0 ) {
						this.toast(res.msg)
					}else{
						if (this.recommondList.length == 0) {
							this.hideLoad()
						}
						this.recommondList = this.recommondList.concat(res.rsps[0].body.subjects)
						this.start+=this.limit
						this.is_end = res.rsps[0].body.is_end
						if (this.is_end) {
							this.allLoaded = true
						}
						this.$refs.loadmore.onBottomLoaded();
					}
				})
			},
			linkStudio (id) {
				this.showLoad()
				this.$router.push({path:'/Studio',query:{studioId:id}})
			},
			linkSubject (studioId,subjectId) {
				this.showLoad()
				// console.log(studioId,subjectId)
				this.$router.push({path:'/Subject',query:{studioId:studioId,subjectId:subjectId}})
			},
			focus (id) {
				alert(id)
			}
		},
		filters: {
			status (n) {
				n = Number(n)
				switch(n){
					case 0:return '预告';break;
					case 1:return '正在直播';break;
					case 2:return '回答中';break;
					case 9:return '回顾';break;
					default:return '预告';
				}
			},
			time (t) {
				var today = new Date().Format('yyyy/MM/dd') + ' 23:59:59'
				var t_today = +new Date(today)/1000
				if (t > t_today) {
					return new Date(t*1000).Format('yyyy-MM-dd hh:ss')
				}else{
					return '今天  ' + new Date(t).Format('hh:ss')
				}
			}
		},
		computed : {
			...mapGetters(['uid'])
		}
	}
</script>
<style lang="less" scoped>
	.recommond-wrap{
		padding-bottom: 55px;
	}
	.recommond{
		border-bottom: 1px solid #f2f2f2;
		section:nth-child(1){
			width: 62px;
			box-sizing: border-box;
		}
		section:nth-child(2){
			flex:1 1 auto;
			width: calc(~"100% - 62px");
		}
		img{
			width: 100%;
			border-radius: 50%;
		}
		.header{
			padding: 10px 10px 10px 12px;
			box-sizing: border-box;
		}
		.content-title{
			height: 40px;
			padding-right: 12px;
			h4{
				font-size: 15px;
				// color: #666;
				margin: 0;
				font-weight: normal;
			}
			.attention{
				// color: #d93639;
			}
			a{
				color: #d93639;
				padding: 0px 15px;
				background: #fff;
				border: 1px solid #d93639;
				border-radius: 11px;
				height: 22px;
				line-height:22px;
			}
		}
	}
	.content-box{
		padding-right: 12px;
		position: relative;
		.page{
			width: 100%;
			border-radius: 3px;
		}
		h4{
			font-size: 15px;
			text-align: left;
			margin: 5px 0;
		}
		p{
			text-align: left;
			font-size: 14px;
			color: #666;
			margin-bottom: 10px;
		}
		.img-box{
			position: relative;
			overflow: hidden;
			.tag{
				position: absolute;
				background-color: rgba(0,0,0,0.6);
				color: #fff;
				border-radius: 11px;
				height: 22px;
				line-height: 22px;
				padding: 0 6px;
				font-size: 12px;
			}
			.status{
				left: 0;
				top: 0;
			}
			.bottom-tag{
				position: absolute;
				width: 100%;
				overflow: hidden;
				bottom:10px;
				.price{
					margin-left: 5px;
					margin-right: 6px;
					border-radius: 5px;
					height: 20px;
					line-height: 20px;
					padding:0 5px;
					color: #fff;
					background-color: rgba(0,0,0,0.6)
				}
				.num{
					border-radius: 5px;
					height: 20px;
					line-height: 20px;
					padding:0 5px;
					color: #fff;
					background-color: rgba(0,0,0,0.4);
				}
			}
		}
	}
</style>