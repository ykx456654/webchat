<template>
	<div class="set-status">
		<ul class="clearfix">
			<li>
				<label for="radio1" v-on:click="updateValue(1)">
					<span class="selected" v-show="status == 1"></span>
					<div class="spirite-icon icon-yisheng"></div>
					<div>医生</div>
				</label>
			</li>
			<li>
				<label for="radio2"  v-on:click="updateValue(4)">
					<span class="selected" v-show="status == 4"></span>
					<div class="spirite-icon icon-hushi"></div>
					<div>护士</div>
				</label>
			</li>
			<li>
				<label for="radio3" v-on:click="updateValue(3)">
					<span class="selected" v-show="status == 3"></span>
					<div class="spirite-icon icon-yaoshi"></div>
					<div>药师</div>
				</label>
			</li>
			<li>
				<label for="radio4" v-on:click="updateValue(2)">
					<span class="selected" v-show="status == 2"></span>
					<div class="spirite-icon icon-guanli"></div>
					<div>医院管理者</div>	
				</label>
			</li>
			<li>
				<label for="radio5" v-on:click="updateValue(5)">
					<span class="selected" v-show="status == 5"></span>
					<div class="spirite-icon icon-yixuesheng"></div>
					<div>医学生</div>
				</label>
			</li>
			<li>
				<label for="radio6" v-on:click="updateValue(9)">
					<span class="selected" v-show="status == 9"></span>
					<div class="spirite-icon icon-qita"></div>
					<div>其他</div>
				</label>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		created() {
			
		},
		props:{
			status
		},
		data () {
			return {
		
			}
		},
		methods:{
			updateValue (value) {
				this.$emit('hideStatu',Number(value))
			}
		}
	}
</script>
<style lang="less" scoped>
	.set-status{
		background-color: #fff;
		height: calc(~'100vh - 40px');
		ul{
			padding-top: 20px;
			width: 100%;
			li{
				width: 50%;
				padding: 10px 0;
				float: left;
				position: relative;
				label{
					// display: inline-block;
					input{
						display: none;
					}
				}
				span{
					position: absolute;
				    right: 10px;
				    width: 22px;
				    height: 20px;
				    background-size: 300px;
				    background-image: url(../../../assets/images/sprites/css_sprite.png);
				    background-repeat: no-repeat;
				    background-position: -41px -406px;
				}
			}
			.spirite-icon{
				width: 77px;
				height: 77px;
				margin: 0 auto;
				background: url(../../../assets/images/sprites/css_sprite.png) no-repeat 100px;
				background-size: 300px;
			}
			.icon-yisheng{
				background-position: -75px -405px;
			}
			.icon-hushi{
				background-position: -75px -325px;
			}
			.icon-yaoshi{
				background-position: -75px -242px;
			}
			.icon-guanli{
				background-position: -75px -161px;
			}
			.icon-yixuesheng{
				background-position: -75px -79px;
			}
			.icon-qita{
				background-position: -75px 2px;
			}
		}
	}
</style>
