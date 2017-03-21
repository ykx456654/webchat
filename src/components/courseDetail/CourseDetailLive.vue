<template>
	<div class="course-detail-live">
		<x-header :title="vdo.title">
			<router-link to="/CourseLive" slot="left">
				<img src="../../assets/images/back2.png">
			</router-link>
			<a class="btn course-detail-btn" slot="right">关注</a>
		</x-header>
<!-- 		<div class="video-pannel">
			<video class="video-js vjs-custom-skin" id="video-play" playsinline></video>
		</div> -->
		<div class="zy_media">
			<video id="ss" :poster="vdo.coverpicUrl" playsinline>
		        <source :src="playurl"  type="application/x-mpegURL">
		    </video>
		</div>
		<div class="course-menu flex">
			<div class="flex align-items-center" :class="{'active':vdo.signup}" @click="signIn">
				<i class="sprite-icon sign-up"></i>
				<span>{{vdo.signup?'已报名':'报名'}}</span>
			</div>
			<div class="flex align-items-center" :class="{'active':vdo.supported === 1}" @click="support">
				<i class="sprite-icon support"></i>
				<span>{{vdo.supportNum}}</span>
			</div>
		</div>
		<section class="course-intro">
			<h4>课程介绍</h4>
			<article>
				{{vdo.content}}
			</article>
		</section>
		<section class="teacher-intro">
			<h4>讲师介绍</h4>
			<div class="teacher-head flex">
				<div class="header">
					<img :src="vdo.proHeadUrl">
				</div>
				<div class="intro flex justify-space-between">
					<p v-text="vdo.proName"></p>
					<p v-text="vdo.proTitle"></p>
					<p>{{vdo.org + ' ' + vdo.proDepartment}}</p>
				</div>
			</div>
			<article>
				{{vdo.proOrg}}
			</article>
		</section>
	</div>
</template>
<script>
import {mapMutations} from 'vuex'
import {api} from '../../utils/api.js'
import { Header } from 'mint-ui';
// import videojs from 'video.js'
// require('videojs-contrib-hls')
import zy from '../../lib/zymedia/zy.media.js'
export default {
	components:{xHeader:Header},
	mounted () {
		const params = this.$route.params
		const uid = this.uid
		const vdoid = params.vdoid
		this.vdoid = vdoid
		api(uid,{srv: "video_video",cmd: "get_live_video"},{vdoid:vdoid,src:0})
		.then(res=>{
			let data = res.data
			// console.log(data)
			if (data.result !== 0) {
				this.toast(data.msg)
			}else{
				this.vdo = data.rsps[0].body.video
				this.playurl = data.rsps[0].body.video.newPlayUrl
			}
			this.hideLoad()
			this.initVideoOption()
		})
	},
	data () {
		return {
			vdoid:0,
			vdo:{},
			videoOption:{},
			player:null,
			playurl:''
		}
	},
	methods:{
		...mapMutations([
			'showLoad','hideLoad','showTab'
		]),
		initVideoOption () {
			const vdo = this.vdo
			const height = window.innerWidth * 0.56
			var _this = this
			_this.player =  zy(document.getElementById('ss'),{
				videoHeight:height,
				audioHeight: 40,
				error:function(){
					_this.toast('视频错误')
				}
			}) 
		},
		signIn () {
			if (this.vdo.signup) {
				this.toast('您已报名')
				return false
			}
			api(this.uid,{srv: "video_video",cmd: "signup_live_video"},{vdoid:this.vdoid,isSignup:true,src:2,isIgnore:true})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.toast('报名成功')
					this.vdo.signup = true
				}
			})
			.catch(e=>{
				console.log(e)
			})
		},
		support () {
			const uid = this.uid
			const s = this.vdo.supported === 1 ? false:true
			const success = this.vdo.supported === 1 ? '取消点赞成功':'点赞成功'
			api(uid,{srv: "video_video",cmd: "set_video_support"},{vdoid:this.vdoid,support:s})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.toast(success)
					if (this.vdo.supported === 1) {
						this.vdo.supportNum--
					}else{
						this.vdo.supportNum++
					}
					this.vdo.supported = this.vdo.supported === 1 ? 0:1
				}
			})
			.catch(e=>{})
		}
	},
	computed: {
		uid () {
			return this.$store.getters.uid
		}
	},
	beforeRouteLeave  (to ,from ,next) {
		this.player && this.player.media.pause()		
		this.player = null
		delete this.player
		this.show = false
		this.showTab()
		next()
	}
}
</script>
<style lang="less">
@import '../../lib/zymedia/zy.media.css';
.course-detail{background-color: #f2f2f2;}.video{margin-bottom: 5px;}
.video{position: relative;width: 100%;margin-bottom: 0;padding-bottom:56.25%; height: 0}
.poster{
	width: 100%;
	background-size: 100%;
	background-position: center;
	position:absolute;
	height: 100%;
	left: 0;
	top: 0;
	background-repeat: no-repeat;
}
.play-button{
	background-image: url(../../assets/images/play_btn.png);
	background-size: 100%;
	background-position: center;
	display: block;
	width: 50px;
	height: 50px;
	position: absolute;
	z-index: 1000;
	left: 50%;
	top: 50%;
	margin-left: -25px;
	margin-top: -25px;
}
.video-pannel{
    width:100%;
    position:relative;
    overflow: hidden;
}
.video-pannel video{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%
}
.video-js{
	width: 100%;
}
.course-menu{flex-direction:row-reverse;height: 38px;font-size: 14px;padding-right: 15px;color: #999;background-color: #fff}
.course-menu>div:first-child{margin-right: 10px}
.course-menu>div:last-child{margin-right: 15px}
.active span{color: #d93639}
.active >.sprite-icon.support{
	background-position: -31px -127px;
}
.active >.sprite-icon.sign-up{
	background-position: -34px -187px;
}
.sprite-icon{
	background: url(../../assets/images/sprites/css_sprite.png);
	background-size: 248px 460px;
	width: 26px;
	height: 26px;
	&.support{
		background-position: -31px -97px;
		margin-right: 5px;
	}
	&.sign-up{
		background-position: -34px -157px;
	}
}
.course-intro,.teacher-intro{
	margin-top: 10px;
	background-color: #fff;
	padding-top: 6px;
	h4 {
		border-left: 4px solid #d93639;
	    font-size: 16px;
	    text-align: left;
	    padding-left: 5px;
	    font-weight: normal;
	    display: inline-block;
	    width: 100%;
	    text-overflow: ellipsis;
	    box-sizing: border-box;
	    overflow: hidden;
	    white-space: nowrap;
	    margin: 0;
	}
	article{
		padding: 5px 10px 10px 10px;
		text-align: left;
		font-size: 13px;
	}
}
.teacher-head{
	padding: 10px;
	.header{
		width: 67px;
		margin-right: 10px;
		img{width: 100%;}
	}
	.intro{
		flex-direction:column;
		padding-bottom: 2px;
		text-align: left;
		font-size: 14px;
	}
}

</style>