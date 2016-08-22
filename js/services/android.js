//--------------
// name        : android.js
// type        : 
// dependences : 
// usage       : 用于仿真安卓底包提供的接口,并作为这些接口的示例
//             : 
// copyright   : KF580
//--------------

//自动判断是否处于debug模式
var debug = true;
if (window.Android) {debug = false;}

//如果处于debug模式,则定义所有的仿真接口
if (debug) {
	console.log("模拟安卓的js加载成功");
	if (!window.Android) {
		//向console输出终端信息
		function android_log(name, msg) {
			//console.log('\n      %c调用android原生接口:%c' + name + '\n      %c' + msg + '\n\n', 'color:#777', 'color:indianred', 'color:royalblue');
		};
		//接口仿真
		window.Android = {
			//获取文件的URL地址(用于安卓SD卡中获取资源文件)
			getURL : function (URL) {
				android_log("getURL", JSON.stringify(arguments));
				return URL;
			},
			//获取当前消息的条数
			getMsgCount : function () {
				android_log("getMsgCount", JSON.stringify(arguments));
				return "10"
			},
			//通知安卓底层用户已经通过Oauth登录(仅用于患者端)
			onBtnLoginClick : function () {
				android_log("onBtnLoginClick", JSON.stringify(arguments));
			},
			//停止播报系统声音
			stopSpeaking : function () {
				android_log("stopSpeaking", JSON.stringify(arguments));
			},
			//触发一次设备震动
			onVibrator : function () {
				android_log("onVibrator", JSON.stringify(arguments));
			},
			//启动仪器
			onBtnClick : function () {
				var delayTime = Math.floor(Math.random() * 3) * 1000;
				var argStr = JSON.stringify(arguments);
				var callFuncName = arguments[0];
				var callbackArg = arguments[1];
				setTimeout(function () {
					android_log(callFuncName, argStr);
					if(window.AndroidCallBack)
						window.AndroidCallBack(callbackArg, 'HelloWorld');
					else
					{
						var callbackFunc = arguments[1][2] + "(\"" + callbackArg + "\", \"HelloWorld\")";
						eval(callbackFunc);
					}
				}, delayTime);
			},
			//启动播放器
			openPlayer : function () {
				android_log("openPlayer", JSON.stringify(arguments));
			},
			//写入键值对
			setcfg : function (k, v) {
				android_log("setcfg", JSON.stringify(arguments));
				localStorage.setItem(k,v);
			},
			//获取键值对
			getcfg : function (k) {
				android_log("getcfg", JSON.stringify(arguments));
				return localStorage.getItem(k);
			},
			//????/
			updateAudio : function () {
				android_log("updateAudio", JSON.stringify(arguments));
			},
			//系统关机
			closeSystem : function () {
				android_log("closeSystem", JSON.stringify(arguments));
			},
			//系统重启
			resetSystem : function () {
				android_log("resetSystem", JSON.stringify(arguments));
			},
			//获取消息(根据window.AndroidCallBack返回的key获取消息缓存)
			getMsg : function (key) {
				android_log("getMsg", key);
				return key;
			},
			//根据消息ID获取消息
			getMsgById : function (id, callback) {
				android_log("getMsgById", JSON.stringify(arguments));
				return JSON.stringify({
					"code" : "0",
					"data" : {
						"createDate" : "2016-04-06 21:18:55",
						"flag" : "0",
						"gsonData" : {
							"formTime" : "1459948735485",
							"formId" : "x26827_743",
							"msg" : "雷猴",
							"formLogin" : "护理所管理"
						},
						"id" : "6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea",
						"loginId" : "x26687_303",
						"submsg" : "[{\"gsondata\":\"[re:6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea]哈哈哈\",\"id\":\"dd333829-35f2-4a10-8903-f81f37924569\",\"parentid\":\"6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea\",\"flag\":\"1\",\"loginid\":\"x26687_303\"},{\"gsondata\":\"[re:6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea]biubiubiu\",\"id\":\"7d7d21e3-c034-42c5-8280-eafff59a4031\",\"parentid\":\"6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea\",\"flag\":\"1\",\"loginid\":\"x26687_303\"},{\"gsondata\":\"[re:6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea]没有loginid！！！，我自己发的信息我自己发的信息我自己发的信息我自己发的信息我自己发的信息我自己发的信息我自己发的信息我自己发的信息我自己发的信息我自己发的信息\",\"id\":\"7d7d21e3-c034-42c5-8280-eafff59a4031\",\"parentid\":\"6cf9de1b-e3fc-4395-a9e9-c9789efbb6ea\",\"flag\":\"1\"\}]"
					},
					"msg" : "操作成功！"
				});
			},
			//分页获取历史消息
			getHistoryMsgPage : function (index, pageSize) {
				android_log("getHistoryMsgPage", JSON.stringify(arguments));
				var msgSample = function (i) {
					var o = new Object();
					var now = new Date();
					o.createDate = moment().unix();
					o.flag = "0";
					var p = new Object();
					p.formTime = o.createDate;
					p.formId = "x26688_161";
					p.msg = " 测试" + i + getTestPic();
					p.formLogin = "ww128@qq.com";
					o.gsonData = p;
					o.id = "8b448b92-e9c3-4693-b2d2-4b971d655332";
					o.loginId = "x26692_379";
					return o;
				};
				var retMsgs = new Array();
				for (var i = 0; i < pageSize; i++) {
					retMsgs[i] = msgSample(i);
				};
				var retMsgStr = JSON.stringify(retMsgs);
				return retMsgStr;
			},
			//即时通信发送消息接口
			onBtnSendMsgClick : function (id, content) {
				android_log("onBtnSendMsgClick", JSON.stringify(arguments));
			},
			//删除消息
			delMsg : function (id, callback) {
				android_log("delMsg", JSON.stringify(arguments));
			},
			//添加事件
			addEvent : function (a, b, c, d, e, f, g, h) {
				android_log("addEvent", JSON.stringify(arguments));
			},
			//刷新事件列表
			updateEvent : function (a, b, c) {
				android_log("updateEvent", JSON.stringify(arguments));
			},
			//获取事件列表
			getEventList : function (a) {
				android_log("getEventList", JSON.stringify(arguments));
			},
			//????????
			getAudioValue : function (a) {
				android_log("getAudioValue", JSON.stringify(arguments));
			},
			//??????????????
			javaShowMsg : function () {
				android_log("javaShowMsg", JSON.stringify(arguments));
			},
			//???????????
			exitMonitor : function () {
				android_log("exitMonitor", JSON.stringify(arguments))
			},
			//播放文字
			readMsg : function () {
				android_log("readMsg", JSON.stringify(arguments))
			},
			//获取未读消息条数
			getNoReadCount : function () {
				android_log("getNoReadCount", JSON.stringify(arguments));
				return "20"
			},
			//分页获取事件列表
			getEventPage : function (index, pageSize) {
				android_log("getEventPage", JSON.stringify(arguments));
				return '{"code":"0","data":[{"content":"亲，您要检测血压啦，要听话哦！","createTime":"2016-03-29?16:06:04","eventId":"check_bloodpress_nojc","faceImg":"/patientpage/images/face/angry.gif","id":"1458547564704HLWMRH","macImg":"/patientpage/images/xyj_on.png","status":"0","type":"0"},{"content":"亲，请测量血压哟","createTime":"2016-03-21?16:05:04","eventId":"check_bloodpress_jc","faceImg":"/patientpage/images/face/happy.gif","id":"1458547504257ZWGKYM","macImg":"/patientpage/images/xyj_on.png","status":"0","type":"0"},{"content":"亲，请打开血压计哟","createTime":"2016-03-21?16:02:05","eventId":"check_bloodpress_noon","faceImg":"/patientpage/images/face/sorry.gif","id":"1458547325931OV6G3J","macImg":"/patientpage/images/xyj_on.png","status":"0","type":"0"},{"content":"亲，请测量血压哟","createTime":"2016-03-21?16:00:05","eventId":"check_bloodpress_jc","faceImg":"/patientpage/images/face/happy.gif","id":"1458547205245BFK61A","macImg":"/patientpage/images/xyj_on.png","status":"0","type":"0"},{"content":"亲，您要用药啦，要听话哦！","createTime":"2016-03-20?12:37:09","eventId":"medic_no_ph","faceImg":"/patientpage/images/face/angry.gif","id":"1458448629113OJQPZ8","macImg":"","status":"0","type":"0"},{"content":"亲，用药时间到，请按时用药","createTime":"2016-03-20?12:35:03","eventId":"medic_use_zl","faceImg":"/patientpage/images/face/happy.gif","id":"145844850359681SJKB","macImg":"","status":"0","type":"0"},{"content":"亲，用药时间到，请按时用药","createTime":"2016-03-20?12:30:23","eventId":"medic_use_zl","faceImg":"/patientpage/images/face/happy.gif","id":"145844822337997R14N","macImg":"","status":"0","type":"0"},{"content":"亲，您要用呼吸机啦，要听话哦！","createTime":"2016-03-20?11:03:22","eventId":"o2mac_no_ph","faceImg":"/patientpage/images/face/angry.gif","id":"1458443002902MFXA4S","macImg":"/patientpage/images/oxygen.png","status":"0","type":"0"},{"content":"亲，您要用呼吸机啦，要听话哦！","createTime":"2016-03-20?10:00:38","eventId":"o2mac_no_ph","faceImg":"/patientpage/images/face/angry.gif","id":"1458439238287J63GVJ","macImg":"/patientpage/images/oxygen.png","status":"0","type":"0"},{"content":"亲，您要检测血氧饱和度啦，要听话哦！","createTime":"2016-03-20?09:18:58","eventId":"check_co2bo2_nophjc","faceImg":"/patientpage/images/face/angry.gif","id":"1458436738604LD9BAK","macImg":"/patientpage/images/img_ey.jpg","status":"0","type":"0"}],"msg":"操作成功！"}';
			},
			getMsg : function (key) {
				android_log("getMsg", key);
				return key;
			},
			getPic : function () {
				android_log("getEventPage", JSON.stringify(arguments));
				return 'sssss'
			},
			//打开摄像头扫描二维码
			qrcode: function(){
				android_log("qrcode", JSON.stringify(arguments));
				if(window.AndroidCallBack)
					window.AndroidCallBack('QRCODE', 'HelloWorld');
			}
		}
	};
};

