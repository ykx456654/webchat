//生成随机字符串
export const randomStr = function (len) {
    var result = '',
        charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    len = len || 20;
    while (len--) {
        result += charts[Math.ceil(Math.random() * charts.length - 1)];
    }
    return result;
}


export const  setCookie = function(name,value){
  	var Days = 30;
  	var exp = new Date();
  	exp.setTime(exp.getTime() + Days*24*60*60*1000);
  	document.cookie = name + "="+ value + ";expires=" + exp.toGMTString();
}

export const getCookie = function (name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}

export const delCookie = function(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}


export const getUrlParam = function  (name) {
    var parmsStr = window.location.search.substring(1)
    var parmsArr = parmsStr.split('&')
    var parms = {}
    for (var i = 0; i < parmsArr.length; i++) {
      parms[parmsArr[i].split('=')[0]] = parmsArr[i].split('=')[1]
    }
    return parms[name]
}




export const throttle = function(method,delay,duration){
    var timer=null, begin=new Date();
    return function(){
        var context=this, args=arguments, current=new Date();;
        clearTimeout(timer);
        if(current-begin>=duration){
             method.apply(context,args);
             begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
}



export const setPPT = function (current, actionList) {
	// console.log(actionList)
	return actionList.reduce((previousValue, currentValue, currentIndex, array1)=>{
		if(previousValue.actionTime >= current){
			return Object.assign({},previousValue,{next:1})
		}
		if(previousValue.actionTime < current && currentValue.actionTime >= current ){
			return Object.assign({},currentValue,{next:2})
		}
		if(current > currentValue.actionTime){
			return Object.assign({},currentValue,{next:1})
		}
		return 
	})
	// next 取值1 pageFrom  取2 pageTo
}


	// Get time format
 export const timeFormat = function(time,showHour) {
		// Video's duration is Infinity in GiONEE(金立) device
		if (!isFinite(time) || time < 0) {
			time = 0;
		}
		// Get hours
		var _time = showHour ? [0] : [];
		if (Math.floor(time / 3600) % 24) {
			_time.push(Math.floor(time / 3600) % 24)
		}
		// Get minutes
		_time.push(Math.floor(time / 60) % 60);
		// Get seconds
		_time.push(Math.floor(time % 60));
		_time = _time.join(':');
		// Fill '0'
		
		_time = _time.replace(/(:|^)([0-9])(?=:|$)/g, '$10$2')
		

		return _time
	};
