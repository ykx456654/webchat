<template>
<div class="ppt-player" :style="{backgroundImage:'url('+pptImg.url+')'}" @click.self="controlSwitch">
    <div class="old-video-player" id="old-video-player" v-if="isOldVideo || (!hasPPt && options.videoStatus === 0) || (!hasPPt && options.liveStatus === 1)">
    </div>
<!--     <div class="old-video-player" id="no-ppt-live-video-player" v-if="isOldVideo || (!hasPPt && options.videoStatus === 0)">

    </div> -->
<!--     <img class="ppt-item" :src="options.poster"
     v-if="(options.liveStatus == 9 && recordPlayStatu == 1) || (options.liveStatus == 0 && hasPPt)"> -->
    <div class="seeking" v-if="seeking">
        <spinner :size="30" type="snake"/>
    </div>
    <!--<img src="" alt="">-->
    <transition name="slide-fade">    
        <div data-flex="main:left cross:center" class="control" v-show="showControl && options.liveStatus == 9">
            <div data-flex="main:center" class="control-s-p" @click="pause">
                <div class="control-start" v-show="recordPlayStatu==4 ">
                </div>
                <div class="control-pause" v-show="recordPlayStatu==3">
                    <span></span>
                    <span></span>
                </div>
            </div>
            <range 
            class="range"
            v-model="playCurrentPercentage" 
            @change="setTime" 
            @input="dragging" 
            :min="0" 
            :max="100">
                <div class="control-time align-items-center" slot="start">{{sourceTime}}</div>
                <div class="control-time align-items-center" slot="end">{{sourceEnd}}</div>
            </range>
            <!--<div class="full-screen-btn">
            </div>-->
        </div>
    </transition>

    <transition name="slide-fade">
        <div data-flex="main:center cross:center" class="control" v-show="showLiveControl && options.liveStatus == 1 && hasPPt">
            <!--<div :class="{'control-pause':livePlayStatu==3,'control-start':livePlayStatu==4}" @click="pause">
            </div>-->
            <div class="ppt-num">
                {{(pptImg.page || 0 ) +1 + '/' + (pptImg.totalPage || 0)}}
            </div>
        </div>
    </transition>


    <div
    data-flex="cross:center main:center" 
    class="generate-mp4" 
    :class="{'pos':hasPPt}"
    v-show="(options.liveStatus == 9 || options.liveStatus == 2) && options.videoStatus != 0">
        生成回放中...
    </div>
    <!--<div class="btn-start"></div>-->
    <div id="video" 
    class="video-box" 
    :class="{'audio':options.subjectType == 3}" 
    data-flex="main:center cross:center" 
    v-if="options.liveStatus==1 && hasPPt">
    <!-- 存在ppt -->
    </div>


    <div 
    id="recordStart" 
    class="control-btn" 
    v-show="(options.liveStatus == 9 && (recordPlayStatu == 4 || recordPlayStatu == 1 || recordPlayStatu == 5)) && options.videoStatus == 0 && !isOldVideo && hasPPt">
    </div>
    <!--<div class="full-screen">
        <img src="http://studioimage.yxj.org.cn/ios11494122809308080.jpeg" alt="">
    </div>-->
