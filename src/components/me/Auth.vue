<template>
	<div class="auth">
		<x-header title="完善资料">
			<router-link to="/Setting" slot="left">
				<i class="icon icon-arrow-back"></i>
			</router-link>
		</x-header>
		<div class="head-toast flex">
			<i class="icon"></i>
			<p>为了医生站平台交流的专业性，请完善您的个人资料</p>
		</div>
		<group label-align="left" label-width="4em" gutter="0">
	    	<x-input  v-model="name" title="姓名" name="username" placeholder="请输入姓名" is-type="china-name"></x-input>
	    	<selector v-model="sex" placeholder="请选择性别" title="性别" :options="sexOption" @on-change="setSex"></selector>
	    	<selector v-model="education" placeholder="请选择学历" title="学历" :options="eduOption" @on-change="setEdu"></selector>
	    	<datetime   
	    	:min-year="1940"
	    	:max-year="2017" 
	    	v-model="birth"
	    	format="YYYY-MM-DD"
	    	confirm-text="确认"
	    	cancel-text="取消"
	    	@on-change="setBirth"
	    	title="生日"></datetime>
	    	<cell title="医院"  @click.native="selectHospital" is-link>
	    		<span slot="value">
					<spinner  v-show="loadingData" :size="15"></spinner>
					<span v-show="!loadingData" v-text="userInfo.hospital"></span>
				</span>
	    	</cell>
	    	<cell title="科室" @click.native="selectDepartment" value="大丰大厦" is-link></cell>
	    	<selector placeholder="请输入职称" title="职称" :options="['主任医师','副主任医师','主治医师','住院医师','其他']" @on-change=""></selector>
	    	<!-- <x-input title="邮箱" v-model="" placeholder="请输入邮箱" is-type="email"></x-input> -->
	    	<x-input title="邀请码" placeholder="请输入邀请码（选填）"></x-input>
	    </group>
		<router-link to="/UpAuthImg" class="btn next-step">下一步，上传图片</router-link>
		<popup v-model="showPopup" height="100%">
			<div>
				<x-header title="医院设置"> 
					<a @click="hidePopup" slot="left">
						<img src="../../assets/images/back2.png">
					</a>
				</x-header>
				<hospital :list="hlist" @load="loadList" @search="searchHospital" @selH="selHospital" v-show="option == 0"></hospital>
				<x-department v-show="option == 1" @load="loadDepartments" @setD="setProp" :list="dlist"></x-department>
			</div>
		</popup>
	</div>
