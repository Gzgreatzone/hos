'use strict';


angular.module('chafangbao.services',['chafangbao.factories'])
.service('kfDevices', ['$rootScope','ThePerson', function ($rootScope,ThePerson) {
	//
	// 仪器的属性封装
	//
	var stat;
	if (!stat) {
		var data = [
			{
				设备名 : "呼末二氧化碳",
				消息标识 : "co2",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "肺功能仪",
				消息标识 : "Lung",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "肺功能仪4",
				消息标识 : "Lung4",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "血氧检测仪",
				消息标识 : "SPO2",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "血糖仪",
				消息标识 : "GLU",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "睡眠呼吸初筛仪",
				消息标识 : "SLEEP",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "体重计",
				消息标识 : "Weight",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "血压计",
				消息标识 : "血压",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "用药管理",
				消息标识 : "Drug",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "氧气机",
				消息标识 : "O2",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "呼吸机",
				消息标识 : "Br",
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}
		];
	} else {
		var data = JSON.parse(stat);
	}

	//设备二维码的回调函数
	var qrcodeCallback;
	
	var device = {
		status : data,
		//回调数组
		callBacks : [],
		
		//====注: 麟翔编写的方法
		save : function(msg){
			//console.log(msg);
			var people = ThePerson.get();
			if (people.name) {  //名字不存在将不会存储
				var peopleName = people.name;  //键值名字
				var indexName = peopleName + "_" + msg.data[0]; //仪器名
				var indexName_time = indexName + "_" +  JSON.parse(安卓用键获取值("devicestatus"))["最后开始时间"];
				if (安卓用键获取值(indexName)) {  //索引是否存在
					var timeStamp = JSON.parse(安卓用键获取值("devicestatus"))["最后开始时间"]+"#"+安卓用键获取值(indexName); //时间戳加长
					var deviceInfor = 安卓用键获取值("devicestatus");  //直接推入本次检测的数据
				} else{
					var deviceInfor = 安卓用键获取值("devicestatus");  //直接推入本次检测的数据
					var timeStamp = JSON.parse(安卓用键获取值("devicestatus"))["最后开始时间"];  //直接录入时间戳
				}
				安卓设置键值对(indexName,timeStamp);  //时间戳键入索引
				安卓设置键值对(indexName_time,deviceInfor);  //存储本次检测信息
			}
		},
		
		//开启 device.open("中文设备","回调","标志字")
		open : function (name, callBack, arg) {
			var callBackPair = new Object();
			var index;
			var x;
			var y;
			//找到设备
			for (x in device.status) {
				//判断是连接哪一个仪器
				if (device.status[x].设备名 == name) {
					//给回调分配唯一索引
					while(1){
						var same = false;
						index = Math.floor(Math.random() * 1000);
						for(x in device.callBacks) {
							if (device.callBacks[x].index == index)
								same = true;
						}
						if(same == false)
							break;
					}
					//将回调加入数组
					var date = new Date();
					callBackPair.index = index;
					callBackPair.date = date.getTime();
					callBackPair.name = name;
					callBackPair.callBack = callBack;
					callBackPair.arg = arg;
					device.callBacks.push(callBackPair);
					console.log("加入数组后");
					//开始连接设备检测
					Android_do_cmd("onBtnClick", "00000", name + 'APP', "window.AndroidCallBack");
					return index;
				}
			}
			return -1;
		},

		//关闭
		close : function (index) {
			var x;
			for (x in device.callBacks) {
				if (device.callBacks[x].index == index) {
					device.callBacks.splice(index, 1);
					break;
				}
			}
		},

		//获取状态
		getStatus : function (name) {
			var i;
			for (i in device.status) {
				if (device.status[i].设备名 == name) {
					return device.status[i];
				}
			}
			return null;
		},

		//二维码
		qrcode: function(callback) {
			qrcodeCallback = callback;
			Android_do_cmd("qrcode");
		}
	}

	// -------------
	// Module      : 安卓的原生接口
	// description : 
	// parameters  : 
	// return      : 
	// author      : risen
	// comment     : 所有安卓的接口调用后,都会把结果传到AndroidCallBack中,
	//             : 所以,重载该函数,让所有的结果获取后能够自动判断分发到对应的回调函数中
	// -------------
	window.AndroidCallBack = function (消息标识, msgKey) {
		
		if(消息标识 == 'qrcode') {
			if(qrcodeCallback)
				qrcodeCallback(msgKey);
		}
		//设备服务数据消息
		if (消息标识 == "设备服务输出消息") {
			var msg = eval("(" + Android_do_cmd("getMsg", msgKey) + ")").type;
			$rootScope.$apply(function () {
				$rootScope.txt_activeDevice = msg.substring(msg.indexOf("n") + 1, msg.length);
				合成语音($rootScope.txt_activeDevice);
			})
		//将获得的设备数据分发到对应的注册回调中
		} else {
			//运行回调方法
			for (var i in device.status) {
				//生成指标的字符串
				var 判断指标;
				if (debug == "true") {
					判断指标 = device.status[i].设备名 + 'APP' == 消息标识;
				} else if (debug == "false") {
					判断指标 = device.status[i].消息标识 == 消息标识;
				}
				//遍历回调函数数组,执行回调函数
				if (判断指标) {
					for (var j = 0; j < device.callBacks.length; j++) {
						//回调函数所需结果跟当前结果匹配,执行回调函数
						if (device.callBacks[j].name == device.status[i].设备名) {
							var 真正的消息;
							var date = new Date();
							var ms = date.getTime();
							//如果是DEBUG模式,就给一个假数据
							if (debug == "true") {
								var debugResult = {
									血氧检测仪 : "'SPO2', '{spo2:98,hr:64}'",
									呼末二氧化碳 : "'co2', '32.11'",
									肺功能仪 : "'Lung', '{fev1:1.59,fev6:7.5}'",
									肺功能仪4 : "'Lung4', '{fev1:1.12,fev6:1.5}'",
									体重计 : "'Weight', '74.9'",
									呼吸机 : "'Breath', 'rate:8.4,vol:488.4,lasttime:[[1448150465649,1448164865649],[1448168465649,1448182865649],[1448186465649,1448198201849]]}'",
									氧气机 : "'O2', '{rate:16.9,o2:90.6,vol:45,lasttime:[[1448168850781,1448168850781]]}'",
									血压计 : "'血压', '{收缩压:160,舒张压:115}'",
									血糖仪 : "'GLU', '11.2'",
									用药管理 : "'DRUG', '1'"
								};
								真正的消息 = "{code:0,data:[" + debugResult[device.callBacks[j].name] + "],msg:'操作成功'}";
							//如果在安卓中运行,就给真数据
							} else if (debug == "false") {
								真正的消息 = Android_do_cmd("getMsg", msgKey);
							}
							//执行回调
							device.callBacks[j].callBack(真正的消息);
							device.callBacks.splice(j, 1);
							j--;
							//更新设备状态
							device.status[i].最后开始时间 = ms;
							device.status[i].最后结束时间 = ms;
							device.status[i].最后检测参数 = 真正的消息;
							安卓设置键值对("devicestatus", JSON.stringify(device.status[i]));
						}
					}
				}
			}
		}
	}
	return device;
}]);
