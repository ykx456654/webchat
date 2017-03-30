<template>
	<div class="chat-b">
		<div class="flex chat-b-item" v-for="m in normalMsg">
			<div class="chat-content flex justify-center" :data-id="m">
				地方飞得更高都很反感邯郸市的时候覅哈德hi分红个哈佛欧式都是丹佛斯达舒动的时候发货收到的时候发货收到的时候发货收到的时候发货收到的时候发货收到的时候发货收到
			</div>
			<div class="user-head">
				<img src="../../../assets/images/default_head.png">
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