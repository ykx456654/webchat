<template>
	<div class="list-wrap" @click="choose">
		<iframe id="sub_frame" name="sub_frame" width="0" height="0" style="display:none;"></iframe>
		<div class="search-hospital flex align-items-center">
			<form target="sub_frame">
				<input type="search" v-on:input="search" v-on:search="search" v-model="searchValue" placeholder="搜索医院">
            </form>
		</div>
		<cellx v-for="(i,index) in list" :key="'id'+index" is-link>
			<span slot="left" 
			v-text="i.name" 
			:data-pvcid="i.pvcid || ''" 
			:data-ctyid="i.ctyid || ''" 
			:data-dstid="i.dstid || ''"
			:data-hspid="i.hspid || ''"
			:data-hsname="i.name" 
			:data-directly="i.directly"
			>
			</span>
		</cellx>
	</div>
</template>
<style lang="less" scoped>
	.list-wrap{
		max-height: 95%; 
		max-height: calc(~'100vh - 40px');
		overflow: scroll;
	}
	.search-hospital{
		 width: 100%;
		 padding: 3px 5px;
		 box-sizing: border-box;
		 form{
		 	width: 100%;
		 }
		 input{
		 	width: 100%;
		 	border: 1px solid #ccc;
		 	background-color: #fff;
		 	border-radius: 5px;
    		padding: 4px;
    		font-size: 14px;
    		text-align: center;
    		margin: 0;
		 }
	}
</style>
<script>
import cellx from '../../common/cell-x'
import {throttle} from '../../../utils/func'
	export default {
		components:{
			cellx
		},
		props:{
			list:{
				type:Array,
				default:[]
			}
		},
		data () {
			return {
				searchValue:''
			}
		},
		methods:{
			choose ($event) {
				var el = $event.target
				var dom = el.querySelector('span') || el
				var pvcid = dom.getAttribute('data-pvcid')
				var ctyid = dom.getAttribute('data-ctyid')
				var dstid = dom.getAttribute('data-dstid')
				var hspid = dom.getAttribute('data-hspid')
				var directly = dom.getAttribute('data-directly')
				// load第一个参数获取类型，第二个参数市区id，第三个参数省id
				if (directly == 0) {
					// 省份获取市
					this.$emit('load',2,pvcid)
				}else if (directly == 1) {
					// 直辖市直接获取区列表
					this.$emit('load',3,0,pvcid)
				}else if (directly == 2) {
					//特区获取区列表
					this.$emit('load',3,0,pvcid)
				}else{
					if (ctyid) {
						// 市获取区列表
						this.$emit('load',3,ctyid,pvcid)
						return false
					}
					if (dstid) {
						// 获取医院
						this.$emit('load',4,dstid)
						return false
					}
					if (hspid) {
						var name = dom.getAttribute('data-hsname')
						this.$emit('selH',hspid,name)
						return false
					}
				}
			},
			search:throttle(function(){
				this.$emit('search',this.searchValue)
			},600,1000)	
		},
		watch: {

		}
	}
</script>