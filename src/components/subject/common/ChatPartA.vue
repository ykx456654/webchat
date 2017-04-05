<template>
	<div class="chat-a chat-part-a">
		<loadmore
		class="chat-a-loadmore" 
		:autoFill="false"
		:top-method="getHistory"
		ref="loadmore"
		@top-status-change="handTopStatus"
		@bottom-status-change="handBottomStatus"
		>
			<div class="flex mint-loadmore-top  align-items-center justify-center" slot="top">
				<span class="arrow" v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">
					<i class="icon icon-drop-down"></i>
				</span>
				<spinner :size="15" v-show="topStatus == 'loading'"></spinner>
			</div>

			<transition-group class="msg-list" name="list" tag="ul">
				<div class="live-start-time" key="00000000">
					直播将于<span>{{new Date(subjectInfo.startTime*1000).Format('yyyy年MM月dd日 hh:ss')}}</span>开始
				</div>
				<li v-for="(m,index) in advanceMsg.msgList" :key="index"  v-bind:data-index="index">
					<a-chat-item :msg="m"></a-chat-item>
				</li>
			</transition-group>
<!-- 			<div class="flex mint-loadmore-bottom  align-items-center justify-center" slot="bottom">
				<span class="arrow" v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">
					<i class="icon icon-drop-up"></i>
				</span>
				<spinner :size="15" v-show="bottomStatus == 'loading'"></spinner>
			</div> -->
		</loadmore>
	</div>
</template>
<script>
import {Header,Spinner,Loadmore } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import AChatItem from './AChatItem'
	export default{
		components:{xHeader:Header,Loadmore,Spinner,AChatItem},
		data () {
			return {
				is_top_end:false,
				is_bottom_end:false,
				advanceMsgList: [1,2,3,4,5],
				topStatus:'',
				bottomStatus:''
			}
		},
		props:{
			subjectInfo:{
				type:Object,
				default:{}
			}
		},
		computed: {
			...mapGetters(['advanceMsg'])
		},
		methods:{
			...mapActions(['getHistoryAdvMsg','getAdvMsg']),
			getHistory () {
				this.getHistoryAdvMsg()
				.then(res=>{
					this.$refs.loadmore.onTopLoaded()
				})
				.done()
			},
			load () {
				this.getAdvMsg()
				.then(res=>{
					this.$refs.loadmore.onBottomLoaded();
					this.is_bottom_end = res
				})
				.done()
			},
			handTopStatus (status) {
				this.topStatus = status
			},
			handBottomStatus (status) {
				// console.log(status)
				this.bottomStatus = status
			}
		}
	}
</script>
<style lang="less" scoped>
	.arrow{
		transition: all .5s;
	}
	.chat-a-loadmore{
		min-height: 100%;
	}
	.icon-drop-down{
		background-image: url(../../../assets/icons/drop_down.png);
		margin: 0 auto;
		width: 16px;
		height: 20px;
	}
	.icon-drop-up{
		background-image: url(../../../assets/icons/drop_up.png);
		margin: 0 auto;
		width: 16px;
		height: 20px;
	}
	.rotate{
		transform: rotate(180deg);
	}
	.chat-a{
		height: 100%;
	}
	.msg-list{
		margin-top: .5rem;
		padding: .1rem;
	}
	.live-start-time{
		color: #c1c1c1;
		font-size: 13px;
	}
	.live-tips{
		// display: flex;
		// flex: 1 1 auto;
		background-color: rgba(0,0,0,.15);
		border-radius: 3px;
		padding:3px 5px;
		color: #fff;
		margin: 15px 0;
	}
	.msg-list{
		li{
			margin: 5px 0;
		}
	}
	.list-enter-active, .list-leave-active {
	  transition: all 1s;
	}
	.list-enter, .list-leave-active {
	  opacity: 0;
	  transform: translateY(30px);
	}
</style>