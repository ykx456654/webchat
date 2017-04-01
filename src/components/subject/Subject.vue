<template>
	<div class="flex flex-direction-column">
		<x-header :title="subject.subjectTitle">
			<a slot="left" @click="goBcak()">
				<i class="icon icon-arrow-back"></i>
			</a>
		</x-header>
		<section class="swiper-ppt" v-if="subject.subjectType != 1">
			<img src="../../assets/images/pic__zbht.jpg">
		</section>
		<section class="chat" :class="{'no-ppt':subject.subjectType == 1}">
			<div class="subject-intro flex align-items-center justify-space-between" @click="linkSubjectIntro">
				<i class="icon icon-subject-intro"></i>
				<span>话题介绍</span>
			</div>
			<div class="discuss flex align-items-center justify-center" @click="linkDiscuss">
				<div class="members flex align-items-center">
					<img src="../../assets/icons/icon_rq.png">
					<span>456</span>
				</div>
				<div class="flex align-items-center justify-center">讨论</div>
			</div>
			<div class="studio-home">
				<i class="icon icon-studio-home"></i>
			</div>
			<chat-part-b></chat-part-b>
			<chat-part-a :subject-info="subject"></chat-part-a>	
		</section>
		<section>
			<normal-input></normal-input>
			<high-input v-if="false"></high-input>
		</section>
		<audio id="voice-player" class="voice-player"></audio>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner } from 'mint-ui'
import { api } from '../../utils/api'
import ChatPartA from './common/ChatPartA'
import ChatPartB from './common/ChatPartB'
import NormalInput from './common/NormalInput'
import HighInput from './common/HighInput'
	export default {
		name:'Subject',
		created () {
			const query = this.$route.query
			this.setSubjectInfo({subjectId:query.subjectId,studioId:query.studioId})
			var p1 = this.getSubjectInfo()
			var p2 = this.enterSubejct()
			Promise.all([p1,p2])
			.then(res=>{
				return res.every(item => item == true)
			})
			.then(()=>{
				this.isCached = true
				this.hideLoad()
			})
			.then(()=>{
				console.log(11122112)
				this.loopSubject()
			})
			.catch(e=>{
				console.log(e + 'from subject_enter')
			})
		},
		mounted () {
			// this.hideLoad()
		},
		activated () {
			if (this.isCached) {
				this.hideLoad()
			}
		},
		deactivated () {

		},
		beforeRouteLeave (to, from ,next) {
			if (to.name != 'Discuss') {
				this.clearMsg()
			}
			// console.log(from)
			// console.log(to)
			next()
		},
		components:{xHeader:Header,ChatPartA,NormalInput,HighInput,ChatPartB},
		data () {
			return {
				isCached:false
			}
		},
		computed: {
			...mapGetters(['subject','id','uvNum'])
		},
		methods:{
			...mapMutations(['showLoad','hideLoad','setSubjectInfo','clearMsg']),
			...mapActions(['getSubjectInfo','enterSubejct','loopSubject']),
			checkLayout() {

			},
			goBcak () {
				this.$destroy()
				history.back()
			},
			linkSubjectIntro () {
				this.showLoad()
				setTimeout(()=>{
					this.$router.push({path:'/SubjectIntro',query:{subjectId:this.id.subjectId}})
				},1000)
			},
			linkDiscuss () {
				this.showLoad()
				const query = this.$route.query
				this.$router.push({path:'/Discuss',query})
			}
		}
	}
</script>
<style lang="less" scoped>
	.swiper-ppt{
		height: 2.1rem;
		width: 100%;
		background-color: #111;
		img{
			width: 100%;
		}
	}
	.chat{
		position: relative;
		// flex:1 1 100%;
		background-color: #f7f7f7;
		height: calc(~'100vh - 3.05rem');
		overflow: hidden;
		&.no-ppt{
			height: calc(~'100vh - 0.95rem');
		}
	}
	.input{
		flex:0 0 auto;
		// position: fixed;
		align-self: space-around;
		bottom: 0;
		height: 0.5rem;
	}
	.subject-intro{
		position: absolute;
		background-color: #fff;
		left: 10px;
		top: 10px;
		width: 100px;
		height: 30px;
		line-height: 30px;
		border-radius: 18px;
		z-index: 10;
		i{
			background-image: url(../../assets/images/pic_htjs.png);
			background-repeat: no-repeat;
			margin-left: 5px; 
			width: 24px;
			height: 24px;
		}
		span{
			color: #d93639;
			font-size: 12px;
			text-align: left;
			margin-left: 8px;
			flex:1 1 auto;
		}
	}
	.studio-home{
		position: absolute;
		bottom: 30px;
		z-index: 10;
		right: 10px;
		i{
			background-image: url(../../assets/images/button_hdzbj.png);
			width: 55px;
			height: 60px;
		}
	}
	.chat-part-a{
		position: relative;
		height: 100%;
		overflow-y: scroll;
		overflow-x:hidden;
	}
	.chat-part-b{
		position: absolute;
		z-index: 5;
		width: 1.15rem;
		top: 0.45rem;
		right: 0.05rem;
	}
	.discuss{
		position: absolute;
	    top: .05rem;
	    right: .05rem;
	    z-index: 10;
	    .members{
	    	background-color: #303031;
		    color: #fff;
		    height: .25rem;
		    padding: 0 .2rem 0 .15rem;
		    border-radius: .125rem 0 0 .125rem;
		    span{
		    	font-size: 12px;
		    	margin-left: 3px;
		    }
		    img{
		    	width: 0.15rem;
		    }
	    }
	    >div:nth-child(2){
			width: .3rem;
		    height: .3rem;
		    border-radius: .15rem;
		    background-color: #d93639;
		    text-align: center;
		    color: #fff;
		    margin-left: -15px;
		    font-size: 12px;
	    }
	}
	.voice-player{
		display: none;
	}
</style>
