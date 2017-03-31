<template>
	<div class="channel">
		<x-header title="我的临床频道">
			<router-link to="/CourseSave" slot="left">
				<img src="../../assets/images/back2.png">
			</router-link>
		</x-header>
		<div  class="focuses" v-for="a in allChannels">
			<h4 class="title" v-text="a.title"></h4>
			<ul>	
				<li v-for="(f,i) in a.data">
					<label class="focus-item" @click="foucs(f.catid,selected.indexOf(f.catid) > -1)">
						{{f.name}}
						<input style="display: none" type="checkbox" name="focus" :value="f.catid" v-model="selected">
					</label>
					<i class="icon" :class="{'checked':selected.indexOf(f.catid) > -1}"></i>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import { mapMutations } from 'vuex'
import { Header } from 'mint-ui'
import { api } from '../../utils/api.js'
	export default {
		name:'Channel',
		components: {
			xHeader:Header
		},
		data () {
			return {
				allChannels:[],
				focusChannels:[],
				selected:[]
			}
		},
		created () {
			var p1 = api(this.uid,{srv: "user_user",cmd: "get_new_focus_list"},{})
			.then(res=>{
				res = res.data
				return res.rsps[0].body.focuses
			})
			.catch(e=>{console.log(e)})

			var p2 = api(this.uid,{srv: "video_video",cmd: "get_new_category_list"},{})
			.then(res=>{
				res = res.data
				return res.rsps[0].body.cats
			})
			.catch(e=>{console.log(e)})

			Promise.all([p1,p2])
			.then(value=>{
				// console.log(value)
				this.allChannels = value[0]
				this.focusChannels = value[1]
				this.selected = Array.from(this.focusChannels,i=>{
					return i.catid
				})
				this.hideLoad()
			})
			.catch(e=>{console.log(e)})
		},
		computed: {
			uid () {
            	return this.$store.getters.uid
        	}
		},
		methods: {
			...mapMutations([
				'showLoad','hideLoad'
			]),
			foucs (catid,v) {
				// console.log(catid,v)
				api(this.uid,{ srv: "user_user",cmd: "set_focus"},{catid:catid,focused:!v})
				.then(res=>{
					res = res.data
					if (res.result !== 0) {
						this.toast(res.msg)
					}
				})
				.catch(e=>{console.log(e)})
			}
		},
		watch: {

		}
	}
</script>
<style lang="less">
	.channel{
		background-color: #f2f2f2;
		min-height: 95%;
		padding-bottom: 65px;
	}
	.focuses{
		border-top: 1px solid #f7f7f7;
		background-color: #fff;
		width: 100%;
		margin-top: 10px;
		// border-bottom: 1px solid #f7f7f7;
		ul{
			width: 100%;
			border-top: 1px solid #f7f7f7;
			text-align: left;
		}
		li{
			width: 33.33%;
			border-bottom: 1px solid #f7f7f7;
			border-right: 1px solid #f7f7f7;
			padding:13px;
			text-align: left;
			box-sizing: border-box;
			display: inline-block;
			position: relative;
			:nth-child(3n){
				border-right: none;
			}
			label{
				width: 100%;
				display: block;
			}
			.icon{
				display: block;
				position: absolute;
				right: 10px;
				top: 50%;
				margin-top: -10px;
				width: 20px;
				height: 20px;
				background-image: url(../../assets/images/plus1.png);
				background-repeat: no-repeat;
				background-size: 65%;
				&.checked{
					background-image: url(../../assets/images/checked.png);
					background-size: 90%;
				}
			}
		}
	}
	.title{
		height: 45px;
		margin: 0;
		box-sizing: border-box;
		padding: 10px;
		text-align: left;
		font-size: 15px;
	}
	.focus-item{
		font-size: 14px;
		color: #666;
	}
</style>