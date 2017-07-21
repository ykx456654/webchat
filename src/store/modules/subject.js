import {api} from '../../utils/api'
import axios from 'axios'
import bus from '../../components/common/eventBus'
export default {
	state:{
		subjectId:0,
		studioId:0,
		subject:{},
		subjectMsg:{
			advanceMsg:{
				msgId:'init',
				msgList:[],
				is_end:false
			},
			normalMsg:{
				msgId:'init',
				msgList:[],
				is_end:false
			}
		},
		updateKeys:[],
		loopClock:null,
		repeatAdvId:[],
		repeatNrmId:[],
		scrollTopA:'init',
		scrollTopB:'init',
		currentImg:{},
		firstImg:'',
		actionList:[],
		imgs:[],
		isPlayLive:false,   //播放器是否正在播放
		onlyQuestion:false,
		playFlag:0
	},
	getters:{
		subject (state) {
			return state.subject
		},
		id (state) {
			return {subjectId:state.subjectId,studioId:state.studioId}
		},
		loopClock (state) {
			return state.loopClock
		},
		scroll (state) {
 			return {a:state.scrollTopA,b:state.scrollTopB}
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
						w:item.imgWidth != 0 ?item.imgWidth:'100%',
						h:item.imgHeight,
						src:item.imgUrl,
						id:item.id
					})
				}
			})
			return a
		},
		isStart (state) {
			return state.subject.liveStatus > 0
		},
		subjectRole (state) {
			return state.subject.subjectRole
		},
		currentImg (state, getters, rootState) {
			if(state.currentImg.url == ''){
				return {
					url: state.subject.subjectImg
				}
			}else{
				return state.currentImg
			}
		},
		firstImg (state) {
			return {url:state.firstImg,actionTime:0}
		},
		recordPlayInfo (state) {
			return {
				imgs:state.imgs,
				actionList:state.actionList
			}
		}
	},
	mutations: {
		setSubjectInfo (state,{subjectId,studioId}) {
			state.subjectId = Number(subjectId)
			state.studioId = Number(studioId)
		},
		setScroll (state,{a,b}) {
			if (a) {
				state.scrollTopA = a
			}
			if (b) {
				state.scrollTopB = b
			}
		},
		pushAdvMsg (state,{msgId,msgList}) {
			// 轮询获取高级消息
			// console.log(msgList)
			var rIds = state.repeatAdvId
			state.subjectMsg.advanceMsg.msgId = msgId
			var list = state.subjectMsg.advanceMsg.msgList
			for (var i = 0; i <= rIds.length; i++) {
				for (var j = 0; j < msgList.length; j++) {
					if (msgList[j].msgType == 3) {
						// console.log('0.0')
						msgList[j].playing = false
					}
					if(msgList[j].msgType == 201){
						state.subject.liveStatus = 1
					}
					if(msgList[j].msgType == 202){
						// console.log('0.0')
						state.subject.liveStatus = 2
					}
					if(msgList[j].msgType == 203){
						state.subject.liveStatus = 9
					}
					if(msgList[j].answerFlag){
						msgList[j].ansList[0].playing = false
					}
					if (msgList[j].id == rIds[i]) {
						rIds.splice(i,1);
						msgList.splice(j,1);
						i--;
						j--;
					}
				}
			}
			state.subjectMsg.advanceMsg.msgList = list.concat(msgList)
		},
		unshiftAdvMsg(state,{is_end,msgId,msgList}){
			state.subjectMsg.advanceMsg.is_end = is_end
			state.subjectMsg.advanceMsg.msgId = msgId
			var list = state.subjectMsg.advanceMsg.msgList
			for(var i = msgList.length - 1; i >= 0; i-- ){
				if (msgList[i].msgType == 3) {
					msgList[i].playing = false
				}
				if(msgList[i].answerFlag){
					msgList[i].ansList[0].playing = false
				}
				list.unshift(msgList[i])
			}
		},
		pushNormalMsg (state,{msgId,msgList}) {
			// 轮询获普通消息
			let rIds = state.repeatNrmId
			state.subjectMsg.normalMsg.msgId = msgId
			let list = state.subjectMsg.normalMsg.msgList
			for (let i = 0; i < rIds.length; i++) {
				for (let j = 0; j < msgList.length; j++) {
					if (msgList[j].id == rIds[i]) {
						msgList[j].selected = false
						rIds.splice(i,1);
						msgList.splice(j,1);
						i--;
						j--;
					}
				}
			}
			if(state.onlyQuestion){
				msgList = msgList.filter(item=> item.questionFlag == true)
			}
			state.subjectMsg.normalMsg.msgList = list.concat(msgList)
		},
		unshiftNormalMsg (state,{is_end,msgId,msgList}) {
			state.subjectMsg.normalMsg.msgId = msgId
			var list = state.subjectMsg.normalMsg.msgList
			for(var i = msgList.length - 1; i >= 0; i-- ){
				// console.log(msgList[i])
				msgList[i].selected = false
				list.unshift(msgList[i])
			}
		},
		selfSendMsg (state,{id,msg}) {
			// 个人发送消息
			// state.subjectMsg.normalMsg.msgId = msgId
			// state.subjectMsg.normalMsg.msgList.push(msg)
			if (msg.type === 1) {
				state.repeatAdvId.push(id) 
				state.subjectMsg.advanceMsg.msgList.push(msg)
			}
			if (msg.type === 2) {
				state.repeatNrmId.push(id)
				msg.selected = false
				state.subjectMsg.normalMsg.msgList.push(msg)
			}
		},
		clearMsg (state,n) {
			// 清除消息，1清除左侧消息，2清除右侧消息
			if (n == 1) {
				state.subjectMsg.advanceMsg = {
					msgId:'init',
					msgList:[],
					is_end:false
				}
				return false
			}
			if (n == 2) {
				state.subjectMsg.normalMsg = {
					msgId:'init',
					msgList:[],
					is_end:false
				}
				return false
			}
			state.subjectMsg = {
				advanceMsg:{
					msgId:'init',
					msgList:[],
					is_end:false
				},
				normalMsg:{
					msgId:'init',
					msgList:[],
					is_end:false
				}
			}
			clearTimeout(state.loopClock)
			state.subject = {}
			state.loopClock = null
		},
		setPlayingVoice (state,o) {
			switch (o.type) {
				case 1:
					state.subjectMsg.advanceMsg.msgList.forEach((item,index)=>{
						if(o.i == index){
							console.log(o)
							item.playing = true
						}else{
							item.playing = false
						}
					})
					break;
				case 2:
					state.subjectMsg.advanceMsg.msgList[o.i].playing = false
					break;
				case 3:
					state.subjectMsg.advanceMsg.msgList.forEach((item,index)=>{
						if(item.answerFlag){
							if(o.i == index){
								// console.log(item)
								item.ansList[0].playing = true
							}else{
								if(item.ansList){
									item.ansList[0].playing = false
								}
							}
						}
					})
					break;
				case 4:
					// console.log(+new Date())
					state.subjectMsg.advanceMsg.msgList[o.i].ansList[0].playing = false
					break;
				case 5:
					// 讨论区语音播放
					state.subjectMsg.normalMsg.msgList.forEach((item,index)=>{
						if(item.questionFlag){
							if(o.i == index){
								if(item.ansList[0]){
									// console.log(+new Date())
									item.ansList[0].playing = true
								}
							}else{
								if(item.ansList[0]){
									item.ansList[0].playing = false
								}
							}
						}
					})
					break;
				case 6:
					state.subjectMsg.normalMsg.msgList[o.i].ansList[0].playing = false
					break;
			}
		},
		setCurrentImg (state,current) {
			state.currentImg = current
		},
		setLiveStatu (state,n) {
			state.subject.liveStatus = n
		},
		setIsPlayLive (state,flag) {
			state.isPlayLive = flag
		},
		setPlayFlag (state,n) {
			state.playFlag = n
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
					state.subject = res.rsps[0].body
					return true
				}
			})
		},
		enterSubejct ({ commit, state, rootState },instance) {
			const uid = rootState.user.uid
			return api(uid,{cmd:'enter_subject',srv:'studio_studio'},{studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					commit('toast',res.msg)
					if(res.result == -10){
						// 未付费状态，去话题介绍页
						instance.$router.push({path:'/SubjectIntro',query:{studioId:state.studioId,subjectId:state.subjectId}})
					}
					Promise.reject(res.msg)
				}else{
					const data = res.rsps[0].body
					state.subject = data.subject
					state.imgs = data.imgs
					state.currentImg = data.currentImg
					state.actionList = data.actionList
					if(data.firstImg){
						state.firstImg = data.firstImg
					}
					return true
				}
			})
		},
		getAdvMsg ({ commit, state, rootState},{direction,limit}) {
			/*获取高级消息,默认一次拉十条*/
			const uid = rootState.user.uid
			const msgId = state.subjectMsg.advanceMsg.msgId
			return api(uid,{cmd:'get_advance_msg_list',srv:'studio_studio'},{msgId,direction,limit,studioId:state.studioId,subjectId:state.subjectId})
			.then(res=>{
				res = res.data
				if (res.result !=0 ) {
					// alert(res.msg)
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					if (direction) {
						// 拉去新消息
					}else{
						// 拉取历史消息
						commit('unshiftAdvMsg',res.rsps[0].body)
					}
					return true
				}
			})
		},
		getNormalMsg ({ commit, state, rootState},{direction,limit,onlyQuestion}) {
			/*获取普通消息*/
			const uid = rootState.user.uid
			const msgId = state.subjectMsg.normalMsg.msgId
			state.onlyQuestion = onlyQuestion
			return api(
				uid,
				{cmd:'get_normal_msg_list',srv:'studio_studio'},
				{limit,onlyQuestion,msgId,direction,studioId:state.studioId,subjectId:state.subjectId}
			)
			.then(res=>{
				res = res.data
				if (res.result != 0) {
					commit('toast',res.msg)
					Promise.reject(res.msg)
				}else{
					if (direction) {
						// 拉取新消息
					}else{
						// 拉取历史消息
						commit('unshiftNormalMsg',res.rsps[0].body)
					}
					return true
				}
			})
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
							updateKeys:state.updateKeys,
							playFlag:state.playFlag
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
					if(state.isPlayLive){
						// 只有用户收到开始才会播放ppt
						if(state.currentImg.url){
							var time = rootState.system == 'ios' ? 20000:30000
							// console.log(time)
							setTimeout(()=>{
								commit('setCurrentImg',res.rsps[0].body.currentImg)
							},time)
						}else{
							commit('setCurrentImg',res.rsps[0].body.currentImg)
						}
					}

					// console.log(res)
					// console.log(+new Date() - t)
					// t = +new Date()
					if (state.loopClock) {
						clearTimeout(state.loopClock)
					}
					state.loopClock = 
					setTimeout(()=>{
						run()
					},3000)
					Promise.resolve()
				})
				.catch(e=>{
					// console.log(e)
					if (state.loopClock) {
						clearTimeout(state.loopClock)
					}	
					state.loopClock = 
					setTimeout(()=>{
						run()
					},3000)
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
							msgTime:+new Date()/1000,
							name:rootState.user.userInfo.nickName,
							headImg:rootState.user.userInfo.headUrl,
							ansList:[]
						}
					})
				}
			})
		}
	}
}