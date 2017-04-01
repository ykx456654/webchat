<template>
	<div class="discuss">
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
		<div class="no-msgs flex align-items-center justify-center" v-if="normalMsg.msgList == 0">
			<img src="../../assets/images/wdzbij_qst.png">
		</div>
		<div class="load-wrap">
			<Loadmore
			v-if="normalMsg.msgList != 0"
			class="chat-b-content"
			:autoFill="false"
			:top-method="getHistory"
			ref="loadmore"
			@top-status-change="handTopStatus"
			@bottom-status-change="handBottomStatus"
			>
				<transition-group name="list" tag="ul">
					<li class="discuss-item flex" v-for="(m , index) in normalMsg.msgList" :key="index">
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
					</li>
				</transition-group>
			</Loadmore>
		</div>
		<normal-input></normal-input>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import NormalInput from './common/NormalInput'
import {Spinner,Loadmore } from 'mint-ui'
	export default {
		name:'Discuss',
		components:{
			NormalInput,Spinner,Loadmore
		},
		created () {
			if (this.normalMsg.msgId==0) {
				const query = this.$route.query
				this.setSubjectInfo({subjectId:query.subjectId,studioId:query.studioId})
				var p1 = this.getSubjectInfo()
				var p2 = this.enterSubejct()
				Promise.all([p1,p2])
				.then(res=>{
					return res.every(item => item == true)
				})
				.then(()=>{
					this.isCached = true
					this.hideLoad()
				})
				.catch(e=>{
					console.log(e + 'from subject_enter')
				})
			}
		},
		activated() {
			this.hideLoad()
		},
		data () {
			return {
				isCached:false,
				is_top_end:false
			}
		},
		computed: {
			...mapGetters(['normalMsg'])
		},
		methods:{
			...mapMutations(['hideLoad','showLoad','setSubjectInfo']),
			...mapActions(['enterSubejct','getSubjectInfo','getNormalHistoryMsg','getNormalMsg']),
			backSubject () {
				history.back()
			},
			getHistory () {
				this.getNormalHistoryMsg()
				.then(res=>{
					this.$refs.loadmore.onTopLoaded()
				})
				.done()
			},
			load () {

			},
			handTopStatus (value) {

			},
			handBottomStatus (value) {

			}
		}
	}
</script>
<style lang="less" scoped>
	.chat-b-content{
		min-height: 100%;
		overflow: hidden;
	}
	.load-wrap{
		height: calc(~'100% - 1rem');
		overflow: scroll;
	}
	.no-msgs{
		width: 100%;
		height: 100%;
		img{
			width: 1.43rem;
    		height: 1.75rem;
		}
	}
	.discuss{
		width: 100%;
		height: 100%;
	}
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
	.list-enter-active, .list-leave-active {
	  transition: all 1s;
	}
	.list-enter, .list-leave-active {
	  opacity: 0;
	  transform: translateY(30px);
	}
</style>