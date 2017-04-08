export default {
	state:{
		loading:true,
		tabShow:true,
		keepAliveComponents:['Subject','Discuss']
	},
	getters :{
	
	},
	mutations:{
		showLoad (state) {
			state.loading = true
		},
		hideLoad (state) {
			state.loading = false
		},
		hideTab (state) {
			state.tabShow = false
		},
		showTab (state) {
			state.tabShow = true
		},
		setAlive (state,arr) {
			state.keepAliveComponents = arr
		}
	}
}