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


export const throttle = function (delay, action) {
    var last = 0
    return function(){
        var curr = +new Date()
        if (curr - last > delay){
          action.apply(this, arguments)
          last = curr 
        }
    }
}