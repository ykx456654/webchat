<template>
	<div data-flex="box:first" class="studio-item flex">
		<div class="topic-item-img flex align-items-center justify-center">
			<p class="status">{{subject.liveStatus | status}}</p>
      <img :src="subject.subjectImg" alt="" v-if="subject.subjectImg != ''">
			<img src="../../../assets/images/banner_zbj_small.png" v-else>
			<i class="icon icon-fee" v-if="subject.fee > 0"></i>
		</div>
		<div class="studio-item-info flex justify-space-between flex-wrap flex-direction-column">
			<div class="topic-item-title flex justify-space-between">
				<p class="text-overflow">{{subject.subjectTitle}}</p>
			</div>
			<div class="topic-start-time flex align-items-center">
				<span>{{new Date(subject.startTime*1000).Format("yyyy-MM-dd hh:mm")}}</span>
			</div>
			<div class="flex topic-item-num align-items-center">
				<i class="icon icon-people"></i>
				<span v-text="subject.uvNum"></span>
			</div>
			<div class="studio-owner" v-if="subject.studioTitle">
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
					case 2:return '正在直播';break;
					case 9:return '回顾';break;
					default:return '预告';
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
	    .studio-item-info{
			flex:1 1 100%;
			>div{
				width: 100%;
			}
	    }
	}
	.topic-item-img{
	    width: 1.25rem;
	    height: .7rem;
		flex: 1 0 1.25rem;
	    overflow: hidden;
	    margin-right: .1rem;
	    border-radius: 3px;
	    box-sizing: border-box;
	    position: relative;
	    img{
	    	width: 1.25rem;
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
		    left: 1px;
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
</style>
