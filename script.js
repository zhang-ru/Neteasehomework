// 封装ajax
function ajax(obj){
	// create xhr object
	var xhr=new XMLHttpRequest();
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
            alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
        }    
    }
}
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