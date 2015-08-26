window.onload=function(){
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
    //绑定事件
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    //移除事件
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

        var oUl = document.getElementById("courselist_ajax");
        oUl.innerHTML='';
        for(i=0;i<_data.list.length;i++){
            var oLi = document.createElement("li");
            oLi.setAttribute("class","main_course");
            oUl.appendChild(oLi);
            //创建子元素
            var _img = document.createElement("img");
            var _description = document.createElement("p");
            var _provider = document.createElement("p");
            var _follower = document.createElement("p");
            var _price = document.createElement("p");
            var _categoryName = document.createElement("p");
            var _name = document.createElement("p");

            //设置属性
            _img.setAttribute("class", "main_course_pic");
            _img.setAttribute("src", _data.list[i].middlePhotoUrl);

            _description.setAttribute("class","course_intro");
            _description.innerHTML=_data.list[i].description;

            _provider.setAttribute("class", "course_teacher");
            _provider.innerHTML=_data.list[i].provider;

            _follower.setAttribute("class","course_follower");
            _follower.innerHTML=_data.list[i].learnerCount;

            _price.setAttribute("class","course_price");
            _price.innerHTML='￥'+_data.list[i].price;

            _name.innerHTML=_data.list[i].name;

            _categoryName.innerHTML="分类: "+_data.list[i].categoryName;

            oLi.appendChild(_img);
            oLi.appendChild(_description);
            oLi.appendChild(_provider);
            oLi.appendChild(_follower);
            oLi.appendChild(_price);
            oLi.appendChild(_name);
            oLi.appendChild(_categoryName);
           _name.style.display='none';
           _categoryName.style.display='none';
            //课程鼠标悬浮
            oLi.onmouseover=function(){
                var _img = this.getElementsByTagName("img")[0];
                var _description = this.getElementsByTagName("p")[0];
                var _provider = this.getElementsByTagName("p")[1];
                var _follower = this.getElementsByTagName("p")[2];
                var _price =this.getElementsByTagName("p")[3]; 
                var _name =this.getElementsByTagName("p")[4]; 
                var _categoryName =this.getElementsByTagName("p")[5]; 
                var _usericon=document.createElement("img");

                this.setAttribute('class','main_course_hover');
                this.innerHTML='';
                this.appendChild(_img);
                this.appendChild(_name);
                this.appendChild(_follower);
                this.appendChild(_provider);
                this.appendChild(_categoryName);
                this.appendChild(_description);
                this.appendChild(_price);

                _price.style.display='none';
                _img.style.cssText='float:left;width: 219px; height: 122px;';
                _name.style.cssText='display:block; font:18px Microsoft Yahei; margin:15px 15px 15px 239px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;';
                _follower.style.cssText='background: url(images/usericon.png) no-repeat 1px; padding-left: 16px; font-size:12px; color:#666; margin:0 0 15px 239px;';
                _provider.style.cssText='font-size:12px; color:#666; margin:0 0 5px 239px;';
                _categoryName.style.cssText='font-size:12px; color:#666; margin:0 0 5px 239px;';
                _description.style.cssText='clear:both;font:14px/1.5 Microsoft Yahei; height:40px; color:#666; padding:20px 20px 20px; text-indent:2em; position:relative; bottom:0;overflow: hidden;text-overflow:ellipsis;';
                _categoryName.style.display='block';


                

            }
            //鼠标移出
            oLi.onmouseout=function(){
                this.setAttribute('class','main_course');
                var _img = this.getElementsByTagName("img")[0];
                var _description = this.getElementsByTagName("p")[4];
                var _provider = this.getElementsByTagName("p")[2];
                var _follower = this.getElementsByTagName("p")[1];
                var _price =this.getElementsByTagName("p")[5]; 
                var _name = this.getElementsByTagName("p")[0];
                var _categoryName =this.getElementsByTagName("p")[3]; 

                 _img.style.cssText='';
                _name.style.cssText='';
                _follower.style.cssText='';
                _provider.style.cssText='';
                _categoryName.style.cssText='';
                _description.style.cssText='';
                this.appendChild(_img);
                this.appendChild(_description);
                this.appendChild(_provider);
                this.appendChild(_follower);
                this.appendChild(_price);
                this.appendChild(_name);
                this.appendChild(_categoryName);
                _name.style.display='none';
                _categoryName.style.display='none';
                _price.style.display='block';
            }   
            
        }
}
//载入课程列表ajax
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
//载入热门推荐ajax函数
function hot_list_fun(data){
        var _data= eval(data);
        var oUl = document.getElementById("side_courselist_ajax");
        var timer=0;
            setInterval(function(){
                oUl.innerHTML='';
                    //5秒滚动一门课程
                    for(var i=timer+0;i<10+timer && i<20;i++){
                        var oLi = document.createElement("li");
                        
                        oUl.appendChild(oLi);

                        var _img = document.createElement("img");
                        var _name = document.createElement("p");
                        var _follower = document.createElement("p");

                        _img.setAttribute("class", "side_course");
                        _img.setAttribute("src", _data[i].smallPhotoUrl);

                        _name.setAttribute("class","side_course_title");
                        _name.innerHTML=_data[i].name;

                        _follower.innerHTML=_data[i].learnerCount;

                        oLi.appendChild(_img);
                        oLi.appendChild(_name);
                        oLi.appendChild(_follower);
                    
                     }
                     timer>=10?timer=10:timer++;
            },5000);

        
}
//页面加载后载入热门课程列表
ajax({
    method : 'get',
    url : 'http://study.163.com/webDev/hotcouresByCategory.htm',
    data : {},
    success : hot_list_fun,
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
 
// 回到首页
var backtopage1=function(){
    var page_aLi=page_list.getElementsByTagName('li');
    page_aLi[1].setAttribute('class','currentpage');
    for(var i =2;i<9;i++){
        page_aLi[i].removeAttribute('class');
    }
}
//tab 切换
var main_course_tab1=document.getElementById('main_course_tab1');
var main_course_tab2=document.getElementById('main_course_tab2');
//tab2切换绑定函数
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
    backtopage1();
});
//tab1切换绑定函数
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
    backtopage1();
});

