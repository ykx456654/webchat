<template>
	<div class="chat-a">
		<loadmore 
		:auto-fill="false"
		:top-method="refresh"
		:bottom-method="load"
		:bottom-all-loaded="is_end" 
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
			<ul class="msg-list">
				<div class="live-start-time">
					直播将于<span>{{new Date(subjectInfo.startTime*1000).Format('yyyy年MM月dd日 hh:ss')}}</span>开始
				</div>
				<li v-for="m in advanceMsgList">
					<span>
						<a-chat-item></a-chat-item>
					</span>
				</li>
			</ul>
			<div class="flex mint-loadmore-bottom  align-items-center justify-center" slot="bottom">
				<span class="arrow" v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">
					<i class="icon icon-drop-up"></i>
				</span>
				<spinner :size="15" v-show="bottomStatus == 'loading'"></spinner>
			</div>
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
				is_end:false,
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
			isStart () {

			}
		},
		methods:{
			refresh () {
				setTimeout(()=>{
					this.advanceMsgList = [1,2,34,5,6]
					this.$refs.loadmore.onTopLoaded();
				},1000)
			},
			load () {
				setTimeout(()=>{
					for(var i = 0;i<5;i++){
						this.advanceMsgList.push(i)
					}
					this.$refs.loadmore.onBottomLoaded();
				},1000)
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
		margin-top: 50px;
		padding: .1rem;
	}
	.live-start-time{
		color: #c1c1c1;
		font-size: 12px;
	}
</style>