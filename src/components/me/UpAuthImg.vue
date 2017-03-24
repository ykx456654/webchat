<template>
	<div >
		<x-header title="上传认证图片">
			<router-link to="/Auth" slot="left">
				<!-- <img src="../../assets/images/back2.png"> -->
				<i class="icon icon-arrow-back"></i>
			</router-link>
		</x-header>
		<div class="auth-upload ">
			<div class="auth-up-tip flex align-items-center">
				<img src="../../assets/images/iconfont-shangchuan.png">
				<p>请上传下面的图片</p>
			</div>
			<div class="auth-up-sel">
				<select v-model="selectValue">
					<option value="0">医护执业证照片页+个人信息页</option>
					<option value="1">工牌+身份证正面照片</option>
				</select>
			</div>
			<div class="auth-up-tip flex align-items-center">
				<img src="../../assets/images/iconfont-pic.png">
				<p>图片示例</p>
			</div>
			<div class="auth-up-example">
				<div class="clearfix" v-show="selectValue == 0">
					<img src="../../assets/images/wo_renzhen_a_01.jpg">
					<img src="../../assets/images/wo_renzhen_a_02.jpg">
				</div>
				<div class="clearfix" v-show="selectValue == 1">
					<img src="../../assets/images/wo_renzhen_b_01.jpg">
					<img src="../../assets/images/wo_renzhen_b_02.png">
				</div>
			</div>
			<h5 class="auth-rule">
				 请确保姓名、职称、头像等信息清晰可见，上传资料仅用于认证，其他用户及第三方不可见 
			</h5>
			<div class="img-priview">
		        <div class="privew-item">
		          	<div class="item-inner1 flex align-items-center justify-center"  @click="chooseImage(1)">
		          		<spinner v-show="statu1 == 0"></spinner>
		            	<i v-show="statu1 == 1">+</i>
		            	<img v-show="statu1 == 2" :src="imgData1"/>
		          	</div>
		        </div>
	        	<div class="privew-item flex align-items-center justify-center">
	          		<div class="item-inner2" @click="chooseImage(2)">
		          		<spinner v-show="statu2 == 0"></spinner>
		            	<i v-show="statu2 == 1">+</i>
		            	<img v-show="statu2 == 2"  :src="imgData2"/>
	          		</div>
	        	</div>
	        	<div class="input-group">
	        		<input type="file" @change="imgCrop" id="upLoad" accept="image/*" >
	        	</div>
	    	</div>
	    	<div class="img-tips">
		        <div class="img-tip1">
		            <div class="tips-inner" v-if="selectValue == 0">医护执业证照片页</div>
		            <div class="tips-inner" v-if="selectValue == 1">工牌</div>
		        </div>
		        <div class="img-tip2">
		          	<div class="tips-inner" v-if="selectValue == 0">个人信息页</div>
		          	<div class="tips-inner" v-if="selectValue == 1">身份证正面照</div>
		        </div>
		    </div>
		    <!-- <button @click="chooseImage">upload</button> -->
		</div>
	</div>
