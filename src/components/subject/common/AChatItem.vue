<template>
	<div class="chat-a-item">
		<div class="flex" v-if="msg.msgType <= 200">
			<div class="chat-speaker">
				<img :src="msg.headImg" v-if="msg.headImg !='' && msg.headImg ">
				<img src="../../../assets/images/default_head.png" v-else>
				<i class="icon icon-dashang" @click="gain(msg)"></i>
			</div>
			<div class="chat-content">
				<div class="chat-speaker-name ">
					<span>{{msg.name}}</span>
					<span></span>
					<!-- <span>{{new Date(msg.msgTime*1000).Format("yyyy-MM-dd hh:mm:ss")}}</span> -->
				</div>
				<div class="chat-speaker-content" v-if="!msg.answerFlag">
					<!-- 文字 -->
					<div class="content flex align-items-center" v-if="msg.msgType === 1">
						<div class="triangle bw" style="width:auto"></div>
						<div class="triangle-border"></div>
						<div class="word-msg">
							<div class="msg" v-html="msg.textContent.replace(/<script.*?>.*?<\/script>/ig,'').replace(/\n/g,'<br>')"></div>
						</div>
					</div>

					<!-- 图片 -->
					<div class="image" v-if="msg.msgType === 2" @click="showPreview">
						<img :src="msg.imgUrl">
					</div>

					<!-- 语音 -->
					<div class="flex align-items-center voice" v-if="msg.msgType === 3" >
						<div class="content"
						v-voice-width="{'vodDuration':msg.vodDuration,'msgType':msg.msgType}"
						@click="play({vodUrl:msg.vodUrl,vodDuration:msg.vodDuration},1)">
							<div class="triangle"></div>
							<div class="triangle-border"></div>
							<div class="voice-msg">
								<i class="icon icon-voice" :class="{'icon-playing':msg.playing}"></i>
							</div>
						</div>
						<span class="times">{{msg.vodDuration}}s</span>
					</div>
				</div>

				<div class="content" v-if="msg.answerFlag">
					<div class="triangle"></div>
					<div class="triangle-border"></div>
					<div>
						<p class="text-left t999">
							{{msg.refQuestionText}}
						</p>
						<div class="bd1"></div>
						<div class="flex align-items-center" v-if="msg.ansList[0].ansType == 3">
							<div class="answer-voice content"
								v-voice-width="{'vodDuration':msg.ansList[0].vodDuration,'msgType':msg.ansList[0].ansType}"
								@click="play({vodUrl:msg.ansList[0].vodUrl,vodDuration:msg.ansList[0].vodDuration},3)">
								<div class="voice-msg">
									<i class="icon icon-voice" :class="{'icon-playing':msg.ansList[0].playing}"></i>
								</div>
							</div>
							<span class="times answer-times">{{msg.ansList[0].vodDuration}}s</span>
						</div>
						<div class="text-left" v-if="msg.ansList[0].ansType == 1">
							<p>
								{{msg.ansList[0].textContent}}
							</p>
						</div>
					</div>
				</div>
				<!--//调研-->
				<div class="question" @click="showQuestion(msg)" v-if="msg.msgType === 100">
					<div>
						<h4 v-text="msg.refQuestionText"></h4>
						<div class="question-intro" data-flex="box:last" >
							<div v-text="msg.textContent"></div>
							<div class="question-img" :style="{'background-image':`url(${msg.imgUrl})`}">
							</div>
						</div>
					</div>
					<div class="question-bt-icon" data-flex="cross:center">
						<i class="icon icon-question" :style="{'background-image':`url(${subject.subjectImg})`}"></i>
						<p v-text="subject.subjectTitle"></p>
					</div>
				</div>
			</div>
		</div>
		<div  v-if="msg.msgType > 200">
			<div class="tip-live-notice" >
				<p v-text="msg.textContent"></p>
			</div>
		</div>
 		<div class="tip-to-app" v-if="!isStart && subjectRole == 1">
			<a href="https://www.yishengzhan.cn/download?channel=release_webysz">要开始直播，请使用医生站APP。</a>
		</div>
 		<!--<div class="gain">
			<div>
				<div class="gain-inner flex align-items-center justify-center">
					<i class="icon icon-gain"></i>
					<span>XX</span>
					<span>打赏了</span>
					<span>ZZ</span>
					<span>1元</span>
				</div>
			</div>
		</div> -->


	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import bus from '../../common/eventBus.js'
	export default{
		props:{
			msg:{
				type:Object,
				default:{}
			},
			index:{
				type:Number,
				default:0
			}
		},
		data () {
			return {
				flag:true
			}
		},
		computed :{
			...mapGetters(['subjectRole','isStart','subject'])
		},
		methods: {
			showPreview () {
				const images = this.$store.getters.images
				let index
				images.forEach((ite,idx)=>{
					if (this.msg.id === ite.id) {
						index = idx
					}
				})
				bus.$emit('show',index)
			},
			play (msg,type) {
				// type= 1播放，type=2停止，type=3答案语音播放，type=4答案语音停止
				bus.$emit('resetOtherVoicePlay',this.index)
				if(this.flag){
					this.flag = false
					console.log('play')
					bus.$emit('playVoice',{msg,index:this.index,type})
					setTimeout(()=>{
						// console.log(msg.vodDuration)
						this.flag = true
					},msg.vodDuration*990)
				}else{
					console.log('end')
					this.flag = true
					bus.$emit('endVoice',{index:this.index,type:type+1})
				}
			},
			gain (msg) {
				bus.$emit('invoke',msg)
			},
			showQuestion (msg) {
				bus.$emit('showQuestion',{title:msg.refQuestionText,brief:msg.textContent,imgUrl:msg.imgUrl,url:msg.vodUrl})
			}
		},
		filters: {

		},
		directives: {
			voiceWidth: {
				inserted (el,binding) {
					/*计算语音宽度，最长60s，最短1s，*/
					if(binding.value.msgType == 3 && binding.value.vodDuration){
						// console.log(el)
						el.style.width =.2 + Number(binding.value.vodDuration)*1.2/60 + 'rem'
					}
				}
			}
		},
		mounted () {
			bus.$on('resetOtherVoicePlay',index=>{
				if(this.index != index){
					this.flag = true
				}
			})
		}
	}
