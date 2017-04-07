<template>
	<div class="high input flex align-items-center justify-center">
		<div @click="recordVoice">
			<i class="icon icon-voice-input"></i>
		</div>
		<div class="input-box flex align-items-center">
			<textarea v-model="content"></textarea>
		</div>
		<div>
			<a class="btn " :class="[canSend?'btn-send':'no-send']" @click="sendMsg">发送</a>
		</div>
		<div>
			<i class="icon icon-plus" @click="sendImg"></i>
		</div>
		<!-- <input type="file" name=""> -->
	</div>
</template>
<script>
import bus from '../../common/eventBus'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { Indicator } from 'mint-ui';
	export default {
		data () {
			return {
				canSend:true,
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
		methods:{
			...mapActions(['saveMsg']),
			recordVoice () {
				bus.$emit('record',true)
			},
			sendImg () {
				// bus.$emit('Ascroll')
				alert('发送图片')
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
.btn{
	display: block;
	color: #fff;
	height: .3rem;
	width: 40px;
	border-radius: 3px;
	margin-left: 5px;
	line-height: .3rem;
}
.btn-send{
	background-color: #d93639;
}
.no-send{
	background-color: #9b9b9b
}
</style>