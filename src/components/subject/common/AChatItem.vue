<template>
	<div class="chat-a-item">
		<div class="flex" v-if="msg.msgType < 3">
			<div class="chat-speaker">
				<img :src="msg.headImg" v-if="msg.headImg !='' ">
				<img src="../../../assets/images/default_head.png" v-else>
				<i class="icon icon-dashang"></i>
			</div>
			<div class="chat-content">
				<div class="chat-speaker-name ">
					<span>{{msg.name}}</span>
					<span></span>
				</div>
				<div class="chat-speaker-content">
					<!-- 文字 -->
					<div class="content flex align-items-center" v-if="msg.msgType === 1">
						<div class="triangle"></div>
						<div class="triangle-border"></div>
						<div class="word-msg">
							<div class="msg">{{msg.textContent}}</div>
						</div>
					</div>
					

					<!-- 图片 -->
					<div class="image" v-if="msg.msgType === 2" @click="showPreview">
						<img :src="msg.imgUrl">
					</div>

					<!-- 语音 -->
					<div class="flex align-items-center voice" v-if="msg.msgType === 3" > 
						<div class="content" v-voice-width="{'vodDuration':msg.vodDuration,'msgType':msg.msgType}" @click="playVoice({vodUrl:msg.vodUrl,vodDuration:msg.vodDuration})">
							<div class="triangle"></div>
							<div class="triangle-border"></div>
							<div class="voice-msg">
								<i class="icon icon-voice"></i>
							</div>
						</div>
						<span class="times">{{msg.vodDuration}}s</span>
					</div>

				</div>
			</div>
		</div>
		<div  v-if="msg.msgType > 3">
			<div class="tip-live-notice" >
				<p v-text="msg.textContent"></p>
			</div>
		</div>
<!-- 		<div class="tip-to-app">
			<a>要开始直播，请使用医生站APP。</a>
		</div> -->
<!-- 		<div class="gain">
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
import bus from './eventBus.js'
	export default{
		props:{
			msg:{
				type:Object,
				default:{}
			}
		},
		methods: {
			...mapMutations(['playVoice']),
			showPreview () {
				const images = this.$store.getters.images
				let index 
				images.forEach((ite,idx)=>{
					if (this.msg.id === ite.id) {
						index = idx
					}
				})
				// console.log(images)
				bus.$emit('show',index)
			}
		},
		filters: {

		},
		directives: {
			voiceWidth (el,binding) {
				/*计算语音宽度，最长60s，最短1s，*/
				// console.log(binding)
				el.style.width =.2 + binding.value*1.2/60 + 'rem';
			}
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
		// margin-top: 0.05rem;
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
	}
	.triangle{
		width: 0;
	    height: 0;
	    border-top: 6px solid transparent;
	    border-right: 7px solid #fff;
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
			animation:  1.5s linear infinite blink;
		}
		.times{
			color: #666;
		}
	}
	@keyframes blink {
		0% { background-image: url(../../../assets/icons/yuying1.png)}
		50% { background-image: url(../../../assets/icons/yuying2.png) }
		100% { background-image: url(../../../assets/icons/yuying1.png)}
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

</style>