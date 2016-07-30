'user strict';
var isDebug = !window.Android;
if (isDebug) {
	Android = {
		log : function (Api, Param) {
			console.log("%cAndroid." + Api + "%c " + JSON.stringify(Param), "color:blue;", "color:green;");
		},
		onBtnLoginClick : function () {
			this.log("onBtnLoginClick", arguments);
		},
		sendKFEvent : function () {
			this.log("sendKFEvent", arguments);
		},
		getURL : function (Url) {
			this.log("getURL", arguments);
			return Url;
		},
		onBtnSendMsgClick : function () {
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
		},
		readMsg : function () {
			// this.log("readMsg", arguments);
		}
	}
};
// 不需要在debug.Window显示提醒的安卓接口
var tipsIgnoreAPI = {
	"getMsg" : true,
	"sendKFEvent" : true,
	"onBtnSendMsgClick" : true,
	"onBtnLoginClick" : true,
	"getURL" : true,
	"readMsg" : true
};
var Android_do_cmd = function () {
	var i;
	var param = tool.getParamFromArg(arguments, 1);
	var Name = arguments[0];
	if (!tipsIgnoreAPI[Name]) {
		debug.Tips(arguments);
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
};

/* ============================== */

var global = {
	setData : function (Key, Val) {
		return $(Key).next().val(Val);
	},
	getData : function (Key) {
		return $(Key).next().val();
	}
};

/* ============================== */

var debug = {
	Tips : function () {
		var param = tool.getParamFromArg(arguments);
		eval("this.Content.prepend(tool.htmlEncode(" + param.join('+') + ")+'<br /><hr />');"); // debug.Tips核心
		this.Window[0].scrollTop = 0; // 滑到顶部
		//this.Window[0].scrollTop = this.Window[0].scrollHeight; // 滑到底部
	},
	Clear : function () {
		this.Content.empty();
	},
	Expand : function () {
		var status = this.Window.attr("status");
		if (status == "expanding") {
			this.Window.removeAttr("status");

			this.WrapperParent.animate({
				height : "40%"
			}, true).siblings().slideDown();

			this.Wrapper.animate({
				height : "90%"
			}, true);
		} else {
			this.Window.attr("status", "expanding");

			this.WrapperParent.animate({
				height : "100%"
			}, true).siblings().slideUp();

			this.Wrapper.animate({
				height : "100%"
			}, true);
		}
	}
};
$(function () {
	debug.WrapperParent = $(".bottom_footer_container");
	debug.Wrapper = $(".bottom_footer");
	debug.Content = $(".debugWindow p");
	debug.Window = $(".debugWindow");
});

/* ============================== */

var clickArr = [{
		name : "返回",
		target : ".back",
		click : function () {
			window.location.href = '../index.html';
		}
	}, {
		name : "刷新",
		target : ".refresh",
		click : function () {
			window.location.reload();
		}
	}, {
		name : "登录",
		target : ".login .submit",
		click : function () {
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

				debug.Tips("通知后台，用户已登录：'" + Pad_User.infoList.uid + "'/'" + name + "'");
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
		click : function () {
			var msg = global.getData(".sendKFEventContent");
			if (msg) {
				Android_do_cmd("sendKFEvent", msg);
				setTimeout(function () {
					debug.Tips("发送消息到MQTT成功！", "消息内容：'" + msg + "'");
					global.setData(".sendKFEventContent", '');
				}, 1000);
			}
		}
	}, {
		name : "自动发送/开启",
		target : ".autoSendOn",
		click : function () {
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
		click : function () {
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
		click : function () {
			var url = global.getData(".getURLContent");
			var realUrl = url ? '/web/app/' + url : '';
			if (realUrl) {
				var file = Android_do_cmd("getURL", realUrl);
				if (file) {
					setTimeout(function () {
						debug.Tips("获取文件成功！文件名：'", realUrl + "'；", "文件内容：'" + file + "'");
						global.setData(".getURLContent", '');
					}, 1000);
				}
			}
		}
	}, {
		name : "发送信息",
		target : ".sendMsg",
		click : function () {
			var toId = global.getData(".sendMsgToId");
			var Content = global.getData(".sendMsgContent");
			if (toId && Content) {
				Android_do_cmd("onBtnSendMsgClick", toId, Content);
				setTimeout(function () {
					debug.Tips("消息发送成功！接收方id：'" + toId + "'；", "消息内容：'" + Content + "'");
					global.setData(".sendMsgToId", '');
					global.setData(".sendMsgContent", '');
				}, 1000);
			}
		}
	}, {
		name : "重启集成消息服务",
		target : ".deviceRestart",
		click : function () {
			Android_do_cmd("restartService");
		}
	}, {
		name : "检测设备关闭",
		target : ".deviceClose",
		click : function () {
			Android_do_cmd("exitMonitor");
		}
	}, {
		name : "从逻辑表达式中获取检测参数",
		target : ".getParamObj",
		click : function () {
			var device_value = {
				co2 : 50,
				spo2 : 60,
				氧流量 : 50
			};
			var param = global.getData(".logicFunc");
			var strArr = param.replace(/##./g, '').replace(/>=|<=|==|>|</g, ',').split(/&&|\|\|/);
			var resObj = {};
			strArr && strArr.forEach(function (str) {
				var per = str.split(',')[0];
				if (!resObj[per]) {
					resObj[per] = device_value[per];
				}
			});
			var res;
			try {
				res = (eval(param.replace(/##/g, 'device_value')) ? "满足" : "不满足") + "判断条件";
			} catch (e) {
				res = "逻辑表达式格式错误";
			}
			debug.Tips("最后检测参数：'" + JSON.stringify(resObj) + "'；" + res + "：'" + param + "'。");
		}
	}, {
		name : "全屏测试窗口",
		target : ".debugExpand",
		click : function () {
			debug.Expand();
		}
	}, {
		name : "清空测试窗口",
		target : ".debugClear",
		click : function () {
			debug.Clear();
		}
	}, {
		name : "重启系统",
		target : ".restartSys",
		click : function () {
			Android_do_cmd("resetSystem");
		}
	}, {
		name : "关闭系统",
		target : ".closeSys",
		click : function () {
			Android_do_cmd("closeSystem");
		}
	}, {
		name : "测试策略树",
		target : ".treeTest",
		click : function () {
			treeTest.on();
		}
	}, {
		name : "停止策略树",
		target : ".treeCancel",
		click : function () {
			treeTest.off();
		}
	}, {
		name : "检测报告分析",
		target : ".reportAnalyse",
		click : function () {
			try {
				var data = $(this).data();
				data && report.analyse(data['name'], function () {
					debug.Tips("==> ",arguments);
				});
			} catch (e) {
				console.error("report.js", '\n', e);
			}
		}
	}, {
		name : "重置检测回调函数",
		target : ".deviceCallbackReset",
		click : function () { // 接收消息的回调在进入controller时配置
			try {
				checkQueue.setApi();
			} catch (e) {
				console.error("checkQueue.js", '\n', e);
			}
		}
	}, {
		name : "检测设备开启",
		target : ".deviceBtn",
		click : function () {
			try {
				if(!$(".deviceCallbackSet").data()['callbackset']){
					debug.Tips("请设置“检测回调函数”！！");
				}else{					
					var devname = $(this).data()['devname'];
					var checktimes = $(".deviceRecheck").data()['recheckmode'] ? $(this).data()['checktimes'] : 1;
					//console.log("检测设备开启，是否重复检测：", !!$(".deviceRecheck").data()['recheckmode'], "；本次检测次数：",checktimes);
					checkQueue.open(devname, checktimes);
					debug.Tips("当前检测队列：",checkQueue.show());
				}
			} catch (e) {
				console.error("checkQueue.js", '\n', e);
			}
		}
	}, {
		name : "未开启重复检测",
		target : ".deviceRecheck",
		click : function () {
			var res = true;
			var txt = "已开启重复检测";
			if ($(this).data()['recheckmode']) {
				res = false;
				txt = "未开启重复检测";
			}
			$(this).data('recheckmode', res).text(txt);
			$(".deviceBtn i").toggle();
		}
	}, {
		name : "未设置检测回调函数",
		target : ".deviceCallbackSet",
		click : function () {
			try {
				// 接收消息的回调在进入controller时配置
				if($(this).data()['callbackset']){
					debug.Tips("已经初始化过检测回调函数啦，点击“重设检测回调函数”，进行重设！");
				}else{
					checkQueue.setApi();
				}
				$(this).data('callbackset', true).text("已设置检测回调函数");
			} catch (e) {
				console.error("checkQueue.js", '\n', e);
			}
		}
	}, {
		name : "重设检测回调函数",
		target : ".deviceCallbackReset",
		click : function () {
			try {
				// 接收消息的回调在进入controller时配置
				checkQueue.setApi();
			} catch (e) {
				console.error("checkQueue.js", '\n', e);
			}
		}
	}
];

$(function () {
	clickArr && clickArr.forEach(function (per) {
		if (!$(per['target']).is(".needLogin")) {
			$(document).on('click', per['target'], per['click']);
		}
	});
});

var treeTest = {
	getTarget : function () {
		if (!this.target) {
			this.target = $(".treeCancel");
		}
		return this.target;
	},
	on : function () {
		var target = this.getTarget();
		target.removeClass("negative");
		try {
			tree.updateConfig();
			tree.doEvent();
			debug.Tips("策略树启动！");
		} catch (e) {
			console.error("策略树未加载！", e);
			debug.Tips("策略树未加载！");
		}
	},
	off : function () {
		var target = this.getTarget();
		if (!target.hasClass("negative")) {
			try {
				tree.cancel();
				target.addClass("negative");
				debug.Tips("策略树已终止！");
			} catch (e) {
				console.error("策略树未加载！", e);
				debug.Tips("策略树未加载！");
			}
		} else {
			debug.Tips("策略树未启动！");
		}
	}
};

/* ============================== */
// 初始化页面信息
var infoList = localStorage.getItem("infoList") || "{}";
var Pad_User = {
	infoList : eval("(" + infoList + ")")
};
var initData = [{
		target : ".name",
		content : Pad_User.infoList.name,
		func : function () {
			global.setData(this['target'], this['content']);
		}
	}, {
		target : ".pwd",
		content : Pad_User.infoList.pwd,
		func : function () {
			global.setData(this['target'], this['content']);
		}
	}, {
		target : ".logicFunc",
		content : "##.co2>=20&&##.co2<50&&##.spo2>=60||##.氧流量>70",
		func : function () {
			global.setData(this['target'], this['content']);
		}
	}, {
		target : ".deviceContainer",
		content : [
			["呼末二氧化碳", 3],
			["肺功能仪", 3],
			["体重计"],
			["血氧检测仪"],
			["睡眠初筛仪"],
			["血糖仪"],
			["血压计"],
			["肺功能仪4"],
		],
		func : function () {
			var This = this;
			This['content'].reverse().forEach(function (per) {
				var devname = per[0];
				var checktimes = per[1];
				$(This['target']).prepend("<span class='deviceBtn' data-devname=" + devname + " data-checktimes=" + (checktimes ? checktimes : 1) + ">" + devname + "<i style='display:none'>" + (checktimes ? "（" + checktimes + "）" : "") + "</i>" + "</span>");
			});
		}
	}, {
		target : ".status",
		content : "未登录",
		func : function () {
			$(this['target']).append("<span>" + this['content'] + "</span>");
		}
	}
];
$(function () {
	initData.forEach(function (per) {
		per['func']();
	});
});

/* ============================== */
// Oauth2鉴权
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
// 一些自动执行的工具
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

/* ============================== */
// 给安卓调用的全局函数
/*
 * 实时通讯的回调
 */
window.showReceiveMsg = function (msgKey) {
	var 消息 = Android_do_cmd("getMsg", msgKey) || msgKey;
	debug.Tips("showReceiveMsg,['" + 消息 + "']");
};
/* ============================== */
// 通用工具
var tool = {
	// 1、html转义
	htmlEncode : function (html) {
		return document.createElement('ele').appendChild(document.createTextNode(html)).parentNode.innerHTML;
	},
	// 2、将arguments转换为数组
	getParamFromArg : function (Arg, StartIndex) {
		var param = [];
		var len = Arg.length;
		var i;
		for (i = (StartIndex || 0); i < len; i++) {
			var per = Arg[i];
			if (typeof per !== "string") {
				Arg[i] = JSON.stringify(per);
			}
			// console.log("111", Arg[i]);
			param.push('arguments[' + i + ']');
		}
		return param;
	}
};

/*
 * continue作用
 * 符合条件，直接进行下一步循环
 */
/* var i;
var arr = [1, 2, 3, 4, 5];
for (i in arr) {
var per = arr[i];
if (i < 4) {
continue;
}
} // 5 */
/*
 * break作用
 * 符合条件，跳出循环
 */
/* var j;
var arr2 = [1, 2, 3, 4, 5];
for (j in arr2) {
var per = arr2[j];
if (j < 4) {
break;
}
} // 1 */

/*
 * 函数构造器
 * 全局.作用域的"构建函数"中使用到
 */
/* var b = function (c) {
return function () {
console.log("111",c);
};
};
a = b("你好！");
c = b("你也好");
a();
c(); */
