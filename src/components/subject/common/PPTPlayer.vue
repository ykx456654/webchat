<template>
<div class="ppt-player" :style="{backgroundImage:'url('+pptImg.url+')'}">
    <img class="ppt-item" :src="options.poster"
     v-if="(options.liveStatus == 9 && recordPlayStatu == 1) || options.liveStatus == 0">
    <div class="seeking" v-if="seeking">
        <spinner :size="30" type="snake"/>
    </div>
    <!--<img src="" alt="">-->
    <transition name="slide-fade" v-if="options.liveStatus == 9">
        <div class="control" v-show="showControl" >
            <range 
            v-model="playCurrentPercentage" 
            @change="setTime" 
            @input="dragging" 
            :min="0" 
            :max="100">
                <div class="control-time align-items-center" slot="start">{{sourceTime}}</div>
                <div class="control-time align-items-center" slot="end">{{sourceEnd}}</div>
            </range>
        </div>
    </transition>
    <div id="mediaSourcePlayer"></div>
    <video id="video" v-if="options.subjectType==2" playsinline webkit-playsinline="true" playsinline="true">
    </video>
    <div id="recordStart" class="control-btn" v-show="options.liveStatus==9 && (recordPlayStatu == 4 || recordPlayStatu == 1)"></div>
</div>
</template>
<script>
import { Range ,Spinner } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { setPPT,throttle,timeFormat} from '../../../utils/func'
import Hls from 'hls.js'
// import videojs from 'video.js'
// window.videojs = videojs
// require('videojs-contrib-hls') 
// require('video.js/dist/video-js.css')
// import Clapper from 'Clappr'
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

        },
        data () {
            return {
                playCurrentPercentage:0,
                currentTime:0,
				recordPlayStatu:1,    //回看播放状态，1 未播放，2 已播放， 3 正在播放 ，4 暂停， 5，结束
				defaultPPTIndex:0,
                coursePlayer:null,
                duration:0,
                showControl:false,
                canUpdateTimeLine:true,
                timer:null,
                seeking:false,
                hls:null
            }
        },
        components:{Range,Spinner},
        computed:{
            ...mapGetters(['recordPlayInfo','currentImg']),
    		recordPPTImg () {
				if(this.recordPlayInfo.imgs.length){
					let index = this.defaultPPTIndex
					return this.recordPlayInfo.imgs[index]
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
                    return this.recordPPTImg
                }else{
                    return {url:'./static/images/pic__zbht.jpg'}
                }
            },
            pptRatio () {
                if(this.pptImg.url){
                    return this.pptImg.height/this.pptImg.width
                }
            },
            sourceEnd () {
                let duration = parseInt(this.duration)
                return timeFormat(duration,false)
            },
            sourceTime () {
                let current = this.currentTime
                return timeFormat(current,false)
            }
        },
        methods:{
            playLive () {
				// this.playurl = 'http://vjs.zencdn.net/v/oceans.mp4'
                console.log('livePlay') 
                var _this = this
                var player
                if(_this.options.subjectType == 2){
                    player = document.getElementById('video')
                }else{
                    player = new Audio()
                }
                var hls = new Hls();
                hls.loadSource(_this.options.livePullUrl);
                    hls.attachMedia(player);
                    hls.on(Hls.Events.MANIFEST_PARSED,function() {
                        $('body').on('click',function(){
                            player.play();
                        })
                });
			},
			playRecord () {
                console.log('recordplay')
				if(this.coursePlayer){
					return false
				}
				this.coursePlayer = new Audio()
				let player = this.coursePlayer
				let _this = this
				player.src = this.options.recordUrl
				this.recordPlayStatu = 1
				player.load()
				// 开始播放
				$('#recordStart').click(function(){
					_this.recordPlayStatu = 2
					player.play()
                    _this.duration = player.duration
                    _this.controlSwitch()
					// console.log(player.duration)
				})

				player.addEventListener('timeupdate',throttle(function(){
					// 正在播放
					// _this.playCurrentTime = player.currentTime
					_this.recordPlayStatu = 3
					let currentTime = parseInt(player.currentTime)
					let value = setPPT(currentTime,_this.recordPlayInfo.actionList)
					let valueAction = JSON.parse(value.actionData)
                    _this.currentTime = currentTime
                    if(_this.canUpdateTimeLine){
                        _this.playCurrentPercentage = (currentTime/this.duration).toFixed(2)*100
                    }
					_this.defaultPPTIndex = value.next == 1 ? valueAction.pageFrom : valueAction.pageTo
					// console.log(value.next)
				},1000,1000))

				player.addEventListener('pause',function(){
					// 暂停
					_this.recordPlayStatu = 4
				})

                player.addEventListener('seeking',function(){
                    _this.seeking = true
                })
                player.addEventListener('seeked',function(){
                    _this.seeking = false
                })

				player.addEventListener('ended',function(){
					// 结束
					_this.recordPlayStatu = 5
				})
			},
            controlSwitch () {
                if(this.options.liveStatus!=1){
                    this.showControl = true
                    // console.log(1)
                    this.timer =  setTimeout(()=>{
                        this.showControl = false
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
                // this.canUpdateTimeLine = true
                let timePoint = parseInt(this.duration * val / 100)
                this.coursePlayer.currentTime = timePoint
                this.currentTime = timePoint
            }
        },
        destroyed () {
            this.coursePlayer && this.coursePlayer.pause()
            this.hls = null 
            this.coursePlayer = null
        },
        watch: {

        }
    }
</script>
<style lang="less">
    .ppt-player{
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
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
    #video{
        display: none;
        position: absolute;
        z-index: 1000;
        background-color: #000;
        width: 50px;
        height: 88px;
        right: 0;
        top: 0;
    }
</style>