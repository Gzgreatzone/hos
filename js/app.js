'use strict';

angular.module('chafangbao', ['ionic','chafangbao.controllers', 'chafangbao.services','chafangbao.factories','ngCordova','ngAnimate'])

.run(function($rootScope,$ionicPlatform,$ionicActionSheet,$state,$window,$cordovaSQLite) {
	$ionicPlatform.ready(function () {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		if (window.cordova) {
			var  db = $cordovaSQLite.openDB({ name: "my.db" }); //device
		}
		else{
			var db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
		}
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
		document.body.addEventListener("touchmove", function (e) {
			if ($rootScope.preventDefault == "false") {}
			else {
				e.preventDefault();
			}
		});
		//debug
		//Android_do_cmd('qrcode');
	});

	if (debug == "true") {
		$rootScope.debug = true;
	} else if (debug == "false") {
		$rootScope.debug = false;
	}

	/* 函数工具集 */
	var Fn = $rootScope.Fn = {
		//触发震动交互
		shake : function () {
			Android_do_cmd("onVibrator");
		},
		//设置系统时间
		time_Set : function () {
			var current_time = moment();
			var Time = $rootScope.Time = {
				//H表示24小时制；h表示12小时制，只有个位数不显示高位，hh表示两位的12小时制，只有个位数高位显示0
				moment : current_time.format('H:mm'),
				//日期
				date : current_time.format('L'),
				//周几
				day : current_time.format('dd'),
				//控制当前显示气温，分为 上午/下午
				period : current_time.format('a')
			}
			if (Time.period == '上午' || Time.period == 'am') {
				Time.period = 'day';
			} else {
				Time.period = 'night';
			}
			console.log(Time);
		},
		//屏幕自适应
		selfAdaptation : function () {
			return {
				zoom : document.documentElement.clientHeight / 640
			}
		},
		//暂停声音播放
		stop_Voice : function () {
			Android_do_cmd("stopSpeaking");
		},
		//设置侧边栏按钮
		goBtn : function (Page) {
			if ($rootScope.can_jump == true) {
				console.log(Page);
				$state.go(Page);
			}
		},
		//事件推送模拟
		warm_Reminder : function () {
			var test_warmReminder = ['2', './images/devices/2.png', '，您要用血氧饱和度检测仪啦，要听话哟！'];

			$rootScope.warmReminder = {
				index : test_warmReminder[0],
				img : test_warmReminder[1],
				text : Pad_user.infoList.address + test_warmReminder[2]
			}

			合成语音($rootScope.warmReminder.text);
			$timeout(function () {
				$rootScope.warmReminder.text = '';
			}, 5000);
		},
		//获取未读消息
		getNoReadCount : function () {
			console.log("获取未读信息");
			var msg_noReadCount = Android_do_cmd("getMsgCount", "0"),
			event_noReadCount = Android_do_cmd("getNoReadCount", "0");

			if (msg_noReadCount == 0) {
				msg_noReadCount = '';
			}
			if (event_noReadCount == 0) {
				event_noReadCount = '';
			}
			for (var i in URLS) {
				var urlName = URLS[i]['name'];
				if (urlName == "chatlist_page") {
					URLS[i]['badge'] = msg_noReadCount;
				} else if (urlName == "remind_page") {
					URLS[i]['badge'] = event_noReadCount;
				}
			}
			console.log("未读消息：" + msg_noReadCount, "未读事件：" + event_noReadCount);
		},
		//事件提示(康复小子的事件提醒)
		event_Tips : function (Msg) {
			alert(JSON.stringify(Msg))
			var event_text = "请按时使用设备";
			console.log(event_text);
			合成语音(event_text);
			alert(event_text);
			//将本条推送写入sqlite
			Android_do_cmd("addEvnet", "1449152013373HIFJKQ", "亲，该吸氧了，准备好了没？今天要吸1小时", "/patientpage/images/face/happy.gif", "/patientpage/images/oxygen.png", "0", "0", "oxygen_o2_zl", "showDelMsg");
		},
		//写入设置
		setCfg: function (Key, Val, Callback) {
			var val;
			if (Callback == "delay") {
				
			}
			else {
				if (debug == "true") {
					localStorage.setItem(Key, Val);
				} else if (debug == "false") {
					安卓设置键值对(Key, Val);
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
			if (debug == "true") {
				return localStorage.getItem(Key);
			} else if (debug == "false") {
				return 安卓用键获取值(Key);
			}
		},
		//获取天气
		getWeather : function () {
			kfWeather.weather_update().then(function (Data) {
				Pad_user.infoList['weather'] = Data;
				Fn.setCfg('weather', JSON.stringify(Data));
			}, function (error) {
				if (debug == "true") {
					Fn.setCfg('weather', localStorage.getItem("weather"));
				} else if (debug == "false") {
					Fn.setCfg('weather', 安卓用键获取值("weather"));
				}
			}).then(function () {
				$rootScope.Weather = Pad_user.infoList['weather'];
				$rootScope.$broadcast("setCfg.weather")
			});
		},
		//Oauth认证(此处用不到)
		oauth2 : function (Msg, Uid, Type) {
			var oauth2_array = new Object;
			oauth2_array[Uid] = Pad_user.infoList.id;
			oauth2.jsonp.xcall(Msg, oauth2_array, Pad_user.infoList.token, function (r, b, c) {
				if (r.errcode) {
					$rootScope.errcode++
					alert("oauth2获取错误，我要刷新了");
					$state.go("login_page");
				} else {
					console.log("oauth2:拿到" + Type + "啦", r.T);
					Fn.setCfg(Type, JSON.stringify(r.T), "broardcast");
					return r.T;
				}
			})
		},
		//获取用户ID(此处也用不到)
		get_UserById : function (Uid) {
			var friends = Pad_user.infoList.friends;
			if (JSON.stringify(friends).indexOf(Uid) < 0) {
				console.log("该用户不存在！")
			} else {
				for (var i in friends) {
					if (Uid == friends[i]['uid']) {
						return friends[i];
					}
				}
			}
		},
		//获取用户列表(此处用不到)
		Get_list_info : function (id) {
			if (id == Pad_user.infoList.id) {
				if (Pad_user.infoList.icon.indexOf('http') < 0) {}
				return {
					uId : Pad_user.infoList.id || '',
					uAvatar : Pad_user.infoList.icon || '',
					uName : Pad_user.infoList.name || ''
				}
			} else if (Pad_user.infoList.devices.indexOf(id) >= 0) {
				console.log("这是一个事件提醒")
				return {
					uId : id || '',
					uName : id || ''
				}
			} else {
				var the_Userinfo = Fn.get_UserById(id);
				if (the_Userinfo) {
					//如果用户存在
					//如果不是网络图片，则用默认图片代替
					if (the_Userinfo.icon.indexOf('http') < 0) {}
					return {
						uId : the_Userinfo.uid || '',
						uAvatar : the_Userinfo.icon || '',
						uName : the_Userinfo.username || ''
					}
				} else {
					//如果不存在，默认为居家护理所
					return {
						uName : "居家护理所"
					}
				}

			}
		},
		//患者端Weather用的,不知道要来干嘛
		confirm_done : function (Scope, Fn) {
			try {
				//进入页面 直接赋值
				Fn();
			} catch (e) {
				console.error("第一次容错", e);
				//进入页面 页面进入后
				Scope.$on("$ionicView.enter", function () {
					try {
						Fn();
					} catch (e) {
						console.error("第二次容错", e);
						//$broadcast更新
						Scope.$on("setCfg.weather", function () {
							Fn();
						});
					}
				});
			}
		}
	};

	//患者端用户信息
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
		},
		//更新天气
		update_info : {
			"weather" : function () {
				Fn.getWeather();
			}
		},
		//获取信息
		get_info : function (Callback) {
			if (Callback && Callback.key) {
				this.get_data(Callback.key, "非循环");
			} else {
				for (var i in this.infoList) {
					this.get_data(i, "循环");
				}
				if (Callback && Callback.fn) {
					Callback.fn();
				}
			}
		},
		//??????
		get_data : function (Key, State) {
			if (State == "循环") {
				console.log("%c【" + State + "】 get_info()%c//正在获取 " + Key, "color:blue", "color:green");
			} else {
				console.log("%c【" + State + "】 get_info(" + Key + ")%c//正在获取 " + Key + "【啦啦啦】", "color:blue", "color:green")
			}
			var infoList = this.infoList;
			//我要去拿资料
			try {
				var val = eval("(" + Fn.getCfg(Key) + ")");
			} catch (e) {
					var val = Fn.getCfg(Key);
			}
			infoList[Key] = val;
			//对于所有信息
			if (this.update_info[Key]) {
				//拿完发现这份资料是 需要更新的
				try {
					var info_msg = eval("(" + infoList[Key] + ")");
				} catch (e) {
					var info_msg = infoList[Key];
				}
				console.log("%c" + Key + " is updating...", "color:blue", info_msg);
				this.update_info[Key]();
			} else if (!infoList[Key] || infoList[Key] == "" || infoList[Key] == "undefined" || infoList[Key] == []) {
				//拿完发现这份资料是 空的
				console.error("%c" + Key + " is empty", "color:red", infoList[Key]);
				if (Key == "friends") {
					Fn.setCfg(Key, Fn.oauth2('GetCustomerList', "uid", Key), "delay");
				} else if (Key == "videos") {
					Fn.setCfg(Key, Fn.oauth2('GetVideoList', "cid", Key), "delay");
				} else {
					Fn.setCfg(Key, Fn.getCfg(Key));
				}
			}
		}
	};
	
	//定义全局事件
	$window.location.href = '#/login';
	$rootScope.islogin = false;
	if(安卓用键获取值("username") && 安卓用键获取值("password")){  //判断有没有本地存储的账号密码
		$rootScope.islogin = true;
		$rootScope.userName = 安卓用键获取值("username");
		$rootScope.passWord = 安卓用键获取值("password");
	}
	else{
		$rootScope.islogin = false;
		$rootScope.userName = "admin";  //初始化
		$rootScope.passWord = "123";
	}
	if (!$rootScope.islogin) {
		$window.location.href = '#/login';
	}
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		document.body.addEventListener("touchmove",function(e){
		});
	});

})
.config(function($stateProvider, $urlRouterProvider,$locationProvider,$ionicConfigProvider,$httpProvider) {
	
	//为了解决不同手机的布局问题
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
	var stateArray = {
		index:{
			url: '/index',
			controller: 'IndexController',
			aaa: Android.getURL('/web/hos/templates/index.html')
		},
		setting:{
			url: '/setting',
			aaa: Android.getURL('/web/hos/templates/setting.html'),
			controller: 'SettingController'
		},
		setting_password:{
			url: '/setting_password',
			aaa: Android.getURL('/web/hos/templates/setting_password.html'),
			controller: 'SettingController'
		},
		setting_information:{
			url: '/setting_information',
			aaa: Android.getURL('/web/hos/templates/setting_information.html'),
			controller: 'SettingController'
		},
		setting_language:{
			url: '/setting_language',
			aaa: Android.getURL('/web/hos/templates/setting_language.html'),
			controller: 'SettingController'
		},
		login:{
			url:'/login',
			aaa:Android.getURL('/web/hos/templates/login.html'),
			controller:'LoginController'
		},
		addperson:{
			url:'/addperson',
			aaa:Android.getURL('/web/hos/templates/addperson.html'),
			controller:'AddPersonController'
		},
		check:{
			url: '/check',
			aaa: Android.getURL('/web/hos/templates/check.html'),
			controller: 'CheckController'
		},
		checkset:{
			url: '/checkset',
			aaa: Android.getURL('/web/hos/templates/checkset.html'),
			controller: 'CheckSetController'
		},
		checkset_1:{
			url: '/checkset_1',
			aaa: Android.getURL('/web/hos/templates/checkset_1.html'),
			controller: 'CheckSetController'
		},
		checkset_2:{
			url: '/checkset_2',
			aaa: Android.getURL('/web/hos/templates/checkset_2.html'),
			controller: 'CheckSetController'
		},
		checkset_3:{
			url: '/checkset_3',
			aaa: Android.getURL('/web/hos/templates/checkset_3.html'),
			controller: 'CheckSetController'
		},
		checkset_4:{
			url: '/checkset_4',
			aaa: Android.getURL('/web/hos/templates/checkset_4.html'),
			controller: 'CheckSetController'
		},
		checkset_5:{
			url: '/checkset_5',
			aaa: Android.getURL('/web/hos/templates/checkset_5.html'),
			controller: 'CheckSetController'
		},
		checkset_6:{
			url: '/checkset_6',
			aaa: Android.getURL('/web/hos/templates/checkset_6.html'),
			controller: 'CheckSetController'
		},
		check_report:{
			url: '/check_report',
			aaa: Android.getURL('/web/hos/templates/check_report.html'),
			controller: 'CheckReportController'
		},
		checkreport:{
			url: '/checkreport',
			aaa: Android.getURL('/web/hos/templates/checkreport.html'),
			controller: 'CheckReportController'
		},
		checkreport_1:{
			url: '/checkreport_1',
			aaa: Android.getURL('/web/hos/templates/checkreport_1.html'),
			controller: 'CheckReportController'
		},
		checkreport_2:{
			url: '/checkreport_2',
			aaa: Android.getURL('/web/hos/templates/checkreport_2.html'),
			controller: 'CheckReportController'
		},
		checkreport_3:{
			url: '/checkreport_3',
			aaa: Android.getURL('/web/hos/templates/checkreport_3.html'),
			controller: 'CheckSetController'
		}
	}

	if(debug=='true'){
		for(var i in stateArray){
			stateArray[i]['templateUrl'] = stateArray[i].aaa
		}
	}else if(debug=='false'){
		for(var i in stateArray){
			stateArray[i]['template'] = stateArray[i].aaa
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
	;
	$urlRouterProvider.otherwise('/login');
});

angular.module('chafangbao.controllers',[]);
angular.module('chafangbao.services',[]);
angular.module('chafangbao.directives',[]);
angular.module('chafangbao.factories',[]);