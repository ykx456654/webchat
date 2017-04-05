<template> 
	<div class="chat-b chat-part-b">
		<div class="flex chat-b-item justify-end" v-for="(m,index) in partBMsgList">
			<div class="chat-content">
				<i class="icon icon-wen fl" v-if="m.questionFlag"></i>
				{{m.textContent}}
			</div>
			<div class="user-head">
				<img :src="m.headImg" v-if="m.headImg!=''">
				<img src="../../../assets/images/default_head.png" v-else>
			</div>	
		</div>
	</div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
	export default {
		data () {
			return {
				normalMsg:[1,2,3,4]
			}
		},
		computed:{
			...mapGetters(['partBMsgList'])
		}
	}
</script>
<style lang="less" scoped>
	.chat-content{
		color: #fff;
	    background-color: rgba(74,74,74,.7);
	    border-radius: 2px;
	    overflow: hidden;
	    max-height: 36px;
	    max-width: 90px;
	    font-size: 12px;
	    line-height: 18px;
	    padding: 3px;
	    margin-right: 5px;
	    word-break: break-all;
	    text-align: left;
	    .icon-wen{
	    	width: 15px;
	    	height: 15px;
	    	margin-top: 2px;
	    	margin-right: 2px;
	    	float: left;
	    }
	}
	.user-head{
		width: 22px;
		height: 22px;
		border-radius: 11px;
		img{
			width: 100%;
		}
	}
	.chat-b{
		padding-right: 5px;
	}
	.chat-b-item{
		margin: 5px 0;
	}
</style>