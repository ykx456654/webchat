<template>
	<div>
		<section class="discuss-top flex justify-space-between align-items-center">
			<span class="mask"></span>
			<div class="flex align-items-center">
				<i class="icon"></i>
				<span>只看问题</span>
			</div>
			<div class="flex align-items-center" @click="backSubject">
				<span>返回直播话题</span>
			</div>
		</section>
		<ul class="">
			<li v-for="i in [1,2,3,4,5]">
				<div class="discuss-item flex">
					<div class="discuss-item-left">
						<img src="http://img.yishengzhan.cn/user/head/e16deb512ab8456d9eb577dc96b22ab0.jpg">
					</div>
					<div class="discuss-item-right">
						<h5 class="name">fads</h5>
						<p>03-01 18:32</p>
						<div class="discuss-content flex">
							<i class="icon icon-wen"></i>
							<div>
								fafdsadfsa
							</div>
						</div>
						<div class="answer">
							<div class="flex align-items-center">
								<img src="http://img.yishengzhan.cn/user/head/e16deb512ab8456d9eb577dc96b22ab0.jpg">
								<span>fdsafdsa</span>
								<span>fdsfs</span>
							</div>
							<div>
								<div>
									fjisadofsdhiooisdhifsdh
								</div>
							</div>		
						</div>
					</div>
				</div>
			</li>
		</ul>
		<normal-input></normal-input>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import NormalInput from './common/NormalInput'

	export default {
		name:'Discuss',
		components:{
			NormalInput
		},
		created () {
			this.hideLoad()
		},
		activated() {
			this.hideLoad()
		},
		data () {
			return {

			}
		},
		methods:{
			...mapMutations(['hideLoad','showLoad']),
			backSubject () {
				history.back()
			}
		}
	}
</script>
<style lang="less" scoped>
	.discuss-top {
		height: .5rem;
		width: 100%;
		position: relative;
		.mask{
			display: block;
			position: absolute;
			background-color: rgba(0,0,0,0.5);
			width: 100%;
			z-index: -1;
			height: 100%;
		}
		>div{
			height: 28px;
			padding: 0 10px;
			background-color: #d93639;
			color: #fff;
			>.icon{
				width: 15px;
			    height: 15px;
			    border-radius: 3px;
			    border: 1px solid #e2e2e2;
			    margin-right: 5px;
			}
		}
		>div:nth-of-type(1){
			border-radius: 0 14px 14px 0; 
			>span{
				display: block;
				height: 17px;
				line-height: 17px;
			}
		}
		>div:nth-of-type(2){
			border-radius: 14px 0 0 14px;
			span{
				display: block;
			}
		}
	}
	.discuss-item{
		background-color: #fff;
		border-bottom: 1px solid #f7f7f7;
		.discuss-item-left{
			padding: .1rem;
			img{
				width: .38rem;
				height: .38rem;
				border-radius: 50%;
			}
		}
		.discuss-item-right{
			padding-right: .1rem;
			padding-top: .1rem;
			padding-bottom: .1rem;
			width: 100%;
			>h5{
				font-size: 14px;
				text-align: left;
				margin: 0;
				font-weight: normal;
			}
			>p{
				color: #999;
				margin: 2px 0;
				text-align: left;
			}
			.discuss-content{
				i{
					margin-right: 10px;
					flex:0 0 auto;
				}
				div{
					text-align: left;
				}
			}
		}
	}
	.answer{
		margin-top: 12px;
		background-color: #e9f4ea;
		width: 100%;
		text-align: left;
		border-radius: 5px;
		padding: 10px;
		box-sizing: border-box;
		>div:first-child{
			font-size: 15px;
			img{
				width: 24px;
				height: 24px;
				border-radius: 50%;
				margin-right: 5px;
			}
			span:last-child{
				color: #999;
			}
			span:first-child{
				color: #000;
			}

		}
	}
</style>