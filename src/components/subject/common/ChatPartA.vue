<template>
	<div class="chat-a chat-part-a" id="load-wrap">
		<loadmore
		class="chat-a-loadmore"
		id="chat-a-content" 
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
		</loadmore>
	</div>
</template>
<script>
import {Header,Spinner,Loadmore } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { throttle } from '../../../utils/func'
// import bus from '../../common/eventBus'
import AChatItem from './AChatItem'

	export default{
		components:{xHeader:Header,Loadmore,Spinner,AChatItem},
		mounted () {
			let $chatWrapper = $('#load-wrap')
			let $chatLoader = $('#chat-a-content')
			let _this = this
			$chatWrapper.on('scroll',throttle(function(){
				_this.isBottom = false
				// console.log($chatWrapper.scrollTop())
				// console.log($chatWrapper.height())
				var flag = $chatLoader.height() - $chatWrapper.height() - $chatWrapper.scrollTop()
				if (flag == 0) {
					console.log(flag + ' flag')
					_this.isBottom = true
				}else{
					_this.setScroll({a:$chatWrapper.scrollTop()})
					_this.isBottom = false
				}
				// console.log(_this.isBottom)
			},100,500))
		},
		beforeDestroy () {
			// bus
		},
		activated () {
			let a = this.scroll.a
			let $chatWrapper = $('#load-wrap')
			if (a != 'init' && !this.isBottom) {
				$chatWrapper.scrollTop(a)
			}
			if (this.isBottom) {
				$chatWrapper.scrollTop(100000)
			}
		},
		data () {
			return {
				is_top_end:false,
				is_bottom_end:false,
				limit:10,
				direction:false,  //方向标识，true，拉取新消息，false，拉取历史消息
				topStatus:'',
				bottomStatus:'',
				isBottom:true
			}
		},
		props:{
			subjectInfo:{
				type:Object,
				default:{}
			}
		},
		computed: {
			...mapGetters(['advanceMsg','scroll']),
			msgLength () {
				return this.advanceMsg.msgList.length
			}
		},
		methods:{
			...mapMutations(['setScroll']),
			...mapActions(['getAdvMsg']),
			getHistory () {
				this.isBottom = false
				this.getAdvMsg({limit:this.limit,direction:false})
				.then(res=>{
					this.$refs.loadmore.onTopLoaded()
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
		},
		watch:{
			msgLength (nv,ov) {
				this.$nextTick(()=>{
					let box = $('#load-wrap')
					if (this.scroll.a == 'init') {
						setTimeout(()=>{
							box.scrollTop(100000)
						},100)
					}
					if (this.isBottom) {
						box.scrollTop(100000)
					}
				})
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
	  transition: all .8s;
	}
	.list-enter, .list-leave-active {
	  opacity: 0;
	  transform: translateY(30px);
	}
</style>