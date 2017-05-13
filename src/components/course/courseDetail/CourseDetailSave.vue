<template>
	<div class="course-detail-save">
		<x-header :title="vdo.title">
			<router-link to="/CourseSave" slot="left">
				<i class="icon icon-arrow-back"></i>
			</router-link>
			<!-- <a class="btn course-detail-btn" slot="right">关注</a> -->
		</x-header>
		<div class="zy_media">
			<video id="ss" :poster="vdo.coverpicUrl" x5-video-player-type="h5" webkit-playsinline="true"  x-webkit-airplay="true" playsinline="true" >
		        <source :src="playurl" type="video/mp4">
		    </video>
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
								<div class="f-1"><img :src="vdo.proHeadUrl"></div>
								<div class="f-2 flex flex-direction-column flex-wrap justify-space-between">
									<p v-text="vdo.proName"></p>
									<p v-text="vdo.proTitle"></p>
									<p class="text-overflow" v-text="vdo.brief"></p>
								</div>
							</div>
							<p class="course-detail-content" :class="{'active':lanchContent}" v-text="vdo.content"></p>
							<div class="course-toggle" @click="lanch">
                				<span v-if="lanchContent">收起</span>
								<span v-else>展开</span>
								<img :class="{'lanch':lanchContent}" src="../../../assets/images/arrow-bottom.png">
							</div>
						</div>
						<div style="height: 10px;background-color: #f2f2f2"></div>
						<ul class="course-this-list">
							<h4>课程目录</h4>
							<li class="flex align-items-center" :class="{'v-active':i===playId}" v-for="(v,i) in classify" @click="setPlay(i)">
								<div class="c-t-icon"><img src="../../../assets/images/video.png" alt=""></div>
								<div class="c-t-title text-overflow">{{v.title}}</div>
								<div class="c-t-durition">{{v.duration}}</div>
							</li>
						</ul>
					</div>
				</tab-container-item>
				<tab-container-item id="course-detail-tab-2">
					<!-- <div></div> -->
					<div  v-if="commentList.length != 0">
						<div  class="flex comment justify-space-between" @click="listComment($event,c,i)" v-for="(c,i) in commentList" >
							<div class="comment-head">
								<img src="../../../assets/images/default_head.png" v-if="c.head_url==''">
								<img :src="c.head_url" alt="" v-else>
							</div>
							<div class="comment-item">
								<p class="comment-name">{{c.nick_name}}</p>
								<p class="comment-time">{{c.time}}</p>
								<p class="comment-content" v-html="c.content.replace(/\n/g,'<br>')"></p>
								<div class="at-user" v-if="c.reply_user_id && c.rawPic.url ==''">
									<span class="at-user-name">@{{c.reply_nick_name}}</span>
									<span class="at-user-content"> : {{c.rawContent}}</span>
									<!--<span><i class="icon icon-comment-img"></i>图片</span>-->
								</div>
							</div>
							<!--<div class="comment-zan c-z flex align-items-center">
								<img class="c-z" src="../../../assets/images/zan_.png">
								<span class="c-z" zan>赞</span>
							</div>-->
						</div>
					</div>
					<div v-else class="no-comment">
						<img src="../../../assets/images/comment.png">
					</div>
				</tab-container-item>
				<tab-container-item id="course-detail-tab-3">
					<div class="relative-course-list" v-if="relativeVideoList.length != 0">
						<div class="flex"  v-for="v in relativeVideoList" @click="toRelative(v.vdoid)">
							<div class="relative-course-img">
								<img :src="v.coverpicUrl">
							</div>
							<div class="relative-course-info flex flex-direction-column justify-space-between">
								<h3 v-text="v.title"></h3>
								<div class="flex">
									<p v-text="v.proName"></p>
									<p class="text-overflow" v-text="v.proOrg"></p>
									<p class="text-overflow" v-text="v.proDepartment"></p>
								</div>
								<p><i></i>{{v.clickCount}}</p>
							</div>
						</div>
					</div>
					<div v-else class="relative-course flex align-items-center justify-center">
						<img src="../../../assets/images/relevent_pinglun@3x.png">
					</div>
				</tab-container-item>
				<tab-container-item class="course-detail-tab-loading flex justify-center align-items-center" id="course-detail-tab-loading">
					<div class="c-loading">
						<spinner :size="40" type="fading-circle" color="#d93639"></spinner>
					</div>
				</tab-container-item>
			</tab-container>
		</div>
		<transition name="detail-tab-tran">
			<div class="course-detail-tab flex justify-space-between" v-show="show">
				<div class="flex align-items-center justify-center">
					<i class="sprite-icon comment-icon" @click="tabClick(1)"></i>
					<span @click="tabClick(1)">评论</span>
				</div>
				<div class="flex align-items-center justify-center" :class="{'red':vdo.supported == 1}">
					<i class="sprite-icon support-icon" :class="{'supported-icon':vdo.supported == 1}"  @click="tabClick(2)"></i>
					<span @click="tabClick(2)">{{vdo.supportNum == 0 ? '赞':vdo.supportNum}}</span>
				</div>
				<div class="flex align-items-center justify-center">
					<i class="sprite-icon download-icon" @click="tabClick(3)"></i>
					<span @click="tabClick(3)">下载</span>
				</div>
			</div>
		</transition>
		<actionsheet v-model="sheetVisible"  :actions="actions"></actionsheet>
		<popup v-model="popupVisible" is-transparent>
			<div class="comment-textarea">
				<div class="comment-send flex justify-space-between">
					<button @click="cancelComment" class="btn">取消</button>
					<button @click="sendComment"  class="btn">发送</button>
				</div>
				<textarea v-model="comment" placeholder="我要评论.." maxlength="1000"></textarea>
			</div>
		</popup>
