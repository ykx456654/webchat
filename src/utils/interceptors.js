export const responseInterceptor = function (response) {
	if (response.data.result == 1) {
		// 登录态失效
		// location.href = ''
		console.log('登录态失效')
	}
	// console.log(response)
	return response
}