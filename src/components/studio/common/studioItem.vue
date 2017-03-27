<template>
	<div class="studio-item">
		<div class="topic-item-img flex align-items-center justify-center">
			<p class="status"></p>
		</div>
		<div class="flex justify-space-between">
			<div class="topic-item-title flex justify-space-between">
				<p class="text-overflow"></p>
			</div>
			<div class="topic-start-time flex align-items-center">
				开始时间：<span></span>
			</div>
			<div class="flex align-items-center">
				<i class="icon icon-people"></i>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {

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
</style>