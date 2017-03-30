<template>
	<div class="setting">
		<x-header title="个人设置"> 
			<router-link to="/me" slot="left">
				<i class="icon icon-arrow-back"></i>
			</router-link>
		</x-header>
		<header class="header flex align-items-center justify-space-between">
			<span>头像</span>
			<img src="http://wx.qlogo.cn/mmopen/SaNfE90PbPL3gjlRc2SCMRzJqMmCpSPkEaTbr5u387bvFw169s7AlzSpU2kvYcW4uzrun7ktBWlgT79KOZ48pPLuewapQuFq/0">
		</header>
		<cellx>
			<div class="setting flex align-items-center" slot="left">
				<span>姓名</span>
				<input v-model="name" type="text">
			</div>
		</cellx>
		<cellx>
			<div class="setting flex align-items-center" slot="left">
				<span>昵称</span>
				<input type="text" v-model="nickName">
			</div>
		</cellx>
		<cellx is-link @onclick="selStatus">
			<div class="setting flex align-items-center" slot="left">
				<span>身份</span>
			</div>
			<div class="setting-item-right" slot="right">
				{{userInfo.type | type}}
			</div>
		</cellx>
		<cellx is-link>
			<div class="setting setting-sex flex align-items-center justify-space-between" slot="left">
				<span>性别</span>
			</div>
			<div class="setting-item-right" slot="right">
				<select class="select-sex" v-model="sex">
					<option value="0">男</option>
					<option value="1">女</option>
				</select>
			</div>
		</cellx>
		<cellx is-link @onclick="selectHospital" v-show="userInfo.type != 5">
			<div class="setting flex align-items-center" slot="left">
				<span>医院</span>
			</div>
			<div class="setting-item-right" slot="right">
				<span v-if="loadingData">
					<spinner :size="15"></spinner>
				</span>
				<span v-else>{{userInfo.hospital}}</span>
			</div>
		</cellx>
		<cellx is-link v-show="userInfo.type == 1" @onclick="setDepartment">
			<div class="setting flex align-items-center" slot="left">
				<span>科室</span>
			</div>
			<div class="setting-item-right" slot="right">
				{{userInfo.department}}
			</div>
		</cellx>
		<cellx is-link v-show="userInfo.type == 1 || userInfo.type == 4" @onclick="setTitle">
			<div class="setting flex align-items-center" slot="left">
				<span>职称</span>
			</div>
			<div class="setting-item-right" slot="right">
				{{userInfo.title}}
			</div>
		</cellx>
		<cellx is-link v-show="userInfo.type == 5" @onclick="selEducation">
			<div class="setting flex align-items-center" slot="left">
				<span>学历</span>
			</div>
			<div class="setting-item-right" slot="right">
				{{userInfo.education}}
			</div>
		</cellx>
		<cellx is-link v-show="userInfo.type == 5" @onclick="selMajor">
			<div class="setting flex align-items-center" slot="left">
				<span>专业</span>
			</div>
			<div class="setting-item-right" slot="right">
				{{userInfo.major}}
			</div>
		</cellx>
		<cellx is-link>
			<div class="setting flex align-items-center" slot="left">
				<span>实名认证</span>
			</div>
			<div class="setting-item-right" slot="right">
				<span class="tag" :class="authClass">未认证</span>
			</div>
		</cellx>
		<router-link to="/Auth" class="btn btn-auth" v-if="userInfo.authFlag == 0">去认证</router-link>
		<popup  v-model="showPopup" :height="popupHeight">
			<div class="popup-content">
				<x-header :title="popupTitle"> 
					<a @click="hidePopup" slot="left">
						<i class="icon icon-arrow-back"></i>
					</a>
				</x-header>
				<status @hideStatu="SetUserStatus" :status="userInfo.type"  v-show="option == 1"></status>
				<hospital :list="hlist" @load="loadList" @selH="selHospital" @search="searchHospital" v-show="option == 2"></hospital>
				<department v-show="option == 4" @load="loadDepartments" @setD="setProp" :list="dlist"></department>
				<normal-list :list="list" :prop="prop" @setP="setProp" v-show="option == 3"></normal-list>
			</div>
		</popup>
	</div>
