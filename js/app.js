'use strict';

angular.module('chafangbao', ['ionic','chafangbao.controllers', 'chafangbao.services','chafangbao.factories','chafangbao.filters','chart.js','ngAnimate'])

.run(function($rootScope,$ionicPlatform,$ionicActionSheet,$state,$window,$ionicLoading,$timeout) {
	$ionicPlatform.ready(function () {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		if ($rootScope.preventDefault){
			document.body.addEventListener("touchmove", function (e) {
				e.preventDefault();
			});
		}
	});
	
	//什么意义?
	if (debug) {
		$rootScope.debug = true;
	} else {
		$rootScope.debug = false;
	}
	
	$rootScope.co2CheckModel = "检测模式";
	$rootScope.deviceMsg = {
		"content":'',
		"show":false
	}
	//
	// = 全局函数集 =
	//
	var Fn = $rootScope.Fn = {
		//触发震动交互
		shake : function () {
			Android_do_cmd("onVibrator");
		},
		//暂停声音播放
		stop_Voice : function () {
			Android_do_cmd("stopSpeaking");
		},
		setCfg: function (Key, Val, Callback) {
			var val;
			if (Callback == "delay") {
				
			}
			else {
				if (debug) {
					localStorage.setItem(Key, Val);
				} else {
					Android.setcfg(Key, Val);
				}
				try {
					val = eval("(" + Val + ")");
				} catch (e) {
					val = Val;
				}
				if (Callback == "broadcast") {
					$rootScope.$apply(function () {
						console.log("setCfg", Key, val);
						Pad_user.infoList[Key] = val;
					});
				} else {
					console.log(Key, val);
					Pad_user.infoList[Key] = val;
				}
			}
		},
		//获取配置
		getCfg : function (Key) {
			if (debug) {
				return localStorage.getItem(Key);
			} else {
				return Android.getcfg(Key);
			}
		 }
	};

	//登录的用户信息
	var Pad_user = $rootScope.Pad_user = {
		infoList : {
			"name" : "",
			"id" : "",
			"token" : "",
			"icon" : "",
			"address" : "",
			"Height" : "",
			"Sex" : "",
			"Weight":"",
			"Age":"",
			"desktop" : "",
			"devices" : "",
			"role" : "",
			"allow_voice" : "",
			"allow_shake" : "",
			"voice" : "",
			"pet" : "",
			"friends" : "",
			"videos" : "",
			"weather" : ""
		}
	};
	
	//定义全局事件
	//$window.location.href = '#/index';

	var nowTime = new Date();
	$rootScope.nowTime = nowTime.valueOf();
	if (Android.getcfg("loginTime")) {
		if ($rootScope.nowTime > parseInt(Android.getcfg("loginTime"))+1800000) {
			$rootScope.availableTime = false; //有效时间已过
		} else {
			//有效时间已过
			$rootScope.availableTime = true; 
		}
	} else {
			//不存在之前登陆时间
			$rootScope.availableTime = false; 
		}

	$rootScope.islogin = false;
	if(Android.getcfg("userName") && Android.getcfg("passWord")){  	
		//判断有没有本地存储的账号密码，如果有就去本地拿
		$rootScope.userName = Android.getcfg("userName");
		$rootScope.passWord = Android.getcfg("passWord");
		if ($rootScope.availableTime) {
		    $rootScope.islogin = true;
		}
	} else {
		//如果没有就自己定义
		$rootScope.islogin = false;
		$rootScope.userName = "admin";  //初始化
		$rootScope.passWord = "123";
	}

	if (!$rootScope.islogin || !$rootScope.availableTime) {
		//时间过期或者没有登陆就会回到登陆页面
		$window.location.href = '#/login';
	}


})

