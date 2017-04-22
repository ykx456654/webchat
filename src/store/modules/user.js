import {api} from '../../utils/api'

export default {
	state : {
		uid:0,
		userInfo:{},
		userId:0,
		aesid:0
	},
	getters: {
		uid: state => {
			return state.uid
		},
		userInfo: state => {
			return state.userInfo
		},
		myStudioID: state => {
			return state.userInfo.studioId
		}
	},
	mutations: {
		loginIn (state, uid) {
			state.uid = uid
		},
		setUserInfo (state, info) {
			state.userInfo = Object.assign({},state.userInfo,info)
		}
	},
	actions:{
		GETUSERINFO ({commit,state}) {
			return api(state.uid,{ srv: "user_user",cmd: "get_user_info"},{}).then(res=>{
				res = res.data
				if (res.result != 0) {
					return res.msg
				}else{
					commit('setUserInfo',res.rsps[0].body.user)
					Promise.resolve()
				}
			})
		}
	}
}