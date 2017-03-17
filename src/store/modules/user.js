

export default {
	state : {
		uid:0
	},
	getters: {
		uid: state => {
			return state.uid
		}
	},
	mutations: {
		loginIn (state, uid) {
			state.uid = uid
		}
	},
	action:{}
}