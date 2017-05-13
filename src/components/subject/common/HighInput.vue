<template>
	<div ref="input" data-flex="main:justify" class="high input flex align-items-center">
		<div data-flex="box:1" @click="recordVoice">
			<i class="icon icon-voice-input"></i>
		</div>
		<div data-flex="box:7"  class="input-box-high flex align-items-center">
			<textarea placeholder="输入内容..." v-model="content" v-on:focus="inputFocus"></textarea>
		</div>
		<div data-flex="box:1">
			<i class="icon icon-plus" @click="sendImg"></i>
		</div>
		<div data-flex="box:1">
			<a class="btn" :class="[canSend?'btn-send':'no-send']" @click="sendMsg">发送</a>
		</div>

		<!-- <input type="file" name=""> -->
	</div>
</template>
<script>
import bus from '../../common/eventBus'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { Indicator,MessageBox  } from 'mint-ui'
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
			...mapGetters(['system']),
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
			},
			inputFocus () {
				// 输入框上浮
				console.log(1)
				if (this.system == 'andriod') {
					this.$refs.input.scrollIntoView(false)
				}
				if (this.system == 'ios') {
					setTimeout(() => {
					document.body.scrollTop = document.body.scrollHeight
					}, 500)
				}
			}
		}
	}
</script>
<style lang="less" scoped>
@import url(../../../assets/less/input.less);
.icon{
	width: 0.22rem;
	height: 0.22rem;
	// margin-right: 0.11rem;
}
.icon-plus{
	// margin: 0 0 0 0.11rem;
}
.high.input{

}
.input-box-high{
	height: 0.3rem;
    width: 60%;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    padding: 0 7px;
    background-color: #fcfcfc;
	textarea{
		overflow:hidden; resize:none;
		height: 0.25rem;
		line-height: 0.25rem;
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