<template>
	<div class="normal input flex align-items-center justify-center">
		<div class="input-box flex align-items-center">
			<div class="flex question align-items-center" @click="quiz">
				<span class="icon" :class="{'icon-quized':isQuiz}"></span>
				<span class="icon icon-wen"></span>
			</div>
			<textarea placeholder="输入讨论内容..." v-model="content"></textarea>
		</div>
		<div>
			<a class="btn " :class="[canSend?'btn-send':'no-send']" @click="sendMsg">发送</a>
		</div>
	</div>
</template>
<script>
import { Indicator } from 'mint-ui';
import { mapMutations ,mapGetters,mapActions} from 'vuex'
	export default{
		data () {
			return {
				isQuiz:false,
				sendStatu:0,   //0未发送，1正在发送，2，发送成功
				content:'',
				width:0,
				height:0,
				vodDuration:0,
				refQuestionId:0,
				questionFlag:false,
				answerFlag:false,
				msgType:1,
				type:2
			}
		},
		methods:{
			...mapActions(['saveMsg']),
			quiz () {
				this.isQuiz = !this.isQuiz
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
		},
		computed: {
			...mapGetters(['system','uid']),
			canSend () {
				if (this.content != '') {
					return true
				}else{
					return false
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.input{
	height: 0.5rem;
	background-color: #ededed;
	padding: 0 10px;
	width: 100%;
	box-sizing: border-box;
	textarea{
		flex:1 1 auto;
		border: none;
		border-radius: 5px;
		background-color: #fcfcfc;
		height: 80%;
		font-size: 15px;
		color: #c2c2c2;
		-webkit-appearance: none;
	}
}
.input-box{
	height: 0.3rem;
	width: 100%;
	border: 1px solid #e2e2e2;
	border-radius: 5px;
	padding: 0 7px;
	background-color: #fcfcfc;
}
.question{
	color: #c2c2c2;
	font-size: 15px;
	flex:  0 0 auto;
	span{
		display: block;
	}
	:first-child{
		width: 15px;
		height: 15px;
		border-radius: 3px;
		border: 1px solid #e2e2e2;
		margin-right: 10px;
	}
	:last-child{
		margin-right: 21px;
		width: 17px;
		height: 17px;
	}
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