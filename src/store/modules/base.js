export default {
	state:{
		loading:true,
		tabShow:true
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
		}
	}
}