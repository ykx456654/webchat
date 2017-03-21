<template>
	<div class="setting">
		<x-header title="个人设置"> 
			<router-link to="/me" slot="left">
				<img src="../../assets/images/back2.png">
			</router-link>
		</x-header>
		<header class="header flex align-items-center justify-space-between">
			<span>头像</span>
			<img src="http://wx.qlogo.cn/mmopen/SaNfE90PbPL3gjlRc2SCMRzJqMmCpSPkEaTbr5u387bvFw169s7AlzSpU2kvYcW4uzrun7ktBWlgT79KOZ48pPLuewapQuFq/0">
		</header>
		<cellx>
			
		</cellx>
	</div>
</template>
<script>
import { Header } from 'mint-ui'
import { mapMutations } from 'vuex'
import { XInput, Group } from 'vux'
import cellx from '../common/cell-x'
	export default {
		created () {
			this.hideLoad()
		},
		components: {
			xHeader:Header,
			cellx,XInput,Group
		},
		data () {
			return {

			}
		},
		methods: {
			...mapMutations(['showLoad','hideLoad'])
		}
	}
</script>
<style lang="less">
.header{
	padding: 10px;
	border-bottom: 1px solid #f0f0f0;
	img{
		width: 54px;
		height: 54px;
		border-radius: 27px;
	}
	span{
		font-size: 16px;
	}
}
</style>