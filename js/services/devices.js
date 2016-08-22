'use strict';


angular.module('chafangbao.services',['chafangbao.factories'])
.service('kfDevices', ['$rootScope','$timeout', function ($rootScope,$timeout) {
	//
	// 仪器的属性封装
	//
	var stat;
	if (!stat) {
		var data = [
			{
				设备名 : "呼末二氧化碳",
				消息标识 : "co2",
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "肺功能仪",
				消息标识 : "Lung",
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "肺功能仪4",
				消息标识 : "Lung4",
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "血氧检测仪",
				消息标识 : "SPO2",
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "血糖仪",
				消息标识 : "GLU",
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "睡眠呼吸初筛仪",
				消息标识 : "SLEEP",
				最后开始时间 : 0,
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "体重计",
				消息标识 : "Weight",
				最后开始时间 : 0,
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "血压计",
				消息标识 : "血压",
				最后开始时间 : 0,
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "用药管理",
				消息标识 : "Drug",
				最后开始时间 : 0,
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "氧气机",
				消息标识 : "O2",
				最后开始时间 : 0,
				最后检测时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : "呼吸机",
				消息标识 : "Br",
				最后开始时间 : 0,
				最后检测时间 : 0,
				最后检测参数 : 0
			}
		];
	} else {
		var data = JSON.parse(stat);
	}

	//设备二维码的回调函数
	var qrcodeCallback;
	//图片获取回调函数
	var getPicCallback;
	
	var device = {
		status : data,
		//回调数组
		callBacks : [],
		
		//====注: 麟翔编写的方法
		save : function (Signal,peoplename) {
			if (peoplename) {    
			    //键值名字
				var peopleName = peoplename;  
				//人名和仪器名
				var indexName = peopleName + "_" + Signal; 
				var lastCheck = JSON.parse(Android.getcfg("deviceStatus"));
				console.log(lastCheck);
				var lastCheckTime = lastCheck['最后检测时间'];
				var indexName_time = indexName + "_" +  lastCheckTime;
				 //索引是否存在
				if (Android.getcfg(indexName)) {  
					var timeStamp = lastCheckTime+"#"+Android.getcfg(indexName); //时间戳加长
				} else{
					//直接录入时间戳
					var timeStamp =lastCheckTime.toString();  
				}
				Android.setcfg(indexName,timeStamp);  //时间戳键入索引
				//Android.setcfg(indexName_time,deviceInfor);  //存储本次检测信息
				Android.setcfg(indexName_time,JSON.stringify(lastCheck));  //存储本次检测信息

		    }
		},
		// delete : function(Signal) {
		// 	var people = ThePerson.get();
		// 	if (people.name) {}
		// },
		
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
					blueTooth.init(name);
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
		// 获取当前设备
		getCurrentDevice_BySignal : function (Signal) {
			var i;
			for (i in device.status) {
				var status = device.status[i];
				if (status['消息标识'] == Signal) {
					return status;
				}
			}
		},
		getCurrentDevice : function (Signal) {
			var status = device.getCurrentDevice_BySignal(Signal);
			if (status['消息标识'] == Signal) {
				var j;
				for (j in device.callBacks) {
					var callback = device.callBacks[j];
					if (callback['name'] == status['设备名']) {
						// 执行回调并移除该回调
						device.callBacks.splice(j, 1);
						j--;
						return {
							status : status,
							callback : callback.callBack
						};
					}
				};
			}
		},
		getDeviceEvent : function () {
			$timeout(function () {
				device2.getDeviceEvent();
			}, 500);
		},
		// 根据检测项，放回object类型的值
		getRes : function (Key, Val) {
			var Res;
			//var people = ThePerson.get();

			if (Key == "Weight") { // 对于”体重“，返回值是一个number,要先把返回值变成一个object再让其进入object的操作中！
				Res = {
					weight : Val,
					bmi : parseFloat(parseFloat(Val / (Math.pow($rootScope.Pad_user.infoList.Height / 100, 2))).toFixed(1).replace('.0', ''))
				};
			} else if (Key == "co2") { // 对于”co2“，返回值是一个number,要先把返回值变成一个object再让其进入object的操作中！
				Res = {
					co2 : Val
				};
			} else if (Key == "GLU") { // 对于”GLU“，返回值是一个number,要先把返回值变成一个object再让其进入object的操作中！
				Res = {
					GLU : Val
				};
			} else {
				Res = eval("(" + Val + ")");
			}
			return Res;
		},
		storage : function (Status, result) {
			console.log(Status);
			if (Status) {
				var date = new Date();
				var ms = date.getTime();
				Status.最后检测时间 = ms;
				// 判断已经检测了多少次
				var repeatCheck = false; // 是否多次重复检测
				var i;
				for (i in DEVICE) {
					var pre = DEVICE[i];
					if (pre['id'] == Status.设备名) {
						if (pre['checkTimes'] > 1) {
							repeatCheck = true;
							if (pre['currentTimes'] == 0) {
								var p;
								var q = {};
								for (p in result) {
									q[p] = [];
								}
								Status.最后检测参数 = q;
							}
						}
					}
				}
				if (repeatCheck) {
					var j;
					console.log(result);
					for (j in result) {
						Status.最后检测参数[j].push(result[j]);
						//console.log(Status.最后检测参数[j]);
					}
					// for(j in result) {
					// 	if (Status.最后检测参数[j].length == DEVICE[Status.消息标识].checkTimes ) {
					// 		this.save(Status);
					// 		break;
					// 	}
					// }
				} else {
					Status.最后检测参数 = result;
					//this.save(Status);
				}				   
			} else {
				console.error("status不存在");
			}
			Android.setcfg("deviceStatus", JSON.stringify(Status));
		},
		//二维码
		qrcode: function(callback) {
			qrcodeCallback = callback;
			Android_do_cmd("qrcode");
		},
		getPicReturn : function(callback) {
			getPicCallback = callback;
			Android.getPic();
			//Android_do_cmd("qrcode");
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

	window.AndroidCallBack = function (MsgKey1, MsgKey2) {
		//alert(msgKey);
		if(MsgKey1 == 'QRCODE') {
			if(qrcodeCallback){
				var codeStr = Android_do_cmd("getMsg",MsgKey2);
				qrcodeCallback(codeStr);
			}
		}
		if (MsgKey1 == '选中图片') {
			var picStr = MsgKey2;
			getPicCallback(picStr);
		}
		var 消息内容 = [Android_do_cmd("getMsg", MsgKey1) || MsgKey1];
		var isMsg = false;
		MsgKey2 && 消息内容.push(Android_do_cmd("getMsg", MsgKey2) || MsgKey2);
		var 完整数据 = 消息内容.join('');
		console.log(完整数据);
		$rootScope.deviceOutMsg = 完整数据;
		isMsg = blueTooth.analyse(完整数据);
		if (isMsg) {
			if (isMsg == "isRes") {
				
					console.log("%c这是检测结果", "color:cornflowerblue");
					console.log(完整数据);
					var 真实的消息 = JSON.parse(完整数据);
					console.log(完整数据);
					var signal = 完整数据.match(/Lung|co2|SPO2|Weight|血压|GLU|SLEEP /g);
					var result = device.getRes(signal, 真实的消息['data'][1]);
					var msg = 真实的消息['msg'];
					if (msg == '操作成功') { 
 						// 运行回调方法
 						//console.log(signal);
						var currentDevice = device.getCurrentDevice(signal);
						//console.log(result);
						currentDevice.callback(signal, result);
						console.log(currentDevice.status);
						device.storage(currentDevice.status, result);
					} 
				
			} else {
				console.log("%c这是回调消息", "color:blue");
			}
		}
	}
	return device;
}]);

