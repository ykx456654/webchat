<template>
	<div class="loading">
		<div class="loading-wrap flex justify-center align-items-center">
			<Spinner :type="0" :size="50"></Spinner>	
		</div>
	</div>
</template>
<style lang="less">
	.loading{width: 100%;height: 100%;position: fixed;left: 0;top:-5%;}.loading-wrap{width: 100%;height: 100%;}
</style>
<script>
import { Spinner } from 'mint-ui';
export default {
	components:{Spinner}
}
</script>