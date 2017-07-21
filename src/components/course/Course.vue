<template>
	<div class="course">
		<header class="course-head flex justify-center align-items-center">
			<a class="course-search" @click.prevent="toSearch"></a>
			<div class="course-tab flex">
				<a class="course-tab-item" :class="{'active': tab === 1}" @click="link(1)">直播</a>
				<a class="course-tab-item" :class="{'active': tab === 2}" @click="link(2)">视频</a>
			</div>
		</header>
		<transition :name="animation">
			<router-view :key="$route.path" class="course-transition"></router-view>
		</transition>
	</div>
</template>
<style lang="less" scoped>
	.course{padding-top: 47px;}
	.course-head{width: 100%;height: 47px;position: fixed;top: 0;left: 0;background-color: #d93639;z-index: 10}
	.course-search{position: absolute;width: 47px;height: 47px;right: 0;top: 0;background-image: url('../../assets/images/icon_search.png');background-size: 50%;background-repeat: no-repeat;background-position: center;}
	.course-tab{width: 160px;border: 1px solid #fff;border-radius: 3px;}
	.course-tab-item{width: 50%;height: 30px;display: block;color: #fff;font-size: 12px;line-height: 30px;}
	.course-tab-item.active{background-color: #fff;color: #d93639;}
	.slide-left-enter, .slide-right-leave-active {
	  opacity: 0;
	  transform: translate(100%, 0);
	}
	.slide-left-leave-active, .slide-right-enter {
	  opacity: 1;
	  transform: translate(-100%, 0);
	}
	.course-transition{ transition: all .5s ease;position: absolute;width: 100%;}
</style>
<script>
	import { mapMutations,mapGetters } from 'vuex'
	export default {
		name:"Course",
		created () {

		},
		mounted () {
			wx.ready(function () {
            var
            params = {
                title: '医生站-医生学习的加油站',
                desc: '医生站 医生学习的加油站，服务医生改善医疗',
                link: 'http://' + window.location.href.replace(/code=+\w*/g,''),
                imgUrl: 'http://' + window.location.hostname + '/images/shared_icon.jpg'
            }
            wx.onMenuShareAppMessage(params);
            wx.onMenuShareTimeline(params);
        });

		},
		data () {
			return {
				
			}
		},
		methods: {
			...mapMutations([
				'showLoad','hideLoad','tabChange'
			]),
			link (n) {
				n = Number(n)
				// this.showLoad()
				if (n == 2) {
					this.tabChange(2)
					this.$router.push({path:'CourseSave'})
				}else if (n == 1) {
					this.tabChange(1)
					this.$router.push({path:'CourseLive'})
				}
			},
			toSearch () {
				this.hideLoad()
				this.$router.push({path:'Search'})
			}
		},
		computed: {
			tab () {
				return this.$store.state.course.tab
			},
			animation () {
				return this.active == 1 ? 'slide-left':'slide-right'
			}
		}
	}
</script>