</template>
<script>
import { Header,Spinner  } from 'mint-ui'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import { XInput, Group,Popup } from 'vux'
import { api } from '../../utils/api.js'
import status from './setPart/status'
import hospital from './setPart/hospital'
import normalList from './setPart/normalList'
import department from './setPart/department'
import cellx from '../common/cell-x'
	export default {
		created () {
			if (JSON.stringify(this.userInfo) == '{}') {
				this.GETUSERINFO()
				.then((msg)=>{
					if (msg) {this.toast(msg)}
					this.name = this.userInfo.name
					this.sex = this.userInfo.sex
					this.nickName = this.userInfo.nickName
					this.hideLoad()
				})
			}else{
				this.userStatus = this.userInfo.type
				this.name = this.userInfo.name
				this.sex = this.userInfo.sex
				this.nickName = this.userInfo.nickName
				this.hideLoad()
			}
		},
		components: {
			xHeader:Header,cellx,XInput,Group,Popup,status,hospital,Spinner,normalList,department
		},
		data () {
			return {
				showPopup:false,
				popupTitle:'',
				popupHeight:'100%',
				sex:0,
				nickName:'',
				name:'',
				option:0,
				hlist:[],  //选择医院时的列表
				dlist:[], //科室列表
				list:[],	//选择学校、专业时的列表
				loadingData:false,
				prop:'',
				type:''
			}
		},
		methods: {
			...mapMutations(['showLoad','hideLoad','hideTab','showTab','setUserInfo']),
			...mapActions(['GETUSERINFO']),
			selStatus () {
				this.option = 1
				this.popupTitle = '身份设置'
				this.showPopup = true
				this.popupHeight = '100%'
			},
			selectHospital () {
				if (this.loadingData) { return false}
				this.option = 2
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
						this.hideTab()
						this.popupTitle = '医院设置'
						this.popupHeight = '100%'
					}
				})
			},
			selEducation () {
				this.option = 3
				this.popupTitle = '学历设置'
				this.list = ['高中/中专','大专','本科','硕士','博士','其他']
				this.prop = 'education'
				this.hideTab()
				this.showPopup = true
				this.popupHeight = '100%'
			},
			selMajor () {
				this.option = 3
				this.popupTitle = '专业设置'
				this.prop = 'major'
				api(this.uid,{cmd:'get_major_list',srv:'user_user'},{})
				.then(res=>{
					res = res.data
					if (res.result!=0) {
						this.toast(res.msg)
					}else{
						this.list = res.rsps[0].body.majors.map(item=>{return item.name})
						this.hideTab()
						this.showPopup = true
						this.popupHeight = '100%'
					}
				})
			},
			setTitle () {
				this.option = 3
				this.popupTitle = '职称设置'
				this.prop = 'title'
				if (this.userInfo.type == 1) {
					this.list = ['主任医师','副主任医师','主治医师','住院医师','其他']
				}else{
					this.list = ['护士长','护士']
				}
				this.hideTab()
				this.showPopup = true
				this.popupHeight = '100%'
			},
			setDepartment () {
				this.option = 4
				this.popupTitle = '科室设置'
				this.prop = 'department'
				this.hideTab()
				this.loadDepartments(1)
				.then(res=>{
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
			hidePopup () {
				this.showTab()
				this.showPopup = false
			},
			SetUserStatus (v) {
				api(this.uid,{srv: "user_user",cmd: "set_user_info"},{prop:'role',hspid:0,value:'',type:v,department:''})
				.then(res => {
					res = res.data
					if (res.result !=0 ) {
						this.toast(res.msg)
					}else{
						// switch(v){
						// 	case 1:this.type='医生';break;
						// 	case 2:this.type='医院管理者';break;
						// 	case 3:this.type='药师';break;
						// 	case 4:this.type='护士';break;
						// 	case 5:this.type='医学生';break;
						// 	case 9:this.type='其他';break;
						// }
						this.$nextTick(function(){
							this.setUserInfo({type:v})
						})
					}
				})
				this.hidePopup()
			}
		},
		computed: {
			...mapGetters(['uid','userInfo']),
			authClass () {
				switch(this.userInfo.authFlag){
					case 0:return 'un-auth';break;
					case 1:return 'authed';break;
					case 2:return 'auth-failed';break;
					case 3:return 'authing';break;
					default:return 'un-auth';
				}
			}
		},
		filters: {
			type (v) {
				switch(v){
					case 1:return'医生';break;
					case 2:return'医院管理者';break;
					case 3:return'药师';break;
					case 4:return'护士';break;
					case 5:return'医学生';break;
					case 9:return'其他';break;
				}
			}
		},
		watch:{

		},
		beforeRouteLeave (to ,from, next) {
			this.showTab()
			next()
		}
	}
</script>
<style lang="less">
.header{
	padding: 10px;
	border-bottom: 1px solid #f0f0f0;
	img{
		width: 54px;
		height: 54px;
		border-radius: 27px;
	}
	span{
		font-size: 16px;
	}
}
.setting{
	font-size: 16px;
	input,select{
		color: #7e7e7e;
		border: none;
		margin-left: 15px;
	}
	select{
		appearance:none;
		-moz-appearance:none;
		-webkit-appearance:none;
		border: solid 1px #fff;
		text-align: right;
	}
}
.setting-item-right{
	color: #7e7e7e;
	font-size: 14px;
}
.setting-sex {
	width: 100%;
}
.tag{
    padding: 3px 7px;
    font-size: 14px;
    // line-height: 2.4rem;
    text-align: right;
    color: #fff;
    border-radius: 3px;
    display: block;
    &.un-auth{
    	background-color: #adadad;
    }
    &.authing{
    	background-color: #83cc52;
    }
    &.authed{
    	background-color: #fff990;
    }
    &.auth-failed{
    	background-color: #ff0000;
    }
}
.btn-auth{
	color: #fff;
	display: block;
    background-color: #d9534f;
    border-color: #d43f3a;
    border-radius: 5px;
    padding: 10px;
    font-size: 13px;
    width: 90%;
    margin: 10px auto;
}
.popup-content{
	height: 100%;
}
</style>