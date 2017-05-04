<template>
	<div class="cell flex align-items-center justify-space-between"  @click="cellClick">
		<div class="cell-box flex justify-space-between">
			<div>
				<slot name="left"></slot>
			</div>
			<div class="flex align-items-center">
				<slot name="right"></slot>
			</div>
		</div>
		<i v-if="isLink === ''" class="arrow-right"></i>
	</div>
</template>
<style lang="less">
	.cell{
		border-bottom: 1px solid #f2f2f2;
		background-color: #fff;
		padding:8px;
		min-height: 30px;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		color: inherit;
	}
	.arrow-right{
		background-image: url(../../assets/images/arrow-right-2.png);
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		width: 20px;
		line-height: 20px;
		color: #999;
		height: 20px;
		display: block;
	}
	.cell-box{
		width: 100%;
		margin-right: 10px;
		font-size: 14px;
	}
</style>
<script>
	export default {
		props:['isLink'],
		methods:{
			cellClick () {
				this.$emit('onclick')
			}
		}
	}
</script>
