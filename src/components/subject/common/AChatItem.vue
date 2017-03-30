<template>
	<div class="flex chat-a-item">
		<div class="chat-speaker">
			<img src="http://img.yishengzhan.cn/user/head/e16deb512ab8456d9eb577dc96b22ab0.jpg">
			<i class="icon icon-dashang"></i>
		</div>
		<div class="chat-content">
			<div class="chat-speaker-name">
				<span>jackmao</span>
				<!-- <span></span> -->
			</div>
			<div class="chat-speaker-conten">
				<div class="word-content flex align-items-center">
					<div class="triangle"></div>
					<div class="triangle-border"></div>
					<div class="word-msg"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{

	}
</script>
<style lang="less" scoped>
	.chat-a-item {
		margin: 5px 0;
	}
	.chat-speaker{
		img{
			width: .36rem;
			display: block;
			margin: 0 auto;
			height: .36rem;
			border-radius: .18rem;
			margin-top: .1rem;
			overflow: hidden;
		}
		.icon-dashang{
			margin: 5px auto 0;
			background-image: url(../../../assets/icons/icon_ds.png)
		}
	}
	.chat-content{
		margin-left: 0.15rem;
	    display: inline-block;
	    min-width: .5rem;
	    position: relative;
	}
	.chat-speaker-name{
		// margin-top: 0.05rem;
		color: #4a4a4a;
		font-size: 0.15rem;
	}
	.word-content{
		font-size: .15rem;
	    color: #4a4a4a;
	    border: 1px solid #d8d8d8;
	    line-height: .2rem;
	    min-height: .2rem;
	    background-color: #fff;
	    padding: 0 .05rem;
	    max-width: 2.4rem;
	    border-radius: 5px;
	    padding: .05rem .1rem;
	    word-break: break-all;
	    position: relative;
	    margin-top: 5px;
	}
	.triangle{
		width: 0;
	    height: 0;
	    border-top: 6px solid transparent;
	    border-right: 7px solid #fff;
	    border-bottom: 6px solid transparent;
	    position: absolute;
	    z-index: 5;
	    left: -7px;
	    top: 9px;
	}
	.triangle-border{
		width: 0;
	    height: 0;
	    border-top: 7px solid transparent;
	    border-right: 8px solid #d8d8d8;
	    border-bottom: 7px solid transparent;
	    position: absolute;
	    z-index: 4;
	    left: -8px;
	    top: 8px;
	}
	.word-msg{
		text-align: left;
	}
</style>