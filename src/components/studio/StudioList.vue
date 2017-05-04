<template>
	<div>
		<x-header :title="headTitle">
			<router-link to="/me" slot="left">
				<i class="icon icon-arrow-back"></i>
			</router-link>
		</x-header>
		<Loadmore :autoFill="false"  :bottom-method="loadStudios" :bottom-all-loaded="allLoaded" ref="loadmore">
			<ul>
				<li v-for="s in studios" @click="link(s.studioId)">
					<studio-item :studio="s"></studio-item>
				</li>
				<div class="no-more" v-if="allLoaded">
					没有更多了
				</div>
				<seat-img v-if="(studios.length == 0) && isLoadOnce" msg="暂无直播间"></seat-img>
			</ul>
		</Loadmore>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
import {Header,Loadmore } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { api } from '../../utils/api'
import seatImg from '../common/seat-img'
import studioItem from './common/studioItem'
	export default {
		name:'StudioList',
		created () {
			const type = this.$route.query.type
			this.type = Number(type)
			if (this.type == 1) {
				this.request = {cmd:'get_subscribe_studio',srv:'studio_studio'}
			}else{
				this.request = {cmd:'get_recommend_studio',srv:'studio_studio'}
			}
			this.loadStudios()
			.then(()=>{
				window.scroll(0,0)
			})
		},
		components:{
			xHeader:Header,Loadmore,studioItem,seatImg
		},
		data () {
			return {
				isLoadOnce:false,
				type:0,
				allLoaded:false,
				studios:[],
				start:0,
				limit:10,
				request:{}
			}
		},
		methods:{
			...mapMutations(['hideLoad']),
			...mapActions(['GETUSERINFO']),
			loadStudios () {
				return api(this.uid,this.request,{start:this.start,limit:this.limit})
				.then(res=>{
					res = res.data
					if (this.studios.length == 0) {
						this.hideLoad()
					}
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						this.isLoadOnce = true
						this.studios = this.studios.concat(res.rsps[0].body.studios)
						this.start+=this.limit
						this.allLoaded = res.rsps[0].body.is_end
						this.$refs.loadmore.onBottomLoaded();
					}
				})
			},
			link (id) {
				this.$router.push({path:'/Studio',query:{studioId:id}})
			}
		},
		computed: {
			...mapGetters(['uid']),
			headTitle () {
				return this.type == 1 ? '关注的直播间':'全部直播间'
			}
		}
	}
</script>
