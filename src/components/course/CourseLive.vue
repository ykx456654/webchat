<template>
	<div class="course-live">
		<Swipe class="banner" :auto="30000">
			<Swipe-item class="banner-item">
				<a href="https://www.yishengzhan.cn/download?channel=release_webysz">
					<img src="../../assets/images/banner_01.jpg">
				</a>
			</Swipe-item>
			<Swipe-item class="banner-item"><img src="../../assets/images/banner1114.png"></Swipe-item>
			<Swipe-item class="banner-item"><img src="../../assets/images/Artboard2.png"></Swipe-item>
		</Swipe>
		<div class="course-live-list">
			<ul class="course-live-date"  v-for="(data,index) in titles" v-bind:class="{'close': stretch[index]}" >
				<div class="course-live-date-detail flex  align-items-center justify-space-between" @click="spread(index)">
					<span>{{data}}</span>
					<span class="flex align-items-center"><img  class="arrow-bottom" src="../../assets/images/arrow-bottom.png"></span>
				</div>
				<li class="course-live-lecture flex" v-for="(one,vindex) in videos[index]" v-on:click="link(one.vdoid)">
					<div class="course-picture">
						<img :src="one.proHeadurl">
					</div>
					<div class="course-live-detail flex just-space-around">
						<div class="lecture-item lecture-title text-overflow">{{one.title}}</div>
						<div class="lecture-item lecture-hospital">{{one.proOrg}}</div>
						<div class="lecture-item lecture-doctor">
							<span>{{one.proName}}</span><span>{{one.proTitle}}</span>
						</div>
						<div class="lecture-item lecture-time">{{new Date(one.startTime).Format('hh:mm')}}~{{new Date(one.endTime).Format('hh:mm')}}</div>
						<button @click.self.stop="signUp(one.vdoid,index,vindex)" class="btn lecture-signup flex align-items-center" :class="{'has-sign':one.signup}"><span v-show="!one.signup">+ </span>{{one.signup?'已报名':'报名'}}</button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<style lang="less" scoped>
.course-live{padding-bottom: 60px;}
.banner > div{padding-bottom: 33.33%;}
.banner-item img{width: 100%}
.course-live-list{background-color: #f2f2f2}
.course-live-date{overflow: hidden;}
.course-live-date.close{height: 40px;border-bottom:1px solid #fff}
.course-live-date.close .arrow-bottom{transform:rotate(180deg)}
.course-live-date-detail{background-color: #f2f2f2;color: #111;padding: 0 15px;height: 40px;font-size: 15px}
.course-live-lecture{position: relative;width: 100%;padding: 8px;background-color: #fff;border: 1px solid #f7f7f7;box-sizing: border-box;margin-top: 10px;&:nth-of-type(1){margin-top: 0}}
.course-picture{width: 18.2%;height: 24.2%;}
.course-picture img{width: 100%;min-height: 85px}
.course-live-detail{margin-left: 2.1%;position: relative;width: 78%;flex-direction:column;transition: all .3s ease;}
.arrow-bottom{transition: all .3s;tarnsform-origin:center}
.lecture-title{font-weight: bold;font-size: 15px}
.lecture-item{width: 100%;text-align: left;}
.lecture-time{color: #999}
.lecture-signup{position: absolute;right: 0;bottom: 0;background-color: #d93639;color: #fff;font-size: 14px;border-radius: 14px;padding: 4px 7px;}
.lecture-signup span {width: 16px;height: 16px;display: block;line-height: 16px;}
.lecture-signup.has-sign{background-color: #ccc;}
</style>
<script>
import { Swipe, SwipeItem } from 'mint-ui';
import {api} from '../../utils/api.js'
import { mapMutations } from 'vuex'
export default {
	components:{Swipe, SwipeItem},
	beforeRouteLeave (to, from , next) {
		// this.showLoad()
		next()
	},
	mounted () {
		const uid = this.uid
		api(uid,{srv: "video_video",cmd: "get_live_list"},{catid:0})
		.then(res=>{
			this.hideLoad()
			var data = res.data
			if (data.result !== 0) {
				this.toast(data.msg)
			}else{
				// this.toast('success')
				this.titles = data.rsps[0].body.titles
				this.videos = data.rsps[0].body.videos
				var length = this.titles.length
				var arr = Array.from({length},(x) =>x = false)
				this.stretch = arr
			}
		})
	},
	data () {
		return {
			titles:[],
			videos:[],
			stretch:[]
		}
	},
	methods:{
		spread (index) {
			const value = !this.stretch[index]
			this.stretch.splice(index,1,value)
		},
		link (id) {
			this.showLoad()
			this.$router.push({name:'CourseDetailLive',params:{vdoid:id}})
		},
		...mapMutations([
			'showLoad','hideLoad'
		]),
		signUp (id,index,vindex) {
			// alert(id)
			if (this.videos[index][vindex].signup) {
				this.toast('您已经报名')
				return false
			}
			api(this.uid,{srv: "video_video",cmd: "signup_live_video"},{vdoid:id,isSignup:true,src:2,isIgnore:true})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.toast('报名成功')
					this.videos[index][vindex].signup = true
				}
			})
			.catch(e=>{
				console.log(e)
			})
		}
	},
	computed: {
		uid () {
			return this.$store.getters.uid
		}
	}
}
</script>