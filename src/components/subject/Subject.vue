<template>
	<div>
		<x-header :title="subject.subjectTitle">
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
			<a class="relative" slot="right">
				<a class="tip-to-app" href="https://www.yishengzhan.cn/download?channel=release_webysz">
					医生站app
				</a>
			</a>
		</x-header>
		<tip v-show="tipShow && subject.subjectType != 1" @close="()=>{tipShow=false}" content="如播放时默认全屏，推荐您使用医生站APP收看，功能更稳定，体验更好哦~"></tip>
		<section class="swiper-ppt" :class="{'not-start':!isStart}" :style="{'height':partSize.pptHeight}" v-if="subject.subjectType != 1">
			<ppt-player
			:options="PPTPlayerOption"
			ref="pptPlayer">
			</ppt-player>
		</section>
		<section class="chat" :class="{'no-ppt':subject.subjectType == 1}" :style="{'height':partSize.chatAHeigt}">
			<div class="subject-intro flex align-items-center justify-space-between" @click="linkSubjectIntro">
				<i class="icon icon-subject-intro"></i>
				<span>话题介绍</span>
			</div>
			<div class="discuss flex align-items-center justify-center" @click="linkDiscuss">
				<div class="members flex align-items-center">
					<img src="../../assets/icons/icon_rq.png">
					<span v-text="subject.pvNum"></span>
				</div>
				<div class="flex align-items-center justify-center">讨论</div>
			</div>
			<div class="studio-home">
				<i class="icon icon-studio-home" @click="linkStudio"></i>
			</div>
			<chat-part-b></chat-part-b>
			<chat-part-a :subject-info="subject"></chat-part-a>
		</section>
		<section>
			<normal-input v-if="subject.subjectRole == 100"></normal-input>
			<high-input v-else></high-input>
		</section>
		<previewer :list="images" :option="options" ref="previewer"></previewer>
		<popup v-model="showVoice"  is-transparent>
			<record-voice></record-voice>
		</popup>
		<gain v-show="gainShow" :info="gainInfo" ref="gain"/>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner,Swipe, SwipeItem,Range  } from 'mint-ui'
import { Previewer, Popup ,XDialog} from 'vux'
import { api } from '../../utils/api'
import { throttle,setPPT } from '../../utils/func'
import bus from '../common/eventBus'
import storage from 'storejs'
// import zy from '../../lib/zymedia/zy.media.js'

