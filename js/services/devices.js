'use strict';


angular.module('chafangbao.services')
.service('kfDevices',
	['$rootScope',
		function ($rootScope) {
			
			var stat;
			if (debug == "true") {
				stat = localStorage.getItem("devicestatus");
			} else if (debug == "false") {
				stat = 安卓用键获取值("devicestatus");
			}

			if (!stat) {
				var data = [{
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

			var device = {
				status : data,
				//回调数组
				callBacks : [],
				//开启 device.open("中文设备","回调","标志字")
				open : function (name, callBack, arg) {
					//alert("name："+name+"\ncallBack："+callBack+"\narg："+arg)
					var callBackPair = new Object();
					var index;
					var x;
					var y;

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
							console.log("加入数组后")
							//开始设备
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
				}
			}

			//获取参数
			window.AndroidCallBack = function (消息标识, msgKey) {
				if (消息标识 == "设备服务输出消息") {
					var msg = eval("(" + Android_do_cmd("getMsg", msgKey) + ")").type;
					$rootScope.$apply(function () {
						$rootScope.txt_activeDevice = msg.substring(msg.indexOf("n") + 1, msg.length);
						合成语音($rootScope.txt_activeDevice);
					})
				} else {
					//运行回调方法
					for (var i in device.status) {
						var 判断指标;
						if (debug == "true") {
							判断指标 = device.status[i].设备名 + 'APP' == 消息标识;
						} else if (debug == "false") {
							判断指标 = device.status[i].消息标识 == 消息标识;
						}

						if (判断指标) {
							for (var j = 0; j < device.callBacks.length; j++) {
								if (device.callBacks[j].name == device.status[i].设备名) {
									var 真正的消息;
									var date = new Date();
									var ms = date.getTime();

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
									} else if (debug == "false") {
										真正的消息 = Android_do_cmd("getMsg", msgKey);
									}

									device.callBacks[j].callBack(真正的消息);
									device.callBacks.splice(j, 1);
									j--;

									device.status[i].最后开始时间 = ms;
									device.status[i].最后结束时间 = ms;
									device.status[i].最后检测参数 = 真正的消息;

									if (debug == "true") {
										localStorage.setItem("devicestatus", JSON.stringify(device.status));
									} else if (debug == "false") {
										安卓设置键值对("devicestatus", JSON.stringify(device.status));
									}
								}
							}
						}
					}

				}
			}
			return device;
		}
	]);
