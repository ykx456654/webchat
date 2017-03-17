<template>
	<div class="search">
		<header class="search-head flex justify-space-between">
			<iframe id="sub_frame" name="sub_frame" width="0" height="0" style="display:none;"></iframe>
			<div class="head-input flex align-items-center">
				<img src="../../assets/images/search.png" alt="">
				<form target="sub_frame">
					<input type="search" @change="delaySearch"  placeholder="搜索视频" v-model="searchWord" v-on:search="search">
                </form>
			</div>
			<button type="button" name="button" @click="search">搜索</button>
		</header>
        <div class="search-part hot">
            <h5>热门搜索</h5>
            <ul class="hot-list">
                <li v-for="h in hotSearch">{{h}}</li>
            </ul>
        </div>
        <div class="search-part history">
            <h5>历史搜索</h5>
            <ul class="history-list">
                <li v-for="h in historySearch">
                    <i class="icon icon-time"></i>
                    {{h}}
                    <i class="icon icon-del">×</i>
                </li>
            </ul>
        </div>
        <ul class="root">
            
        </ul>
	</div>
</template>
<style lang="less">
.search{
    background-color: #f2f2f2;
    min-height:95vh;
    min-height:95%;
}
.search-head {
    padding: 5px 10px;
    background: #d93639;
    height: 30px;
    .head-input {
        flex-shrink: 0;
    }
    .head-input {
        background: #fff;
        border-radius: 5px;
        flex-grow: 99;
        margin-right: 10px;
        img {
            width: 15px;
            height: 15px;
            margin-left: 10px;
        }
        form {
            flex-grow: 99;
            flex-shrink: 0;
        }
        input {
            width: 100%;
            border: 0;
            box-sizing: border-box;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            padding: 0 5px;
        }
    }
    button {
        background: #c22529;
        color: #fff;
        border: 1px solid #b12125;
        border-radius: 5px;
        width: 50px;
        box-sizing: border-box;
        font-size: 12px;
        padding: 0;
    }
}
.search-part{
    padding-left: 15px;
    h5{
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        color: #666;
        margin: 17px 0 15px;
    }
    .hot-list{
        text-align: left;
        li{
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            padding: 0 12px;
            margin: 5px;
            color: #333;
            text-align: center;
            font-size: 15px;
            border: 1px solid #d3d3d3;
            width: auto;
            display: inline-block;
        }
    }
    .history-list{
        padding-left: 15px;
        li{
            height: 45px;
            text-align: left;
            line-height: 45px;
            font-size: 15px;
            border-bottom: 1px solid #e2e2e2;
            position: relative;
            padding-left: 24px;
            .icon{
                position: absolute;
                width: 24px;
                height: 24px;
                background-size: 90%;
                background-repeat: no-repeat;
                background-position: center;
            }
            .icon-time{
                background-image: url(../../assets/images/time.png);
                top: 10px;
                left: -5px;
            }
            .icon-del{
                font-style:normal;
                font-size: 22px;
                right: 15px;
                color: #666;
                top: -3px;
            }
        }
    }
}
</style>
<script>
import { mapMutations } from 'vuex'
import { throttle } from '../../utils/func'
import { Loadmore } from 'mint-ui'
export default {
    created () {
        this.hideLoad()
    },
    components:{
        Loadmore
    },
	data () {
		return {
			searchWord:'',
			searchRes: 0, // 0搜索前，1有结果，2没结果
            hotSearch:['内科','内分泌','儿童咳嗽','欢乐好声音','神经外科','心电图','甲状腺','儿童咳嗽','欢乐好声音'],
            historySearch:['欢乐好声音','神经外科','心电图']
		}
	},
	methods: {
        ...mapMutations([
            'hideLoad','showLod'
        ]),
		search () {
            console.log(1)
		},
        delaySearch () {
            // console.log(1)
            throttle(800,this.search())
        }
	}
}
</script>