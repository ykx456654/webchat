<template>
	<div data-flex="main:justify box:justify"  class="studio-item flex align-items-center">
		<div>
			<img :src="studio.studioImg" v-if="studio.studioImg != ''">
			<img src="../../../assets/images/icon_zbj_mr.png" v-else>
		</div>
		<div data-flex="dir:top" class="studio-item-info">
			<p class="text-left text-overflow" v-text="studio.studioTitle"></p>
			<p class="text-left text-overflow" v-text="studio.subjectTitle"></p>
		</div>
		<div class="flex">
			<p>{{studio.startTime | time}}</p>
			<p></p>
		</div>
	</div>
</template>
<script>
	export default {
		props:{
			studio:{
				type:Object,
				default:{}
			}
		},
		data () {
			return {

			}
		},
		filters: {
			time (t) {
				var today_end = new Date().Format('yyyy/MM/dd') + ' 23:59:59'
				var today_start = new Date().Format('yyyy/MM/dd') + ' 00:00:00'
				var t_today_end = +new Date(today_end)/1000
				var t_today_start = +new Date(today_start)/1000
				if (t < t_today_start || t > t_today_end) {
					// console,log(t_today)
					var t_date= new Date(t*1000).Format('yyyy-MM-dd hh:ss');
					var p_date = t_date.slice(5,16)
					return p_date;
				}else{
					return '今天  ' + new Date(t).Format('hh:ss')
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.studio-item{
		padding: 12px;
	    // box-sizing: border-box;
	    border-bottom: 1px solid #f7f7f7;
		height: 50px;
		>div:nth-child(1){
			height: 100%;
			img{
				width: 50px;
				border-radius: 25px;
			}
		}
		>div:nth-child(2){
			height: 100%;
			flex: 1 0 1rem;
			text-align: left;
			margin-left: 12px;
			>:first-child{
				font-size: 15px;
				color: #000;
				margin-bottom: 5px;
			}
			>:last-child{
				margin-top: 5px;
				font-size: 13px;
				color: 13px;
				color: #666;
			}
		}
		>div:nth-child(3){
			height: 100%;
			>:first-child{
				color: #666;
				font-size: 12px;
			}
		}
		.studio-item-info{
			width: 60%;
		}
	}

</style>
