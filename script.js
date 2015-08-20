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
	var xhr = (function () {
        /*创建XMLHttpRequest对象*/
        if (typeof XMLHttpRequest != 'undefined') {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            // code for IE6, IE5
            var version = [
                                        'MSXML2.XMLHttp.6.0',
                                        'MSXML2.XMLHttp.3.0',
                                        'MSXML2.XMLHttp'
            ];
            for (var i = 0; version.length; i ++) {
                try {
                    return new ActiveXObject(version[i]);
                } catch (e) {
                    //跳过
                }    
            }
        } else {
            throw new Error('您的系统或浏览器不支持XHR对象！');
        }
    })();
	// 给url加随机参数，防止缓存;
	obj.url=obj.url+'?t='+new Date().getTime();
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
            alert('调用AJAX出错,错误代号：' + xhr.status + ' , 请稍后刷新重试!');
        }    
    }
}
//获取课程列表成功函数
function ajax_success(data){
    var _data= JSON.parse(data);

        var oDiv = document.getElementById("courselist_ajax");
        oDiv.innerHTML='';
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
        'pageNo':'1',
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

//判断不再提醒cookie
var nomore_reminder=document.getElementById('noReminderButton');
var noReminderBar=document.getElementById('noMoreReminder');
var no_reminder;
EventUtil.addHandler(nomore_reminder,'click', function(){
    setCookie('no_reminder',1,5);
    noReminderBar.style.display='none';
});
if(getCookie()['no_reminder'] == '1'){
    noReminderBar.style.display='none';
}



//关注

var guanzhu_button=document.getElementsByClassName('guanzhu')[0].getElementsByTagName('a')[0];
var alreadyguanzhu=document.getElementsByClassName('alreadyguanzhu')[0];
var follower_num =document.getElementsByClassName('follower')[0];
    //关注按钮添加事件
var guanzhu_ajax=function(){
    alreadyguanzhu.style.display='block';
    guanzhu_button.style.display='none';
    follower_num.innerHTML="粉丝 46";
    ajax({
        method : 'get',
        url : 'http://study.163.com/webDev/attention.htm',
        data : {},
        success : function (data) {
            if(data == '1'){
                alert('关注成功');
                setCookie('followSuc',1);
            }
        },
        async : true
    })
}

EventUtil.addHandler(guanzhu_button,'click',function() {
     if(getCookie()['loginSuc'] == '1'){guanzhu_ajax();}
     else{
        mask.style.display='block';
        loginBox.style.display='block';
     }
    });
    //判断cookie中是否已经关注
if(getCookie()['followSuc'] == '1'){
    alreadyguanzhu.style.display='block';
    guanzhu_button.style.display='none';
    follower_num.innerHTML="粉丝 46";
 }else{
    alreadyguanzhu.style.display='none';
    guanzhu_button.style.display='block';
    follower_num.innerHTML="粉丝 45";
}
//取消关注
var cancelguanzhu=document.getElementById('cancelguanzhu');
EventUtil.addHandler(cancelguanzhu,'click',function(){
    alreadyguanzhu.style.display='none';
    guanzhu_button.style.display='block';
    follower_num.innerHTML="粉丝 45";
    setCookie('followSuc',0);
    alert('取消关注成功');
});

//登陆
 var login_account=document.getElementById('login_account');
 var login_password=document.getElementById('login_password');
 var login_button=document.getElementById('login_button');
 var login_form=document.getElementById('login_form');
 var login_fun=function(){
    ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/login.htm',
    data : {
        'userName' : md5(login_account.value),
        'password' : md5(login_password.value)
    },
    success : function(data){
        if(data == '1'){
            alert('登录成功');
            mask.style.display='none';
            loginBox.style.display='none';
            setCookie('loginSuc',1);
            setCookie('followSuc',1);
            alreadyguanzhu.style.display='block';
            guanzhu_button.style.display='none';
            follower_num.innerHTML="粉丝 46";
        }
        else{alert('登录失败，请重试')}
        },
    async : true
    })
 }
EventUtil.addHandler(login_button,'click',login_fun);



 var mask=document.getElementById('mask');
 var loginBox=document.getElementById('login_box');
 var cancleLogin=loginBox.getElementsByClassName('close_button')[0];
 //关闭登录框
 EventUtil.addHandler(cancleLogin,'click',function(){
    mask.style.display='none';
    loginBox.style.display='none';
   
 });
 //判断当前页面
 var page_list=document.getElementById('pageNo');
 var page_aLi=page_list.getElementsByTagName('li');
 for(var i=1;i<page_aLi.length-1;i++){
    page_aLi[i].removeAttribute('class');
    EventUtil.addHandler(page_aLi[i],'click',function(){this.setAttribute('class','currentpage')})
 }
//tab 切换
var main_course_tab1=document.getElementById('main_course_tab1');
var main_course_tab2=document.getElementById('main_course_tab2');
EventUtil.addHandler(main_course_tab2,'click',function(){
    main_course_tab1.setAttribute('class','main_course_tab');
    main_course_tab2.setAttribute('class','main_course_tab_checked');
    ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/couresByCategory.htm',
    data : {
        'pageNo':'1',
        'psize':'20',
        'type':'20'
    },
    success : ajax_success,
    async : true
    });
});
EventUtil.addHandler(main_course_tab1,'click',function(){
    main_course_tab2.setAttribute('class','main_course_tab');
    main_course_tab1.setAttribute('class','main_course_tab_checked');

    ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/couresByCategory.htm',
    data : {
        'pageNo':'1',
        'psize':'20',
        'type':'10'
    },
    success : ajax_success,
    async : true
});
});