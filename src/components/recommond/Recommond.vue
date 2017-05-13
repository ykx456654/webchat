<template>
	<div class="recommond-wrap">
		<loadmore :autoFill="false" :bottom-method="load" :bottom-all-loaded="allLoaded" ref="loadmore">
			<div class="recommond flex" v-for="(r,index) in recommondList">
				<section>
					<div class="header" @click.stop="linkStudio(r.studioId)">
						<img :src="r.studioImg" v-if="r.studioImg !== ''">
						<img src="../../assets/images/shared_icon.jpg" v-else>
					</div>
				</section>
				<section class="flex flex-direction-column flex-wrap">
					<div @click="linkStudio(r.studioId)" class="content-title flex align-items-center justify-space-between">
						<h4>{{r.studioTitle}}</h4>
						<a class="btn" v-if="!r.isFan" @click.stop="focus(r.studioId,index)">关注</a>
					</div>
					<div class="content-box" @click.stop="linkSubject(r)">
						<div class="img-box">
							<img class="page" src="../../assets/images/pic_ht_mr.png" v-if="r.subjectImg == ''">
							<img class="page" v-lazy="r.subjectImg" alt="" v-else>
							<span class="tag status">{{ r.liveStatus | status}}</span>
							<div class="bottom-tag flex">
								<span class="num">{{r.pvNum}}人次</span>
							</div>
						</div>
						<h4>{{r.subjectTitle}}</h4>
            			<p>
							{{ r.startTime | time }}<span v-if="r.fee != 0">
							</span><span class="price" v-if="r.fee != 0">￥ {{(r.fee/100).toFixed(2)}}</span>
						</p>
            <!--<span class="price" v-if="r.fee != 0">￥{{(r.fee/100).toFixed(2)}}</span>-->
						<!-- <p>{{new Date(r.startTime*1000).Format('yyyy-MM-dd hh:ss')}}</p> -->
					</div>
				</section>
			</div>
			<div class="no-more" v-if="allLoaded">
				没有更多了
			</div>
		</loadmore>
	</div>
</template>
<script>
import { mapMutations,mapGetters } from 'vuex'
import storage from 'storejs'
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
				wx.ready(() => {
					var	params = {
						title: '医生站',
						desc: '医生学习的加油站',
						link:`${location.href.replace(/code=+\w*/g,'')}`,
						imgUrl: 'http://' + window.location.hostname + '/images/zhibojian.png'
					};
					console.log(params)
					wx.onMenuShareAppMessage(params);
					wx.onMenuShareTimeline(params);
				})
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
			linkSubject (r) {
				this.showLoad()
				// let openid = storage('openid')
				// console.log(studioId,subjectId)
				if(r.fee > 0){
					this.$router.push({path:'/SubjectIntro',query:{studioId:r.studioId,subjectId:r.subjectId}})
				}else{
					this.$router.push({path:'/Subject',query:{studioId:r.studioId,subjectId:r.subjectId}})
				}
			},
			focus (id,index) {
				api(this.uid,{cmd:"subscribe_studio",srv:"studio_studio"},{
					studioId:id,isSubscribe:true
				})
				.then(res=>{
					res = res.data
					if (res.result != 0 ) {
						this.toast(res.msg)
					}else{
						this.toast('关注成功')
						this.recommondList[index].isFan = true
					}
				})
			}
		},
		filters: {
			status (n) {
				n = Number(n)
				switch(n){
					case 0:return '预告';break;
					case 1:return '正在直播';break;
					case 2:return '正在直播';break;
					case 9:return '回顾';break;
					default:return '预告';
				}
			},
			time (t) {
				var today_end = new Date().Format('yyyy/MM/dd') + ' 23:59:59'
				var today_start = new Date().Format('yyyy/MM/dd') + ' 00:00:01'
				var t_today_start = +new Date(today_start)/1000
				var t_today_end = +new Date(today_end)/1000
				// console.log(t-t_today_start,t_today_end-t)
				if (t > t_today_start && t < t_today_end) {
					return '今天  ' + new Date(t*1000).Format('hh:mm')
				}else{
					return new Date(t*1000).Format('yyyy-MM-dd hh:mm')
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
			width: 52px;
			flex: 1 0 52px;
			box-sizing: border-box;
			img{
				/*width: 100%;*/
				border-radius: 50%;
        width:30px;
			}
		}
		section:nth-child(2){
			flex:0 1 100%;
			width: calc(~"100% - 52px");
		}
		.header{
			padding: 10px 10px 10px 12px;
			box-sizing: border-box;
		}
		.content-title{
			height: 40px;
			padding-right: 12px;
      width:100%;
			h4{
				font-size: 13px;
				color: #333;
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
                display:inline-block;
                float:right;

			}
		}
	}
	.content-box{
		margin-right: 12px;
		/*position: relative;*/
		width: 100%;
        border:1px solid #f2f2f2;
        border-radius: 5px;
        margin-bottom: 15px;
		.page{
			width: 100%;
			position: absolute;
			transform: translate(-50%,-50%);
			left: 50%;
    		top: 50%;
		}
		h4{
			font-size: 15px;
			text-align: left;
			margin: 12px 0;
              padding-left:10px;
              font-weight:500;
              color:#333;
		}
		p{
			text-align: left;
			font-size: 12px;
			color: #666;
			margin-bottom: 12px;
      padding-left:10px;
      span:nth-of-type(1){
        margin-left:10px;
        margin-right: 10px;
        height:12px;
        border-left:1px solid #f2f2f2;
        display:inline-block;
      }
      span:nth-of-type(2){
        color:#D93639;
        font-size:12px;
      }
		}
		.img-box{
			position: relative;
			overflow: hidden;
			/*padding-bottom: 41.6%;*/
			/*border-radius: 3px;*/
      width:100%;
      height:125px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
			.tag{
				position: absolute;
				background-color: rgba(0,0,0,0.6);
				color: #fff;
				border-radius:0 11px 11px 0;
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
				margin-left: 5px;
				bottom:5px;
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