<!-- 		<video id="zzz" style="display: none" src="http://7xnvc7.com1.z0.glb.clouddn.com/yv0_1490067507481.mp4" type="video/mp4">
		</video>
		<button id="but">start</button> -->
	</div>
</template>
<script>
// 'https://www.yishengzhan.cn/download?channel=release_webysz';
import { mapGetters,mapActions,mapMutations } from 'vuex'
import {api} from '../../../utils/api'
import { Header ,TabContainer, TabContainerItem,Actionsheet,Spinner,MessageBox} from 'mint-ui';
import { Popup } from 'vux'
import storage from 'storejs'
import zy from '../../../lib/zymedia/zy.media.js'
	export default {
		name:'CourseDetailSave',
		components:{xHeader:Header,TabContainer,TabContainerItem , Actionsheet ,Popup,Spinner,MessageBox},
		mounted () {
			this.getDetail()
			.then(res=>{
				wx.ready(()=>{
					var	params = {
						title: this.vdo.title,
						desc: this.vdo.content,
						link:location.href,
						imgUrl: 'http://' + window.location.hostname + '/images/zhibojian.png'
					};
					console.log(params)
					wx.onMenuShareAppMessage(params);
					wx.onMenuShareTimeline(params);
				});
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
				playurl:'',
				sheetVisible:false,
				popupVisible:false,
				comment:'',
				commentStart:0,
				commentLimit:10,
				commentOrder:0,
				commentList:[],
				commentIsEnd:0,
				commentStart:10000000000,
				relativeVideoList:[],
				relativeVideoStart:0,
				relativeVideoLimt:30,
				relativeVideoIsEnd:0,
				commentIndex:0,
				actions:[
					{
						name:'回复评论',
						method:()=>{
							// this.toast('需要接口')
							this.isReply = true
							this.sheetVisible = false
							this.popupVisible = true
							// this.sendComment()
						}
					},
					{
						name:'举报评论',
						method:()=>{
							// this.toast('需要接口')
							this.reportComment(this.replyCommentId)
						}
					}
				],
				isReply:false,
				replyCommentUserId:0,
				replyCommentId:0
			}
		},
		computed : {
			...mapGetters([
				'uid','userInfo'
			])
		},
		watch:{
		},
		methods:{
			...mapActions(['GETUSERINFO']),
			...mapMutations([
				'showLoad','hideLoad','showTab','hideTab'
			]),
			back () {
				history.back()
			},
			tabChange (n) {
				const uid = this.uid
				const vdoid = Number(this.vdoid)
				if (n == 1) {
					this.active = 'course-detail-tab-' + n
				}else{
					this.active =  'course-detail-tab-loading'
					if (n ==2) {
						var data = {type:2,topic_id:vdoid,start:this.commentStart,limit:this.commentLimit,comment_start:this.commentStart,order:this.commentOrder}
						api(uid,{srv: "article_article",cmd: "get_comment_list"},data)
						.then(res=>{
							res = res.data
							if (res.result != 0) {
								this.toast(res.msg)
							}else{
								this.active = 'course-detail-tab-' + n
								this.commentList = res.rsps[0].body.comments
							}
						})
					}
					if (n == 3) {
						var data = {start:this.relativeVideoStart,limit:this.relativeVideoLimt,tag:this.vdo.tag}
						api(uid,{srv: "video_video",cmd: "relative_video_list"},data)
						.then(res=>{
							res = res.data
							if (res.result != 0) {
								this.toast(res.msg)
							}else{
								this.active = 'course-detail-tab-' + n
								this.relativeVideoList = res.rsps[0].body.videos
								this.relativeVideoIsEnd = res.rsps[0].body.is_end
							}
						})
					}
				}
			},
			initSaveVdo () {
				console.log('init video')
				const height = window.innerWidth * 0.56
				const vdo = this.vdo
				var self = this
				if (this.classify.length == 0) {
					self.playurl = ''
				}else{
					self.playurl = self.classify[0].downUrl || vdo.newPlayUrl
					self.poster = vdo.coverpicUrl
				}
				self.player =  zy(document.getElementById('ss'),{
					videoHeight:height,
					audioHeight: 40,
					error:function(){
						self.toast('视频错误')
					}
				})
			},
			getDetail () {
				const params = this.$route.params
				const uid = this.uid
				const vdoid = params.vdoid
				this.vdoid = params.vdoid
				return api(uid,{srv: "video_video",cmd: "get_save_video"},{vdoid:vdoid})
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
						setTimeout(()=>{
							this.initSaveVdo()
						},0)
						this.hideLoad()
					}
				})
				.catch(e=>{
					console.log(e)
				})
			},
			lanch () {
				this.lanchContent = !this.lanchContent
			},
			setPlay (n) {
				n = Number(n)
				this.playId = n
				this.player.media.pause()
				this.player.media.src = this.classify[n].downUrl
				this.player.media.play()
			},
			tabClick (n) {
				const uid = this.uid
				const vdoid = this.vdoid
				switch (n) {
					case 1:
						this.popupVisible = true
					break;
					case 2:
						const sup = this.vdo.supported == 0 ? true : false
						api(uid,{srv: "video_video",cmd: "set_video_support"},{vdoid:vdoid,support:sup})
						.then(res=>{
							res = res.data
							if (res.result != 0) {
								this.toast(res.msg)
							}else{
								var str = this.vdo.supported == 0 ? '点赞成功':'取消成功'
								if (this.vdo.supported == 0) {
									this.vdo.supported = 1
									this.vdo.supportNum++
								}else{
									this.vdo.supported = 0
									this.vdo.supportNum--
								}
								this.toast(str)
							}
						})
						.catch(e=>{console.log(e)})
					break;
					case 3:
						MessageBox({
							message:'暂不提供下载视频功能，如果您想下载视频，请至医生站app下载该视频',
							confirmButtonText:'确认下载',
							showCancelButton:true,
							showConfirmButton:true
						}).then(action => {
							if (action == 'confirm') {
								location.href = 'https://www.yishengzhan.cn/download?channel=release_webysz';
							}
						})
						.catch(e => {
							console.log(e)
						});
					break;
				}
			},
			listComment (e,c,i) {
				const uid = this.uid
				const vdoid = this.vdoid
				if (e.target._prevClass === 'c-z') {
					const sup = this.vdo.supported == 0 ? true : false
					api(uid,{srv: "video_video",cmd: "set_video_support"},{vdoid:vdoid,support:sup})
					.then(res=>{
						res = res.data
						if (res.result != 0) {
							this.toast(res.msg)
						}else{
							this.toast('点赞成功')
						}
					})
					.catch(e=>{console.log(e)})
					return false
				}else{
					if(JSON.stringify(this.userInfo) == "{}"){
						this.GETUSERINFO()
						.then(()=>{
							this.sheetVisible = true
							this.replyCommentUserId = c.user_id
							this.replyCommentId = c.comment_id
							this.commentIndex = i
							Promise.resolve()
						})
					}else{
						this.sheetVisible = true
						this.replyCommentUserId = c.user_id
						this.replyCommentId = c.comment_id
						this.commentIndex = i
					}
				}
			},
			cancelComment () {
				this.popupVisible = false
				this.comment = ''
			},
			sendComment () {

				if(this.isReply){
					this.replyComment(this.replyCommentUserId,this.replyCommentId,this.commentIndex)
					return false
				}

				let data = {
					type:2,
					content:this.comment,
					topic_id:this.vdo.vdoid,
					user_id:storage('uid')
				}
				api(this.uid,{srv: "article_article",cmd: "add_comment"},data)
				.then(res => {
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						this.toast('评论成功！')
						this.popupVisible = false
						return res.rsps[0].body.comment_id
					}
				})
				.then(comment_id=>{
					this.commentList.unshift({
						time: new Date().Format("MM-dd hh:mm"),
						content: this.comment,
						nick_name: this.userInfo.nickName,
						user_id:storage('uid'),
						head_url:this.userInfo.headUrl,
						comment_id,
						rawPic:{url:''}
					})
					this.comment = ''
				})
				.catch(e=>{
					console.log(e)
				})
			},
			replyComment (reply_user_id,reply_comment_id,index) {
				const userId = storage('uid')
				let data = {
					type:2,
					content:this.comment,
					topic_id:this.vdo.vdoid,
					user_id:userId,
					reply_user_id,
					reply_comment_id
				}
				return api(this.uid,{srv: "article_article",cmd: "add_comment"},data)
				.then(res => {
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)

					}else{
						this.toast('评论成功！')
						this.popupVisible = false
						this.commentList[index].reply_nick_name = this.userInfo.nickName
						this.commentList[index].rawContent = this.comment
						this.commentList[index].reply_user_id = userId
						let com = {
							time: new Date().Format("MM-dd hh:mm"),
							content: this.comment,
							comment_id:res.rsps[0].body.comment_id,
							nick_name: this.userInfo.nickName,
							user_id:userId,
							head_url:this.userInfo.headUrl,
							rawPic:{url:''},
							reply_nick_name:this.commentList[index].nick_name,
							reply_comment_id,
							rawContent:this.commentList[index].content,
							reply_user_id
						}
						this.commentList.unshift(com)
						this.comment = ''
						this.isReply = false
						return res.rsps[0].body.comment_id
					}
				})
			},
			reportComment (report_comment_id) {
				this.popupVisible = true
				api(this.uid,{srv:'article_article',cmd:'report_comment'},{report_comment_id})
				.then(res=>{
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						this.toast('举报成功！')
					}
				})
			},
			toRelative (id) {
				this.player.media && this.player.media.pause()
				// console.log(this.$router)
				this.$router.push({name:'CourseDetailSave',params:{vdoid:id},force: true})
				this.$nextTick(()=>{
					location.reload()
				})
			}
		},
		destroyed () {
			// console.log(to)
			this.player.media && this.player.media.pause()
			this.player = null
			delete this.player
			this.show = false
			this.showTab()
		}
	}