</div>
</template>
<script>
import { Range ,Spinner } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { setPPT,throttle,timeFormat} from '../../../utils/func'
import Drag from '../../../utils/drag.js'
import bus from '../../../components/common/eventBus.js'
// var Clappr = require('clappr')
    export default {
        name:'ppt-player',
        props:{
            options:{
                type:Object,
                default:function(){
                    return {
                        
                    }
                }
            }
        },
        mounted () {
            // console.log(22222222222)
            if(this.options.liveStatus == 1){
                this.playLive()
                return false
            }
            if(this.options.liveStatus == 9){
                this.playRecord()
                return false
            }
        },
        data () {
            return {
                playCurrentPercentage:0,
                currentTime:0,
				recordPlayStatu:1,    //回看播放状态，1 未播放，2 已播放， 3 正在播放 ，4 暂停， 5，结束
                livePlayStatu:1,        //直播播放状态，1 未播放，2 已播放， 3 正在播放 ，4 暂停， 5，结束
				defaultPPTIndex:0,
                coursePlayer:null,
                duration:0,
                showControl:false,
                showLiveControl:false,
                canUpdateTimeLine:true,
                timer:null,
                seeking:false,
                hls:null,
                recordImgUrl:'',
                dragger:null
            }
        },
        components:{Range,Spinner},
        computed:{
            ...mapGetters(['recordPlayInfo','currentImg','firstImg']),
    		recordPPTImg () {
				if(this.recordPlayInfo.imgs.length && this.options.videoStatus === 0){
                    if (this.recordImgUrl !== '') {
                        return {url:this.recordImgUrl}
                    }else{
                        return {url:this.options.poster}
                    }

				}else{
					return {url:this.options.poster}
				}
			},
            pptImg () {
                if(this.options.liveStatus == 1 || this.options.liveStatus == 2){
                    // 直播，使用服务器返还的currentImg
                    return this.currentImg
                }else if(this.options.liveStatus == 9){
                    // 录播， 返回recordIMG
                    // console.log(this.recordPPTImg)
                    return this.recordPPTImg
                }else if(this.options.liveStatus === 0){
                    return {url:this.options.poster}
                }else{
                    return {url:'./static/images/pic__zbht.jpg'}
                }
            },
            pptRatio () {
                if(this.pptImg.url && this.pptImg.height){
                    return this.pptImg.height/this.pptImg.width
                }else{
                    return 9/16
                }
            },
            sourceEnd () {
                let duration = parseInt(this.duration)
                return timeFormat(duration,false)
            },
            sourceTime () {
                let current = this.currentTime
                return timeFormat(current,false)
            },
            isPlayLive () {
                return this.$store.state.subject.isPlayLive
            },
            hasPPt () {
                return this.$store.state.subject.imgs.length !== 0
            },
            isOldVideo () {
                // 兼容以前老版本视频
                return !/.mp4*$/g.test(this.options.recordUrl) && this.options.recordUrl!=''
            }
        },
        methods:{
            ...mapMutations(['setIsPlayLive','setPlayFlag']),
            playLive () {
				// this.playurl = 'http://vjs.zencdn.net/v/oceans.mp4'
                console.log('livePlay') 
                class controlBar extends Clappr.MediaControl{
                    get template() { return Clappr.template('<div class="mycontrol control-media">Tada!</div>') }
                    get stylesheet() { 
                        return Clappr.Styler.getStyleFor(
                            `.mycontrol.control-media{font-size:12px;}`
                        )
                    }
                    constructor(options) {
                        super(options)
                    }
                }
                
                this.$nextTick(()=>{
                    try{
                        var _this = this
                        var video =  document.getElementById('video')
                        var options = {
                            source:{source:_this.options.livePullUrl,mimeType:'application/x-mpegURL'},
                            preload:true,
                            hideMediaControl:true,
                            width:90,
                            height:160,
                            playInline:true,
                            mediacontrol:{external:controlBar},
                            hlsjsConfig:{
                                xhrSetup:function(xhr, url){
                                    // console.log(xhr)
                                    // console.log(_this.coursePlayer)
                                    xhr.onerror = function(){
                                        _this.toast('主讲人已离开，请稍后再试')
                                    }
                                }
                            }
                        }

                        if(this.options.subjectType == 3){
                            options.audioOnly = true
                            options.width = '100%'
                            options.height = '100%'
                            options.poster = _this.options.poster
                        }

                        if (!this.hasPPt && this.options.subjectType !== 3) {
                            // 没有ppt的话，直接播放视频
                            options.width = '100%'
                            options.height = '100%'
                            options.poster = _this.options.poster
                            options.hideMediaControl = true
                            options.mediacontrol = { buttons: "#BEBEBE"}
                            video = document.getElementById('old-video-player')
                        }
                        console.log(options)
                        var player = new Clappr.Player(options)
                        player.attachTo(video)
                        player.on(Clappr.Events.PLAYER_PLAY,function(){
                            if(_this.options.subjectType == 3){
                                video.style.display = 'none'
                            }
                            _this.setIsPlayLive(true)
                            _this.setPlayFlag(1)
                            _this.controlSwitch()
                            _this.livePlayStatu = 3
                        })

                        player.on(Clappr.Events.PLAYER_PAUSE,function(){
                            // player.core.MediaControl.$playPauseToggle.resetKeepVisible()
                            _this.showLiveControl = true
                            _this.liveStatus = 4
                        })

                        player.on(Clappr.Events.PLAYBACK_PLAY ,function(){
                            _this.setPlayFlag(1)
                            _this.toast('暂停后开始')
                        })

                        player.on(Clappr.Events.PLAYER_ERROR,function(){
                            _this.setPlayFlag(0)
                            _this.toast('主讲人已离开，请稍后再试')
                        })

                        player.on(Clappr.Events.PLAYER_ENDED,function(){
                            _this.setPlayFlag(0)
                        })


                        this.coursePlayer = player
                        setTimeout(()=>{
                            if(this.options.subjectType == 2 && this.hasPPt){
                                this.dragger = new Drag({
                                    dragEle:'#video',
                                    ondrag:function(data){

                                    }
                                })
                            }
                        },100)
                    }catch(e){
                        alert(e)
                    }
                })
			},
			playRecord () {
                console.log('recordplay')
                if(this.isOldVideo || (!this.hasPPt && this.options.videoStatus === 0)){
                    this.$nextTick(()=>{
                        var _this = this
                        var video = document.getElementById('old-video-player')
                        var options = {
                            source:{source:_this.options.recordUrl,mimeType:'video/mp4'},
                            preload:true,
                            hideMediaControl:true,
                            mediacontrol:{ buttons: "#BEBEBE"},
                            width:'100%',
                            height:'100%',
                            playInline:true,
                            poster:_this.options.poster
                        }
                        var player = new Clappr.Player(options)
                        player.attachTo(video)
                        player.on(Clappr.Events.PLAYER_PLAY,function(){
                            _this.setPlayFlag(1)
                        })
                        player.on(Clappr.Events.PLAYER_ENDED,function(){
                            _this.setPlayFlag(0)
                        })
                        this.coursePlayer = player
                    })
                    return false
                }


				if(this.coursePlayer){
					return false
				}
				this.coursePlayer = new Audio()
				let player = this.coursePlayer
				let _this = this
                // if (this.) {}
				player.src = this.options.recordUrl
				this.recordPlayStatu = 1
				// player.load()
				// 开始播放
				$('#recordStart').click(function(){
                    // console.log(2222)
                    if(_this.recordPlayStatu == 1 || _this.recordPlayStatu == 4 || _this.recordPlayStatu == 5){
                        _this.recordPlayStatu = 2
                    }
					player.play()
                    _this.setPlayFlag(1)
                    _this.duration = player.duration
                    _this.controlSwitch()
				})

				player.addEventListener('timeupdate',throttle(function(){
                    // console.log(1221)
					// 正在播放
					// _this.playCurrentTime = player.currentTime
                    if(_this.recordPlayStatu == 2){
                        _this.duration = player.duration
                        _this.recordPlayStatu = 3
                    }

                    // _this.toast('playing')
					let currentTime = parseInt(player.currentTime)
					let value = setPPT(currentTime,_this.recordPlayInfo.actionList,_this.firstImg)
                    console.log(value)
					let url = value.url
                    _this.currentTime = currentTime
                    if(_this.canUpdateTimeLine){
                        _this.playCurrentPercentage = (currentTime/this.duration).toFixed(2)*100
                    }
                    _this.recordImgUrl = url
				},0,1000))

				player.addEventListener('pause',function(){
					// 暂停
                    _this.setPlayFlag(0)
                    setTimeout(()=>{
                        _this.recordPlayStatu = 4
                    },0)
				})

                player.addEventListener('seeking',function(){
                    _this.seeking = true
                })
                player.addEventListener('seeked',function(){
                    _this.seeking = false
                })

				player.addEventListener('ended',function(){
					// 结束
                    _this.setPlayFlag(0)
                    _this.toast('结束播放')
					setTimeout(()=>{
                        _this.recordPlayStatu = 5
                    },0)
				})
			},
            controlSwitch () {
                if(this.options.liveStatus!=1){
                    this.showControl = true
                    // console.log(1)
                    if(this.timer) clearTimeout(this.timer)
                    this.timer =  setTimeout(()=>{
                        this.showControl = false
                    },3000)
                }else{
                    this.showLiveControl = true
                    if(this.timer) clearTimeout(this.timer)
                    this.timer = setTimeout(()=>{
                        this.showLiveControl = false
                    },3000)
                }
            },
            dragging () {
                this.showControl = true
                this.canUpdateTimeLine = false
            },
            setTime (val) {
                console.log(val)
                this.controlSwitch()
                this.canUpdateTimeLine = true
                let timePoint = parseInt(this.duration * val / 100)
                this.coursePlayer.currentTime = timePoint
                this.currentTime = timePoint
                if(this.coursePlayer.pause){
                    this.coursePlayer.play()
                }
            },
            pause () {
                if(this.options.liveStatus == 1){
                    if(this.livePlayStatu == 3){
                        this.coursePlayer.pause()
                        this.livePlayStatu = 4
                        return false
                    }
                    if(this.livePlayStatu == 4){
                        this.coursePlayer.play()
                        this.livePlayStatu = 3
                        return false
                    }
                }else if(this.options.liveStatus == 9){
                    if(this.recordPlayStatu == 3){
                        this.coursePlayer.pause()
                        this.recordPlayStatu = 4
                        return false
                    }
                    if(this.recordPlayStatu == 4){
                        this.coursePlayer.play()
                        this.recordPlayStatu = 3
                        return false
                    }
                }
            },
            destoryPlayer () {
                try{
                    this.setPlayFlag(0)
                    if(this.options.liveStatus == 9){
                        if(this.isOldVideo){
                            // 以前的视频，关闭播放器
                            this.coursePlayer && this.coursePlayer.destroy()
                            if(this.dragger){
                                this.dragger.offEvent()
                            }
                        }else{
                            this.coursePlayer && this.coursePlayer.pause()
                            clearTimeout(this.timer)
                        }
                    }else{
                        console.log('end')
                        this.coursePlayer && this.coursePlayer.destroy()
                        if(this.dragger){
                            this.dragger.offEvent()
                        }
                    }
                }catch(e){
                    console.log(e)
                    this.coursePlayer = null
                }
            },
            continuePlay () {
                // 打赏的情况下 返回会导致视频暂停
                if(this.options.liveStatus == 1){
                    // 直播
                    if(this.coursePlayer && !this.coursePlayer.isPlaying){
                        this.coursePlayer.play()
                    }
                }

                if(this.options.liveStatus == 9){
                    // 录播
                    if(this.coursePlayer && this.coursePlayer.paused){
                        this.coursePlayer.play()
                    }
                }

            }
        },
        destroyed () {
            this.destoryPlayer()
        },
        watch: {

        }
    }
