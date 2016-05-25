'use strict';


angular.module('chafangbao.services')

.service('kfDevices', function () {

	var device = {};
	var stat = localStorage.getItem('devicestatus');
	if (!stat) {
		device.status = [{
				设备名 : '呼末二氧化碳',
				消息标识 : 'co2',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '肺功能仪',
				消息标识 : 'Lung',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '血氧检测仪',
				消息标识 : 'SPO2',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '血糖仪',
				消息标识 : 'GLU',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '睡眠呼吸初筛仪',
				消息标识 : 'SLEEP',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '体重计',
				消息标识 : 'Weight',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '血压计',
				消息标识 : '血压',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '用药管理',
				消息标识 : 'Drug',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '氧气机',
				消息标识 : 'O2',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}, {
				设备名 : '呼吸机',
				消息标识 : 'Br',
				最后开始时间 : 0,
				最后结束时间 : 0,
				最后检测参数 : 0
			}
		];
	} else
		device.status = JSON.parse(stat);

	//回调数组
	device.callBacks = [];

	//开启 device.open("中文设备","回调","标志字")
	device.open = function (name, callBack, arg) {
		alert("name："+name+"\ncallBack："+callBack+"\narg："+arg)
		var callBackPair = new Object();
		var index;
		var x,
		y;

		//找到设备
		for (x in device.status) {
			/* alert(device.status[x].设备名) */
			if (device.status[x].设备名 == name) {
				while (1) {
					var same = false;
					index = Math.floor(Math.random() * 1000);
					for (x in device.callBacks) {
						if (device.callBacks[x].index == index)
							same = true;
					}
					if (same == false)
						break;
				}
				var date = new Date();

				callBackPair.index = index;
				callBackPair.date = date.getTime();
				callBackPair.name = name;
				callBackPair.callBack = callBack;
				callBackPair.arg = arg;

				device.callBacks.push(callBackPair);
				console.log('加入数组后')
				console.log(device.callBacks)
				//alert(name)
				//开始设备
				/* var fn_name = debug_state("window.AndroidCallBack","showClickMsg"); */
				Android.onBtnClick('00000', name + 'APP', "window.AndroidCallBack")
				return index;
			}
		}
		return -1;
	}

	//关闭
	device.close = function (index) {
		var x;
		for (x in device.callBacks) {
			if (device.callBacks[x].index == index) {
				device.callBacks.splice(index, 1);
				break;
			}
		}
	}

	//获取状态
	device.getStatus = function (name) {
		var i;
		for (i in device.status) {
			if (device.status[i].设备名 == name) {
				return device.status[i];
			}
		}
		return null;
	}

	//获取参数
	window.AndroidCallBack = function (消息标识, msgKey) {

		/* //方法一：失效
		//alert(device.callBacks[0].name);
		//模拟数据
		if (debug == "true") {
		var device_name = device.callBacks[0].name,
		fake_result;

		if (device_name == "血氧检测仪") {
		fake_result = '"SPO2","{spo2:98,hr:64}"';
		} else if (device_name == "肺功能仪") {
		fake_result = '"Lung","{fev1:1.59,fev6:null}"'
		} else if (device_name == "体重计") {
		fake_result = '"Weight","74.9"'
		} else if (device_name == "呼末二氧化碳") {
		fake_result = '"co2","32.11"'
		}
		}
		//运行回调方法
		device.callBacks[0].callBack(Android.getMsg(debug_state('{"code":"0","data":[' + fake_result + '],"msg":"操作成功"}', msgKey))) */

		/* //方法二：失效
		for (var i in device.status) {
		if (device.status[i].设备名 + 'APP' == 消息标识) {
		var 真正的消息 = Android.getMsg(msgKey);
		var ret = eval('(' + 真正的消息 + ')');
		//console.table(device.callBacks);
		for (var j = 0; j < device.callBacks.length; j++) {
		if (device.callBacks[j].name == device.status[i].设备名) {
		//device.callBacks[j].callBack(ret.msg, ret.data, device.callBacks[j].arg);
		if (debug == "true") {
		var device_name = device.callBacks[j].name,
		fake_result;
		//alert(device_name)
		if (device_name == "血氧检测仪") {
		fake_result = '"SPO2","{spo2:98,hr:64}"';
		} else if (device_name == "呼末二氧化碳") {
		fake_result = '"co2","32.11"';
		} else if (device_name == "肺功能仪") {
		fake_result = '"Lung","{fev1:1.59,fev6:null}"';
		} else if (device_name == "体重计") {
		fake_result = '"Weight","74.9"';
		}
		}
		device.callBacks[j].callBack(Android.getMsg(debug_state('{"code":"0","data":[' + fake_result + '],"msg":"操作成功"}', msgKey)))
		device.callBacks.splice(j, 1);
		j--;
		}
		}
		var date = new Date();
		var ms = date.getTime();
		device.status[i].最后开始时间 = ms;
		device.status[i].最后结束时间 = ms;
		device.status[i].最后检测参数 = 真正的消息;
		localStorage.setItem('devicestatus', JSON.stringify(device.status));
		}
		} */

		//方法三：暂时可行
		if (debug == "true") {
			for (var i in device.status) {
				if (device.status[i].设备名 + 'APP' == 消息标识) {
					var 真正的消息 = Android.getMsg(msgKey);
					var ret = eval('(' + 真正的消息 + ')');
					//console.table(device.callBacks);
					for (var j = 0; j < device.callBacks.length; j++) {
						if (device.callBacks[j].name == device.status[i].设备名) {
							//device.callBacks[j].callBack(ret.msg, ret.data, device.callBacks[j].arg);
							var device_name = device.callBacks[j].name,
							fake_result;
							//alert(device_name)
							if (device_name == "血氧检测仪") {
								fake_result = '"SPO2","{spo2:98,hr:64}"';
							} else if (device_name == "呼末二氧化碳") {
								fake_result = '"co2","32.11"';
							} else if (device_name == "肺功能仪") {
								fake_result = '"Lung","{fev1:1.59,fev6:7.5}"';
							} else if (device_name == "体重计") {
								fake_result = '"Weight","74.9"';
							} else if (device_name == "呼吸机") {
								fake_result = '"Breath","rate:8.4,vol:488.4,lasttime:[[1448150465649,1448164865649],[1448168465649,1448182865649],[1448186465649,1448198201849]]}"';
							} else if (device_name == "氧气机") {
								fake_result = '"O2","{rate:16.9,o2:90.6,vol:45,lasttime:[[1448168850781,1448168850781]]}"';
							} else if (device_name == "血压计") {
								/* fake_result = '"血压","{收缩压:123,舒张压:145}"'; */
								fake_result = '"血压","{收缩压:160,舒张压:115}"';
							} else if (device_name == "血糖仪") {
								/* fake_result = '"GLU","12.2"'; */
								fake_result = '"GLU","11.2"';
							} else if (device_name == "用药管理") {
								fake_result = '"DRUG","1"';
							}
							
							device.callBacks[j].callBack(Android.getMsg('{"code":"0","data":[' + fake_result + '],"msg":"操作成功"}'))
							device.callBacks.splice(j, 1);
							j--;
						}
					}
					var date = new Date();
					var ms = date.getTime();
					device.status[i].最后开始时间 = ms;
					device.status[i].最后结束时间 = ms;
					device.status[i].最后检测参数 = 真正的消息;
					localStorage.setItem('devicestatus', JSON.stringify(device.status));
				}
			}
		} else if (debug == "false") {
			//运行回调方法
			device.callBacks[0].callBack(Android.getMsg(msgKey))
		}
	}

	return device;

});