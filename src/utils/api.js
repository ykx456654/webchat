import axios from 'axios'


export const api = function(uid,head,body) {
	// body...
	const data = {
		guid:'web',
		platform:'web',
		version:'1.2.2',
		time: parseInt(+new Date()/1000),
		encrypt: uid,
		reqs:[{
			head:head,
			body:body
		}]
	}
	return axios({
		method:'post', 
		url:'/api',
		data:data
	})
}



