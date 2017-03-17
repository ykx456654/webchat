<template>
	<div class="course-detail-save">
		<x-header :title="vdo.title">
			<router-link to="/CourseSave" slot="left">
				<img src="../../assets/images/back2.png">
			</router-link>
			<a class="btn course-detail-btn" slot="right">关注</a>
		</x-header>
		<div class="video-pannel">
			<video class="video-js vjs-custom-skin" id="video-play" playsinline>
			 </video>
			<div class="see"></div>
		</div>
		<div class="course-detail-content">
			<div class="flex course-detail-tab-nav just-space-around">
				<div :class="{'active':active === 'course-detail-tab-1'}" @click="tabChange(1)">详情</div>
				<div :class="{'active':active === 'course-detail-tab-2'}" @click="tabChange(2)">评论</div>
				<div :class="{'active':active === 'course-detail-tab-3'}" @click="tabChange(3)">相关课程</div>
			</div>
			<tab-container  v-model="active">
				<tab-container-item id="course-detail-tab-1">
					<div class="course-detail-detail">
						<div class="bg-fff">
							<h5 v-text="vdo.title"></h5>
							<div class="course-pro flex">
								<div><img :src="vdo.proHeadUrl"></div>
								<div class="flex flex-direction-column justify-space-between">
									<p v-text="vdo.proName"></p>
									<p v-text="vdo.proTitle"></p>
									<p class="text-overflow" v-text="vdo.brief"></p>
								</div>
							</div>
							<p class="course-detail-content" :class="{'active':lanchContent}" v-text="vdo.content"></p>
							<div class="course-toggle" @click="lanch">
								<span>展开</span>
								<img :class="{'lanch':lanchContent}" src="../../assets/images/arrow-bottom.png">
							</div>
						</div>
						<div style="height: 10px;background-color: #f2f2f2"></div>
						<ul class="course-this-list">
							<h4>课程目录</h4>
							<li class="flex align-items-center" :class="{'v-active':i===playId}" v-for="(v,i) in classify" @click="setPlay(i)">
								<div class="c-t-icon"><img src="../../assets/images/video.png" alt=""></div>
								<div class="c-t-title text-overflow">{{v.title}}</div>
								<div class="c-t-durition">{{v.duration}}</div>
							</li>
						</ul>
					</div>
				</tab-container-item>
				<tab-container-item id="course-detail-tab-2">
					<!-- <div></div> -->
					<div class="flex comment justify-space-between" @click="comment($event)">
						<div class="comment-head">
							<img src="../../assets/images/default_head.png">
						</div>
						<div class="comment-item">
							<p class="comment-name">jackMapo</p>
							<p class="comment-time">5456</p>
							<p class="comment-content">122fsdaf</p>
						</div>
						<div class="comment-zan c-z flex align-items-center">
							<img class="c-z" src="../../assets/images/zan_.png">
							<span class="c-z" zan>赞</span>
						</div>
					</div>
				</tab-container-item>
				<tab-container-item id="course-detail-tab-3">
					<div class="relative-course flex align-items-center justify-center">
						<img src="../../assets/images/relevent_pinglun@3x.png">
					</div>
				</tab-container-item>
			</tab-container>
		</div>
		<transition name="detail-tab-tran">
			<div class="course-detail-tab flex justify-space-between" v-show="show">
				<div class="flex align-items-center justify-center">
					<i class="sprite-icon comment-icon"></i>
					评论
				</div>
				<div class="flex align-items-center justify-center">
					<i class="sprite-icon support-icon"></i>
					赞
				</div>
				<div class="flex align-items-center justify-center">
					<i class="sprite-icon download-icon"></i>
					下载
				</div>
			</div>		
		</transition>
		<actionsheet v-model="sheetVisible"  :actions="actions">
			
		</actionsheet>
	</div>
</template>
<script>
import {mapMutations} from 'vuex'
import { mapGetters } from 'vuex'
import {api} from '../../utils/api'
import { Header ,TabContainer, TabContainerItem,Actionsheet  } from 'mint-ui';
import videojs from 'video.js'
require('videojs-resolution-switcher')
	export default {
		components:{xHeader:Header,TabContainer,TabContainerItem , Actionsheet },
		created () {
			const query = this.$route.query
			const uid = this.uid
			const vdoid = query.vdoid
			this.vdoid = query.vdoid
			api(uid,{srv: "video_video",cmd: "get_save_video"},{vdoid:vdoid})
			.then(res=>{
				this.hideLoad()
				this.hideTab()
				this.show = true
				let data = res.data
				if (data.result !== 0) {
					this.toast(data.msg)
				}else{
					this.vdo = data.rsps[0].body.video
					this.classify = data.rsps[0].body.classify
					this.initSaveVdo()
				}
			})
			.catch(e=>{
				console.log(e)
			})
		},
		data () {
			return {
				vdoid:0,
				show:false,
				active:'course-detail-tab-1',
				vdo:{},
				classify:[],
				player:null,
				lanchContent:false,
				playId:0,
				sheetVisible:false,
				actions:[
					{name:'回复评论',method:()=>{this.toast('fsas')}},
					{name:'举报评论',method:()=>{this.toast('fsafdas')}}
				]
			}
		},
		computed : {
			...mapGetters([
				'uid'
			])
		},
		watch:{

		},
		methods:{
			...mapMutations([
				'showLoad','hideLoad','showTab','hideTab'
			]),
			tabChange (n) {
				this.active = 'course-detail-tab-' + n
			},
			initSaveVdo () {
				const height = window.innerWidth * 0.56  
				const vdo = this.vdo
				let videoOption = {
					live:false,
					withCredentials: true,
		            fluid: false,
		            LoadingSpinner: true,
		            playsinline:true,
		            controls: true,
		            width:'100%',
		            height:height,
		            preload: 'auto',
		            poster: vdo.coverpicUrl,
		            muted: false
				}
				if (this.classify.length != 0) {
					videoOption.source = Array.from(this.classify,(item,idx)=>{
						return {src:item.downUrl,type:'video/mp4',res:idx}
					})
					videoOption.defaultSrcReId = 1
					videoOption.plugins = { videoJsResolutionSwitcher: { default: videoOption.defaultSrcReId, dynamicLabel: true }}
					// console.log(videoOption.source)
				}else{
					videoOption.source = {src:vdo.downUrl,type:'video/mp4'}
				}
				var _this = this
				_this.player = videojs(document.getElementById('video-play'),videoOption,function () {
					videojs.log('Your player is ready!');
					this.on('ended', function() {
			    		videojs.log('Awww...over so soon?!');
					});
				})
			},
			lanch () {
				this.lanchContent = !this.lanchContent
			},
			setPlay (n) {
				this.playId = n
			},
			comment (e) {
				console.log(e)
				if (e.target._prevClass === 'c-z') {
					alert(1)
					return false
				}else{
					this.sheetVisible = true
				}
			}
		},
		beforeRouteLeave (to ,from, next) {
			this.player && this.player.dispose()
			this.player = null
			delete this.player
			this.show = false
			this.showTab()
			next()
		}
	}
