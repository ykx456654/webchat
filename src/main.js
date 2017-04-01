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
import {checkUser,getUser} from './utils/auth.js'
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

console.log(1)
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.hideTab)) {
        console.log('hidetab')
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
                        // alert(1)
                         // location.href = '../../login_room/build/index.html'
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
    app.$mount('#app')
}
