<template>
	<div class="flex flex-direction-column">
		<x-header :title="subject.subjectTitle">
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
	<!-- 		<a slot="right" @click="">
				设置
			</a> -->
		</x-header>
		<section class="swiper-ppt" :class="{'not-start':!isStart}" v-if="subject.subjectType != 1">
			<img src="../../assets/images/pic__zbht.jpg">
		</section>
		<section class="chat" :class="{'no-ppt':subject.subjectType == 1}">
			<div class="subject-intro flex align-items-center justify-space-between" @click="linkSubjectIntro">
				<i class="icon icon-subject-intro"></i>
				<span>话题介绍</span>
			</div>
			<div class="discuss flex align-items-center justify-center" @click="linkDiscuss">
				<div class="members flex align-items-center">
					<img src="../../assets/icons/icon_rq.png">
					<span v-text="subject.uvNum"></span>
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
		<!-- <button @click="stopLoop">stop</button> -->
		<previewer :list="images" :option="options" ref="previewer"></previewer>
		<popup v-model="showVoice"  is-transparent>
			<record-voice></record-voice>
		</popup>
		<!--<video id="video"></video>-->
		<!--<video id="video" x5-video-player-type="h5" webkit-playsinline="true"  x-webkit-airplay="true" playsinline="true">
			<source :src="playurl"  type="application/x-mpegURL">
		</video>-->
		<div>
			<x-dialog :hide-on-blur="true" v-model="gainShow">
				<gain ref="gain"/>
			</x-dialog>
		</div>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner } from 'mint-ui'
import { Previewer, Popup ,XDialog} from 'vux'
import { api } from '../../utils/api'
import bus from '../common/eventBus'
// import zy from '../../lib/zymedia/zy.media.js'

import ChatPartA from './common/ChatPartA'
import ChatPartB from './common/ChatPartB'
import NormalInput from './common/NormalInput'
import HighInput from './common/HighInput'
import RecordVoice from './common/RecordVoice'
import Gain from './common/Gain'
	export default {
		name:'Subject',
		components:{xHeader:Header,ChatPartA,NormalInput,HighInput,ChatPartB,Previewer,Popup,RecordVoice,Gain,XDialog},
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

			bus.$on('invoke', ()=>{
				this.$refs.gain.clear()
				this.gainShow = true
			})
			bus.$on('endInvoke', ()=>{
				this.gainShow = false
			}) 
			
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
				// console.log(vm)
				vm.setAlive(['Subject','Discuss'])
			})
		},
		beforeRouteLeave (to, from ,next) {
			if (to.name != 'Discuss') {
				this.clearMsg()
				this.setAlive(['noComponent'])
				bus._events = {}
			}else{
				this.setAlive(['Subject','Discuss'])
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
				gainShow:false
			}
		},
		computed: {
			...mapGetters(['subject','id','uvNum','images','uid','loopClock','userInfo','isStart'])
		},
		methods:{
			...mapMutations(['showLoad','hideLoad','setSubjectInfo','clearMsg','setAlive','setPlayingVoice']),
			...mapActions(['getSubjectInfo','enterSubejct','loopSubject','stopLoop','getAdvMsg','getNormalMsg','GETUSERINFO']),
			record (value){
				this.showVoice = value 
			},
			goBcak () {
				// this.$destroy()
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
				var p1 = this.getSubjectInfo()
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
							link:`${location.origin}/Subject?studioId=${this.id.studioId}&subjectId=${this.id.subjectId}`,
							imgUrl: this.subject.subjectImg =='' ? 'http://' + window.location.hostname + '/images/zhibojian.png' : this.subject.subjectImg
						};
						console.log(params)
						wx.onMenuShareAppMessage(params);
						wx.onMenuShareTimeline(params);
					})
					this.playLive()
				})
				.catch(e=>{
					console.log(e + 'from subject_enter')
				})
			},
			playLive () {
				// this.playurl = 'http://vjs.zencdn.net/v/oceans.mp4'
				var player = new Audio()
				// this.$nextTick()
				// player.src = 'http://7xnvc7.com1.z0.glb.clouddn.com/yv1211_1490782401274.mp4'
				// player.play()
			},
			playVoice (obj) {
				// alert(msg)
				if(this.voicePlayer){
					this.voicePlayer.pause()
					this.voicePlayer = null
				}
				this.voicePlayer = new window.Audio()
				this.voicePlayer.src = obj.msg.vodUrl 
				this.voicePlayer.play()
				this.setPlayingVoice({type:obj.type,i:obj.index})
				// type= 1播放，type=2停止，type=3答案语音播放，type=4答案语音停止
				this.voicePlayer.addEventListener('suspend',()=>{
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
		}
	}
</script>
<style lang="less" scoped>
	.swiper-ppt{
		height: 2.1rem;
		width: 100%;
		background-color: #111;
		img{
			width: 100%;
		}
	}
	.chat{
		position: relative;
		// flex:1 1 100%;
		background-color: #f7f7f7;
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

	}
</style>