</script>
<style lang="less">
#video-player::-webkit-media-controls {
  display:none !important;
}
    .ppt-player{
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
    }
    .ppt-item{
        width: 100%;
    }
    .control-btn{
        position: absolute;
        width: 50px;
        height: 50px;
        left: 50%;
        top: 50%;
        margin-left: -25px;
        margin-top: -25px;
        background-image: url(../../../assets/images/play_btn.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
    }
    .control{
        position: absolute;
        z-index: 20;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .seeking{
        position: absolute;
        z-index: 100;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .control-time{margin: 0 3px;}
	.slide-fade-enter-active {
	transition: all .3s ease;
	}
	.slide-fade-leave-active {
	transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-active {
	transform: translateY(10px);
	opacity: 0;
	}
    .video-box{
        display: block;
        position: absolute;
        z-index: 999;
        background-color: #000;
        width: 90px;
        height: 160px;
        left: calc(~'100vw - 100px');
        top: 60px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        video{
            margin: 0 auto;
            display: block;
        }
        &.audio{
            width: 100%;
            height: 60px;
            // border-radius: 50%;
            left: 0;
            top: 0;
            height: 100%;
            // transform: translate(-30px,-30px);
            // background-color: rgba(0,0,0,0.5);
        }
    }
    .btn-start{
        position: absolute;
        left: 100px;
        top: 100px;
        background-color: #000;
        width: 30px;
        height: 30px;
    }
    .range{
        width: 100%;
    }
    .control-s-p{
        width: 25px;
    }
    .control-pause{
        width: 20px;
        height: 12px;
        span{
            display: inline-block;
            width: 3px;
            height: 12px;
            background-color: #fff;
        }
    }
    .control-start{
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-left: 10px solid #fff;
        border-bottom: 6px solid transparent;
        margin-right: 5px;
    }
    .generate-mp4{
        color: #fff;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.3);
    }
    .pos{
        position: absolute;
        left: 0;
        top: 0;
    }
    .full-screen-btn{
        width: 15px;
        height: 15px;
        margin-left: 5px;
        background-image: url(../../../assets/icons/icon_zbht_qp@2x.png);
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }
    .old-video-player,.hasppt-player{
        width: 100%;
        height: 100%;
    }
</style>