<template>
	<div class="subject-intro">
		<x-header>
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
		</x-header>
		<div class="subject-header" v-bind:style="style"></div>
		<div class="subject-title">
			<h4 v-text="subject.subjectTitle"></h4>
			<div class="flex justify-space-between">
				<div class="subject-time ">{{new Date(subject.startTime*1000).Format('yyyy-MM-dd hh:mm')}}</div>
				<!--<div class="subject-num flex align-items-center">-->
					<!--<i class="icon icon-peoples"></i>-->
					<!--<span v-text="subject.uvNum"></span>-->
				<!--</div>-->
			</div>
		</div>
		<div class="fee flex justify-space-between" v-if="subject.fee != 0">
			<p>票价</p>
			<p class="red">￥{{(subject.fee/100).toFixed(2)}}</p>
		</div>
		<div class="all-intro" v-if="subject.masterIntro != ''">
			<div class="intro">
				<h5>话题介绍</h5>
				<p>{{subject.subjectIntro}}</p>
			</div>
			<div class="intro" v-if="subject.masterIntro != ''">
				<h5>主讲人介绍</h5>
				<p>{{subject.masterIntro}}</p>
			</div>
		</div>
		<div class="studio-info">
			<div class="flex justify-space-between align-items-center studio-owner" @click="toStudio">
				<div class="flex align-items-center">
					<img :src="studio.studioImg" v-if="studio.studioImg!=''">
					<img src="../../assets/images/icon_zbj_mr.png" v-else>
					<span>{{studio.studioTitle}}</span>
				</div>
				<div class="flex align-items-center">
					<a class="btn" :class="{'focused':studio.isFan}" @click.stop="focus" v-if="subject.subjectRole == 100">
						{{!studio.isFan?'关注':'已关注'}}
					</a>
				</div>
			</div>
			<div class="flex studio-num align-items-center">
				<div class="flex flex-direction-column just-space-around">
					<p v-text="studio.subjectNum"></p>
					<p>话题数</p>
				</div>
				<div class="flex flex-direction-column just-space-around">
					<p v-text="studio.fanNum"></p>
					<p>粉丝数</p>
				</div>
			</div>
		</div>
		<a class="enter" @click="enter" :class="{'need-pay':!subject.payFlag && subject.fee > 0}">
			{{!subject.payFlag && subject.fee > 0 ? '付费进入':'进入话题'}}
		</a>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner,MessageBox,Indicator } from 'mint-ui'
