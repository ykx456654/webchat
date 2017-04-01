import {api} from '../../utils/api'
import axios from 'axios'
export default {
	state:{
		subjectId:0,
		studioId:0,
		subject:{},
		subjectMsg:{
			advanceMsg:{
				msgId:0,
				msgList:[]
			},
			normalMsg:{
				msgId:0,
				msgList:[]
			}
		},
		updateKeys:[]
	},
	getters:{
		subject (state) {
			return state.subject
		},
		id (state) {
			return {subjectId:state.subjectId,studioId:state.studioId}
		},
		uvNum (state) {
			return state.subjectMsg.uvNum
		},
		advanceMsg (state) {
			return state.subjectMsg.advanceMsg
		},
		normalMsg (state) {
			return state.subjectMsg.normalMsg
		},
		advanceMsgId (state) {
			return state.subjectMsg.advanceMsg.msgId
		},
		normalMsgId (state) {
			return state.subjectMsg.normalMsg.msgId
		}
	},
	mutations: {
		setSubjectInfo (state,{subjectId,studioId}) {
			state.subjectId = Number(subjectId)
			state.studioId = Number(studioId)
		},
		playVoice (state,{vodUrl,vodDuration}) {
			// $()
			alert(vodUrl)
		},
		pushAdvMsg (state,{is_end,msgId,msgList}) {
			state.subjectMsg.advanceMsg.msgId = msgId
			var list = state.subjectMsg.advanceMsg.msgList
			for (var i = 0; i < msgList.length; i++) {
				list.push(msgList[i])
			}
		},
		unshiftAdvMsg(state,{is_end,msgId,msgList}){
			state.subjectMsg.advanceMsg.msgId = msgId
			var list = state.subjectMsg.advanceMsg.msgList
			for (var i = 0; i < msgList.length; i++) {
				list.unshift(msgList[i])
			}
		},
		pushNormalMsg (state,{is_end,msgId,msgList}) {

		},
		unshiftNormalMsg (state,{is_end,msgId,msgList}) {

		},
		clearMsg (state) {
			state.subjectMsg = {
				advanceMsg:{
					msgId:0,
					msgList:[]
				},
				normalMsg:{
					msgId:0,
					msgList:[]
				}
			}
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
					Promise.reject(res.msg)
				}else{
					state.subject = res.rsps[0].body.subject
					return true
				}
			})
		},
		enterSubejct ({ commit, state, rootState }) {
			const uid = rootState.user.uid
			return api(uid,{cmd:'enter_subject',srv:'studio_studio'},{studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					state.subjectMsg = res.rsps[0].body
					return true
				}
			})
		},
		getHistoryAdvMsg ({ commit, state, rootState}) {
			/*获取高级历史消息,默认一次拉十条*/
			const uid = rootState.user.uid
			const msgId = state.subjectMsg.advanceMsg.msgId
			return api(uid,{cmd:'get_msg_list',srv:'studio_studio'},{msgId,limit:10,type:3,studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result !=0 ) {
					// alert(res.msg)
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					commit('unshiftAdvMsg',res.rsps[0].body)
					return res.rsps[0].body.is_end
				}
			})
		},
		getAdvMsg ({ commit, state, rootState}) {
			/*获取高级消息,暂时没用到*/
			const uid = rootState.user.uid
			const msgId = state.subjectMsg.advanceMsg.msgId
			return api(uid,{cmd:'get_msg_list',srv:'studio_studio'},{msgId,start:0,limit:10,type:1,studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					commit('pushAdvMsg', res.rsps[0].body)
					return res.rsps[0].body.is_end
				}
			})
		},
		getNormalHistoryMsg ({ commit, state, rootState}) {
			/*获取普通历史消息，暂时没用到*/
			const uid = rootState.user.uid
			const msgId = state.subjectMsg.normalMsg.msgId
			return api(uid,{cmd:'get_msg_list',srv:'studio_studio'},{msgId,start:0,limit:10,type:2,studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					commit('unshiftNormalMsg',res.rsps[0].body)
					return res.rsps[0].body.is_end
				}
			})
		},
		getNormalMsg ({ commit, state, rootState}) {
			/*获取普通消息*/
			const uid = rootState.user.uid
			const msgId = state.subjectMsg.normalMsg.msgId
			return api(uid,{cmd:'get_msg_list',srv:'studio_studio'},{msgId,start:0,limit:10,type:4,studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result != 0) {	
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					commit('pushNormalMsg',res.rsps[0].body)
					return res.rsps[0].body.is_end
				}
			})

		},
		loopSubject ({ commit, state, rootState}) {
			const uid = rootState.user.uid 
			function run () {
				axios.post('/api',{
					guid:'web',
					platform:'web',
					version:'1.2.2',
					time: parseInt(+new Date()/1000),
					encrypt: uid,
					reqs:[{
						head:{cmd:'loop_subject',srv:'studio_studio'},
						body:{
							studioId:state.studioId,
							subjectId:state.subjectId,
							advMsgId:state.subjectMsg.advanceMsg.msgId,
							nmrMsgId:state.subjectMsg.normalMsg.msgId,
							updateKeys:state.updateKeys
						}
					}]
				},
				{
					timeout:2900
				})
				.then(res=>{
					res = res.data
					setTimeout(()=>{
						run()
					},3000)
				})
				.done()
				.catch(e=>{
					setTimeout(()=>{
						run()
					},1000)
					console.log(e)	
				})
			}
			run()
		}
	}
}