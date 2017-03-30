<template>
	<div class="flex department">
		<ul class="parent-department">
			<li :class="{'selected':active == 1}" @click="setPid(1)">
				<i class="icon icon-department icon-nk"></i>
				<span>内科</span>
			</li>
			<li :class="{'selected':active == 2}" @click="setPid(2)">
				<i class="icon icon-department icon-wk"></i>
				<span>外科</span>
			</li>
			<li :class="{'selected':active == 3}" @click="setPid(3)">
				<i class="icon icon-department icon-fnk"></i>
				<span>妇内科</span>
			</li>
			<li :class="{'selected':active == 4}" @click="setPid(4)">
				<i class="icon icon-department icon-ek"></i>
				<span>儿科</span>
			</li>
			<li :class="{'selected':active == 5}" @click="setPid(5)">
				<i class="icon icon-department icon-qt"></i>
				<span>其他</span>
			</li>
		</ul>
		<ul class="child-department">
			<li v-for="d  in list" @click="set(d.name)">{{d.name}}</li>
		</ul>
	</div>
</template>
<script>
import { Header } from  'mint-ui'
import cellx from '../../common/cell-x'
	export default {
		components:{
			cellx
		},
		props:{
			list:{
				type:Array,
				default:[]
			}
		},
		data () {
			return {
				active:0
			}
		},
		methods:{
			setPid (n) {
				this.active = n
				this.$emit('load',n)
			},
			set (name) {
				this.$emit('setD','department',name)
			}
		}
	}
</script>
<style lang="less" scoped>
	.department{
		height: 100%;
	}
	.parent-department{
		width: 90px;
		background: #fff;
		margin-right: 5px;
		li{
			&.selected{
				color: #d93639;
				.icon-department{
					background-position-x:-56px;
				}
				span{
					color: #d93639;
				}
			}
			padding: 15px;
			border-bottom: 1px solid #f7f7f7;
			span{
				font-size: 12px;
			    color: #666;
			    display: block;
			    margin: 10px auto 0;
			}
		}
		.icon-department{
			width: 37px;
		    height: 37px;
		    background: url(../../../assets/images/sprites/css_sprite_department.png) no-repeat -5px 0;
		    background-size: 250px 444px;
		    margin-right: 0;
		    margin: 0 auto;
		}
		.icon-nk{
			background-position-y:0;
		}
		.icon-wk{
			background-position-y:-55px;
		}
		.icon-fck{
			background-position-y:-110px;
		}
		.icon-ek{
			background-position-y:-165px;
		}
		.icon-qt{
			background-position-y:-220px;
		}
	}
	.child-department{
		background-color: #fff;
		width: 73%;
		width: calc(~'100% - 100px');
		height: 100%;
		overflow-y: scroll;
		li{
		    padding: 10px 0 10px 20px;
    		font-size: 14px;
    		text-align: left;
    		color: #333;
    		border-bottom: 1px solid #f7f7f7;
		}
	}
</style>