//判断当前课程type
var page_type = function(){

    if(main_course_tab1.className=='main_course_tab_checked'){return '10'}
    else if(main_course_tab2.className=='main_course_tab_checked'){return '20';}
}
//判断当前页面API

 //判断当前点击页面并实现点击页面切换课程
 
 var page_list=document.getElementById('pageNo');
 var page_aLi=page_list.getElementsByTagName('li');
 for(var i=1;i<9;i++){
    
    page_aLi[i].onclick=function(){
        var currentPage=this.innerHTML;
        for(var i=1;i<9;i++){
            if(currentPage==i){page_aLi[i].setAttribute('class','currentpage')}
            else{page_aLi[i].removeAttribute('class');}
            ajax({
            method : 'get',
            url : 'http://study.163.com/webDev/couresByCategory.htm',
            data : {
                'pageNo':currentPage,
                'psize':'20',
                'type':page_type()
            },
            success : ajax_success,
            async : true
            });
        }
    }
 }
 //判断当前页面并设置左右翻页键
 var direct_left=document.getElementsByClassName('direct_left')[0];
 var direct_right=document.getElementsByClassName('direct_right')[0];
 //左翻页键函数
 direct_left.onclick=function(){
    var current_active_page=document.getElementsByClassName('currentpage')[0].innerHTML;

    if(current_active_page>=2){
        ajax({
            method : 'get',
            url : 'http://study.163.com/webDev/couresByCategory.htm',
            data : {
                'pageNo':current_active_page-1,
                'psize':'20',
                'type':page_type()
            },
            success : ajax_success,
            async : true
        });
        page_aLi[current_active_page].removeAttribute('class');
        page_aLi[current_active_page-1].setAttribute('class','currentpage');
    }
 }
 //右翻页键函数
 direct_right.onclick=function(){
    var current_active_page=document.getElementsByClassName('currentpage')[0].innerHTML;

    if(current_active_page<8){
        ajax({
            method : 'get',
            url : 'http://study.163.com/webDev/couresByCategory.htm',
            data : {
                'pageNo':++current_active_page,
                'psize':'20',
                'type':page_type()
            },
            success : ajax_success,
            async : true
        });
        page_aLi[current_active_page-1].removeAttribute('class');
        page_aLi[current_active_page].setAttribute('class','currentpage');
    }
 }
 
