<template>
	<div class="subject-intro">
		<x-header :title="subject.subjectTitle">
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
		</x-header>
		<div class="subject-header" v-bind:style="style"></div>
		<div class="subject-title">
			<h4 v-text="subject.subjectTitle"></h4>
			<div class="flex justify-space-between">
				<div class="subject-time ">{{new Date(subject.startTime*1000).Format('yyyy-MM-dd hh:mm')}}</div>
				<div class="subject-num flex align-items-center">
					<i class="icon icon-peoples"></i>
					<span v-text="subject.uvNum"></span>
				</div>
			</div>
		</div>
		<div class="all-intro" v-if="subject.masterIntro != ''">
			<div class="intro">
				<h5>话题介绍</h5>
				<p>{{subject.subjectIntro}}</p>
			</div>
			<div class="intro" v-if="subject.masterIntro != ''">
				<h5>嘉宾介绍</h5>
				<p>{{subject.masterIntro}}</p>
			</div>
		</div>
		<div class="studio-info">
			<div class="flex justify-space-between align-items-center studio-owner">
				<div class="flex align-items-center">
					<img src="../../assets/images/icon_zbj_mr.png">
					<span>jack的直播间</span>
				</div>
				<div class="flex align-items-center">
					<a class="btn" @click="focus" v-if="subject.subjectRole == 100">关注</a>
				</div>
			</div>
			<div class="flex studio-num align-items-center">
				<div class="flex flex-direction-column just-space-around">
					<p>24</p>
					<p>话题数</p>
				</div>
				<div class="flex flex-direction-column just-space-around">
					<p>556</p>
					<p>粉丝数</p>
				</div>
			</div>
		</div>
		<a class="enter" @click="enter">进入直播间</a>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner} from 'mint-ui'
import { api } from '../../utils/api'
export default {
	name:'SubjectIntro',
	components:{
		xHeader:Header
	},
	created () {
		this.hideLoad()
		const query = this.$route.query
		this.subjectId = Number(query.subjectId)
		this.getSubjectInfo()
	},
	data () {
		return {
			subjectId:0,
			subject:{}
		}
	},
	methods : {
		...mapMutations(['hideLoad']),
		goBcak () {
			history.back()
		},
		getSubjectInfo () {
			api(this.uid,{srv:'studio_studio',cmd:'get_subject_info'},{subjectId:this.subjectId})
			.then(res => {
				res = res.data
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.hideLoad()
					this.subject = res.rsps[0].body.subject
				}
			})
		},
		enter () {
			alert('enter')
		},
		focus () {
			alert('关注')
		}
	},
	computed: {
		...mapGetters(['uid']),
		style () {
			if (this.subject.subjectImg != '') {
				return {backgroundImage:'url('+ this.subject.subjectImg +')'}
			}else{
				return ''
			}
		}
	}
}
</script>
<style lang="less" scoped>
	.subject-header{
		background-position: 50%;
	    background-size: 100%;
	    background-repeat: no-repeat;
	    background-image: url(../../assets/images/topic_intro_bg.png);
	    height: 1.8rem;
	    width: 100%;
	    position: relative;
	}
	.subject-intro{
		background-color: #f2f2f2;
		min-height: 100vh;
		min-height: 100%;
		padding-bottom: 55px;
	}
	.subject-title{
		background-color: #fff;
		padding: 15px;
		h4{
			color: #fff;
			font-size: 18px;
			color: #333;
			font-weight: normal;
			margin-top: 0;
			text-align: left;
			margin-bottom: 20px;
		}
		.subject-time{
			color: #d93639;
			font-size: 15px;
		}
		.subject-num{
			i{
				width: 16px;
				height: 16px;
				margin-right: 5px;
			}
			span{
				color: #999;
			}
		}
	}
	.all-intro{
		background-color: #fff;
		margin-top: 10px;
		padding: 15px;
		font-size: 14px;
		.intro{
			padding: 15px 0px 30px;
			>p{
				margin-top: 20px;
				color: #333;
				text-align: left;
			}
		}
		h5{
			margin: 0;
			font-size: 14px;
			font-weight: normal;
			text-align: left;
			color: #999;
		}
	}
	.studio-info{
		background-color: #fff;
		margin-top: 10px;
		.studio-owner{
			>div:nth-child(1){
				height: 45px;
				font-size: 15px;
				color: #333;
				img{
					width: 32px;
					height: 32px;
					border-radius: 50%;
					margin-right: 15px;
				}
			}
			border-bottom: 1px solid #e2e2e2;
			padding: 0 15px;
			.btn{
				background-color: #d93639;
				color: #fff;
				padding: 3px 8px;
				border-radius: 5px;
			}
		}
		.studio-num{
			height: 80px;
			>div{
				height: 50px;
				flex:1 1 50%;
				>p:nth-child(1){
					font-size: 14px;
					color: #333;
				}
				>p:nth-child(2){
					color: #999;
					font-size: 14px;
				}
			}
			>div:nth-child(1){
				border-right: 1px solid #e2e2e2;
			}
		}
	}
	.enter{
		margin-top: 10px;
		display: block;
		background-color: #d93639;
		color: #fff;
		position: fixed;
	    bottom: 0;
	    height: 45px;
	    width: 100%;
	    color: #fff;
	    text-align: center;
	    font-size: 17px;
	    line-height: 45px;
	}
</style>
