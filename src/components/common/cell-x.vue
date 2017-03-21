<template>
	<div class="cell flex align-items-center justify-space-between">
		<div>
			<slot name="left"></slot>
		</div>
		<div>
			<slot name="right"></slot>
		</div>
		<i v-if="isLink === ''" class="arrow-right"></i>
	</div>
</template>
<style lang="less">
	.cell{
		border-bottom: 1px solid #f2f2f2;
		background-color: #fff;
		padding:10px;
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
</style>
<script>
	export default {
		props:['isLink']
	}
</script>