//点击侧栏机构介绍视频播放
var side_jigouIntro_video=document.getElementById('side_jigouIntro_video');
var up_video=document.getElementById('up_video');
EventUtil.addHandler(side_jigouIntro_video,'click',function(){
    mask.style.display='block';
    up_video.style.display="block";
});
//视频播放关闭按钮事件
var close_video=up_video.getElementsByClassName('close_button')[0];
EventUtil.addHandler(close_video,'click',function(){
    mask.style.display='none';
    up_video.style.display='none';
})

//轮播图
//获取元素
var banner_pic=document.getElementById('banner_pic');
var banner_pic_list=banner_pic.getElementsByClassName('bannerpic')[0];//ul
var banner_pic_lists=banner_pic_list.getElementsByTagName('li');
var browser_width=parseInt(document.documentElement.clientWidth);//获取窗口宽度
var quanquan_list=banner_pic.getElementsByClassName('quanquan')[0].getElementsByTagName('li');
var current_banner;


banner_pic.style.height=browser_width*0.2785+'px';//重置banner高度以适应屏幕

 

window.onresize=function(){
    browser_width=parseInt(document.documentElement.clientWidth);
    banner_pic.style.height=browser_width*0.2785+'px'; }
    //动画函数
    var num_count=0;
    var timer=setInterval(function(){

            banner_pic_lists[num_count%3].style.opacity=0;
            banner_pic_lists[(num_count+1)%3].style.opacity=1;

            //自动播放时圈圈自动变化
            for(var i=0;i<3;i++){
                quanquan_list[i].removeAttribute('class');
                if((num_count+1)%3 ==i){quanquan_list[i].setAttribute('class','checked')}
            }
            num_count++;
        },5000);
    //获得当前banner页面
    function getBannerPage(){
        for(var i=0;i<3;i++){
            if(banner_pic_lists[i].style.opacity==1){
                return banner_pic_lists[i].getAttribute('index');
            }
        }
    }
    //鼠标移入停止自动滚动 
    banner_pic.onmouseover=function(){
        clearInterval(timer);
        current_banner=getBannerPage();//保存当前页面
    }
    //鼠标移除重启自动滚动
    banner_pic.onmouseout=function(){
        current_banner=getBannerPage();
        num_count=current_banner;
        timer=setInterval(function(){
            banner_pic_lists[num_count%3].style.opacity=0;
            banner_pic_lists[(num_count+1)%3].style.opacity=1;
            //自动播放时圈圈自动变化
            for(var i=0;i<3;i++){
                quanquan_list[i].removeAttribute('class');
                if((num_count+1)%3 ==i){quanquan_list[i].setAttribute('class','checked')}
            };
            num_count++;
        },5000);
    }

    //点击圆圈切换banner
    for(var i=0;i<3;i++){
        EventUtil.addHandler(quanquan_list[i],'click',function(){
            var current_quanquan=this.getAttribute('index');
            for(var j=0;j<3;j++){
                
                if(j==current_quanquan){
                    banner_pic_lists[j].style.opacity=1;
                    quanquan_list[j].setAttribute('class','checked');
                    current_banner=j;
                }else{
                    banner_pic_lists[j].style.opacity=0;
                    quanquan_list[j].removeAttribute('class');
                }
            }
        })
    }


}