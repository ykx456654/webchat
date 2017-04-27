<template>
	<div class="studio-item flex" data-flex="box:first">
		<div class="topic-item-img flex align-items-center justify-center">
			<p class="status">{{subject.liveStatus | status}}</p>
			<img src="../../../assets/images/banner_zbj_small.png">
			<i class="icon icon-fee" v-if="subject.fee > 0"></i>
		</div>
		<div data-flex="dir:top" class="flex justify-space-between flex-direction-column">
			<div class="topic-item-title flex justify-space-between">
				<p class="text-overflow">{{subject.subjectTitle}}</p>
			</div>
			<div class="topic-start-time flex align-items-center">
				<span>{{subject.startTime | time}}</span>
			</div>
<!-- 			<div class="flex topic-item-num align-items-center">
				<i class="icon icon-people"></i>
				<span v-text="subject.uvNum"></span>
			</div> -->
			<div class="studio-owner flex" v-if="subject.studioTitle">
				<img :src="subject.studioImg">
				<span v-text="subject.studioTitle"></span>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props:{
			subject:{
				type:Object,
				default:{}
			}
		},
		data () {
			return {

			}
		},
		filters: {
			status (n) {
				n = Number(n)
				switch(n){
					case 0:return '预告';break;
					case 1:return '正在直播';break;
					case 2:return '回答中';break;
					case 9:return '回顾';break;
					default:return '预告';
				}
			},
			time (t) {
				var today_end = new Date().Format('yyyy/MM/dd') + ' 23:59:59'
				var today_start = new Date().Format('yyyy/MM/dd') + ' 00:00:01'
				var t_today_start = +new Date(today_start)/1000
				var t_today_end = +new Date(today_end)/1000
				// console.log(t-t_today_start,t_today_end-t)
				if (t > t_today_start && t < t_today_end) {
					return '今天  ' + new Date(t).Format('hh:ss')
				}else{
					return new Date(t*1000).Format('yyyy-MM-dd hh:ss')
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.studio-item{
		padding: .1rem;
	    box-sizing: border-box;
	    border-bottom: 1px solid #f7f7f7;
	    >div:nth-child(2){
			width: 100%;
			flex:1 1 100%;
	    }
	}
	.topic-item-img{
		flex:0 0 1.25rem;
	    width: 1.25rem;
	    height: .7rem;
	    overflow: hidden;
	    margin-right: .1rem;
	    border-radius: 3px;
	    box-sizing: border-box;
	    position: relative;
	    img{
	    	width: 100%;
	    	display: block;
	    }
	    .icon-fee{
	    	position: absolute;
	    	bottom: 1px;
	    	left: 5px;
	    }
	    .status{
	    	position: absolute;
		    color: #fff;
		    font-size: 12px;
		    background-color: rgba(0,0,0,.6);
		    height: 20px;
		    text-align: center;
		    line-height: 20px;
		    width: 55px;
		    border-radius: 0 10px 10px 0;
		    left: 0;
		    top: 0;
	    }
	}
	.topic-item-title{
		font-size: 14px;
		width: 100%;
		>p{
			max-width: 2.1rem;
		}
	}
	.topic-start-time{
		color: #666;
	}
	.topic-item-num{
		color: #666;
		>.icon{
			width: .11rem;
    		margin-right: 5px;
		}
		>span{
			display: block;
			height: 20px;
			line-height: 24px;
		}
	}
	.studio-owner{
		img{
			width: 20px;
			height: 20px;
			border-radius: 10px;
			margin-right: 10px;
		}
	}
</style>