</template>
<script>
import {Header,Spinner} from 'mint-ui'
import {api} from '../../utils/api.js'
import { mapMutations ,mapGetters,mapActions} from 'vuex'
import {Group,Selector} from 'vux'
import EXIF from 'exif-js'
	export default {
		components:{
			xHeader:Header,Group,Spinner
		},
		created () {
			this.hideLoad()
		},
		data () {
			return {
				selectValue:'0',
				active:'',
				imgData1:'',
				imgData2:'',
				statu1:1,
				statu2:1,
				filename1:'',
				filename2:''
			}
		},
		computed :{
			...mapGetters(['uid']),
			system () {
				return this.$store.state.system
			}
		},
		methods:{
			...mapMutations(['hideLoad','showLoad']),
			chooseImage (n) {
				var obj = document.getElementById('upLoad')
				if (obj) {
					this.active = n
					obj.value=""
					obj.click()
				}
			},
			imgCrop () {
				var imgD = document.getElementById('crop-img')
				if (imgD) {
					document.body.removeChild(imgD)
				}
				var self = this
				var f = document.getElementById('upLoad').files[0]
				var filename = f.name
				if (this.active == 1) {
					this.filename1 = filename
				}else{
					this.filename2 = filename
				}
				var src =window.URL.createObjectURL(f)
				var size =  f.size / 1024
				var natureSizeW,natureSizeH;
				var img = new Image()
				img.src = src
				img.crossOrigin='Anonymous'
				new Promise(function(resolve,reject){
					img.onload = function(){
						EXIF.getData(this,function(){
		                    var o =  EXIF.getTag(this,'Orientation');
		                    var width = natureSizeW = this.width
		        			var height = natureSizeH = this.height
		        			var data = {o,width,height}
		                  	resolve(data)
		                })
					}
				})
				.then(data=>{
		            var c = document.createElement('canvas')
		            var ctx = c.getContext("2d")
					if ([5,6,7,8].indexOf(data.o) > -1) {
				      c.width = data.height;
				      c.height = data.width;
				    } else {
				      c.width = data.width;
				      c.height = data.height;
				    }
				    if (data.o) {
				    	var width = data.width
				    	var height = data.height
				    	switch (data.o) {
					      	case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
					      	case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
					      	case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
					      	case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
					      	case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
					      	case 7: ctx.transform(0, -1, -1, 0, height , width); break;
					      	case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
					      	default: ctx.transform(1, 0, 0, 1, 0, 0);
					    }
					}
				    ctx.drawImage(img, 0, 0);
				    var base64
				    switch(true){
				    	case size < 200:
				    		base64 = c.toDataURL('image/jpeg',1)
				    	break;
				    	case size >= 200 && size < 1000:
				    		base64 = c.toDataURL('image/jpeg',0.4)
				    	break;
				    	case size >= 1000 && size < 2000:
				    		base64 = c.toDataURL('image/jpeg',0.2)
				    	break;
				    	case size >=2000 && size < 5000:
				    		base64 = c.toDataURL('image/jpeg', 0.08)
				    	break;
				    	case size >= 5000:
				    		base64 = c.toDataURL('image/jpeg',0.05)
				    	break;
				    }
				    this['statu'+this.active] = 0
				   	api(this.uid,{ srv: "user_user",cmd: "auth_pic"},{data:base64.split(',')[1],filename:filename,status:'single'})
				   	.then(res => {
				   		res = res.data
				   		this['statu'+this.active] = 2
				   		// res.
				   	})
				})
			}
		}
	}

function convertBase64UrlToBlob(urlData){  
      
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
      
    //处理异常,将ascii码小于0的转换为大于0  
    var ab = new ArrayBuffer(bytes.length);  
    var ia = new Uint8Array(ab);  
    for (var i = 0; i < bytes.length; i++) {  
        ia[i] = bytes.charCodeAt(i);  
    }  
  
    return new Blob( [ab] , {type : 'image/jpeg'});  
}  

</script>
<style lang="less" scoped>
	.auth-upload{
		padding: 0 10px;
	}
	.auth-up-tip{
		font-size: 16px;
		margin: 10px 0px;
		img{
			width: 20px;
			height: 20px;
			margin-right: 15px;
		}
	}
	.auth-up-sel{
		width: 100%;
		font-size: 16px;
		select{
			width: 100%;
			border: none;
			background-color: #f1f1f1;
			color: #666;
			padding: 10px 5px;
		}
	}
	.auth-up-example{
		>div{
			width: 100%;
			img{
				width: 50%;
				display: inline-block;
				padding: 3px;
				box-sizing: border-box;
				float: left;
			}
		}
	}
	.auth-rule{
		background-color: #f1f1f1;
		text-align: left;
		font-size: 14px;
		padding: 10px;
		font-weight: normal;
	}
	.img-priview {
      overflow: hidden;
      .input-group {
        display: none;
      }
      .privew-item {
        float: left;
        width: 50%;
        height: 120px;
        margin-top: 10px;
        position: relative;
        .item-inner1 {
          width: 100px;
          height: 100px;
          border: 1px dashed #cab2b2;
          position: absolute;
          top: 0;
          right: 15px;
          i {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            display: block;
            text-align: center;
            font-size: 70px;
            color: #cab2b2;
          }
          img {
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 100px;
          }
        }
        .item-inner2 {
          width: 100px;
          height: 100px;
          border: 1px dashed #cab2b2;
          position: absolute;
          top: 0;
          left: 15px;
          i {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            display: block;
            text-align: center;
            font-size: 70px;
            color: #cab2b2;
          }
          img {
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 100px;
          }
        }
      }
    }
    .img-tips {
      overflow: hidden;
      width: 100%;
      font-size: 12px;
      .img-tip1 {
        width: 50%;
        float: left;
        position: relative;
        height: 30px;
        .tips-inner {
          position: absolute;
          top: 0;
          right: 15px;
          width: 100px;
          text-align: center;
        }
      }
      .img-tip2 {
        width: 50%;
        float: left;
        position: relative;
        height: 30px;
        .tips-inner {
          position: absolute;
          top: 0;
          left: 15px;
          width: 100px;
          text-align: center;
        }
      }
    }
</style>