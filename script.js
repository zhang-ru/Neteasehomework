//cookie相关函数
    //获取cookie
    function getCookie () {
        var cookie = {};
        var all = document.cookie;
        if (all === '')
            return cookie;
        var list = all.split('; ');
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var p = item.indexOf('=');
            var name = item.substring(0, p);
            name = decodeURIComponent(name);
            var value = item.substring(p + 1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return cookie;
    }
    //设置cookie
    function setCookie (name, value, expires, path, domain, secure) {
        var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        var today = new Date();
        today.setDate(today.getDate() + expires);
        if (expires)
            cookie += '; expires=' + today.toGMTString();
        if (path)
            cookie += '; path=' + path;
        if (domain)
            cookie += '; domain=' + domain;
        if (secure)
            cookie += '; secure=' + secure;
        document.cookie = cookie;
    }
    //移除cookie
    function removeCookie (name, path, domain) {
        document.cookie = name + '='
        + '; path=' + path
        + '; domain=' + domain
        + '; max-age=0';
    }
//事件兼容性函数
var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
                element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
             element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
};

// 封装ajax
function ajax(obj){
	// create xhr object
	var xhr=new XMLHttpRequest();
	// 给url加随机参数，防止缓存;
	// obj.url=obj.url+'?t='+new Date().getTime();
	//给data进行格式化
	obj.data=(function(data){
		var arr=[];
		for(var i in data){
			arr.push(encodeURIComponent(i)+'='+encodeURIComponent(data[i]));
		}
		return arr.join('&');
	})(obj.data);
	// 判断get参数
	if(obj.method === 'get'){obj.url+=obj.url.indexOf('?') == -1? '?'+obj.data:'&'+obj.data};
	if(obj.async ===true){
		xhr.onreadystatechange = function(){
			if(xhr.readyState ==4){
				callback();
			}
		}
	}

	xhr.open(obj.method,obj.url,obj.async);
	if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);    
    } else {
        xhr.send();
    }
    if (obj.async === false) {
        callback();
    }
    //回调函数
    function callback() {
        if (xhr.status == 200) {
            obj.success(xhr.responseText);            //回调传递参数
        } else {
            alert('错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
        }    
    }
}
//获取课程列表成功函数
function ajax_success(data){
    var _data= JSON.parse(data);

        var oDiv = document.getElementById("courselist_ajax");

        for(i=0;i<_data.list.length;i++){
            var oLi = document.createElement("li");
            oLi.setAttribute("class","main_course");
            oDiv.appendChild(oLi);

            var _img = document.createElement("img");
            var _description = document.createElement("p");
            var _name = document.createElement("p");
            var _follower = document.createElement("p");
            var _price = document.createElement("p");

            _img.setAttribute("class", "main_course_pic");
            _img.setAttribute("src", _data.list[i].middlePhotoUrl);

            _description.setAttribute("class","course_intro");
            _description.innerHTML=_data.list[i].description;

            _name.setAttribute("class", "course_teacher");
            _name.innerHTML=_data.list[i].provider;

            _follower.setAttribute("class","course_follower");
            _follower.innerHTML=_data.list[i].learnerCount;

            _price.setAttribute("class","course_price");
            _price.innerHTML='￥'+_data.list[i].price;

            oLi.appendChild(_img);
            oLi.appendChild(_description);
            oLi.appendChild(_name);
            oLi.appendChild(_follower);
            oLi.appendChild(_price);
            
        }
}
//课程列表ajax
ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/couresByCategory.htm',
    data : {
        'pageNo':'2',
        'psize':'20',
        'type':'10'
    },
    success : ajax_success,
    async : true
});
//热门推荐ajax
ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/couresByCategory.htm',
    data : {
        'pageNo':'1',
        'psize':'10',
        'type':'10'
    },
    success : function (data) {
        var _data= JSON.parse(data);

        var oDiv = document.getElementById("side_courselist_ajax");

        for(i=0;i<_data.list.length;i++){
            var oLi = document.createElement("li");
            oDiv.appendChild(oLi);

            var _img = document.createElement("img");
            var _description = document.createElement("p");
            var _follower = document.createElement("p");

            _img.setAttribute("class", "side_course");
            _img.setAttribute("src", _data.list[i].smallPhotoUrl);

            _description.setAttribute("class","side_course_title");
            _description.innerHTML=_data.list[i].description;

            _follower.innerHTML=_data.list[i].learnerCount;

            oLi.appendChild(_img);
            oLi.appendChild(_description);
            oLi.appendChild(_follower);
            
        }
    },
    async : true
});
//登录
// ajax({
//     method : 'get',
//     url : 'http://study.163.com/webDev/login.htm',
//     data : {
//         'userName' : md5('studyOnline'),
//         'password' : md5('study.163.com')
//     },
//     success : function(data){
//         if(data == '1'){alert('login success')}
//         else{alert('login failed')}
//     },
//     async : true
// }
// )
//判断不再提醒cookie
var nomore_reminder=document.getElementById('noReminderButton');
var noReminderBar=document.getElementById('noMoreReminder');
var no_reminder;
EventUtil.addHandler(nomore_reminder,'click', function(){
    setCookie('no_reminder',1,5);
    noReminderBar.style.display='none';
})
if(getCookie()['no_reminder'] == '1'){
    noReminderBar.style.display='none';
}

//关注

var guanzhu_button=document.getElementsByClassName('guanzhu')[0];
var alreadyguanzhu=document.getElementsByClassName('alreadyguanzhu')[0];
var follower_num =document.getElementsByClassName('follower')[0];
    //关注按钮添加事件
EventUtil.addHandler(guanzhu_button,'click',function(){
    ajax({
        method : 'get',
        url : 'http://study.163.com/webDev/attention.htm',
        data : null,
        success : function (data) {
            if(data == '1'){
                alreadyguanzhu.style.display='block';
                guanzhu_button.style.display='none';
                follower_num.innerHTML="粉丝 46";
                setCookie('followSuc',1);
            }
        },
        async : true
    })
})
    //判断cookie中是否已经关注
if(getCookie()['followSuc'] == '1'){
    alreadyguanzhu.style.display='block';
    guanzhu_button.style.display='none';
}else{
    alreadyguanzhu.style.display='none';
    guanzhu_button.style.display='block';
}
//取消关注
var cancelguanzhu=document.getElementById('cancelguanzhu');
EventUtil.addHandler(cancelguanzhu,'click',function(){
    alreadyguanzhu.style.display='none';
    guanzhu_button.style.display='block';
    setCookie('followSuc',0);
})