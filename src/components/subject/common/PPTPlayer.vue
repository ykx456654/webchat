<template>
<div class="ppt-player">
    <img class="ppt-item" src="../../../assets/images/pic__zbht.jpg" alt="" v-if="options.liveStatus == 9 && recordPlayStatu == 1">
    <img class="ppt-item" @click="controlSwitch" :src="pptImg.url" alt="" v-else>
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
    <video id="video" >
		<source v-if="options.livePullUrl != ''" :src="options.livePullUrl" x5-video-player-type="h5" webkit-playsinline="true"  x-webkit-airplay="true" playsinline="true"  type="application/x-mpegURL">
	</video>
    <div id="recordStart" class="control-btn" v-show="options.liveStatus==9 && (recordPlayStatu == 4 || recordPlayStatu == 1)"></div>
</div>
</template>
<script>
import { Range ,Spinner } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { setPPT,throttle,timeFormat} from '../../../utils/func'
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
                seeking:false
            }
        },
        components:{Range,Spinner },
        computed:{
            ...mapGetters(['recordPlayInfo','currentImg']),
    		recordPPTImg () {
				if(this.recordPlayInfo.imgs.length){
					let index = this.defaultPPTIndex
					return this.recordPlayInfo.imgs[index]
				}else{
					return {url:''}
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
                    return {url:''}
                }
            },
            sourceEnd () {
                let duration = parseInt(this.duration)
                // console.log(duration/60/60)
                let h = parseInt(duration/60/60) 
                let m = parseInt((duration - h*60*60) / 60)
                let s = parseInt(duration%60)
                return timeFormat(duration,false)
            },
            sourceTime () {
                let current = this.currentTime
                let h = parseInt(current/60/60) 
                let m = parseInt((current - h*60*60) / 60)
                let s = parseInt(current%60)
                return timeFormat(current,false)
            }
        },
        methods:{
            playLive () {
				// this.playurl = 'http://vjs.zencdn.net/v/oceans.mp4'
				var player = $('#video')[0]
                var _this = this
				this.$nextTick(()=>{
					// player.src = 'http://9024.liveplay.myqcloud.com/live/9024_subject200161178.m3u8'
                    if(this.options.livePushUrl != ''){
                        player.load()
					    player.play()
                        player.addEventListener('abort',function(){
                            _this.toast('断流了，重新刷新页面')
                        })
                    }
				})
				// this.$nextTick()
				// player.src = 'http://7xnvc7.com1.z0.glb.clouddn.com/yv1211_1490782401274.mp4'
				// player.play()
			},
			playRecord () {
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
                this.showControl = true
                // console.log(1)
                this.timer =  setTimeout(()=>{
                    this.showControl = false
                },3000)
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
        watch: {

        }
    }
</script>
<style lang="less">
    .ppt-player{
        width: 100%;
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
    }
</style>