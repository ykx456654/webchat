<template>
	<div class="normal input flex align-items-center justify-center">
		<div class="input-box flex align-items-center">
			<div class="flex question align-items-center" @click="quiz">
				<span class="icon" :class="{'icon-quized':isQuiz}"></span>
				<span>提问</span>
			</div>
			<textarea placeholder="输入讨论内容..." ></textarea>
		</div>
		<div>
			<a class="btn btn-send">发送</a>
		</div>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
	export default{
		data () {
			return {
				isQuiz:false
			}
		},
		methods:{
			quiz () {
				this.isQuiz = !this.isQuiz
			}
		},
		computed: {
			...mapGetters(['system'])
		}
	}
</script>
<style lang="less">
@import url(../../../assets/less/input.less);
</style>