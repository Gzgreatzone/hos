var isDebug = !window.Android;
if (isDebug) {
	Android = {
		log : function (Api, Param) {
			console.log("%cAndroid." + Api + "%c " + JSON.stringify(Param), "color:blue;", "color:green;");
		},
		onBtnLoginClick : function (Uid, Uname) {
			this.log("onBtnLoginClick", arguments);
		},
		sendKFEvent : function (Msg) {
			this.log("sendKFEvent", arguments);
		},
		getURL : function (Url) {
			this.log("getURL", arguments);
			return Url;
		},
		onBtnSendMsgClick : function (Url) {
			this.log("onBtnSendMsgClick", arguments);
		},
		onBtnClick : function () {
			this.log("onBtnClick", arguments);
		},
		exitMonitor : function () {
			this.log("exitMonitor", arguments);
		},
		resetSystem : function () {
			this.log("resetSystem", arguments);
		},
		closeSystem : function () {
			this.log("closeSystem", arguments);
		},
		restartService : function () {
			this.log("restartService", arguments);
		},
		getMsg : function (msgKey) {
			return msgKey;
		}
	}
};

var Android_do_cmd = function () {
	var i;
	var param = [];
	var len = arguments.length;
	for (i = 1; i < len; i++) {
		param.push('arguments[' + i + ']');
	}
	var Name = arguments[0];

	if (Name !== "getMsg") {
		global.debugTips(arguments);
	}

	if (Android[Name]) {
		var temp = "Android[Name](" + param.join(',') + ")";
		try {
			return eval("(" + temp + ")");
		} catch (e) {
			alert(Name + " " + e);
		}
	} else {
		alert("Android." + Name + " is undefined!");
	}
}

/* ============================== */

var global = {
	setData : function (Key, Val) {
		return $(Key).next().val(Val);
	},
	getData : function (Key) {
		return $(Key).next().val();
	},
	debugTips : function () {
		var i;
		var param = [];
		var len = arguments.length;
		for (i in arguments) {
			var per = arguments[i];
			if (typeof per !== "string") {
				arguments[i] = JSON.stringify(per);
			}
			param.push('arguments[' + i + ']');
		}
		var debugWindow = $(".debugWindow");
		debugWindow.scrollTop(0);
		//var newData = "debugWindow.find('p').prepend(htmlEncode(" + param.join('+') + ")+'<br /><br />');console.log(" + param.join(',') + ")";
		var newData = "debugWindow.find('textarea').prepend(htmlEncode(" + param.join('+') + ")+'\\r\\n\\r\\n');console.log(" + param.join(',') + ")";
		eval(newData);
		console.log("111",debugWindow.text());
	}
}

/* ============================== */