import ChatPartA from './common/ChatPartA'
import ChatPartB from './common/ChatPartB'
import NormalInput from './common/NormalInput'
import HighInput from './common/HighInput'
import RecordVoice from './common/RecordVoice'
import Gain from './common/Gain'
import pptPlayer from './common/PPTPlayer'
import Tip from './common/Tip'
	export default {
		name:'Subject',
		components:{
			xHeader:Header,
			ChatPartA,
			NormalInput,
			HighInput,
			ChatPartB,
			Previewer,
			Popup,
			RecordVoice,
			Gain,
			XDialog,
			Swipe,
			SwipeItem,
			Range,
			pptPlayer,
			Tip
		},
		created () {
			// console.log(1)
			if (!this.loopClock) {
				this.init()
			}
		},
		mounted () {
			bus.$on('show',index=>{
				/*预览图片*/
				this.showPreviewer(index)
			})

			bus.$on('record',value=>{
				this.record(value)
			})

			bus.$on('playVoice', msg => {
				this.playVoice(msg)
			})

			bus.$on('endVoice',msg => {
				this.endVoice(msg)
			})

			bus.$on('invoke', msg=>{
				this.$refs.gain.clear()
				this.gainInfo = msg
				this.gainShow = true
				// console.log(msg)
			})
			bus.$on('endInvoke', ()=>{
				this.gainShow = false
			})

			if(this.isWeChat && this.subject.subjectType != 1){
				const openid = storage('openid')
			}

			setTimeout(()=>{
				this.tipShow = false
			},5000)

		},
		activated () {
			if (this.isCached) {
				this.hideLoad()
			}
		},
		deactivated () {

		},
		beforeRouteEnter (to ,from ,next) {
			next(vm => {
				// vm.setAlive(['Subject'])
			})
		},
		beforeRouteLeave (to, from ,next) {
			this.clearMsg()
			this.showLoad()
			if(this.$refs.pptPlayer){
				this.$refs.pptPlayer.destoryPlayer()
			}
			bus._events = {}
			if(this.voicePlayer){
				this.voicePlayer.pause()
				this.voicePlayer = null
			}
			next()
		},
		data () {
			return {
				isCached:false,
				showVoice:false,
				options:{
					getThumbBoundsFn (index) {
						let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
			          	// get window scroll Y
			        	let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
			          	// optionally get horizontal scroll
			          	// get position of element relative to viewport
			          	let rect = thumbnail.getBoundingClientRect()
			          	// w = width
			          	return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
					}
				},
				advMsgDirection:false,   //方向标识，true，拉取新消息，false，拉取历史消息
				nrmMsgDirection:false,
				limit:10,
				voiceUrl:'',
				voicePlayer:null,
				playurl:'',
				gainShow:false,
				canplay:false,
				tipShow:true,
				gainInfo:{}
			}
		},
		computed: {
			...mapGetters(['subject','id','uvNum','images','uid','loopClock','userInfo','isStart','currentImg','isWeChat','system','isWeChat']),
			liveStatus () {
				return this.subject.liveStatus
			},
			PPTPlayerOption () {
				return {
					liveStatus:this.liveStatus,
					livePullUrl:this.subject.livePullUrl,
					recordUrl:this.subject.videoUrl,
					subjectType:this.subject.subjectType,
					poster:this.subject.subjectImg,
					videoStatus:this.subject.videoStatus
				}
			},
			partSize () {
				let pptComponent = this.$refs.pptPlayer
				if(pptComponent){
					let ratio = pptComponent.pptRatio || 0.56
				}else{
					return {pptHeight:'',chatAHeigt:''}
				}
				let w = $(window).width()
				let h = $(window).height()
				let rem = w / 3.75
				let h_rem = h / rem
				let s = {
					pptHeight: (w * ratio / rem).toFixed(2) + 'rem',
					chatAHeigt: (h_rem - w * ratio / rem - 0.45 - 0.5 ).toFixed(2) + 'rem'
				}
				if(this.subject.subjectType != 1){
					return s
				}else{
					return {pptHeight:'',chatAHeigt:''}
				}
			}
		},
		methods:{
			...mapMutations(['showLoad','hideLoad','setSubjectInfo','clearMsg','setAlive','setPlayingVoice']),
			...mapActions(['getSubjectInfo','enterSubejct','loopSubject','stopLoop','getAdvMsg','getNormalMsg','GETUSERINFO']),
			record (value){
				this.showVoice = value
			},
			goBcak () {
				this.showLoad()
				history.back()
			},
			linkSubjectIntro () {
				this.showLoad()
				setTimeout(()=>{
					this.$router.push({path:'/SubjectIntro',query:{subjectId:this.id.subjectId,studioId:this.id.studioId}})
				},0)
			},
			linkDiscuss () {
				this.showLoad()
				const query = this.$route.query
				this.$router.push({path:'/Discuss',query})
			},
			linkStudio () {
				this.showLoad()
				const query = this.$route.query
				this.$router.push({path:'/Studio',query})
			},
			showPreviewer (index) {
				setTimeout(()=>{
					try {
						this.$refs.previewer.show(index)
					}catch(e){
						console.log(e)
					}
				},10)
			},
			init () {
				const query = this.$route.query
				this.setSubjectInfo({subjectId:query.subjectId,studioId:query.studioId})
				var p1 = this.enterSubejct(this)
				var p2 = this.getAdvMsg({direction:this.advMsgDirection,limit:this.limit})
				var p3 = this.getNormalMsg({direction:this.nrmMsgDirection,limit:this.limit,onlyQuestion:false})
				// if (this.subject.) {}
				Promise.all([p1,p2,p3])
				.then(res=>{
					return res.every(item => item == true)
				})
				.then(()=>{
					this.isCached = true
					this.hideLoad()
				})
				.then(()=>{
					if(JSON.stringify(this.userInfo) == '{}'){
						this.GETUSERINFO()
					}
					this.loopSubject()
					wx.ready(() => {
						var	params = {
							title: this.subject.subjectTitle,
							desc: this.subject.subjectIntro,
							link:`${location.href.replace(/code=+\w*/g,'')}`,
							imgUrl: this.subject.subjectImg =='' ? 'http://' + window.location.hostname + '/images/zhibojian.png' : this.subject.subjectImg
						};
						console.log(params)
						wx.onMenuShareAppMessage(params);
						wx.onMenuShareTimeline(params);
					})
				})
				.catch(e=>{
					console.log(e + 'from subject_enter')
				})
			},
			playVoice (obj) {
				// alert(msg)
				// console.log('12231231321')
				if(this.voicePlayer){
					this.voicePlayer.pause()
					this.voicePlayer = null
				}
				this.voicePlayer = new window.Audio()
				this.voicePlayer.src = obj.msg.vodUrl
				this.voicePlayer.play()
				console.log(obj)
				this.setPlayingVoice({type:obj.type,i:obj.index})
				// type= 1播放，type=2停止，type=3答案语音播放，type=4答案语音停止
				this.voicePlayer.addEventListener('ended',()=>{
					this.setPlayingVoice({type:obj.type+1,i:obj.index})
				},false)
			},
			endVoice (obj) {
				// 停止录音
				if(this.voicePlayer){
					this.voicePlayer.pause()
					this.voicePlayer = null
				}
				this.setPlayingVoice({type:obj.type,i:obj.index})
			}
		},
		watch:{
			liveStatus (nv,ov) {
				if(this.subject.subjectType > 1){
					if(nv == 1 ){
						this.$nextTick(()=>{
							this.$refs.pptPlayer.playLive()
							// console.log(1)
						})
					}
					if(nv == 9 ){
						this.$nextTick(()=>{
							this.$refs.pptPlayer.playRecord()
							console.log(200000)
						})
					}
				}
			}
		}
	}