</script>
<style lang="less" scoped>
	.chat-a-item {
		margin: 5px 0;
	}
	.chat-speaker{
		img{
			width: .36rem;
			display: block;
			margin: 0 auto;
			height: .36rem;
			border-radius: .18rem;
			margin-top: .1rem;
			overflow: hidden;
		}
		.icon-dashang{
			margin: 5px auto 0;
			background-image: url(../../../assets/icons/icon_ds.png)
		}
	}
	.chat-content{
		margin-left: 0.15rem;
	    display: inline-block;
	    min-width: .5rem;
	    position: relative;
	}
	.chat-speaker-name{
		color: #4a4a4a;
		font-size: 0.15rem;
		text-align: left;
	}
	.content{
		font-size: .15rem;
	    color: #4a4a4a;
	    border: 1px solid #d8d8d8;
	    line-height: .2rem;
	    min-height: .2rem;
	    background-color: #fff;
	    padding: 0 .05rem;
	    max-width: 2.4rem;
	    border-radius: 5px;
	    padding: .05rem .1rem;
	    word-break: break-all;
	    position: relative;
	    margin-top: 5px;
		background-color: #f9f9f9;
	}
	.triangle{
		width: 0;
	    height: 0;
	    border-top: 6px solid transparent;
	    border-right: 7px solid #f9f9f9;
	    border-bottom: 6px solid transparent;
	    position: absolute;
	    z-index: 5;
	    left: -7px;
	    top: 9px;
	}
	.triangle-border{
		width: 0;
	    height: 0;
	    border-top: 7px solid transparent;
	    border-right: 8px solid #d8d8d8;
	    border-bottom: 7px solid transparent;
	    position: absolute;
	    z-index: 4;
	    left: -8px;
	    top: 8px;
	}
	.word-msg{
		text-align: left;
	}
	.voice{
		margin-top: 10px;
		.content{
			margin-top: 0;
			margin-right: 5px;
		}
	}
	.voice-msg{
		.icon-playing{
			animation:  blink 1s linear infinite;
			@keyframes blink {
				0% { background-image: url(../../../assets/icons/yuying1.png)}
				50% { background-image: url(../../../assets/icons/yuying2.png) }
				100% { background-image: url(../../../assets/icons/yuying1.png)}
			}
		}
		.times{
			color: #666;
		}
		.icon-voice{
			background-image: url(../../../assets/icons/yuying2.png);
		}
	}

	.image{
		margin-top: 10px;
		img{
		    max-width: 1.6rem;
    		max-height: 3rem;
    		border-radius: 5px;
		}
	}
	.tip-live-notice{
		margin: 15px 0 25px;
		p{
			display: inline-block;
			padding: 2px 10px;
			background-color: #cecece;
			border-radius: 5px;
			color: #fff;
		}
	}
	.tip-to-app{
		a{
			color: #c1c1c1;
			text-decoration: underline;
		}
	}
	.gain{
		margin:.1rem 0;
		>div{
			display: inline-block;
		}
	}
	.gain-inner{
		.icon{
			height: 15px;width: 13px;
			margin-right: 5px;
		}
		span{
			display: inline-block;
			margin: 0 3px;
		}
		flex: 0 0 auto;
		background: #edc891;
	    border-radius: 3px;
	    height: 23px;
	    font-size: 12px;
	    color: #fff;
	    padding: 0 10px;
	}
	.answer{
		border-top: 1px solid #f0f0f0;
		padding: 10px 0;
	}
	.bd1{
		height: 1px;
		background-color: #e2e2e2;
		margin: 5px 0 4px;
	}
	.answer-voice{
		margin-right: 5px;
		background-color: #f9f9f9;
	}
	.answer-times{
			// flex:0;
		display: block;
		// min-width:50px; 
		word-break: normal;
	}
	.question{
		border-radius: 5px;
		border: 1px solid #e2e2e2;
		background-color: #fff;
		max-width: 2.4rem;
		min-width: 2.2rem;
		margin-bottom: 5px;
		h4{
			font-size: 15px;
			color: #000;
			padding: 12px 10px 0px;
			font-weight: normal;
			text-align: left;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.question-intro{
			color: #999;
			font-size: 12px;
			padding: 8px 10px 10px;
			>div:nth-child(1){
				text-align: left;
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				word-break:break-all;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2; 
				height: 40px;
			}
			>div:nth-child(2){
				width: 45px;
				height: 45px;
				background-position: center;
				background-repeat: no-repeat;
				background-size: cover;
				margin-left: 12px;
			}
		}
		.question-bt-icon{
			border-top: 1px solid #e2e2e2;
			padding: 6px 10px;
			color: #999;
			.icon{
				margin-right: 6px;
				width: 16px;
				height: 16px;
			}
		}
	}
</style>
