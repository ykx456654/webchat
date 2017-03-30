<template>
	<div class="seat">
		<img src="../../assets/images/seat_topic1.png">
		<p>{{msg}}</p>
	</div>
</template>
<script>
	export default {
		props:{
			msg:{
				type:String,
				default:""
			}
		}
	}
</script>
<style lang="less" scoped>
	.seat-img{
	
	}
</style>