</script>
<style lang="less" scoped>
	.course-detail-save{
		padding-bottom: 50px;
	}
	.course-detail-tab{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 40px;
		z-index: 100;
		background-color: #f2f2f2;
		&> div{
			width: 30%;
			color: #999;
		}
		.sprite-icon{
			width: 26px;
			height: 26px;
			display: block;
			background: url(../../assets/images/sprites/css_sprite.png) no-repeat 100px;
    		background-size: 248px 460px;
    		vertical-align: middle;
    		margin-right: 10px;
		}
		.comment-icon{
			background-position: -34px -269px;
		}
		.support-icon{
			background-position: -31px -97px;
		}
		.download-icon{
			background-position: -33px -299px;
		}
	}
	.detail-tab-tran-enter-active, .detail-tab-tran-leave-active {
	  transition: all .5s
	}
	.detail-tab-tran-enter, .detail-tab-tran-leave {
	  opacity: 0;
	  bottom: -55px;
	}
	.course-detail-tab-nav{
		height: 40px;
		line-height: 40px;
		background-color: #fff;
		font-size: 14px;
		color: #666;
		border: 1px solid #f7f7f7;
		>div{
			width: 33.33%;
			&.active{
				color: #d93639;
				border-bottom:2px solid #d93639;
			}
		}
	}
	.video-pannel{
	    width:100%;
	    position:relative;
	    padding-bottom:56.25%;    /*需要用padding来维持16:9比例,也就是9除以16*/
	    height: 0;
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
	.course-detail-detail{
		text-align: left;
		h5{
			margin: 0;
			font-size: 16px;
			padding: 10px;
			font-weight: normal;
		}
		.course-pro{
			width: 100%;
			margin: 5px 0 10px;
			padding: 0 10px;
			:first-child{
				width: 60px;
			}
			>:last-child{
				margin-left: 5px;
			}
			img{
				width: 100%;
			}
			p{
				width: 75%;
				font-size: 14px;
			}
		}
		.course-detail-content{
			padding: 0 10px;
			line-height: 22px;
			height: 22px;
			overflow: hidden;
			&.active{
				height: auto;
				overflow: visible;
			}
		}
		.course-toggle{
			text-align: center;
			font-size: 15px;
			border-top: 1px solid #f2f2f2;
			// border-bottom: 1px solid #f2f2f2;
			height: 36px;
			line-height: 36px;
			img{
				vertical-align: middle;
				transition: all .5s;
				&.lanch{
					transform:rotate(180deg);
				}
			}
		}
	}
	.course-this-list{
		margin-top: 10px;
		background-color: #fff;
		h4{
			border-left: 3px solid #d93639;
			margin-top: 0;
			margin-bottom: 0;
			font-weight: normal;
			font-size: 15px;
			padding: 5px;
		}
		li{
			width: 100%;
			height: 37px;
			border-bottom: 1px solid #f7f7f7;
			padding-left: 20px;
			img{
				width: 100%;
			}
			&.v-active{
				div{
					color:#d93639;
				}
			}
			.c-t-icon{
				width: 18px;
				height: 18px;
			}
			.c-t-title{
				width: 70%;
				padding-left: 10px;
			}
			.c-t-durition{
				text-align: right;
			}
			.c-t-title,.c-t-durition{
				font-size: 15px;
			}
		}
	}
	.comment{
		padding: 10px;
		position: relative;
		.comment-head{
			width: 45px;
			img{
				width: 100%;
			}
		}
		.comment-item{
			text-align: left;
			width: 85%;
			:first-child{
				font-weight: bold;
				color: #4a4a4a;
			}
			:nth-of-type(2){
				color: #666;
			}
			:last-child{
				color: #666;
				margin-top: 10px;
			}
			p{
				margin: 5px 0;
			}
		}
		.comment-zan{
			position: absolute;
			width: 50px;
			height: 50px;
			right: 20px;
			top: 10px;
			width: 40px;
			img{
				width: 15px;
				margin-right: 5px;
			}
		}
	}
	.relative-course{
		>img{
			margin-top: 50px;
			width: 30%;
		}
	}
</style>