.config(function($stateProvider, $urlRouterProvider,$locationProvider,$ionicConfigProvider,$httpProvider) {
	
	//为了解决不同手机的布局问题,因为本项目没有用到ionic的差异布局,这里写不写都没有关系
	$ionicConfigProvider.platform.ios.tabs.style('standard'); 
	$ionicConfigProvider.platform.ios.tabs.position('bottom');
	$ionicConfigProvider.platform.android.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.position('bottom');
	$ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
	$ionicConfigProvider.platform.android.navBar.alignTitle('center');
	$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
	$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
	$ionicConfigProvider.platform.ios.views.transition('ios'); 
	$ionicConfigProvider.platform.android.views.transition('android');

	//路由定义的JSON
	if(!window.rootPath)
		window.rootPath = '/web/hos/';
	var stateArray = {
		index:{
			url: '/index',
			controller: 'IndexController',
			location: Android.getURL(window.rootPath + 'templates/index.html')
		},
		setting:{
			url: '/setting',
			location: Android.getURL(window.rootPath + 'templates/setting.html'),
			controller: 'SettingController'
		},
		setting_password:{
			url: '/setting_password',
			location: Android.getURL(window.rootPath + 'templates/setting_password.html'),
			controller: 'SettingController'
		},
		setting_information:{
			url: '/setting_information',
			location: Android.getURL(window.rootPath + 'templates/setting_information.html'),
			controller: 'SettingController'
		},
		setting_language:{
			url: '/setting_language',
			location: Android.getURL(window.rootPath + 'templates/setting_language.html'),
			controller: 'SettingController'
		},
		login:{
			url:'/login',
			location:Android.getURL(window.rootPath + 'templates/login.html'),
			controller:'LoginController'
		},
		addperson:{
			url:'/addperson',
			location:Android.getURL(window.rootPath + 'templates/addperson.html'),
			controller:'AddPersonController'
		},
		check:{
			url: '/check',
			location: Android.getURL(window.rootPath + 'templates/check.html'),
			controller: 'CheckController'
		},
		check_co2:{
			url: '/check_co2',
			location: Android.getURL(window.rootPath + 'templates/check_co2.html'),
			controller: 'CheckCo2Controller'
		},
		checkset:{
			url: '/checkset',
			location: Android.getURL(window.rootPath + 'templates/checkset.html'),
			controller: 'CheckSetController'
		},
		checkset_1:{
			url: '/checkset_1',
			location: Android.getURL(window.rootPath + 'templates/checkset_1.html'),
			controller: 'CheckSetController'
		},
		checkset_2:{
			url: '/checkset_2',
			location: Android.getURL(window.rootPath + 'templates/checkset_2.html'),
			controller: 'CheckSetController'
		},
		checkset_3:{
			url: '/checkset_3',
			location: Android.getURL(window.rootPath + 'templates/checkset_3.html'),
			controller: 'CheckSetController'
		},
		checkset_4:{
			url: '/checkset_4',
			location: Android.getURL(window.rootPath + 'templates/checkset_4.html'),
			controller: 'CheckSetController'
		},
		checkset_5:{
			url: '/checkset_5',
			location: Android.getURL(window.rootPath + 'templates/checkset_5.html'),
			controller: 'CheckSetController'
		},
		checkset_6:{
			url: '/checkset_6',
			location: Android.getURL(window.rootPath + 'templates/checkset_6.html'),
			controller: 'CheckSetController'
		},
		check_report:{
			url: '/check_report',
			location: Android.getURL(window.rootPath + 'templates/check_report.html'),
			controller: 'CheckReportController'
		},
		checkreport:{
			url: '/checkreport',
			location: Android.getURL(window.rootPath + 'templates/checkreport.html'),
			controller: 'CheckReportController'
		},
		checkreport_1:{
			url: '/checkreport_1',
			location: Android.getURL(window.rootPath + 'templates/checkreport_1.html'),
			controller: 'CheckReportDetailController'
		},
		checkreport_2:{
			url: '/checkreport_2',
			location: Android.getURL(window.rootPath + 'templates/checkreport_2.html'),
			controller: 'CheckReportDetailController'
		},
		checkreport_3:{
			url: '/checkreport_3',
			location: Android.getURL(window.rootPath + 'templates/checkreport_3.html'),
			controller: 'CheckReportDetailController'
		}
	}
	//判断是用使用templateUrl还是template(在debug环境下,Android.getURL返回的是资源的URL,所以需要使用templateUrl定义路由;
	//而在安卓环境下Android.getURL返回的是资源文件的内容,则需要用template来定义路由.
	if(debug){
		for(var i in stateArray){
			stateArray[i]['templateUrl'] = stateArray[i].location;
		}
	}else{
		for(var i in stateArray){
			stateArray[i]['template'] = stateArray[i].location;
		}
	}
	//页面路由设置
	$stateProvider
	.state('index',stateArray['index'])//主页面
	.state('setting',stateArray['setting'])//系统设置
	.state('setting_password',stateArray['setting_password'])//系统设置——密码设置
	.state('setting_information',stateArray['setting_information'])//系统设置————医院信息
	.state('setting_language',stateArray['setting_language'])//系统设置——语言设置
	.state('login',stateArray['login'])//登陆
	.state('addperson',stateArray['addperson'])//添加病人
	.state('check',stateArray['check'])//检查
	.state('check_co2',stateArray['check_co2'])//检查co2
	.state('checkset',stateArray['checkset'])//检查-设置
	.state('checkset_1',stateArray['checkset_1'])//检查-设置-1
	.state('checkset_2',stateArray['checkset_2'])//检查-设置-2
	.state('checkset_3',stateArray['checkset_3'])//检查-设置-3
	.state('checkset_4',stateArray['checkset_4'])//检查-设置-4
	.state('checkset_5',stateArray['checkset_5'])//检查-设置-5
	.state('checkset_6',stateArray['checkset_6'])//检查-设置-6
	.state('check_report',stateArray['check_report'])//检查-报告选择
	.state('checkreport',stateArray['checkreport'])//检查-报告
	.state('checkreport_1',stateArray['checkreport_1'])//检查-报告-内容1
	.state('checkreport_2',stateArray['checkreport_2'])//检查-报告——内容2
	.state('checkreport_3',stateArray['checkreport_3'])//检查-设置-7
	;$urlRouterProvider.otherwise('/login');
});

angular.module('chafangbao.controllers',[]);
angular.module('chafangbao.services',[]);
angular.module('chafangbao.directives',[]);
angular.module('chafangbao.factories',[]);
angular.module('chafangbao.filters',[]);