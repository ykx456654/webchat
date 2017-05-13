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
<style lang="less" scoped>
.tab{width: 100%;}
.footer{
	position: fixed;z-index: 999;height: 55px;box-sizing:border-box;width: 100%;
	background-color: #f2f2f2;box-shadow: 0 0 10px 0 rgba(150,140,140,0.6);bottom:0;padding: 10px 0 5px 0;transition: all .5s;
	left: 50%;
	margin-left: -50%;
	}
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
			// if (this.active === n) return false
			switch (n){
				case 1 :
					if (this.active !== n) {
						this.showLoad()	
					}
					this.$router.push({path:'/CourseLive',force: true});
					this.tabChange(1);
					break;
				case 2 :
					if (this.active !== n) {
						this.showLoad()	
					}
					this.$router.push({path:'/Recommond'});
					break;
				case 3 :
					if (this.active !== n) {
						this.showLoad()	
					}
					this.$router.push({path:'/me'});		
					break;
			}
			this.active = n
		},
		...mapMutations([
   			'showLoad','hideLoad','tabChange'
      	])
	},
	beforeRouteUpdate  (to, from , next) {
		// console.log('sadasdas')
	},
	mounted () {

  	},
	watch:{
		$route (nv ,ov) {
			let position = nv.path
			switch(position){
				case '/Recommond':
				// console.log(position)
				this.active = 2;
				break;
				case '/CourseLive':
				// console.log(position)
				this.active = 1;
				break;
				case '/me':
				// console.log(position)
				this.active = 3;
				break;
			} 
		}
	}
}
</script>