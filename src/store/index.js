import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)
import user from './modules/user'
import base from './modules/base'
import course from './modules/course'

export default new vuex.Store({
	state:{
		system:''
	},
	modules: {
		user,base,course
	}
})