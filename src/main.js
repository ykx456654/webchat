// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import storage from 'storejs'
import { Lazyload,Toast } from 'mint-ui'
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
store.state.isWeChat = /MicroMessenger/i.test(navigator.userAgent)
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
        if (!code && store.state.isWeChat) {
            // console.log('to login')
            // storage('uid','ISqVdBQQajP94TFRo3mVLQ9HUTUw5c/F2611v4jFPQzb2NphxllE/hdngcUYWRh0YJtYeWuvynMpQox7aEhewoZ+W5XQraUNMig7yBTv7wE=')
            location.href =  
            'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ 
            window.appId+'&redirect_uri='+encodeURIComponent(window.location.href)+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect' 
        }else{
            // 通过code获取openid
            var p 
            if(store.state.isWeChat){
                 p = getOpenId(code)
            }else{
                p = (function(){
                    let o = to.query.openid
                    // console.log(openid)
                    let res = {result:0,rsps:[{body:{openId:o}}]}
                    // alert(JSON.stringify(res))
                    return Promise.resolve(res) 
                })()
            }
            // const p = getOpenId(code)
            p.then(res=>{
                // alert(JSON.stringify(res))
                let openid
                if(res.result!=0){
                    location.href =  
                    'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ 
                    window.appId+'&redirect_uri='+encodeURIComponent(window.location.href)+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'  
                    
                    return Promise.reject(res.msg)
                }
                
                openid = res.rsps[0].body.openId
                // alert(openid)
                storage('openid',openid)
                return getUser(openid)
            })
            .then(res=>{
                if(res.result!=0){
                    const openid = storage('openid')
                    if(!openid){
                        // console.log(1111)
                         location.href =  
                    'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ 
                    window.appId+'&redirect_uri='+encodeURIComponent(window.location.href)+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect' 
                        Toast(res.msg)
                    }else{
                        location.href = '../../testLogin/build/index.html'
                    }
                    if(res.result == -1){
                        storage('from',location.href.replace(/code=+\w*/g,''))
                        location.href = '../../testLogin/build/index.html'
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
            // Toast(res.msg)
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
        app.$mount('#app')
    })
    .catch(e=>{
        console.log(e)
        app.$mount('#app')
    })
}


