'use strict';


angular.module('chafangbao.services')
.service('kfLogin', function ($interval) {
	var username = localStorage.getItem('username');
	var password = localStorage.getItem('password');
	var autologin = true;
	if (localStorage.getItem('autologin') == '0')
		autologin = false;

	var isLogin = false;
	var timer;
	var refreshInterval = 10 * 60 * 1000;
	var userinfo;

	//定义接口
	//登录
	var login = function (user, pwd, cb, auto, callback) {
		console.log('正在登录系统...');
		oauth2.jsonp.login(user, pwd, function (r) {

			//判断是否登录失败，失败则回调，然后返回
			if (r.errcode) {
				console.log('登录失败，洗洗睡吧');
				if (cb)
					cb(r);
				localStorage.removeItem('userinfo');
				return;
			}

			autologin = true;
			username = user;
			password = pwd;
			userinfo = r;
			isLogin = true;
			
			//登录成功，执行回调函数
			console.log("callback" + callback)
			callback();
			
			//成功,写入localStorage
			console.log('登录成功');
			/* window.location.href = "#/chatlist_page"; */
			window.location.href = "#/home_page";

			console.log(r, r.uid.T[0].uid, r.uid.T[0].username);

			if (debug == "true") {
				localStorage.setItem('username', user);
				localStorage.setItem('password', pwd);
				localStorage.setItem('userinfo', JSON.stringify(r));
			} else if (debug == "false") {
				//登录的时候就记录用户数据
				安卓设置键值对("userinfo", JSON.stringify(r))
				安卓设置键值对("id", r.uid.T[0].uid)
				安卓设置键值对("name", r.uid.T[0].username)
				/* //用alert检测一下设置是否成功
				alert(安卓用键获取值("userinfo")) */
			}

			/* localStorage.setItem('user_id', r.uid.T[0]); */
			if (auto)
				localStorage.setItem('autologin', '1');
			else
				localStorage.setItem('autologin', '0');

			timer = $interval(function () {
					refresh();
				}, refreshInterval);

			//通知后台，用户已登录
			Android.onBtnLoginClick(r.uid.T[0].uid, r.uid.T[0].username);

			if (cb)
				cb(r);
		});
	};

	var _copyObj = function (obj1, obj2) {
		var i;
		for (i in obj1) {
			if (typeof obj1[i] == 'Object')
				copyObj(obj1[i], obj2[i]);
			else
				obj1[i] = obj2[i];
		}
	}

	//判断是否登录
	var checkLogin = function () {
		return isLogin;
	};

	//更新用户信息
	var refresh = function () {
		if (autologin == true) {
			console.log('更新token');
			oauth2.jsonp.login(username, password, function (r) {
				//判断是否登录失败，失败则回调，然后返回
				if (r.errcode) {
					userinfo = undefined;
					localStorage.removeItem('userinfo');
					isLogin = false;
					return;
				}
				localStorage.setItem('userinfo', JSON.stringify(r));
				_copyObj(userinfo, r);
			});
		}
	};

	//退出登录
	var logout = function () {
		localStorage.setItem('autologin', '0');
		isLogin = false;
	};

	var getLoginInfo = function () {
		return userinfo;
	}

	//开机登录
	if (autologin && username && password)
		login(username, password);

	return {
		login : login,
		logout : logout,
		//checkLogin: checkLogin
		getLoginInfo : getLoginInfo
	};
});
