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


export const getOpenId = function (code) {
	return axios({
		method:'post',
		url:'/api',
		data:{
			guid:'web',
			platform:'web',
			version:'1.2.2',
			time: parseInt(+new Date()/1000),
			encrypt: '',
			reqs:[{
				head:{cmd:'oauth_openid',srv:'wxaccess_wxauth'},
				body:{appId:window.appId,code}
			}]
		}
	})
	.then(res=>{
		return res.data
	})
}

export const getUser = function (openid) {
	return axios({
		method:'post',
		url:'/api',
		data:{
			guid:'web',
			platform:'web',
			version:'1.2.2',
			time: parseInt(+new Date()/1000),
			encrypt: '',
			reqs:[{
				head:{cmd:'get_user_by_wechat',srv:'user_user'},
				body:{appid:window.appId,openid}
			}]
		}
	})
	.then(res=>{
		return res.data
	})
}