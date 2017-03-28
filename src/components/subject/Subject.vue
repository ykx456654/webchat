<template>
	<div>
		subject
	</div>
</template>
<style lang="less">
	
</style>
<script>
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Header,Spinner} from 'mint-ui'
import { api } from '../../utils/api'

	export default {
		mounted () {
			this.hideLoad()
		},
		methods:{
			...mapMutations(['hideLoad'])
		}
	}
</script>