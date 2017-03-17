import {setCookie,getCookie} from './func';
import axios from 'axios'

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