<template>
	<div class="discuss">
		<section class="discuss-top flex justify-space-between align-items-center">
			<span class="mask"></span>
			<div class="flex align-items-center" @click="seeQuestion">
				<i class="icon" :class="{'icon-nike':onlyQuestion}"></i>
				<span>只看问题</span>
			</div>
			<div class="flex align-items-center" @click="backSubject">
				<span>返回直播话题</span>
			</div>
		</section>
		<div class="no-msgs flex align-items-center justify-center" v-if="normalMsg.msgList == 0 && isLoad">
			<img src="../../assets/images/wdzbij_qst.png">
		</div>
		<div class="load-wrap" id="load-wrap" v-show="normalMsg.msgList != 0">
			<Loadmore
			class="chat-b-content"
			
			id="chat-b-content"
			:autoFill="false"
			:top-method="getMsg"
			ref="loadmore"
			@top-status-change="handTopStatus"
			@bottom-status-change="handBottomStatus"
			>
				<transition-group name="list" tag="ul">
					<li class="discuss-item flex" :class="{'selected':m.selected}" v-for="(m,index) in normalMsg.msgList" :key="index">
						<div class="discuss-item-left">
							<img src="../../assets/images/default_head.png" v-if="m.headImg==''">
							<img src="http://img.yishengzhan.cn/user/head/e16deb512ab8456d9eb577dc96b22ab0.jpg" v-else>
						</div>
						<div class="discuss-item-right">
							<h5 class="name" v-text="m.name"></h5>
							<p>{{new Date(m.msgTime*1000).Format('MM-dd hh:mm:ss')}}</p>
							<div class="discuss-content">
								<i class="icon icon-wen" v-if="m.questionFlag"></i>
								{{m.textContent}}
							</div>
							<div class="answer" v-if="m.questionFlag">
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
import {Loadmore ,Indicator } from 'mint-ui'
import bus from '../common/eventBus'
import { throttle } from '../../utils/func'
	export default {
		name:'Discuss',
		components:{
			NormalInput,Loadmore,Indicator
		},
		created () {
			if (!this.loopClock) {
				this.init()
			}else{
				this.hideLoad()
				this.isLoad = true
			}
		},
		mounted () {
			var $chatWrapper = $('#load-wrap')
			var $chatLoader = $('#chat-b-content')
			var _this = this
			$chatWrapper.on('scroll',throttle(function(){
				_this.isBottom = false
				var flag = $chatLoader.height() - $chatWrapper.height() - $chatWrapper.scrollTop()
				if (flag == 0) {
					_this.isBottom = true
				}else{
					_this.setScroll({b:$chatWrapper.scrollTop()})
					_this.isBottom = false
				}
				// console.log(_this.isBottom)
			},500,500))
		},
		activated() {
			this.hideLoad()
			let $chatWrapper = $('#load-wrap')
			let b = this.scroll.b
			let query = this.$route.query
			// console.log('activated')
			if (b != 'init' && !this.isBottom) {
				this.$nextTick(()=>{
					$('#load-wrap').scrollTop(b)
				})
			}
			if (this.isBottom) {
				$chatWrapper.scrollTop(100000)
			}
			if(typeof query.msgIndex != 'undefined'){
				this.$nextTick(()=>{
					const length = this.normalMsg.msgList.length
					const index = parseInt(query.msgIndex)
					this.normalMsg.msgList[length - 4 + index].selected = true
				})
			}	
		},
		data () {
			return {
				isCached:false,
				is_top_end:false,
				isLoad:false,
				direction:false, //方向标识，true为拉取新消息，false拉取历史消息
				limit:10,
				onlyQuestion:false,
				isBottom:true
			}
		},
		computed: {
			...mapGetters(['normalMsg','loopClock','scroll']),
			msgLength () {
				return this.normalMsg.msgList.length
			}
		},
		methods:{
			...mapMutations(['hideLoad','showLoad','setSubjectInfo','clearMsg','setScroll']),
			...mapActions(['getSubjectInfo','getNormalMsg','loopSubject','getAdvMsg']),
			backSubject () {
				this.normalMsg.msgList.forEach(item=>{
					item.selected = false
				})
				history.back()
			},
			getMsg () {
				this.isBottom = false
				this.getNormalMsg({direction:this.direction,limit:this.limit,onlyQuestion:this.onlyQuestion})
				.then(res=>{
					this.$refs.loadmore.onTopLoaded()
				})
				.done()
			},
			jumpMsg () {
				const query = this.$router.query
				if(query){

				}
			},
			seeQuestion () {
				Indicator.open({
					text: '加载中...',
  					spinnerType: 'fading-circle'
				})
				this.onlyQuestion = !this.onlyQuestion
				this.clearMsg(2)
				// this.isLoad = false
				this.getNormalMsg({direction:this.direction,limit:this.limit,onlyQuestion:this.onlyQuestion})
				.then(res=>{
					this.isLoad = true
					Indicator.close()
				})
				.catch(e=>{
					alert(e)
				})
			},
			init () {
				const query = this.$route.query
				this.setSubjectInfo({subjectId:query.subjectId,studioId:query.studioId})
				var p1 = this.getSubjectInfo()
				var p2 = this.getNormalMsg({direction:this.direction,limit:this.limit,onlyQuestion:this.onlyQuestion})
				var p3 =this.getAdvMsg({direction:this.direction,limit:this.limit})
				Promise.all([p1,p2,p3])
				.then(res=>{
					return res.every(item => item == true)
				})
				.then(()=>{
					this.isCached = true
					this.isLoad = true
					this.hideLoad()
					this.loopSubject()
				})
				.catch(e=>{
					console.log(e + 'from subject_enter')
				})
			},
			handTopStatus (value) {

			},
			handBottomStatus (value) {

			}
		},
		watch:{
			msgLength (nv, ov) {
				this.$nextTick(()=>{
					var box = $('#load-wrap')
					if (this.isBottom) {
						box.scrollTop(100000)
					}
				})
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
		height: calc(~'100% - 1rem');
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
		&.selected{
			background-color: #e9f4ea;
		}
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
				text-align: left;
				word-break: break-word;
				i{
					margin-right: 10px;
					margin-bottom: -5px;
					float: left;
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