</script>
<style lang="less" scoped>
@import '../../../lib/zymedia/zy.media.css';
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
		.red {
			color: #d93639;
		}
		.sprite-icon{
			width: 26px;
			height: 26px;
			display: block;
			background: url(../../../assets/images/sprites/css_sprite.png) no-repeat 100px;
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
		.supported-icon{
			background-position: -31px -127px;
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
      color: #000;
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
			.f-1{
				width: 60px;
				flex: 1 0 60px;
                /*height:120px;*/
                max-width:60px;
			}
			.f-2{
				margin-left: 10px;
				flex: 0 0 auto;
			}
			img{
				width: 100%;
                height:100%;
			}
			p{
				width: 100%;
				font-size: 14px;
				&.text-overflow{
					width: 80%;
				}
			}
		}
		.course-detail-content{
			padding: 0 10px;
			line-height: 22px;
			height: 22px;
			overflow: hidden;
            font-size:14px;
			&.active{
				height: auto;
				overflow: visible;
                min-height: 44px;
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
	.relative-course-list{
		>div{
			padding: 5px;
			border-bottom: 1px solid #f7f7f7;
		}
		.relative-course-img{
			width: 128px;
			flex-shrink: 0;
			flex-grow: 0;
			height: 64px;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.relative-course-info{
			margin-left: 10px;
			text-align: left;
			>h3{
				margin: 0;
			}
			>div{
        font-size: 14px;
				p:nth-child(1){
					flex: 1 0 auto;
				}
				p:nth-child(2){
					margin-left: 10px;
					margin-right: 10px;
					max-width: 110px;
				}

			}
      >p{
        i{
          background: url(../../../assets/icons/pic_ll_zb.png) no-repeat;
          display:inline-block;
          width: 20px;
          height:20px;
          padding-right:7px;
          background-size:68%;
          vertical-align:middle;
          margin-top: 7px;
        }
      }
		}
	}
	.comment{
		padding: 10px;
		position: relative;
		border-bottom: 1px solid #f7f7f7;
		.comment-head{
			width: 45px;
			img{
				width: 100%;
			}
		}
		.comment-item{
			text-align: left;
			width: 85%;
			>:first-child{
				font-weight: bold;
				color: #4a4a4a;
			}
			>:nth-of-type(2){
				color: #666;
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
	.no-comment{
		img{
			width: 130px;
			margin-top: 30px;
		}
	}
	.comment-textarea{
		padding: 10px;
		background-color: #fff;
		button{
			margin: 4px 0;
		    padding: 3px;
		    width: 70px;
		    color: #333;
    		background-color: #fff;
    		border:1px solid #ccc;
    		border-radius: 3px;
		}
		textarea{
			font-size: 12px;
			border: 1px solid #ccc;
		    border-radius: 2px;
		    width: 100%;
		    height: 80px;
		    font-size: 12px;
		    background: transparent;
		    outline: transparent;
		}
	}
	.comment-send{
		:first-child{
		}
	}
	.at-user{
		padding: 5px;
		background-color: #f2f2f2;
		width: 100%;
		font-size: 12px;
		box-sizing: border-box;
	}
	.at-user-name{
		color: #0a6cd6!important;
		font-weight: normal!important;
	}
	.relative-course{
		>img{
			margin-top: 50px;
			width: 30%;
		}
	}
	.course-detail-tab-loading{
		height: 200px;
		.c-loading{
			width: 40px;
			height: 40px;
			display: block;
		}
	}
</style>
