<template>
	<div class="watched-subjects">
		<x-header title="我浏览过的话题">
			<router-link to="/me" slot="left">
				<i class="icon icon-arrow-back"></i>
			</router-link>
		</x-header>
		<Loadmore :autoFill="false"  :bottom-method="loadSubjects" :bottom-all-loaded="allLoaded" ref="loadmore">
			<ul>	
				<seat-img v-if="subjects.length == 0 && isLoad" msg="暂无浏览过的话题"></seat-img>
				<li v-for="(m,i) in subjects" @click="linkSubject(m.studioId,m.subjectId)">
					<watched-subject :subject="m"></watched-subject>
					<div class="no-more" v-if="allLoaded && subjects.length != 0">
						没有更多了
					</div>
				</li>
			</ul>
		</Loadmore>
	</div>
</template>
<script>
import {Header,Loadmore } from 'mint-ui'
import watchedSubject from './common/watchedSubject'
import seatImg from '../common/seat-img'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { api } from '../../utils/api'
	export default {
		name:'WatchedSubjects',
		components:{
			xHeader:Header,Loadmore,seatImg,watchedSubject
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
				limit:10,
				isLoad:false
			}
		},
		methods: {
			...mapMutations(['showLoad','hideLoad']),
			loadSubjects () {
				api(this.uid,{cmd:'get_scan_subject',srv:'studio_studio'},{start:this.start,limit:this.limit})
				.then(res=>{
					res = res.data
					this.isLoad = true
					if (this.subjects.length == 0) {
						this.hideLoad()
					}
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						this.subjects = this.subjects.concat(res.rsps[0].body.subjects)
						this.start+=this.limit
						this.$refs.loadmore.onBottomLoaded();
						this.allLoaded = res.rsps[0].body.is_end
					}
				})
			},
			linkSubject (studioId,subjectId) {
				this.showLoad()
				this.$router.push({path:'/Subject',query:{studioId,subjectId}})
			}
		},
		computed: {
			...mapGetters(['uid'])
		}
	}
</script>
<style lang="less">
	
</style>