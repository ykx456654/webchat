<template>
	<div class="studio">
		<x-header :title="studioTitle">
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
		</x-header>
		<div class="header">
			<div class="user-info">
				<div class="flex justify-center">
					<img src="../../assets/images/default_head.png">
				</div>
				<div>
					<p class="studio-name" v-text="studio.studioTitle"></p>
					<div class="flex justify-center align-items-center ">
						<div class="ft12 align-items-center flex">
							<span>粉丝</span>
							&nbsp;
							<span v-text="studio.fanNum"></span>
						</div>
						<div class=" align-items-center flex">
							<a class="btn btn-focus">关注</a>
						</div>
					</div>
				</div>
				<div class="ft12 flex info-wrap justify-center">
					<p  class="studio-intro-p flex ">简介：<span class="text-overflow" id="studio-intro" v-text="studio.studioIntro"></span></p>
					<span class="lanch-info icon icon-arrow-down-white" v-if="showLanch" @click="lanchStudioInfo"></span>
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
import { api } from '../../utils/api'
import SubjectItem from './common/SubjectItem'
	export default {
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
			this.getStudioInfo()
			.then(res=>{
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.studio = res.rsps[0].body.studio
					this.studioTitle = this.studio.studioTitle
					setTimeout(()=>{
						this.checkInfoSize()
						this.hideLoad()
					},100)
				}
			})

			this.getSubjects()
		},
		data () {
			return {
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
				api(this.uid,{cmd:'get_subject_list',srv:'studio_studio'},{studioId:this.studioId,start:this.subjectsStart,limit:this.subjectsLimit})
				.then(res=>{
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
						this.showLoading = false
					}else{
						this.showLoading = false
						this.subjects = this.subjects.concat(res.rsps[0].body.subjects)
						this.subejectsIsEnd = res.rsps[0].body.is_end
						this.subjectsStart++
					}
				})
			},
			checkInfoSize () {
				// alert($('#studio-intro').width())
			},
			loadMore () {
				if (this.subejectsIsEnd) return false;
				this.getSubjects()
			},
			link (s) {
				console.log(s)
			},
			goBcak () {
				history.back()
			},
			lanchStudioInfo () {
				this.isLanch = !this.isLanch
			}
		},
		computed :{
			...mapGetters(['myStudioID','uid']),
			showSeatImg () {
				if (this.subjects.length === 0) {
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
			padding:0 20px;
			flex-wrap: wrap;
			position: relative;
			width: 100%;
			box-sizing: border-box;
		}
		.studio-intro-p{
			position: relative;
			width: 100%;
			span{
				width: 85%;
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
</style>
