<template>
	<div class="me-wrap">
		<div class="me">
			<img class="me-bg" src="../../assets/images/wo_bg.jpg">
			<div class="me-header">
				<router-link to="/Setting">
					<img src="http://wx.qlogo.cn/mmopen/SaNfE90PbPL3gjlRc2SCMRzJqMmCpSPkEaTbr5u387bvFw169s7AlzSpU2kvYcW4uzrun7ktBWlgT79KOZ48pPLuewapQuFq/0">
				</router-link>
				<div class="me-info">
				<p class="flex justify-center">
					<span class="ft14" v-text="userInfo.nickName"></span>
					<span class="ft12" v-text="userInfo.title"></span>
				</p>
				<p class="flex justify-center">
					<span class="ft12" v-text="userInfo.hospital"></span>
					<span class="ft12" v-text="userInfo.department"></span>
				</p>
			</div>
			</div>

		</div>
		<div class="">
			<cellx is-link>
				<div class="cells flex align-items-center" slot="left">
					<img src="../../assets/images/icon_wdzbj.png">
					<p>全部直播间</p>
				</div>
			</cellx>
			<cellx is-link>
				<div class="cells flex align-items-center" slot="left">
					<img src="../../assets/images/wgldzbj.png">
					<p>我关注的直播间</p>
				</div>
			</cellx>
			<cellx is-link>
				<div class="cells flex align-items-center" slot="left">
					<img src="../../assets/images/wgzdzbj.png">
					<p>我浏览过的话题</p>
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
		width: 100%;
		position: absolute;
		margin-top: 10%;
		img{
			width: 20%;
			margin: 0 auto;
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
	.me-info{
		color: #fff;
		span{
			margin: 5px 10px;
		}
	}
</style>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { api } from '../../utils/api.js'
import cellx from '../common/cell-x'
	export default {
		components:{
			cellx
		},
		created () {
			// this.getUserInfo()
			// .then(res=>{
			// 	if (res.result != 0) {
			// 		this.toast(res.msg)
			// 	}else{
			// 		this.userInfo = res.rsps[0].body.user
			// 		this.hideLoad()
			// 	}
			// })
			// 
			this.GETUSERINFO()
			.then((msg)=>{
				if (msg) {this.toast(msg)}
				this.hideLoad()
			})
			.catch(e=>{
				console.log(e)
			})
		},
		data () {
			return {
			}
		},
		computed: {
			...mapGetters(['uid','userInfo'])
		},
		methods : {
			...mapMutations([
				'showLoad','hideLoad'
			]),
			...mapActions(['GETUSERINFO'])
			// getUserInfo () {
			// 	return api(this.uid,{ srv: "user_user",cmd: "get_user_info"},{})
			// 	.then(res => {
			// 		return res.data
			// 	})
			// }
		}
	}
</script>