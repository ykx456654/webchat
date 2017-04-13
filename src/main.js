// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { Toast } from 'mint-ui'
import { Lazyload } from 'mint-ui'
import time from './utils/time.js'
import prms from './utils/promise.js' 
import system from './utils/checkSystem.js'
import {checkUser,getUser,getJsTicket} from './utils/auth.js'
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


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.hideTab)) {
        // console.log('hidetab')
        store.state.base.tabShow = false
    }else{
        store.state.base.tabShow = true
    }
    const cookie = getCookie('uid')
    if (!cookie) {
        const code = getUrlParam('code')
        if (!code) {
            console.log('to login')
            // location.href = '../../login_room/build/index.html'
        }else{
            // 通过code获取uid、openid
            var p = getUser(code)
            p.then(res=>{
                if (res.success) {
                    setCookie('uid',res.encrypt)
                    store.state.user.uid = res.encrypt
                    next()
                }else{
                    Toast(res.message)
                    setTimeout(()=>{

                    },1500)
                }
            })
        }
    }else{
        // store.state.user.uid = cookie
        store.state.user.uid = cookie
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
    const cookie = getCookie('uid')
    getJsTicket(cookie)
    .then(res=>{
        if(res.result!=0){
            Toast(res.msg)
        }else{
            const signParams = Object.assign({},res.rsps[0].body,{
                debug: window.appId == 'wx9a4c6d9512f05f99',
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
}


