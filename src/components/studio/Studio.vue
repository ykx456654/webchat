<template>
	<div class="studio">
		<x-header :title="studioTitle">
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
		</x-header>
		<div class="header" :class="{'lanch':isLanch}">
			<div class="user-info">
				<div class="flex justify-center flex-wrap">
          <img :src="studio.studioImg" v-if="studio.studioImg != ''">
					<img  src="../../assets/images/default_head.png" v-else>
				</div>
				<div>
					<p class="studio-name" v-text="studio.studioTitle"></p>
					<div class="flex justify-center align-items-center ">
						<div class="ft12 align-items-center flex">
							<span>粉丝</span>
							&nbsp;
							<span v-text="studio.fanNum"></span>
						</div>
						<div class=" align-items-center flex" v-if="studio.studioRole != 1">
							<a @click="focus" class="btn btn-focus" :class="{'btn-unfocus':studio.isFan}">
								{{studio.isFan?'已关注':'关注'}}
							</a>
						</div>
					</div>
				</div>
				<div class="ft12 flex info-wrap justify-center">
					<p class="studio-intro-p flex justify-center" @click="lanchStudioInfo">
						<span class="studio-jj">简介：</span>
						<span :class="{'lanch':isLanch,'text-overflow':!isLanch}" id="studio-intro" v-text="studio.studioIntro"></span>
					</p>
					<span class="lanch-info icon icon-arrow-down-white" :class="{'lanched':isLanch}" v-if="showLanchInfoArrow"></span>
				</div>
			</div>
		</div>
		<div class="seat-img" v-if="showSeatImg">
			<img src="../../assets/images/wdzbij_qst.png">
			<p>暂无直播话题</p>
		</div>
		<ul class="subjects">
			<li v-for="s in subjects" @click="link(s)">
				<subject-item :subject="s"></subject-item>
			</li>
			<div class="subjects-loading flex justify-center " v-show="showLoading">
				<spinner></spinner>
			</div>
			<div class="click-more" @click="loadMore" v-show="showBtn">
				<button>{{ subejectsIsEnd ?'没有更多了':'加载更多'}}</button>
			</div>
		</ul>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner} from 'mint-ui'
