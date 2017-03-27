<template>
	<div class="studio-item flex">
		<div class="topic-item-img flex align-items-center justify-center">
			<p class="status">{{subject.liveStatus | status}}</p>
			<img src="../../../assets/images/banner_zbj_small.png">
		</div>
		<div class="flex justify-space-between flex-direction-column">
			<div class="topic-item-title flex justify-space-between">
				<p class="text-overflow">{{subject.subjectTitle}}</p>
			</div>
			<div class="topic-start-time flex align-items-center">
				开始时间：<span>{{new Date(subject.startTime).Format("yyyy-MM-dd hh:mm")}}</span>
			</div>
			<div class="flex topic-item-num align-items-center">
				<i class="icon icon-people"></i>
				<span v-text="subject.uvNum"></span>
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
					case 0:return '未开始';break;
					case 1:return '直播中';break;
					case 2:return '回答中';break;
					case 9:return '回顾';break;
					default:return '未开始';
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
			flex:2 1 auto;
	    }
	}
	.topic-item-img{
		-webkit-box-flex: 0;
	    -ms-flex: 0 0 1.25rem;
	    flex: 0 0 1.25rem;
	    -ms-flex-positive: 0;
	    flex-grow: 0;
	    -ms-flex-negative: 0;
	    flex-shrink: 0;
	    -ms-flex-preferred-size: 1.25rem;
	    flex-basis: 1.25rem;
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
	}
</style>