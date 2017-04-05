import {api} from '../../utils/api'
import axios from 'axios'
export default {
	state:{
		subjectId:0,
		studioId:0,
		subject:{},
		subjectMsg:{
			advanceMsg:{
				msgId:'',
				msgList:[]
			},
			normalMsg:{
				msgId:'',
				msgList:[]
			}
		},
		updateKeys:[],
		loopClock:null,
		repeatAdvId:0,
		repeatNrmId:0
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
		},
		partBMsgList (state) {
			return state.subjectMsg.normalMsg.msgList.slice(-4)
		},
		images (state) {
			let a = []
			let advanceMsgs = state.subjectMsg.advanceMsg.msgList
			advanceMsgs.forEach((item,index)=>{
				if (item.msgType === 2) {
					a.push({
						w:item.imgWidth,
						h:item.imgHeight,
						src:item.imgUrl,
						id:item.id
					})
				}
			})
			return a
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
		pushAdvMsg (state,{msgId,msgList}) {
			// 轮询获取高级消息
			const rId = state.repeatAdvId
			state.subjectMsg.advanceMsg.msgId = msgId
			var list = state.subjectMsg.advanceMsg.msgList
			for (var i = 0; i < msgList.length; i++) {
				if (msgList[i].id != rId) {
					list.push(msgList[i])
				}
			}
		},
		unshiftAdvMsg(state,{is_end,msgId,msgList}){
			state.subjectMsg.advanceMsg.msgId = msgId
			var list = state.subjectMsg.advanceMsg.msgList
			for (var i = 0; i < msgList.length; i++) {
				list.unshift(msgList[i])
			}
		},
		pushNormalMsg (state,{msgId,msgList}) {
			// 轮询获取历史消息
			const rId = state.repeatNrmId
			state.subjectMsg.normalMsg.msgId = msgId
			var list = state.subjectMsg.normalMsg.msgList
			for (var i = 0; i < msgList.length; i++) {
				if (rId != msgList[i].id) {
					console.log('1231312')
				}
				list.push(msgList[i])
			}
		},
		selfSendMsg (state,{id,msg}) {
			// 个人发送消息
			// state.subjectMsg.normalMsg.msgId = msgId
			// state.subjectMsg.normalMsg.msgList.push(msg)
			if (msg.type === 1) {
				state.advOnlyId = id
				state.subjectMsg.advanceMsg.msgList.push(msg)
			}
			if (msg.type === 2) {
				state.nrmOnlyId = id
				state.subjectMsg.normalMsg.msgList.push(msg)
			}
		},
		unshiftNormalMsg (state,{is_end,msgId,msgList}) {

		},
		clearMsg (state) {
			clearTimeout(state.loopClock)
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
			
		},
		getNormalHistoryMsg ({ commit, state, rootState}) {
			/*获取普通历史消息*/
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
			/*获取普通消息,暂时没用到*/
			
		},
		loopSubject ({ commit, state, rootState}) {
			/*轮循获取消息*/
			const uid = rootState.user.uid 
			var t = +new Date()
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
					commit('pushAdvMsg',Object.assign({},res.rsps[0].body.advMsgList))
					commit('pushNormalMsg',Object.assign({},res.rsps[0].body.nmrMsgList))
					console.log(+new Date() - t)
					t = +new Date()
					if (state.loopClock) {
						clearTimeout(state.loopClock)
					}
					state.loopClock = 
					setTimeout(()=>{
						run()
					},10000)
					Promise.resolve()
				})
				.catch(e=>{
					console.log(e)
					if (state.loopClock) {
						clearTimeout(state.loopClock)
					}	
					state.loopClock = 
					setTimeout(()=>{
						run()
					},10000)
				})
			}
			run()
		},
		saveMsg ({ commit, state, rootState},{type,questionFlag,answerFlag,msgType,content,width,height,vodDuration,refQuestionId}) {
			/*话题发言*/
			const uid = rootState.user.uid
			const data = Object.assign({},{studioId:state.studioId,subjectId:state.subjectId},{
				type,questionFlag,answerFlag,msgType,content,width,height,vodDuration,refQuestionId
			})
			return api(uid,{cmd:'save_msg',srv:'studio_studio'},data)
			.then(res=>{
				res = res.data
				if (res.result!=0) {
					commit('toast',res.msg)
				}else{
					commit('selfSendMsg',{
						id:res.rsps[0].body.msgId,
						msg:{
							type,
							textContent:content,
							msgType,
							questionFlag,
							headImg:''
						}
					})
				}
			})
		}
	}
}