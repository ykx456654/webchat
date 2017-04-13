import {setCookie,getCookie} from './func';
import axios from 'axios'
// import api from './api'

export const checkUser = function () {
	const cookie = getCookie('user')
	if (!cookie) {
		return false
	}else{
		return true
	}
}


export const getUser = function (code) {
	return axios({
		method:'get',
		url:'/wechatApi?cmd=wechat-getUserInfo&code='+code
	})
	.then(res=>{
		return res.data
	})
}

export const getJsTicket =  function (cookie) {
	return axios({
		method:'post',
		url:'/api',
		data:{
			guid:'web',
			platform:'web',
			version:'1.2.2',
			time: parseInt(+new Date()/1000),
			encrypt: cookie,
			reqs:[{
				head:{cmd:'jsapi_signature',srv:'wxaccess_wxauth'},
				body:{appId:window.appId,url:location.href.split('#')[0]}
			}]
		}
	})
	.then(res=>{
		return res.data
	})
}