</template>
<script>
import {Header,Spinner} from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {XInput, Group, Cell,Selector,Datetime,Popup} from 'vux'
import hospital from './setPart/hospital';
import department from './setPart/department'
import { api } from '../../utils/api.js'
	export default{
		name:'Auth',
		components:{xHeader:Header,XInput, Group, Cell, Selector, Datetime, hospital, Popup, Spinner,xDepartment:department},
		created (){
			this.hideTab()
			if (JSON.stringify(this.userInfo) == '{}') {
				this.GETUSERINFO()
				.then((msg)=>{
					if (msg) {this.toast(msg)}
					this.name = this.userInfo.name
					this.sex = this.userInfo.sex
					this.birth= this.userInfo.birth
					this.nickName = this.userInfo.nickName
					this.major = this.userInfo.major
					this.department = this.userInfo.department
					this.school = this.userInfo.school
					this.education = this.userInfo.education
					this.title = this.userInfo.title
					this.email = this.userInfo.email
					this.hideLoad()
				})
			}else{
				this.name = this.userInfo.name
				this.sex = this.userInfo.sex
				this.birth= this.userInfo.birth
				this.nickName = this.userInfo.nickName
				this.major = this.userInfo.major
				this.department = this.userInfo.department
				this.school = this.userInfo.school
				this.education = this.userInfo.education
				this.title = this.userInfo.title
				this.email = this.userInfo.email
				this.hideLoad()
			}
		},
		data () {
			return {
				name:'',
				sex:0,
				sexOption:[{key:0,value:"男"},{key:1,value:"女"}],
				eduOption:['高中/中专','大专','本科','硕士','博士','其他'],
				hlist:[],
				nickName:'',
				education:'',
				email:'',
				birth:'',
				department:'',
				major:'',
				title:'',
				hospital:'',
				school:'',
				sexShow:false,
				educationShow:false,
				loadingData: false,
				showPopup:false,
				pickerValue:'',
				option:0,
				dlist:[]
			}
		},
		methods:{
			...mapMutations(['showLoad','hideLoad','setUserInfo','hideTab','showTab']),
			...mapActions(['GETUSERINFO']),
			selectHospital () {
				this.option = 0
				if (this.loadingData) { return false}
				this.loadingData = true
				this.loadHospitalList()
				.then(res => {
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						this.hlist = res.rsps[0].body.provinces
						this.loadingData = false
						this.showPopup = true
						this.popupTitle = '医院设置'
						this.popupHeight = '100%'
					}
				})
			},
			selectDepartment () {
				this.option = 1
				this.loadDepartments(1)
				.then(()=>{
					this.showPopup = true
					this.popupHeight = '100%'
				})
			},
			selHospital (id,name) {
				// alert('修改个人信息---医院接口'+id+name)
				api(this.uid,{ srv: "user_user",cmd: "set_user_info"},{prop:'hospital',hspid:id,value:name,type:'',department:''})
				.then(res=>{
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						this.setUserInfo({hospital:name})
						this.showPopup = false
					}
				})
			},
			loadHospitalList (n,id,pid) {
				let cmd =  {srv: "user_user",cmd:"get_province_list"}
				let body = {}
				if (n == 1) {
					// n 1,省列表；2，市列表；3，区列表；4，医院
					cmd.cmd = "get_province_list"
				}
				if (n == 2) {
					// 普通省获取市
					cmd.cmd = "get_city_list"
					body = {pvcid:id}
				}
				if (n == 3) {
					cmd.cmd = "get_district_list"
					body = {pvcid:pid,ctyid:id}
				}
				if (n == 4) {
					cmd.cmd = "get_hospital_list"
					body = {dstid:id}
				}
				return api(this.uid,cmd,body)
			},
			loadList (n,id,pid) {
				this.loadHospitalList(n,id,pid)
				.then(res=>{
					res = res.data
					if (res.result != 0) {
						this.toast(res.msg)
					}else{
						if (n == 2) {
							this.hlist = res.rsps[0].body.citys.map(i => {
								i.pvcid = id
								return i
							})
						}else if (n == 3) {
							this.hlist =  res.rsps[0].body.districts
						}else if (n == 4) {
							this.hlist = res.rsps[0].body.hospitals
						}
					}
				})
			},
			searchHospital (value) {
				api(this.uid,{cmd:'search_hospital_list',srv:'suggestion_suggestion'},{key:value,start:0,limit:30})
				.then(res => {
					res = res.data
					if (res.result!=0) {
						this.toast(res.msg)
					}else{
						this.hlist = res.rsps[0].body.list
					}
				})
			},
			loadDepartments (pid) {
				pid = Number(pid)
				return api(this.uid,{ srv: "user_user",cmd: "get_department_list"},{pid:pid})
				.then(res=>{
					res = res.data
					this.dlist = res.rsps[0].body.departments
				})
			},
			setProp (prop,value) {
				// alert('设置用户数据  4.9' + value)
				const uid = this.uid
				api(this.uid,{ srv: "user_user",cmd: "set_user_info"},{prop:prop,hspid:0,value:value,type:'',department:''})
				.then(res=>{
					res = res.data
					if (res.result!=0) {
						this.toast(res.msg)
					}else{
						var obj = {}
						obj[prop] = value
						this.setUserInfo(obj)
						this.showPopup = false
					}
				})
			},
			setSex (value) {
				// console.log(value)
				this.setProp('sex',value)
			},
			setEdu (value) {
				// console.log(value)
				this.setProp('education',value)
			},
			setBirth (value) {
				console.log(value)
				this.setProp('birth',value)
			},
			hidePopup () {
				this.showPopup =false
			}
		},
		computed:{
			...mapGetters(['userInfo','uid'])
		}
	}
</script>
<style lang="less">
	.head-toast{
		font-size: 16px;
		color: #000;
		margin-top: 10px;
		padding: 0 10px;
		margin-bottom: 12px;
		text-align: left;
		.icon{
			background-repeat: no-repeat;
			background-image: url(../../assets/images/iconfont-tishi.png);
			width: 18px;
			height: 24px;
			background-position: center;
			background-size: 100%;
			margin-right: 12px;
		}
	}
	.next-step{
		display: block;
		box-sizing: border-box;
		color: #fff;
	    background-color: #d9534f;
	    border-color: #d43f3a;
	    border-radius: 5px;
	    padding: 10px;
	    font-size: 13px;
	    width: 95%;
	    margin: 10px auto;
	}
</style>