//安卓容错机制
function Android_do_cmd(cmd, a, b, c, d, e, f, g) {
	var args = [];
	for (var i = 1; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	try {
		if (arguments.length == 1)
			return Android[cmd]();
		if (arguments.length == 2)
			return Android[cmd](a);
		if (arguments.length == 3)
			return Android[cmd](a, b);
		if (arguments.length == 4)
			return Android[cmd](a, b, c);
		if (arguments.length == 5)
			return Android[cmd](a, b, c, d);
		if (arguments.length == 8)
			return Android[cmd](a, b, c, d, e, f, g);
	} catch (e) {
		if (debug) {
			console.error(cmd + "\r\n " + args.join() + "\r\n " + e);
		} else {
			alert(cmd + "\r\n " + args.join() + "\r\n " + e);
		}
	}
}

//错误检测(若接口错误,往console抛出异常)
/*function Android_do_cmd(){
	var args = [];
	for (var i = 1; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	try{
		Android[arguments[0]].apply(this, args);
	} catch(e) {
		if (debug) {
			console.error(arguments[0] + "\r\n " + args.join() + "\r\n " + e);
		} else {
			alert(arguments[0] + "\r\n " + args.join() + "\r\n " + e);
		}
	}
}*/

//安卓接口（部分）
console.log("真实安卓接口调用-js加载成功");

function 安卓设置键值对(key, data) {
	if (debug) {
		localStorage.setItem(key, data);
	} else {
		Android.setcfg(key,data);
		//alert(data);
	}
};

function 安卓用键获取值(key) {
	var data;
	if (debug) {
		data = localStorage.getItem(key);
	} else {
		data = Android.getcfg(key);
	}
	return data;
};

function 安卓获取页面模板内容(FileUrl) {
	if (!debug) {
		FileUrl = FileUrl.replace('./', '/web/app/');
	}
	var file = Android_do_cmd("getURL", FileUrl);
	return file;
}

function 删除消息(信息Id) {
	Android_do_cmd("delMsg", 信息Id, "showDelMsg");
};

function 获取回复信息(父信息Id) {
	var real_data = eval("(" + Android_do_cmd("getMsgById", 父信息Id) + ")");
	return real_data;
};

function 消息发送(toId, dataId, send_msg, callback) {
	Android_do_cmd("onBtnSendMsgClick", toId, "[re:" + dataId + "]" + send_msg);
	if (callback) {
		callback(send_msg);
	}
};

function 合成语音(文字) {
	Android_do_cmd("stopSpeaking");
	Android_do_cmd("readMsg", 文字);
};

function 获取历史消息(Type, Page, Num) {
	var typeName;
	var api;

	if (Type == "历史消息") {
		typeName = "温馨问候";
		api = "getHistoryMsgPage";
	} else if (Type == "事件提示") {
		typeName = "每日提醒";
		api = "getEventPage";
	}

	var msgList = new Array;
	var 真实消息 = Android_do_cmd(api, Page, Num);
	var msgData = eval("(" + 真实消息 + ")");

	if (Type == "历史消息") {
		msgList = getChatlistMsg(msgData);
	} else if (Type == "事件提示") {
		var i;
		for (i in msgData['data']) {
			msgList[i] = msgData['data'][i];
			msgList[i]['formId'] = msgList[i]['eventId'],
			msgList[i]['formTime'] = moment(msgList[i]['createTime'], 'YYYY-MM-DD h:mm:ss').calendar(),
			msgList[i]['msg'] = msgList[i]['content'],
			msgList[i]['macImg'] = msgList[i]['macImg'],
			msgList[i]['faceImg'] = msgList[i]['faceImg'];
		}
	}

	console.log("%c" + typeName + "里面的" + Type, "color:green");
	console.table(msgList);
	return msgList;
};

function 获取接收到的消息(Data) {
	var 信息标志;
	var msgkey;
	var 真正的消息;
	if (Data.indexOf('msg') >= 0) {
		信息标志 = 'msg##';
	} else if (Data.indexOf('cmd') >= 0) {
		信息标志 = 'cmd@@';
	}
	msgkey = Data.replace(信息标志, '');
	if(debug)
		真正的消息 = '{"createDate" : "2016-03-27 11:21:16","flag" : "0","gsonData" : {"formTime" : "'+moment().unix()+'","formId" : "x26687_303","msg" : "[re:回复的主题id]测试消息~~~' + getTestPic() + '","formLogin" : "居家护理所"},"id" : "74eef2d1-1a4804c30-b87a-69253b7315f9","loginId" : "x23207_755"}';
	else
		真正的消息 = Android_do_cmd("getMsg", msgkey);
	if (window.showReceiveMsg_Callback !== "undefined" && typeof(window.showReceiveMsg_Callback) === "function") {
		window.showReceiveMsg_Callback(真正的消息);
	}
};

function 事件新增() {
	Android_do_cmd("addEvent", "1449152013373HIFJKQ", "亲，该吸氧了，准备好了没？今天要吸1小时", "/patientpage/images/face/happy.gif", "/patientpage/images/oxygen.png", "0", "0", "oxygen_o2_zl");
	var NoReadCount = Android_do_cmd("getNoReadCount", "1");
	Android_do_cmd("updateEvent", "1449152013373HIFJKQ", "1");
	Android_do_cmd("getEventList", "showHistoryMsg");
	return NoReadCount;
};

/**
 * 时间戳转换函数
 */
function fn_UnixToDate(Unixtime) {
	if (Unixtime == "" || Unixtime == undefined) {
		unixLength = 0;
		var date = "";
	} else {
		var unixLength = JSON.stringify(Unixtime).length;
		if (unixLength == "15") {
			var timeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
		} else {
			Unixtime = Unixtime + '000';
			var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		}
		var date = moment(moment(parseInt(Unixtime)).format(timeFormat)).calendar();
	}
	return date;
};

/**
 * 本函数完成三个功能：
 * 获取纯文字消息文本（去掉“[re:……],<img src='……'/>等消息前缀和Html标签”），即最后返回的text；
 * 获取html标签里的属性值，即最后返回的val（数组形式）。
 */
function getValueByHtml(Data) {
	/* var HTML标签正则 = /<[a-zA-Z]+(\s+[a-zA-Z]+\s*=\s*("([^"]*)"|'([^']*)'))*\s*\/>/g; */
	var HTML标签正则 = /<[a-zA-Z]+(\s+[a-zA-Z]+\s*=\s*("([^"]*)"|'([^']*)'))*\s*\S*>/g;
	var SRC正则 = /\s*("([^"]*)"|'([^']*)')/g;
	var text;
	var val;
	//获取纯文本信息
	Data = Data.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	var textOrigin = Data.replace(HTML标签正则, '');
	//console.log("纯文本信息:", textOrigin);
	//去掉”[re:……]“
	var total = textOrigin.length;
	var pos = textOrigin.indexOf(']') + 1;
	text = textOrigin.substring(pos, total);
	//获取Html里的值
	var val = Data.match(SRC正则, '');
	var j;
	for (j in val) {
		val[j] = val[j].replace(/'|"/g, '');
	}
	return {
		text : text,
		val : val
	};
}

/**
 * JS获取n至m随机整数
 */
function getRandom(n, m) {
	var c = m - n + 1;
	return Math.floor(Math.random() * c + n);
}

/**
 * 获取不重复随机数图片
 * js数组除重
 */
function getTestPic() {
	var n = {};
	var testPic = '';
	for (var j = 0; j < getRandom(1, 9); j++) {
		var num = getRandom(1, 13);
		if (!n[num]) {
			n[num] = num;
			testPic += "&lt;img src='./images/dialog/" + num + ".jpg'&gt;"
		}
	}
	return testPic.toString();
}
