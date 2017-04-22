// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import storage from 'storejs'
import { Toast } from 'mint-ui'
import { Lazyload } from 'mint-ui'
import time from './utils/time.js'
import prms from './utils/promise.js' 
import system from './utils/checkSystem.js'
import {checkUser,getUser,getJsTicket,getOpenId,getEncrypt} from './utils/auth.js'
import {responseInterceptor} from './utils/interceptors.js'
import {getUrlParam,getCookie,setCookie} from './utils/func'
import axios from 'axios'


axios.interceptors.response.use(responseInterceptor)
Vue.use(Lazyload);
Vue.config.productionTip = false
Vue.prototype.toast = Toast
time()
prms()
store.state.system = system()
// console.log(storage)
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.hideTab)) {
        // console.log('hidetab')
        store.state.base.tabShow = false
    }else{
        store.state.base.tabShow = true
    }
    const encrypt = storage('encrypt')
    if (!encrypt) {
        const code = getUrlParam('code')
        if (!code) {
            // console.log('to login')
            // storage('uid','ISqVdBQQajP94TFRo3mVLQ9HUTUw5c/F2611v4jFPQzb2NphxllE/hdngcUYWRh0YJtYeWuvynMpQox7aEhewoZ+W5XQraUNMig7yBTv7wE=')
            // location.href =  
            // 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ 
            // window.appId+'&redirect_uri='+encodeURIComponent(window.location.href)+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect' 
        }else{
            // 通过code获取openid
            
            const p = getOpenId(code)
            p.then(res=>{
                let openid
                if(res.result!=0){
                    return Promise.reject(res.msg)
                }
                openid = res.rsps[0].body.openId
                storage('openid',openid)
                return getUser(openid)
            })
            .then(res=>{
                if(res.result!=0){
                    Toast(res.msg)
                    if(res.result == -1){
                        alert('去登录')
                    }
                }else{
                    const data = res.rsps[0].body
                    storage(data)
                    store.state.user.uid = data.encrypt
                    store.state.user.userId = data.uid
                    store.state.user.aesid = data.aesid
                    next()
                }
            })
            .catch(e=>{
                // console.log(e)
                Toast(e)
            })
        }
    }else{
        // store.state.user.uid = cookie
        store.state.user.uid = encrypt
        store.state.user.aesid = storage('aesid')
        store.state.user.userId = storage('uid')
        next()
    }
})


/* eslint-disable no-new */

const app = new Vue({
    router,
    store,
    template: '<App/>',
    components: { App }
})




if (!/MicroMessenger/i.test(navigator.userAgent)) {
    app.$mount('#app')
}else{
    const encrypt = storage('encrypt')
    getJsTicket(encrypt)
    .then(res=>{
        if(res.result!=0){
            Toast(res.msg)
        }else{
            const signParams = Object.assign({},res.rsps[0].body,{
                debug: false,
                jsApiList:['onMenuShareAppMessage', 'onMenuShareTimeline','hideOptionMenu','chooseWXPay'],
            }) 
            return signParams
        }
    })
    .then(sign=>{
        wx.config(sign)
        wx.ready(function () {
            var
            params = {
                title: '医学界-医生学习的加油站',
                desc: '医生站 医生学习的加油站，服务医生改善医疗',
                link: 'http://' + window.location.hostname,
                imgUrl: 'http://' + window.location.hostname + '/images/shared_icon.jpg'
            };
            wx.onMenuShareAppMessage(params);
            wx.onMenuShareAppMessage(params);
        });
        app.$mount('#app')
    })
    .catch(e=>{
        console.log(e)
        app.$mount('#app')
    })
}


