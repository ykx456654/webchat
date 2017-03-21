<template>
	<div class="me-wrap">
		<div class="me">
			<img class="me-bg" src="../../assets/images/wo_bg.jpg">
			<div class="me-header">
				<img src="http://wx.qlogo.cn/mmopen/SaNfE90PbPL3gjlRc2SCMRzJqMmCpSPkEaTbr5u387bvFw169s7AlzSpU2kvYcW4uzrun7ktBWlgT79KOZ48pPLuewapQuFq/0">
			</div>
		</div>
		<div class="">
			<cellx is-link>
				<div class="cells flex align-items-center" slot="left">
					<img src="../../assets/images/icon_wdzbj.png">
					<p>gffdsdf</p>
				</div>
			</cellx>
		</div>
	</div>
</template>
<style lang="less" scoped>
	.me-wrap {
		background-color: #f2f2f2;
		height: 95%;
		height: calc(~'100% - 53px');
	}
	.me{
		position: relative;
		padding-bottom: 54.4%;
		overflow: hidden;
	}
	.me-bg{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
		max-height: 210px;
	}
	.me-header{
		width: 20%;
		position: absolute;
		left: 50%;
		margin-left: -10%;
		margin-top: 10%;
		img{
			width: 100%;
			border-radius: 50%;
		}
	}
	.cells{
		img{
			width: 28px;
			height: 28px;
		}
		p{
			font-size: 16px;
			margin-left: 10px;
		}
	}
</style>
<script>
import { mapMutations } from 'vuex'
import cellx from '../common/cell-x'
	export default {
		components:{
			cellx
		},
		created () {
			this.hideLoad()
		},
		methods : {
			...mapMutations([
				'showLoad','hideLoad'
			])
		}
	}
</script>