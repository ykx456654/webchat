<template>
	<div class="tab">
		<footer class="footer flex">
			<div class="tab-item flex align-items-center justify-center" @click="link(1)">
				<i class="icon icon-course" :class="{'icon-course-active':active === 1}"></i>
				<span :class="{'red':active === 1}">讲座</span>
			</div>
			<div class="tab-item flex align-items-center justify-center" @click="link(2)">
				<i class="icon icon-studio" :class="{'icon-studio-active':active === 2}"></i>
				<span :class="{'red':active === 2}">直播间</span>
			</div>
			<div class="tab-item flex align-items-center justify-center" @click="link(3)">
				<i class="icon icon-me" :class="{'icon-me-active':active === 3}"></i>
				<span :class="{'red':active === 3}">我</span>
			</div>
		</footer>
	</div>
</template>
<style lang="less">
.footer{position: fixed;z-index: 999;width: 100%;background-color: #f2f2f2;box-shadow: 0 0 10px 0 rgba(150,140,140,0.6);bottom:0;padding: 10px 0 5px 0;transition: all .5s}
.tab-item{width: 33.33%; color: #888888;flex-direction:column;}.icon{width: 24px;height: 20px;background-repeat: no-repeat;background-position: center;background-size: 100%;margin-bottom: 2px;}
.icon-course{background-image: url('../../assets/images/jz-grey.png')}.icon-course-active{background-image: url('../../assets/images/jz-red.png')}
.icon-studio{background-image: url('../../assets/images/zb-grey.png')}.icon-studio-active{background-image: url('../../assets/images/zb-red.png')}
.red{color: #d93639}
.icon-me{background-image: url('../../assets/images/me-grey.png');background-size: 75%;}.icon-me-active{background-image: url('../../assets/images/me-red.png')}
</style>
<script>
import { mapMutations } from 'vuex'
export default {
	data () {
		return {
			active:1
		}
	},
	methods: {
		link (n) {
			n = Number(n)
			this.active = n
			switch (n){
				// case 1 :
			}
		},
		...mapMutations([
   			'showLoad','hideLoad'
      	])
	}
}
</script>