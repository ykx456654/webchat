<template>
	<div class="discuss">
		<section class="discuss-top flex justify-space-between align-items-center">
			<span class="mask"></span>
			<div class="flex align-items-center" @click="seeQuestion">
				<i class="icon" :class="{'icon-nike':onlyQuestion}"></i>
				<span>只看提问</span>
			</div>
			<div class="flex align-items-center" @click="backSubject">
				<span>返回直播话题</span>
			</div>
		</section>
		<div class="no-msgs flex align-items-center justify-center" v-if="normalMsg.msgList.length == 0 && isLoad">
			<img src="../../assets/images/wdzbij_qst.png">
		</div>
		<div class="load-wrap" id="load-wrap" v-show="normalMsg.msgList.length != 0">
			<Loadmore
			class="chat-b-content"
			id="chat-b-content"
			:autoFill="false"
			:top-method="getMsg"
			ref="loadmore"
			@top-status-change="handTopStatus"
			@bottom-status-change="handBottomStatus"
			>
				<!--<transition-group name="list" tag="ul">-->
					<li class="discuss-item flex" :class="{'selected':m.selected}" v-for="(m,index) in normalMsg.msgList" :key="index">
						<div class="discuss-item-left">
							<img src="../../assets/images/default_head.png" v-if="m.headImg==''">
							<img :src="m.headImg" v-else>
						</div>
						<div class="discuss-item-right">
							<h5 class="name" v-text="m.name"></h5>
							<p>{{new Date(m.msgTime*1000).Format('MM-dd hh:mm:ss')}}</p>
							<div data-flex="cross:center box:first" class="discuss-content">
								<i class="icon icon-wen" v-if="m.questionFlag"></i>
								<div v-html="m.textContent.replace(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/ig,'').replace(/\n/g,'<br>')"></div>
							</div>
							<div class="answer" v-if="m.questionFlag && m.ansList[0]">
								<div class="flex align-items-center">
									<img :src="m.ansList[0].headUrl" alt="" v-if="m.ansList[0].headUrl != ''">
									<img src="../../assets/icons/pic_men@2x.png" v-else>
									<span>{{m.ansList[0].name}}</span>
								</div>
								<div class="answer-teacher">
									<div v-if="m.ansList[0].ansType == 1">
										{{m.ansList[0].textContent}}
									</div>
									<div class="flex align-items-center" v-if="m.ansList[0].ansType == 3">
										<div class="answer-voice content"
										v-voice-width="{'vodDuration':m.ansList[0].vodDuration,'msgType':m.ansList[0].ansType}"
										@click="playVoice({vodUrl:m.ansList[0].vodUrl,vodDuration:m.ansList[0].vodDuration},5,index)">
											<div class="voice-msg">
												<i class="icon icon-voice" :class="{'icon-playing':m.ansList[0].playing}"></i>
											</div>
										</div>
										<span class="times">{{m.ansList[0].vodDuration}}s</span>
									</div>
								</div>
							</div>
						</div>
					</li>
				<!--</transition-group>-->
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
			this.init()
			.then(()=>{
				this.hideLoad()
				const query = this.$route.query
				if(typeof query.msgIndex != 'undefined'){
					this.normalMsg.msgList.forEach(item=>{
						item.selected = false
					})
					try{
						this.$nextTick(()=>{
							const length = this.normalMsg.msgList.length
							const index = parseInt(query.msgIndex)
							// this.$refs.loadmore.scrollTop = this.$refs.loadmore.$el.scrollHeight
							// console.log(this.$refs.loadmore.$el.scrollHeight)
							if(this.normalMsg.msgList && this.normalMsg.msgList.length >= 4){
								this.normalMsg.msgList[length - 4 + index].selected = true
							}else{
								var arr = this.normalMsg.msgList
								this.normalMsg.msgList[index].selected = true
							}
							// $()
						})
					}catch(e){
						console.log(e)
					}
				}
				setTimeout(()=>{
					$('#load-wrap')[0].scrollTop = $('#load-wrap')[0].scrollHeight
					$('#chat-b-content').click()
				},0)
			})
			this.isLoad = true
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
			},500,500))
		},
		data () {
			return {
				isCached:false,
				is_top_end:false,
				isLoad:false,
				direction:false, //方向标识，true为拉取新消息，false拉取历史消息
				limit:10,
				onlyQuestion:false,
				isBottom:true,
				flag:true,
				player:null,
				playerIndex:null
			}
		},
		computed: {
			...mapGetters(['normalMsg','loopClock','scroll','userInfo']),
			msgLength () {
				if(this.normalMsg.msgList){
					return this.normalMsg.msgList.length
				}
			}
		},
		methods:{
			...mapMutations(['hideLoad','showLoad','setSubjectInfo','clearMsg','setScroll','setPlayingVoice']),
			...mapActions(['getSubjectInfo','getNormalMsg','loopSubject','getAdvMsg','GETUSERINFO']),
			backSubject () {
				history.back()
			},
			getMsg () {
				this.isBottom = false
				let height = $('#chat-b-content').height()
				this.getNormalMsg({direction:this.direction,limit:this.limit,onlyQuestion:this.onlyQuestion})
				.then(res=>{
					this.$refs.loadmore.onTopLoaded()
					this.$nextTick(()=>{
						let newHeight = $('#chat-b-content').height()
						$('#load-wrap').scrollTop(newHeight - height)
					})
				})
				.done()
			},
			seeQuestion () {
				Indicator.open({
					text: '加载中...',
  					spinnerType: 'fading-circle'
				})
				this.onlyQuestion = !this.onlyQuestion
				this.clearMsg(2)
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
				return Promise.all([p1,p2,p3])
				.then(res=>{
					return res.every(item => item == true)
				})
				.then(()=>{
					this.isCached = true
					this.isLoad = true
					if(JSON.stringify(this.userInfo) == '{}'){
						this.GETUSERINFO()
					}
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

			},
			playVoice (msg,type,index) {
				// console.log(msg)
				// console.log(index)
				if(this.player){
					this.player.pause()
					this.player = null
					if(this.playerIndex == index){
						this.playerIndex = null
						this.setPlayingVoice({type:type+1,i:index})
						return false	
					}
				}
				this.player = new Audio()
				this.player.src = msg.vodUrl
				this.player.play()
				this.playerIndex = index
				this.setPlayingVoice({type:type,i:index})
				// type= 1播放，type=2停止，type=3答案语音播放，type=4答案语音停止  type=5讨论区语音播放。 type=6讨论区语音停止播放
				this.player.addEventListener('ended',()=>{
					this.setPlayingVoice({type:type+1,i:index})
				},false)
			}
		},
		destroyed() {
			if(this.player){
				this.player.pause()
				this.player = null
			}
		},
		watch:{
			msgLength (nv, ov) {
				this.$nextTick(()=>{
					var box = $('#load-wrap')
					if (this.isBottom) {
						// console.log(111111)
						box.scrollTop(box.get(0).scrollHeight)
					}
				})
			}
		},
		directives: {
			voiceWidth (el,binding) {
				/*计算语音宽度，最长60s，最短1s，*/
				el.style.width =.2 + Number(binding.value.vodDuration)*1.2/60 + 'rem'
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
		 -webkit-overflow-scrolling: touch;
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
			/*background-color: #e9f4ea;*/
      animation:myfirst 3s;
      -moz-animation:myfirst 3s; /* Firefox */
      -webkit-animation:myfirst 3s; /* Safari and Chrome */
      -o-animation:myfirst 3s; /* Opera */
      @keyframes myfirst
      {
        from {background:#e2e2e2;}
        to {background:#fff;}
      }

      @-moz-keyframes myfirst /* Firefox */
      {
        from {background:#e2e2e2;}
        to {background:#fff;}
      }

      @-webkit-keyframes myfirst /* Safari and Chrome */
      {
        from {background:#e2e2e2;}
        to {background:#fff;}
      }

      @-o-keyframes myfirst /* Opera */
      {
        from {background:#e2e2e2;}
        to {background:#fff;}
      }
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
					margin-top: 3px;
					margin-right: 10px;
					width: 17px;
					height: 17px;
					float: left;
					background-position: center;
					background-size: 100%;
					align-self:flex-start;
				}
				div{
					text-align: left;
					word-break: break-word;
					flex:1;
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
		.answer-teacher{
			margin-top: 6px;
			padding-left: 26px;
		}
	}
	.content{
		font-size: .15rem;
	    color: #4a4a4a;
	    border: 1px solid #d8d8d8;
	    line-height: .2rem;
	    min-height: .2rem;
	    background-color: #fff;
	    padding: 0 .05rem;
	    max-width: 2.4rem;
	    border-radius: 5px;
	    padding: .05rem .1rem;
	    word-break: break-all;
	    position: relative;
	    margin-top: 5px;
	}
	.answer-voice{
		// flex: 1;
		margin-right: 5px;
		.icon-voice{
			background-image: url(../../assets/icons/yuying2.png);
		}
		.icon-playing{
			animation:  blink 1s linear infinite;
			@keyframes blink {
				0% { background-image: url(../../assets/icons/yuying1.png)}
				50% { background-image: url(../../assets/icons/yuying2.png) }
				100% { background-image: url(../../assets/icons/yuying1.png)}
			}
		}
	}
	.list-enter-active, .list-leave-active {
	  transition: all 1s;
	}
	.list-enter, .list-leave-active {
	  opacity: 0;
	  position: absolute;
	  transform: translateY(30px);
	}
</style>
