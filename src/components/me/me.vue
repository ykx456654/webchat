<template>
	<div class="me-wrap">
		<div class="me">
			<img class="me-bg" src="../../assets/images/wo_bg.jpg">
			<div class="me-header">
				<router-link to="/Setting">
					<img :src="userInfo.headUrl" v-if="userInfo.headUrl != ''">
					<img src="../../assets/images/default_head.png" alt="" v-else>
				</router-link>
				<div class="me-info">
				<p class="flex justify-center">
					<span class="ft14" v-text="userInfo.nickName"></span>
					<span class="ft14" v-text="userInfo.title"></span>
				</p>
				<p class="flex justify-center">
					<span class="ft12" v-text="userInfo.hospital"></span>
					<span class="ft12" v-text="userInfo.department"></span>
				</p>
			</div>
			</div>
		</div>
		<div class="">
      <cellx is-link @onclick="link(1)">
        <div class="cells flex align-items-center" slot="left" >
          <i class="focus"></i>
          <p>关注的直播间</p>
        </div>
      </cellx>
      <cellx is-link @onclick="link(2)">
        <div class="cells flex align-items-center" slot="left" >
          <!--<img src="../../assets/images/icon_wo_kgdht.png">-->
          <i class="watch"></i>
          <p>看过的话题</p>
        </div>
      </cellx>
			<cellx is-link @onclick="link(0)">
				<div class="cells flex align-items-center" slot="left" >
					<!--<img src="../../assets/images/icon_wo_zbj.png">-->
          <i class="all"></i>
					<p>全部直播间</p>
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
    margin-left:15px;
		img{
			width: 28px;
			height: 28px;
		}
		p{
			font-size: 16px;
			margin-left: 15px;

		}
	}
	.me-info{
		color: #fff;
    p{
      margin-top: 2px;
      span{
        margin: 5px 1px;
      }
    }

	}
  .focus{
    display:inline-block;
    background: url(../../assets/images/icon_wo_gzdzbj.png) no-repeat;
    width:20px;
    height:20px;
    background-size:90%;
    vertical-align: middle;
  }
  .watch{
    display:inline-block;
    background: url(../../assets/images/icon_wo_kgdht.png) no-repeat;
    width:20px;
    height:20px;
    background-size:100%;
    vertical-align: middle;
    margin-top:5px;
  }
  .all{
    display:inline-block;
    background: url(../../assets/images/icon_wo_zbj.png) no-repeat;
    width:20px;
    height:20px;
    background-size:90%;
    vertical-align: middle;
  }
</style>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { api } from '../../utils/api.js'
import cellx from '../common/cell-x'
	export default {
		name:'Me',
		components:{
			cellx
		},
		created () {
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
		methods: {
			...mapMutations([
				'showLoad','hideLoad'
			]),
			...mapActions(['GETUSERINFO']),
			link (n) {
				n = Number(n)
				// alert(n)
				switch(n){
					case 0:
					this.showLoad()
					this.$router.push({path:'/StudioList'})
					break;
					case 1:
					this.showLoad()
					this.$router.push({path:'/StudioList',query:{type:1}})
					break;
					case 2:
					this.showLoad()
					this.$router.push({path:'/WatchedSubjects'})
					break;
				}
			}
		}
	}
</script>
