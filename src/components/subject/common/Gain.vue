<template>
<transition name="gain">
    <div class="gain-box" data-flex="main:center cross:center" @click.self="endInvoke">
        <div class="gain-container">
            <i class="icon icon-close" @click="endInvoke"  :class="{'icon-pray-close':moneyType == 1}"></i>
            <div class="money-list" v-if="moneyType == 0">
                <div class="money-list-bg">
                </div>
                <img class="head-img" :src="info.headImg" v-if="info.headImg">
                <img class="head-img" src="../../../assets/images/default_head.png" alt="" v-else>
                <p class="name" v-text="info.name"></p>
                <p class="tip-gain-gain">如果内容对您有用，欢迎打赏支持一下~</p>
                <ul class="options flex flex justify-center">
                    <li @click="setPrice(m)" v-for="m in moneyList">{{m + '元'}}</li>
                </ul>
                <a class="switch" @click="other">其他金额</a>
            </div>
            <div class="other-money" v-if="moneyType == 1">
                <h5>其他金额</h5>
                <div class="flex price-input align-items-center">
                    <span>金额（元）</span>
                    <input type="number" name="" v-model="price" placeholder="可填写1-200">
                </div>
                <button class="gain-btn btn" @click="setPrice(price)">打赏</button>
            </div>
        </div>
    </div>
</transition>

</template>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import bus from '../../common/eventBus.js'
import {api} from '../../../utils/api'
    export default {
        components:{
            
        },
        props:{
            info:{
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },
        data () {
            return {
                moneyType:0,
                moneyList:[2,5,10,50,100,200],
                price:''
            }
        },
        computed:{
            ...mapGetters(['uid','id'])
        },
        methods:{
            other () {
                this.moneyType = 1
            },
            endInvoke () {
                bus.$emit('endInvoke')
            },
            setPrice (m) {
                const data = {
                    studioId:this.id.studioId,
                    subjectId:this.id.subjectId,
                    grantUid:this.info.uid,
                    grantMoney:m*100,
                    appid:window.appId
                }
                if(data.grantMoney > 20000){
                    this.toast('最多只能打赏200元')
                    return false
                }
                if(data.grantMoney < 200){
                    this.toast('至少打赏2元')
                    return false
                }
                api(this.uid,{cmd:'wechat_grant_prepay_generate',srv:'studio_studio'},data)
                .then(res=>{
                    res = res.data
                    if(res.result!=0){
                        this.toast(res.msg)
                        return false
                    }else{
                        let info = res.rsps[0].body
						var _this = this
                        if (typeof WeixinJSBridge == "undefined"){
							if( document.addEventListener ){
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady(info,_this), false);
							}else if (document.attachEvent){
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady(info,_this)); 
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(info,_this));
							}
						}else{
							// alert(1)
							onBridgeReady(info,_this);
						}
                    }
                })
            },
            clear () {
                this.moneyType = 0
                this.price = ''
            },
            continuePlay () {
                bus.$emit('continue_play')
            }
        },
        mounted () {
            // this.toast({
            //     message:'dfafdas',
            //     duration:50000
            // })
        }
    }


function onBridgeReady(info,instance){
	// alert(JSON.stringify(info))
    WeixinJSBridge.invoke(
       'getBrandWCPayRequest',info,
       function(res){
       	    // alert(JSON.stringify(res))
		    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
		    if (res.err_msg == "get_brand_wcpay_request:ok") {
				instance.isPaying = true
				instance.toast({
					message:'打赏成功',
					iconClass:'icon icon-pay-success'
				})
			}else{
                if(res.err_msg == "get_brand_wcpay_request:cancel"){
                    instance.toast({
                        message:'打赏取消',
                        iconClass:'icon icon-pay-fail'
                    })
                }else{
                    instance.toast({
                        message:'打赏失败',
                        iconClass:'icon icon-pay-fail'
                    })
                }
			}
            instance.endInvoke()
            instance.continuePlay()
       }
   );
}
</script>
<style lang="less" scoped>
.gain-box{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background-color: rgba(0,0,0,0.5);
}
// .gain-mask{
//     left: 0;
//     top: 0;
//     width: 100%;
//     height: 100%;
//     width: 100vw;
//     height: 100vh;
//     position: absolute;
//     z-index: 501;
//     background-color: rgba(0,0,0,0.5);
// }

    .gain-container{
        width: 300px;
        position: relative;
        // left: 50%;
        // top: 50%;
        // margin-left: -150px;
        // margin-top: -50%;
        background-color: #fff;
        border-radius: 10px;
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
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
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
        .tip-gain{
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
        width: 2.5rem;
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
    .gain-enter-active {
    transition: all .5s ease;
    }
    .gain-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .gain-enter, .gain-leave-active {
    transform: scale(1.1);
    opacity: 0;
    }
</style>