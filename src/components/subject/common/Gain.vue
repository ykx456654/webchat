<template>
    <div class="gain-container">
        <i class="icon icon-close" @click="endInvoke"  :class="{'icon-pray-close':moneyType == 1}"></i>
        <div class="money-list" v-if="moneyType == 0">
            <div class="money-list-bg">
            </div>
            <img class="head-img" src="http://img.yishengzhan.cn/user/head/96d4d23cddb44be7891d797ecf897c7b.jpg">
            <p class="name"> assadasd</p>
            <p class="tip">如果内容对您有用，欢迎打赏支持一下~</p>
            <ul class="options flex flex justify-center">
                <li @click="setPrice(m)" v-for="m in moneyList">{{m + '元'}}</li>
            </ul>
            <a class="switch" @click="other">其他金额</a>
        </div>
        <div class="other-money" v-if="moneyType == 1">
            <h5>其他金额</h5>
            <div class="flex price-input align-items-center">
                 <span>金额（元）</span>
                 <input type="number" name="" v-model="price" placeholder="可填写2-200">
            </div>
            <button class="gain-btn btn">打赏</button>
        </div>
    </div>
</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import bus from '../../common/eventBus.js'
    export default {
        data () {
            return {
                moneyType:0,
                moneyList:[2,5,10,50,100,200],
                price:''
            }
        },
        methods:{
            other () {
                this.moneyType = 1
            },
            endInvoke () {
                bus.$emit('endInvoke')
            },
            setPrice (m) {
                this.price = m
                alert(m)
                // bus.$emit('endInvoke')
            },
            clear () {
                this.moneyType = 0
                this.price = ''
            }
        },
        mounted () {
            
        }
    }
</script>
<style lang="less" scoped>
    .gain-container{
        width: 300px;
        // position: relative;
        border-radius: 10px;
        background-color: #fff;
        box-sizing: border-box;
        .icon-close{
            top: 10px;
            right: 10px;
            z-index: 10;
            width: .13rem;
            height: .13rem;
            position: absolute;
            background-size: 100%;
            background-position: center;
        }
        .money-list{
            padding-top: 110px;
            padding-bottom: 10px;
            width: 300px;
            overflow: hidden;
        }
        .money-list-bg{
            position: absolute;
            left: 50%;
            top: 0;
            margin-left: -150px;
            width: 300px;
            height: 80px;
            border-bottom-right-radius: 150px 50px;
            border-bottom-left-radius: 150px 50px;
            // border-radius: 50%;
            background-image: url(../../../assets/icons/pic_ds_qb.png);
            background-size: contain;
        }
        .head-img{
            width: 60px;
            height: 60px;
            border-radius: 30px;
            position: absolute;
            top: 80px;
            left: 50%;
            margin-top: -30px;
            margin-left: -30px;
        }
        .name{
            font-size: 16px;
        }
        .tip{
            margin-top: .15rem;
            text-align: center;
            font-size: 14px;
            color: #999;
            padding: 0 5px;
            box-sizing: border-box;
        }
        .options{
            // padding: 15px;
            font-size: 0;
            box-sizing: border-box;
            flex-wrap: wrap;
            width: 300px;
            li{
                color: #d93639;
                border: 1px solid #d93639;
                border-radius: 3px;
                line-height: 40px;
                width: 80px;
                height: 40px;
                font-size: 16px;
                margin: 5px;
                box-sizing: border-box;
            }
        }
        .switch{
            text-align: center;
            -webkit-box-flex: 99;
            -ms-flex-positive: 99;
            flex-grow: 99;
            padding-bottom: .1rem;
            font-size: 14px;
            color: #5998d7;
            margin-top: .1rem;
        }
    }
    .other-money{
        width: 100%;
        background: #f2f2f2;
        padding-bottom: .2rem;
        position: relative;
        h5{
            padding-top: .2rem;
            text-align: center;
            font-size: 17px;
            margin: 0;
            font-weight: 400;
        }
    }
    .gain-btn{
        width: 2.7rem;
        height: .4rem;
        background: #d93639;
        color: #fff;
        line-height: .4rem;
        margin: .2rem auto 0;
        font-size: 17px;
        border-radius: 5px;
        text-align: center;
    }
    .price-input{
        background-color: #fff;
        width: 260px;
        border: 1px solid #c8c8c8;
        border-radius: 3px;
        margin: .1rem auto 0;
        height: .4rem;
        font-size: 15px;
        padding: 0 .1rem;
        span{
            width: 120px;
            display: inline-block;
        }
        input{
            border: none;
            outline:none;
        }
    }
</style>