import {api} from '../../utils/api'
export default {
	state:{
		subjectId:0,
		studioId:0,
		subject:{

		}
	},
	getters:{
		subject (state) {
			return state.subject
		}
	},
	mutations: {
		setSubjectInfo (state,{subjectId,studioId}) {
			state.subjectId = Number(subjectId)
			state.studioId = Number(studioId)
		}
	},
	actions: {
		getSubjectInfo ({ commit, state ,rootState }) {
			const uid = rootState.user.uid
			return api(uid,{cmd:'get_subject_info',srv:'studio_studio'},{subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result!=0) {
					commit('toast',res.msg)
				}else{
					state.subject = res.rsps[0].body.subject
					return true
				}
			})
		},
		enterSubejct ({ commit, state }) {
			// api()
		}
	}
}