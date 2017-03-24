<template>
	<div class="normal-list">
		<div v-for="i in list" @click="sel(i)">
			<cellx>
				<span slot="left">
					{{i}}
				</span>
			</cellx>
		</div>
	</div>
</template>
<script>
import cellx from '../../common/cell-x'
	export default {
		components:{
			cellx
		},
		props:{
			list:{
				type:Array,
				default: []
			},
			prop:{
				type:String,
				default:''
			}
		},
		methods:{
			sel (val) {
				this.$emit('setP',this.prop,val)
			}
		}
	}
</script>
<style lang="less">
	.normal-list{
		max-height: 95%; 
		max-height: calc(~'100vh - 40px');
		overflow: scroll;
	}
</style>