import Vue from 'vue'
import vuex from 'vuex'
import { Toast } from 'mint-ui'
Vue.use(vuex)
import user from './modules/user'
import base from './modules/base'
import course from './modules/course'
import subject from './modules/subject'

export default new vuex.Store({
	state:{
		system:''
	},
	getters : {
		system (state) {
			return state.system
		}
	},
	modules: {
		user,base,course,subject
	},
	mutations: {
		toast (state,msg) {
			Toast(msg)
		}
	}
})