</script>
<style lang="less" scoped>
	.swiper-ppt{
		height: 2.1rem;
		width: 100%;
		background-color: #fff;
		position: relative;
		img{
			margin-top: 30px;
			width: 25%;
		}
	}
	.chat{
		position: relative;
		// flex:1 1 100%;
		background-color: #eef1f5;
		height: calc(~'100vh - 3.05rem');
		overflow: hidden;
		&.no-ppt{
			height: calc(~'100vh - 0.95rem');
		}
	}
	.input{
		flex:0 0 auto;
		// position: fixed;
		align-self: space-around;
		bottom: 0;
		height: 0.5rem;
	}
	.subject-intro{
		position: absolute;
		background-color: #fff;
		left: 10px;
		top: 10px;
		width: 100px;
		height: 30px;
		line-height: 30px;
		border-radius: 18px;
		z-index: 10;
		i{
			background-image: url(../../assets/images/pic_htjs.png);
			background-repeat: no-repeat;
			margin-left: 5px;
			width: 24px;
			height: 24px;
		}
		span{
			color: #d93639;
			font-size: 12px;
			text-align: left;
			margin-left: 8px;
			display: block;
			width: 60px;
			flex:1 1 auto;
		}
	}
	.studio-home{
		position: absolute;
		bottom: 30px;
		z-index: 10;
		right: 10px;
		i{
			background-image: url(../../assets/images/button_hdzbj.png);
			width: 55px;
			height: 60px;
		}
	}
	.chat-part-a{
		position: relative;
		height: 100%;
		overflow-y: scroll;
		overflow-x:hidden;
		-webkit-overflow-scrolling: touch;
	}
	.chat-part-b{
		position: absolute;
		z-index: 10;
		width: 1.15rem;
		top: 0.45rem;
		right: 0.05rem;
	}
	.discuss{
		position: absolute;
	    top: .05rem;
	    right: .05rem;
	    z-index: 10;
	    .members{
	    	background-color: #303031;
		    color: #fff;
		    height: .25rem;
		    padding: 0 .2rem 0 .15rem;
		    border-radius: .125rem 0 0 .125rem;
		    span{
		    	font-size: 12px;
		    	margin-left: 3px;
		    }
		    img{
		    	width: 0.15rem;
		    }
	    }
	    >div:nth-child(2){
			width: .3rem;
		    height: .3rem;
		    border-radius: .15rem;
		    background-color: #d93639;
		    text-align: center;
		    color: #fff;
		    margin-left: -15px;
		    font-size: 12px;
	    }
	}
	.voice-player{
		display: none;
	}
	.high-input-wrap{
		background-color: #fff;
		height: 300px;
	}
	#video{
		display: none;
	}
	.relative{
		position: relative;
	}
	.tip-to-app{
		border: 1px solid #fff;
		border-radius: 3px;
		display: inline-block;
		text-align: center;
		color: #fff;
		padding:5px 2px;
		margin: 0;
		font-size:12px;
	}

</style>
