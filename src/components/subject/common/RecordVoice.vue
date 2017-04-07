<template>
	<div class="record-voice">
		<i class="icon icon-del" v-show="isRecording" @click="del"></i>
		<h6 v-show="!isRecording">点击开始录音</h6>
		<h6 v-show="isRecording"><span class="blue" v-text="t"></span> / <span>60s</span></h6>
		<div class="record-buttom flex align-items-center justify-center">
			<div @click="startRecord" class="record " :class="[isRecording?'r-after':'r-before']">
				<div></div>
				<div></div>
			</div>
		</div>
		<h6>每条最多60s，结束后自动开始录制下一条</h6>
	</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import bus from '../../common/eventBus'
	export default {
		data () {
			return {
				isRecording:false,
				timer:null,
				t:0
			}
		},
		methods:{
			startRecord () {
				if (this.isRecording) {
					alert('结束录音')
					clearInterval(this.timer)
					this.isRecording = false
				}else{
					alert('开始录音')
					this.isRecording = true
					if (this.timer) {clearInterval(this.timer)}
					this.timer = 
					setInterval(()=>{
						this.t = this.t + 1
					},1000)
				}
			},
			del () {
				MessageBox({
					title:'',
					message: '取消当前声音录制?',
  					showCancelButton: true
				})
				.then(action=>{
					if (action == 'confirm') {
						alert('取消录制')
						clearInterval(this.timer)
						this.isRecording = false
						this.t = 0
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.record-voice{
		background-color: #fff;
		height: 2rem;
		position: relative;
		h6{
			font-weight: normal;
			margin: 0;
			height: .5rem;
			line-height: .5rem;
		    text-align: center;
    		font-size: .14rem;
    		color: #9b9b9b;
		}
		.blue{
			color: #4a90e2
		}
		.record-buttom{
			height: 1rem;
		}
		.record{
			position: relative;
			width: 1rem;
			height: 1rem;
			border-radius: .5rem;
		}
		.record.r-before{
			border: 1px solid #a0a0a0;
			&:before {
				display: block;
				content: "";
				position: absolute;
				width: .8rem;
				height: .8rem;
				left: 50%;
				top: 50%;
				margin-left: -.4rem;
				margin-top: -.4rem;
				border-radius: .4rem;
				background-color: #d93639;
				z-index: 600;
			}
		}
		.record.r-after{
			&:before{
				display: block;
				content: "";
				position: absolute;
				width: .8rem;
				height: .8rem;
				left: 50%;
				top: 50%;
				margin-left: -.4rem;
				margin-top: -.4rem;
				border-radius: .4rem;
				background-color: #4a90e2;
				z-index: 600;
			}
			&:after{
				display: block;
				content: "";
				position: absolute;
				width: .8rem;
				height: .8rem;
				left: 50%;
				top: 50%;
				margin-left: -.4rem;
				margin-top: -.4rem;
				border-radius: .4rem;
				background-color: #c3ddfc;
				z-index: 599;
				animation: lightup 2s infinite;
			}
			>div{
				position: absolute;
				z-index: 601;
				width: .06rem;
			    height: .4rem;
			    background-color: #fff;
			    border-radius: .04rem;
			    left: 50%;
			    top: 50%;
			    &:nth-child(1){
			    	margin-left: -.09rem;
			    	margin-top: -.2rem;
			    }
			    &:nth-child(2){
			    	margin-left: 0.03rem;
			    	margin-top: -.2rem;
			    }
			}
		}
	}

	@keyframes lightup {
		0% {
			transform:scale(1)
		}
		50%{
			transform:scale(1.3)
		}
		100%{
			transform:scale(1)
		}
	}


	.icon-del{
		position: absolute;
		right: 10px;
		top: 10px;
	}
</style>