var Arr = [{
		name : "返回",
		target : ".back",
		func : function () {
			window.location.href = '../index.html';
		}
	}, {
		name : "刷新",
		target : ".refresh",
		func : function () {
			window.location.reload();
		}

	}, {
		name : "登录",
		target : ".login .submit",
		func : function () {
			var name = global.getData(".name");
			var pwd = global.getData(".pwd");
			Oauth2.Push('登录', name, pwd, function (r) {
				console.log("登录成功");

				Pad_User.infoList.name = name;
				Pad_User.infoList.pwd = pwd;
				Pad_User.infoList.token = r.authToken;

				var i;
				for (i in r.uid.T[0]) {
					var per = r.uid.T[0][i];
					Pad_User.infoList[i] = per;
				}

				global.debugTips("通知后台，用户已登录：", Pad_User.infoList.uid, '/', name);
				Android_do_cmd("onBtnLoginClick", Pad_User.infoList.uid, name); // 通知后台，用户已登录

				global.setData(".name", name);
				global.setData(".pwd", pwd);

				localStorage.setItem("infoList", JSON.stringify(Pad_User.infoList));

				$(".needLogin").removeClass("needLogin");

				$(".status span").text(Pad_User.infoList.username);
			});
		}
	}, {
		name : "发送信息到MQTT",
		target : ".sendKFEvent",
		func : function () {
			var msg = global.getData(".sendKFEventContent");
			if (msg) {
				Android_do_cmd("sendKFEvent", msg);
				setTimeout(function () {
					global.debugTips("发送消息到MQTT成功！", "消息内容：'" + msg + "'");
					global.setData(".sendKFEventContent", '');
				}, 1000);
			}
		}
	}, {
		name : "自动发送/开启",
		target : ".autoSendOn",
		func : function () {
			var autoSend = $(this).attr("autoSend");
			if (autoSend !== "true") {
				$(this).attr("autoSend", true);
				var type = $(this).attr("class").replace('autoSendOn ', '');
				if (type == "MQTT") {
					Auto.sendKFEvent.func();
				} else if (type == "Msg") {
					Auto.sendMsg.func();
				}
			}
		}
	}, {
		name : "自动发送/关闭",
		target : ".autoSendOff",
		func : function () {
			$(this).siblings(".autoSendOn").removeAttr("autoSend");
			var type = $(this).attr("class").replace('autoSendOff ', '');
			if (type == "MQTT") {
				Auto.sendKFEvent.cancel();
			} else if (type == "Msg") {
				Auto.sendMsg.cancel();
			}
		}
	}, {
		name : "获取文件",
		target : ".getURL",
		func : function () {
			var url = global.getData(".getURLContent");
			var realUrl = url ? '/web/app/' + url : '';
			if (realUrl) {
				var file = Android_do_cmd("getURL", realUrl);
				if (file) {
					setTimeout(function () {
						global.debugTips("获取文件成功！文件名：'", realUrl + "'；", "文件内容：'" + file + "'");
						global.setData(".getURLContent", '');
					}, 1000);
				}
			}
		}
	}, {
		name : "发送信息",
		target : ".sendMsg",
		func : function () {
			var toId = global.getData(".sendMsgToId");
			var Content = global.getData(".sendMsgContent");
			if (toId && Content) {
				Android_do_cmd("onBtnSendMsgClick", toId, Content);
				setTimeout(function () {
					global.debugTips("消息发送成功！接收方id：'" + toId + "'；", "消息内容：'" + Content + "'");
					global.setData(".sendMsgToId", '');
					global.setData(".sendMsgContent", '');
				}, 1000);
			}
		}
	}, {
		name : "检测设备开启",
		target : ".deviceBtn",
		func : function () {
			var name = $(this).text();
			Android_do_cmd("onBtnClick", "00000", name + 'APP', "window.AndroidCallBack");
		}
	}, {
		name : "重启集成消息服务",
		target : ".deviceRestart",
		func : function () {
			Android_do_cmd("restartService");
		}
	}, {
		name : "检测设备关闭",
		target : ".deviceClose",
		func : function () {
			Android_do_cmd("exitMonitor");
		}
	}, {
		name : "从逻辑表达式中获取检测参数",
		target : ".getParamObj",
		func : function () {
			var device_value = {
				co2 : 50,
				spo2 : 60,
				氧流量 : 50
			};
			var param = global.getData(".logicFunc");
			var strArr = param.replace(/##./g, '').replace(/>=|<=|==|>|</g, ',').split(/&&|\|\|/);
			var paramObj = new Object;
			var paramArr = new Array;
			var i;
			for (i in strArr) {
				var per = strArr[i].split(',')[0];
				if (!paramObj[per]) {
					paramObj[per] = device_value[per];
				}
			}
			var res;
			try {
				res = "检测参数" + (eval(param.replace(/##/g, 'device_value')) ? "满足" : "不满足") + "判断；";
			} catch (e) {
				res = "逻辑表达式格式错误；";
			}
			global.debugTips("检测参数：" + JSON.stringify(device_value) + "；", res, paramObj);
		}
	}, {
		name : "全屏测试窗口",
		target : ".debugExpand",
		func : function () {
			var status = $(this).attr("status");
			if(status == "expanding"){
				$(this).attr("status","");
				$(this).parents(".bottom_footer_container").removeAttr("style").siblings().show();
			}else{
				$(this).attr("status","expanding");
				$(this).parents(".bottom_footer_container").height("100%").siblings().hide();
			}
		}
	},  {
		name : "清空测试窗口",
		target : ".debugClear",
		func : function () {
			$(this).siblings(".debugWindow").empty().html("<textarea></textarea>");
		}
	}, {
		name : "重启系统",
		target : ".restartSys",
		func : function () {
			Android_do_cmd("resetSystem");
		}
	}, {
		name : "关闭系统",
		target : ".closeSys",
		func : function () {
			Android_do_cmd("closeSystem");
		}
	}
];

var i;
for (i in Arr) {
	var per = Arr[i];
	if (!$(per['target']).is(".needLogin")) {
		$(document).on('click', per['target'], per['func']);
	}
}

/* ============================== */
// 初始化页面信息
var infoList = localStorage.getItem("infoList") || "{}";
var Pad_User = {
	infoList : eval("(" + infoList + ")")
};
var initData = {
	name : {
		type : "val",
		content : Pad_User.infoList.name
	},
	pwd : {
		type : "val",
		content : Pad_User.infoList.pwd
	},
	logicFunc : {
		type : "val",
		content : "##.co2>=20&&##.co2<50&&##.spo2>=60||##.氧流量>70",
	},
	deviceContainer : {
		type : "text",
		create : "span",
		class: "deviceBtn",
		content : [
			"呼末二氧化碳",
			"肺功能仪",
			"体重计",
			"血氧检测仪",
			"睡眠初筛仪",
			"血糖仪",
			"血压计",
			"肺功能仪4"
		]
	},
	status : {
		type : "text",
		create : "span",
		content : "未登录"
	}
}
$(function () {
	var j;
	for (j in initData) {
		var per = initData[j];
		/* if (typeof per !== "string") {
		per = JSON.stringify(per);
		} */
		if (per['type'] == "val") {
			global.setData("." + j, per['content']);
		} else if (per['type'] == "text") {
			var k;
			var ele = per['create'];
			var perContent = per['content']
				if (perContent instanceof Array) {
					perContent = perContent.reverse();
					for (k in perContent) {
						$("." + j).prepend("<" + ele + " class="+per['class']+">" + perContent[k] + "</" + ele + ">");
					}
				} else {
					$("." + j).append("<" + ele + ">" + perContent + "</" + ele + ">");
				}
		}
	}
});
/* ============================== */

var Oauth2 = {
	Push : function (type, name, pwd, callback) {
		oauth2.jsonp.login(name, pwd, function (r) {
			if (!r.errcode) {
				callback(r);
			} else {
				console.log(type, "失败");
			}
		});
	}
};

/* ============================== */

var Auto = {
	sendKFEvent : {
		timerArr : [],
		func : function () {
			var i = 0;
			var timer = setInterval(function () {
					var data = {
						"u" : Pad_User.infoList.uid,
						"n" : "bre",
						"e" : "co2_breath_before_low",
						"t" : (new Date).getTime(),
						"v" : '{co2 : [32.1, 33.5, 36]}',
						"m" : '{"重复次数" : 2,"执行次数" : 0,"中断提醒" : "已经检测过","显示白旗" : true,"测试":' + i + '}'
					};
					global.setData(".sendKFEventContent", JSON.stringify(data));
					$(".sendKFEvent").click();
					i++;
				}, 2000);
			this.timerArr.push(timer);
		},
		cancel : function () {
			var i;
			for (i in this.timerArr) {
				clearInterval(this.timerArr[i]);
			}
			this.timerArr = [];
		}
	},
	sendMsg : {
		timerArr : [],
		func : function () {
			var i = 0;
			var timer = setInterval(function () {
					global.setData(".sendMsgToId", "x28833_602");
					global.setData(".sendMsgContent", "测试" + i);
					$(".sendMsg").click();
					i++;
				}, 2000);
			this.timerArr.push(timer);
		},
		cancel : function () {
			var i;
			for (i in this.timerArr) {
				clearInterval(this.timerArr[i]);
			}
			this.timerArr = [];
		}
	}
};

/*
 * 给安卓调用的全局函数
 */
window.AndroidCallBack = function (msgKey1, msgKey2) {
	var 消息1 = Android_do_cmd("getMsg", msgKey1) || msgKey1;
	if (!msgKey2) {
		global.debugTips("01：" + 消息1);
	} else {
		var 消息2 = Android_do_cmd("getMsg", msgKey2) || msgKey2;
		global.debugTips("01：", 消息1, "；02：", 消息2);
	}
}

/* ===================== */
/* 其他工具 */
/*
 * 1、html转义
 */
function htmlEncode(html) {
	return document.createElement('a').appendChild(document.createTextNode(html)).parentNode.innerHTML;
};
/*
 * 2、浏览器内容复制到剪切板
 */

/* function oCopy(obj) {
	try {
		obj.select();
		js = obj.createTextRange();
		js.execCommand("Copy")
		global.debugTips("复制成功！");
	} catch (e) {
		global.debugTips("浏览器不支持复制功能！");
	}
} */
