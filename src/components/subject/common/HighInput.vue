<template>
	<div data-flex="main:justify box:justify" class="high input flex align-items-center">
		<div @click="recordVoice">
			<i class="icon icon-voice-input"></i>
		</div>
		<div data-flex="box:0"  class="input-box flex align-items-center">
			<textarea v-model="content"></textarea>
		</div>
		<div data-flex="box:1">
			<a class="btn " :class="[canSend?'btn-send':'no-send']" @click="sendMsg">发送</a>
		</div>
		<div data-flex="box: 0">
			<i class="icon icon-plus" @click="sendImg"></i>
		</div>
		<!-- <input type="file" name=""> -->
	</div>
</template>
<script>
import bus from '../../common/eventBus'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { Indicator,MessageBox  } from 'mint-ui';
	export default {
		data () {
			return {
				content:'',
				width:0,
				height:0,
				vodDuration:0,
				refQuestionId:0,
				questionFlag:false,
				answerFlag:false,
				msgType:1,
				type:1
			}
		},
		computed :{
			canSend () {
				if (this.content != '') {
					return true
				}else{
					return false
				}
			}
		},
		methods:{
			...mapActions(['saveMsg']),
			recordVoice () {
				MessageBox({
					title:'提示',
					message:'暂不提供语音功能，如果您想使用语音，请至医生站app的直播间',
					confirmButtonText:'去下载',
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
				// bus.$emit('record',true)
			},
			sendImg () {
				MessageBox({
					title:'提示',
					message:'暂不提供发送图片，如果您想发送图片，请至医生站app的直播间',
					confirmButtonText:'去下载',
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
				// bus.$emit('Ascroll')
				// alert('发送图片')
			},
			sendMsg () {
				if (!this.canSend) return false
				if (!this.content) {
					this.toast('请选择发送内容')
					return false
				}
				this.questionFlag = this.isQuiz
				const data = {
					type:this.type,
					questionFlag:this.questionFlag,
					answerFlag:this.answerFlag,
					msgType:this.msgType,
					content:this.content.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
					width:this.width,
					height:this.height,
					vodDuration:this.vodDuration,
					refQuestionId:this.refQuestionId
				}
				this.sendStatu = 1
				Indicator.open({
					text:'发送中...',
					spinnerType:'snake'
				})
				this.saveMsg(data)
				.then(res=>{
					this.content = ''
					Indicator.close()
					// console.log(res)
				})
			}
		}
	}
</script>
<style lang="less" scoped>
@import url(../../../assets/less/input.less);
.icon{
	width: 0.22rem;
	height: 0.22rem;
	margin-right: 0.11rem;
}
.icon-plus{
	margin: 0 0 0 0.11rem;
}
.input-box{
	width: auto;
	textarea{
		overflow:hidden; resize:none;
	}
}
.btn{
	display: block;
	color: #fff;
	height: .3rem;
	width: 50px;
	border-radius: 3px;
	margin-left: 5px;
	line-height: .3rem;
	flex: 1 1 50px;
}
.btn-send{
	background-color: #d93639;
}
.no-send{
	background-color: #9b9b9b
}
</style>