import storage from 'storejs'
import { api } from '../../utils/api'
import SubjectItem from './common/SubjectItem'
	export default {
		name:'Studio',
		components:{
			xHeader:Header,SubjectItem,Spinner
		},
		mounted () {
			// console.log(this.$route.params)
			const query = this.$route.query
			const studioId = query.studioId
			if (studioId) {
				this.studioId = Number(studioId)
			}else{
				this.studioTitle = '我的直播间'
				this.studioId = this.myStudioID
			}

			var p1 = this.getStudioInfo()
			.then(res=>{
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.studio = res.rsps[0].body.studio
					this.studioTitle = this.studio.studioTitle
					return true
				}
			})
			var p2 = this.getSubjects()
			Promise.all([p1,p2])
			.then(res=>{
				this.checkInfoSize()
				this.hideLoad()
				wx.ready(() => {
					var	params = {
						title: this.studioTitle,
						desc: this.studio.studioIntro,
						link:`${location.origin}/Studio?studioId=${this.studioId}`,
						imgUrl: this.studio.studioImg =='' ? 'http://' + window.location.hostname + '/images/zhibojian.png' : this.studio.studioImg
					};
					console.log(params)
					wx.onMenuShareAppMessage(params);
					wx.onMenuShareTimeline(params);
				});
			})
			.catch(e=>{})
		},
		data () {
			return {
				isLoadOnce:false,
				studioId:0,
				subjectsStart:0,
				subjectsLimit:10,
				subejectsIsEnd:false,
				subjects:[],
				studio:{},
				studioTitle:'',
				showLanchInfoArrow:false,
				showLoading:false,
				isLanch:false
			}
		},
		methods:{
			...mapMutations(['hideLoad','showLoad','hideTab']),
			getStudioInfo () {
				return api(this.uid,{cmd:'enter_studio',srv:'studio_studio'},{studioId:this.studioId,start:this.subjectsStart,limit:this.subjectsLimit})
				.then(res=>{
					res = res.data
					return res
				})
			},
			getSubjects () {
				this.showLoading = true
				return api(this.uid,{cmd:'get_subject_list',srv:'studio_studio'},{studioId:this.studioId,start:this.subjectsStart,limit:this.subjectsLimit})
				.then(res=>{
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
						this.showLoading = false
					}else{
						this.isLoadOnce = true
						this.showLoading = false
						this.subjects = this.subjects.concat(res.rsps[0].body.subjects)
						this.subejectsIsEnd = res.rsps[0].body.is_end
						this.subjectsStart+=this.subjectsLimit
						return true
					}
				})
			},
			checkInfoSize () {
				if (this.studio.studioIntro.length > 20) {
					this.showLanchInfoArrow = true
				}else{
					this.showLanchInfoArrow = false
				}
			},
			loadMore () {
				if (this.subejectsIsEnd) return false;
				this.getSubjects()
			},
			link (s) {
				if (s.fee > 0) {
					this.showLoad()
					this.$router.push({path:'/SubjectIntro',query:{subjectId:s.subjectId,studioId:s.studioId}})
				}else{
					this.showLoad()
					let openid = storage('openid')
					this.$router.push({path:'/Subject',query:{subjectId:s.subjectId,studioId:s.studioId,openid}})
				}
				// console.log(s)
			},
			goBcak () {
				history.back()
			},
			lanchStudioInfo () {
				this.isLanch = !this.isLanch
			},
			focus () {
				api(this.uid,{cmd:"subscribe_studio",srv:"studio_studio"},{
					studioId:this.studioId,isSubscribe:!this.studio.isFan
				})
				.then(res=>{
					res = res.data
					if (res.result != 0 ) {
						this.toast(res.msg)
					}else{
						if (this.studio.isFan) {
							this.studio.fanNum--
							this.toast('取消关注成功')
						}else{
							this.studio.fanNum++
							this.toast('关注成功')
						}
						this.studio.isFan = !this.studio.isFan
					}
				})
			}
		},
		computed :{
			...mapGetters(['myStudioID','uid']),
			showSeatImg () {
				if (this.subjects.length === 0 && this.isLoadOnce) {
					return true
				}else{
					return false
				}
			},
			showBtn () {
				if (this.subjects.length < 5 && this.subejectsIsEnd) {
					return false
				}else{
					return true
				}
			},
			showLanch () {
				if ($('#studio-intro').html() && ($('#studio-intro').width() / 12 < $('#studio-intro').html().length)) {
					return true
				}else{
					console.log(2)
					return false
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.header{
		position: relative;
		padding-bottom: 47.5%;
		background-image: url(../../assets/images/bg_wdzbj.png);
		background-position: 50%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		&.lanch{
			@media screen and (min-width:375px) {
				padding-bottom: 55.5%;
			}
			padding-bottom: 58.5%;
		}
	}
	.user-info{
		position: absolute;
		width: 100%;
		color: #fff;
		>div:nth-child(1){
			img{
				width: .6rem;
			    height: .6rem;
			    display: block;
			    border-radius: 50%;
			    border: none;
			    margin-top: .15rem;
			}
		}
		>div:nth-child(2){
			margin-top: .15rem;
		    margin-bottom: .1rem;
		    text-align: center;
		    .studio-name{
		    	font-size: .16rem;
		    	margin-bottom: .10rem;
		    }
		}
		.info-wrap{
			padding:0 30px;
			flex-wrap: wrap;
			position: relative;
			width: 100%;
			box-sizing: border-box;
		}
		.studio-intro-p{
			position: relative;
			width: 100%;
			.studio-jj{
				width: 36px;
				flex:0 0 36px;
			}
			span.lanch{
				height: 48px;
				text-align: left;
			}
			span{
				display: block;
			}
		}
		.lanch-info{
			margin-left: 10px;
			width: 15px;
			word-break:break-all;
			transition:all .3s;
			position: absolute;
			right:15px;
			&.lanched{
				transform:rotate(180deg);
			}
		}
	}
	.subjects-loading{
		padding: 20px 0;
	}
	.seat-img{
		width: 100%;
		img{
			margin-top: 50px;
			width: 45%;
		}
		p{
			color: #999;
		}
	}
	.click-more{
		margin-bottom: .1rem;
		background-color: #fff;
    	padding: .1rem .1rem 0;
    	button{
    	    border: none;
 		    background: #fff;
    		color: #ccc;
    		width: 100%;
    	}
	}
	.btn-focus {
		padding: 0 0.08rem;
	    border-radius: 10px;
	    text-align: center;
	    color: #fff;
	    display: block;
	    background-color: #d93639;
	    height: 16px;
	    line-height: 16px;
	    margin-left: 10px;
	}
	.btn-unfocus {
		background-color: #999;
	}
</style>
