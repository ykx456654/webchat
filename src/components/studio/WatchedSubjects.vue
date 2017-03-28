<template>
	<div class="watched-subjects">
		<x-header title="我浏览过的话题">
			<router-link to="/me" slot="left">
				<i class="icon icon-arrow-back"></i>
			</router-link>
		</x-header>
		<Loadmore :autoFill="false"  :bottom-method="loadSubjects" :bottom-all-loaded="allLoaded" ref="loadmore">
			<ul>
				<li>
					<div class="no-more" v-if="allLoaded && subjects.length != 0">
						没有更多了
					</div>
					<div class="seat" v-if="subjects.length == 0">
						<img src="../../assets/images/seat_topic.png">
						<p>暂无浏览过的话题</p>
					</div>
				</li>
			</ul>
		</Loadmore>
	</div>
</template>
<script>
import {Header,Loadmore } from 'mint-ui'
import SubjectItem from './common/SubjectItem'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { api } from '../../utils/api'
	export default {
		components:{
			xHeader:Header,Loadmore,SubjectItem
		},
		created () {
			this.hideLoad()
			this.loadSubjects()
		},
		data () {
			return {
				allLoaded:false,
				subjects:[],
				start:0,
				limit:10
			}
		},
		methods: {
			...mapMutations(['hideLoad']),
			loadSubjects () {
				api(this.uid,{cmd:'get_scan_subject',srv:'studio_studio'},{start:this.start,limit:this.limit})
				.then(res=>{
					res = res.data
					if (this.subjects.length == 0) {
						this.hideLoad()
					}
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						// 
						this.start+=this.limit
						this.$refs.loadmore.onBottomLoaded();
						this.allLoaded = res.rsps[0].body.is_end
					}
				})
			}
		},
		computed: {
			...mapGetters(['uid'])
		}
	}
</script>
<style lang="less">
	
</style>