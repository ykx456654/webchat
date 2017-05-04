<template>
<div class="ppt-player" :style="{backgroundImage:'url('+pptImg.url+')'}" @click.self="controlSwitch">
    <img class="ppt-item" :src="options.poster"
     v-if="(options.liveStatus == 9 && recordPlayStatu == 1) || options.liveStatus == 0">
    <div class="seeking" v-if="seeking">
        <spinner :size="30" type="snake"/>
    </div>
    <!--<img src="" alt="">-->
    <transition name="slide-fade" v-if="options.liveStatus == 9">
        
        <div data-flex="main:left cross:center" class="control" v-show="true">
            <div :class="{'control-pause':recordPlayStatu==3,'control-start':recordPlayStatu==4}" @click="pause">
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
        </div>
    </transition>
    <!--<div class="btn-start"></div>-->
    <div id="video" data-flex="main:center cross:center" v-if="options.liveStatus==1">
        <!--<video id="video-player" 
        crossOrigin="anonymous"
        v-if="options.subjectType==2" 
        preload="auto" 
        type="application/x-mpegURL" 
        x-webkit-airplay="allow" autoplay webkit-playsinline playsinline="true">
            
        </video>
        -->
    </div>

    <div id="recordStart" class="control-btn" v-show="options.liveStatus==9 && (recordPlayStatu == 4 || recordPlayStatu == 1)"></div>
</div>
</template>
<script>
import { Range ,Spinner } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { setPPT,throttle,timeFormat} from '../../../utils/func'
import Drag from '../../../utils/drag.js'
import Clappr from 'clappr' 
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
                hls:null,
                recordImgUrl:''
            }
        },
        components:{Range,Spinner},
        computed:{
            ...mapGetters(['recordPlayInfo','currentImg']),
    		recordPPTImg () {
				if(this.recordPlayInfo.imgs.length){
					return {url:this.recordImgUrl}
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
                        var video = document.getElementById('video')
                        var player = new Clappr.Player({
                            source:{source:_this.options.livePullUrl,mimeType:'application/x-mpegURL'},
                            autoPlay:false,
                            preload:true,
                            hideMediaControl:true,
                            width:80,
                            height:150,
                            playInline:true,
                            mediacontrol:{external:controlBar}
                        })
                        // player.Playback
                        player.attachTo(video)
                        this.coursePlayer = player
                        // console.log(player.Playback)
                        setTimeout(()=>{
                            new Drag({
                                dragEle:'#video',
                                ondrag:function(data){
                                // console.log(data)
                                }
                            })
                        },100)
                    }catch(e){
                        alert(e)
                    }

                })

			},
			playRecord () {
                // console.log('recordplay')
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
                    if(this.recordPlayStatu==1){
                        _this.recordPlayStatu = 2
                    }
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
                    // console.log(value.actionData)
					let url = value.url
                    _this.currentTime = currentTime
                    if(_this.canUpdateTimeLine){
                        _this.playCurrentPercentage = (currentTime/this.duration).toFixed(2)*100
                    }
                    _this.recordImgUrl = url
				},0,1000))

				player.addEventListener('pause',function(){
					// 暂停
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
					_this.recordPlayStatu = 5
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
            },
            destoryPlayer () {
                // console.log('end')
                if(this.options.liveStatus == 9){
                    this.coursePlayer && this.coursePlayer.pause()
                    clearTimeout(this.timer)
                }else if(this.options.liveStatus == 1){
                    this.coursePlayer && this.coursePlayer.destroy()
                }
                this.coursePlayer = null
            }
        },
        destroyed () {
            // this.destoryPlayer()
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
        display: block;
        position: absolute;
        z-index: 1000;
        background-color: #000;
        width: 80px;
        height: 150px;
        left: calc(~'100vw - 80px');
        top: 60px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        video{
            margin: 0 auto;
            display: block;
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
    .control-pause{
        width: 12px;
        height: 12px;
        background-color: #fff;
        margin-right: 5px;
    }
    .control-start{
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-left: 10px solid #fff;
        border-bottom: 6px solid transparent;
        margin-right: 5px;
    }
</style>