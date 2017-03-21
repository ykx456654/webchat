<template>
	<div class="recommond-wrap">
		<loadmore :autoFill="false" :bottom-method="load" :bottom-all-loaded="allLoaded" ref="loadmore">
			<div class="recommond flex" v-for="r in recommondList">
				<section>
					<div class="header">
						<img src="../../assets/images/shared_icon.jpg">
					</div>
				</section>
				<section class="flex flex-direction-column">
					<div class="content-title flex align-items-center justify-space-between">
						<h4>里法师法的直播间</h4>
						<a class="btn">关注</a>
					</div>
					<div class="content-box">
						<div class="img-box">
							<img class="page" src="../../assets/images/pic_ht_mr.png">	
							<span class="tag status">正在直播</span>
							<div class="bottom-tag flex">
								<span class="price">$54.2</span>
								<span class="num">4515人次</span>
							</div>
						</div>
						<h4>晚期法司法hi多撒谎发大四</h4>
						<p>今天 18:30</p>
					</div>
				</section>
			</div>
		</loadmore>
	</div>
</template>
<script>
import { mapMutations } from 'vuex'
import { Loadmore } from 'mint-ui';

	export default {
		components:{
			Loadmore
		},
		created () {
			setTimeout(()=>{
				this.load()
				this.hideLoad()
			},1000)

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
				if (this.start > 5) return false;
				for(var i = 0;i < 5;i++){
					this.recommondList.push(this.start)
				}
				// this.allLoaded = true
				this.$refs.loadmore.onBottomLoaded();
				this.start++
			}
		}
	}
</script>
<style lang="less">
	.recommond-wrap{
		padding-bottom: 55px;
	}
	.recommond{
		border-bottom: 1px solid #f2f2f2;
		section:nth-child(1){
			flex:0 1 62px;
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
		}
		.content-title{
			height: 47px;
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