import { api } from '../../utils/api'
import { getUrlParam } from '../../utils/func' 
import storage from 'storejs'
import _ from 'lodash'
export default {
	name:'SubjectIntro',
	components:{
		xHeader:Header
	},
	created () {
		const query = this.$route.query
		const froment = query.froment
		const encryptKey = query.encryptKey
		// console.log(encryptKey)
		this.froment = froment
		this.type = Number(query.type)
		// console.log(from)
		this.subjectId = Number(query.subjectId)
		this.studioId = Number(query.studioId)
		let arr = []
		let shareSubjectIdArray = storage('shareSubjectIdArray') || []
		arr = arr.concat(shareSubjectIdArray)
		// console.log(arr)
		if (encryptKey && arr.indexOf(this.subjectId) < 0) {
			api(this.uid,{cmd:'share_points',srv:'ent_hh'},{type_id:this.subjectId,type:6,key:encryptKey})
			.then(()=>{
				arr.push(this.subjectId)
				storage({'shareSubjectIdArray':arr})
			})
		}
		this.getSubjectInfo()
		.then(()=>{
			this.hideLoad()
			wx.ready(() => {
				var	params = {
					title: this.subject.subjectTitle,
					desc: this.subject.subjectIntro,
					link:this.subject.shareUrl,
					imgUrl: this.subject.shareImg
				};
				console.log(params)
				wx.onMenuShareAppMessage(params);
				wx.onMenuShareTimeline(params);
			});
			Promise.resolve()
		})
	},
	mounted () {

	},
	data () {
		return {
			subjectId:0,
			studioId:0,
			subject:{},
			studio:{},
			isPaying:false,
			froment:''
		}
	},
	methods : {
		...mapMutations(['hideLoad','showLoad']),
		goBcak () {
			history.back()
		},
		getSubjectInfo () {
			let type = Number(this.$route.query.type)
			return api(this.uid,{srv:'studio_studio',cmd:'subject_introduce'},{studioId:this.studioId,subjectId:this.subjectId,type})
			.then(res => {
				res = res.data
				if (res.result != 0) {
					this.toast(res.msg)
				}else{
					this.hideLoad()
					this.subject = res.rsps[0].body.subject
					this.studio = res.rsps[0].body.studio
				}
			})
		},
		enter () {
			let openid = storage('openid')
			if(this.subject.fee > 0 && !this.subject.payFlag){
				const data = {
					studioId:this.studioId,
					subjectId:this.subjectId,
					appid:appId
				}
				if(this.isPaying) return
				this.isPaying = true
				api(this.uid,{cmd:'wechat_ticket_prepay_generate',srv:'studio_studio'},data)
				.then(res=>{
					this.isPaying = false
					res = res.data
					if(res.result != 0){
						this.toast(res.msg)
					}else{
						let info = res.rsps[0].body
						// this.toast(JSON.stringify(info))
						var _this = this
						if (typeof WeixinJSBridge == "undefined"){
							if( document.addEventListener ){
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady(info,_this), false);
							}else if (document.attachEvent){
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady(info,_this)); 
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(info,_this));
							}
						}else{
							// alert(1)
							onBridgeReady(info,_this);
						}
					}
				})
				return false
			}
			// alert(openid)
			this.showLoad()
			this.$router.push({path:'/Subject',query:{subjectId:this.subjectId,studioId:this.studioId,froment:this.froment}})
		},
		toStudio () {
			// console.log('fsafasd')
			this.showLoad()
			if(!!this.froment){
				let _url = decodeURIComponent(this.froment)
				location.href = _url
			}else{
				this.$router.push({path:'/Studio',query:{studioId:this.studioId}})
			}
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


function onBridgeReady(info,instance){
	// alert(JSON.stringify(info))
    WeixinJSBridge.invoke(
       'getBrandWCPayRequest',info,
       function(res){
       	    // alert(JSON.stringify(res))
		    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
			var status
		    if (res.err_msg == "get_brand_wcpay_request:ok") {
				instance.isPaying = true
				status = 2
			}else{
				status = 4
				if(res.err_msg == "get_brand_wcpay_request:cancel"){
					status = 3
					instance.toast({
						message:'取消支付',
						iconClass:'icon icon-pay-fail'
					})
				}else{
					instance.toast({
						message:'支付失败' + JSON.stringify(res),
						iconClass:'icon icon-pay-fail'
					})
				}
			}

			api(instance.uid,{cmd:'confirm_ticket_order',srv:'studio_studio'},{sign:info.paySign,status:status})
			.then(res=>{
				res = res.data
				if(res.result == 0){
					if(status == 2){
						instance.toast({
							message:'支付成功',
							iconClass:'icon icon-pay-success'
						})
						instance.payFlag = true
						setTimeout(()=>{
							instance.$router.push({path:'/Subject',query:{subjectId:instance.subjectId,studioId:instance.studioId}})
						},0)
					}
				}else{
					if(status == 2){
						MessageBox({
							message:'网络不稳定，如果您已支付过，请勿重新支付，您可以尝试重新进入页面或刷新页面。',
							confirmButtonText:'我知道了',
							showCancelButton:false
						})
						.then(action=>{
							if(action == 'confirm'){
								location.reload()
							}
						})
					}
				}
			})

       }
   );
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
	.fee{
		margin: 10px 0;
		height: 50px;
		line-height: 50px;
		font-size: 17px;
		padding: 0 15px;
		background-color: #fff
	}
	.red{
		color: #d93639
	}
	.all-intro{
		background-color: #fff;
		margin-top: 10px;
		padding: 15px;
		font-size: 14px;
		.intro{
			padding: 15px 0px 15px;
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
			border-bottom: 1px solid #f2f2f2;
			padding: 0 15px;
			.btn{
				background-color: #d93639;
				color: #fff;
				padding: 3px 8px;
				border-radius: 5px;
				&.focused{
					background-color: #999;
				}
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
				border-right: 1px solid #f2f2f2;
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
	.need-pay{
		background-color: #f9962d;
	}
</style>
