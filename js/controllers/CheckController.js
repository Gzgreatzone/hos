'use strict';
//--------------
// name        : CheckController.js
// type        : 快速检测页面对应的控制器
// dependences : 这里依赖了devices.js bluethooth.js checkQueue.js
// usage       : 
//             : 
// copyright   : 
//--------------
angular.module('chafangbao.controllers')
.controller('CheckController', function($scope,$timeout,$interval,$ionicLoading,$window,$ionicHistory,$ionicPopup,$ionicModal,ThePerson,kfDevices,$rootScope,checkQueue) {
	//进入页面 预设仪表盘
	$scope.$on("$ionicView.beforeEnter", function () {
		var i;
		var j = 0;
		for (i in DEVICE) {
			if (j == 0) {
				$scope.activeDevice = DEVICE[i];
				j++;
			}
		}
		$scope.people = angular.copy(ThePerson.get());
	});
	//获取传入的人的参数
	$scope.people = angular.copy(ThePerson.get());

	//获取用户信息
	$rootScope.Pad_user.infoList.Height = $scope.people.height;
	$rootScope.Pad_user.infoList.Sex = $scope.people.sex;
	$rootScope.Pad_user.infoList.Weight = $scope.people.weight;
	$rootScope.Pad_user.infoList.Age = $scope.people.age;
	$rootScope.Pad_user.infoList.Name = $scope.people.name;
	//快速检测是不能报告和管理的
	$scope.isreport = ThePerson.returnIsReport();
	$scope.ischarge = ThePerson.returnIsCharge();
	//路由配置
	$scope.back = function () {
		window.history.go(-1);
	}
	$scope.toReport = function () {
		$window.location.href = "#/check_report";
	}
	$scope.toCheckSet = function () {
		$window.location.href = "#/checkset";
	}
	$scope.toAddperson = function () {
		$window.location.href = "#/addperson";
	}
	// console.logtorage);


	//扫描二维码
	$scope.sannerCR = function () {
	  	$rootScope.Fn.shake();
	  	//Android.qrcode();
	  	kfDevices.qrcode(function(msg)
	  		{
	  			var clearword = ThePerson.backqrcord(msg);
	  			alert(clearword);
	  			var peopleOne = ThePerson.get()
	  			if (ThePerson.restore(peopleOne,clearword)) {
	  				var Info = ThePerson.restore(peopleOne,clearword);
		  			ThePerson.setPeople(Info);
		  			//alert(Info);
		  			$scope.people = angular.copy(ThePerson.get());
		  			//$window.reload();
		  			$scope.$apply();
	  			}
	  		});
	}

	//强制退出
	$scope.exit = function (){
		$ionicPopup.prompt({
			title : "退出仪器还是重启系统",
			template : "退出仪器会结束当前仪器检测，如果无响应建议重启",
			buttons : [{
				text : "取消",
				type : "button-default"
			}, {
				text : "退出",
				type : "button-calm",
				onTap : function (e) {
					Android_do_cmd("exitMonitor");
					$rootScope.isServiceable = false;
					$rootScope.isDeviceAble = false;
				}
			}, {
				text : "重启",
				type : "button-assertive",
				onTap : function (e) {
					Android_do_cmd("resetSystem");
					$rootScope.isServiceable = false;
				}
			}]
		});
	}

	

	//离开页面初始化数据
	$scope.$on("$ionicView.leave", function () {
		$scope.manage_index.Monitor.init();
	});
	//输出设备
	$scope.device = DEVICE;

	//使用devices_IndexCheck服务
	$scope.manage_index = Function($scope);

	/*_____________________________________________________________________________________________*/

	//--------------
	// name        : 设置蓝牙回调
	// type        : 这里是配置了接收到消息的回调方法，以及给device的callback配置
	// dependences : 这里依赖了devices.js bluethooth.js checkQueue.js
	// usage       : 
	//             : 
	// copyright   : 
	//--------------
	var 设置蓝牙回调 = function () {
		var callbackArr = [
			// 血氧检测仪
			{
				devName : "血氧检测仪",
				statusName : "查找设备",
				callback : function () {
					Android_do_cmd("readMsg", "请打开血氧仪测量血氧，耐心等待结果");
					console.log("==> 请打开血氧仪测量血氧，耐心等待结果");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "请打开血氧仪测量血氧，耐心等待结果";
					});
				}
			}, {
				devName : "血氧检测仪",
				statusName : "蓝牙未连接",
				callback : function () {
					Android_do_cmd("readMsg", "请开启血氧仪")
					console.log("==> 血氧检测仪：蓝牙未连接啊啊啊！！");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "请开启血氧仪";
					});
				}
			}, {
				devName : "血氧检测仪",
				statusName : "尝试连接",
				callback : function (res) {
					Android_do_cmd("readMsg", "血氧检测仪：尝试第", res, "次！");
					console.log("==> 血氧检测仪：尝试第", res, "次！");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "血氧检测仪：尝试第", res, "次！";
					});
				}
			}, {
				devName : "血氧检测仪",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "检测成功");
					console.log("==> 检测成功");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					//blueTooth.init();
					//checkQueue.goNext();
					$timeout(function () {
						$rootScope.deviceMsg.content =  "检测成功";
						$rootScope.isServiceable = false;
					});
				}
			}, {
				devName : "血氧检测仪",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "血氧检测退出");
					console.log("==> 血氧检测退出");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					//blueTooth.init();
					//checkQueue.goNext();
					$timeout(function () {
						$rootScope.deviceMsg.content =  "血氧检测退出";
						$rootScope.isServiceable = false;
					});
				}
			},
			// 呼末二氧化碳
			{
				devName : "呼末二氧化碳",
				statusName : "查找设备",
				callback : function () {
					Android_do_cmd("readMsg", "请开启呼末二氧化碳仪");
					console.log("==> 请开启呼末二氧化碳仪");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "请开启呼末二氧化碳仪";
						$rootScope.isServiceable = true;
					});
					
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "蓝牙未连接",
				callback : function (res) {
					if (res == 1) {
						Android_do_cmd("readMsg", "蓝牙未连接")
						console.log("==> 呼末二氧化碳：蓝牙未连接啊啊啊！！");
						$timeout(function () {
							$rootScope.deviceMsg.content =  "蓝牙未连接";
						});
					}
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "已连接",
				callback : function () {
					Android_do_cmd("readMsg", "仪器已经成功连接，请吹气");
					console.log("==> 仪器已经成功连接，请吹气");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "仪器已经成功连接，请吹气";
					});
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "等待回复基线",
				callback : function () {
					Android_do_cmd("readMsg", "喂！你的残留气体没有清理干净，还不可以吹气");
					console.log("==> 喂！你的残留气体没有清理干净，还不可以吹气");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "喂！你的残留气体没有清理干净，还不可以吹气";
					});
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "适配器异常",
				callback : function () {
					Android_do_cmd("readMsg", "呼末二氧化碳适配器异常！我要报警了");
					console.log("==> 呼末二氧化碳适配器异常！我要报警了");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "呼末二氧化碳适配器异常！我要报警了";
					});
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "开始预热",
				callback : function () {
					Android_do_cmd("readMsg", "呼末二氧化碳仪在预热中，需要几分钟，请耐心等待");
					console.log("==> 退后，本宝宝要开始预热了");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "呼末二氧化碳仪在预热中，需要几分钟，请耐心等待";
					});
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "预热完成",
				callback : function () {
					Android_do_cmd("readMsg", "预热完成，请测量二氧化碳哟，缓缓的往外吹气，直到把肺内气体全部吹完，记得最后要含着吹嘴吸一下");
					console.log("==> 预热完成，请测量二氧化碳哟，缓缓的往外吹气，直到把肺内气体全部吹完，记得最后要含着吹嘴吸一下");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "预热完成，请测量二氧化碳哟，缓缓的往外吹气，直到把肺内气体全部吹完，记得最后要含着吹嘴吸一下";
					});
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "检测成功");
					console.log("==> 检测成功");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "检测成功";
					});
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "二氧化碳检测退出");
					console.log("==> 二氧化碳检测退出");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					//checkQueue.goNext();
					$timeout(function () {
						$rootScope.deviceMsg.content =  "二氧化碳检测退出";
						$rootScope.isServiceable = false;
					});
				}
			},
			//肺功能仪
			{
				devName : "肺功能仪",
				statusName : "查找设备",
				callback : function () {
					Android_do_cmd("readMsg", "请打开肺功能仪开关");
					console.log("==> 请打开肺功能仪开关");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "请打开肺功能仪开关";
						$rootScope.isServiceable = true;
					});
				}
			}, {
				devName : "肺功能仪",
				statusName : "蓝牙未连接",
				callback : function (res) {
					if (res == 1) {
						Android_do_cmd("readMsg", "蓝牙未连接")
						console.log("==> ：蓝牙未连接啊啊啊！！");
						$timeout(function () {
							$rootScope.deviceMsg.content =  "蓝牙未连接";
						});
					}
				}
			}, {
				devName : "肺功能仪",
				statusName : "已连接",
				callback : function () {
					Android_do_cmd("readMsg", "用最大力气吹气，直到肺内气体吹完为止");
					console.log("==> 用最大力气吹气，直到肺内气体吹完为止");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "用最大力气吹气，直到肺内气体吹完为止";
					});
				}
			}, {
				devName : "肺功能仪",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "检测成功");
					console.log("==> 检测成功");
					$rootScope.deviceMsg.content = "检测成功";
				}
			}, {
				devName : "肺功能仪",
				statusName : "不成功",
				callback : function () {
					console.log("==> 检测效果不好，您要不要吸一下氧");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "检测效果不好";
					});
				}
			}, {
				devName : "肺功能仪",
				statusName : "成功",
				callback : function () {
					console.log("==> 检测效果很好");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "检测效果很好";
					});
				}
			}, {
				devName : "肺功能仪",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "肺功能检测退出");
					console.log("==> 肺功能检测退出");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "肺功能检测退出";
						$rootScope.isServiceable = false;
					});
				}
			},
			//体重计
			{
				devName : "体重计",
				statusName : "查找设备",
				callback : function () {
					Android_do_cmd("readMsg", "请站到体重计上测量体重，耐心等待测量结果");
					console.log("==> 请站到体重上测量体重，耐心等待测量结果");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "请站到体重计上测量体重，耐心等待测量结果";
						$rootScope.isServiceable = true;
					});
				}
			}, {
				devName : "体重计",
				statusName : "蓝牙未连接",
				callback : function (res) {
					if (res == 1) {
						Android_do_cmd("readMsg", "蓝牙未连接")
						console.log("==> 蓝牙未连接啊啊啊！！");
						$timeout(function () {
							$rootScope.deviceMsg.content =  "蓝牙未连接";
						});
					}
				}
			}, {
				devName : "体重计",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "检测成功");
					console.log("==> 检测成功");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "检测成功";
						$rootScope.isServiceable = false;
					});
				}
			}, {
				devName : "体重计",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "体重测量退出");
					console.log("==> 体重测量退出");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					$timeout(function () {
						$rootScope.deviceMsg.content =  "体重测量退出";
						$rootScope.isServiceable = false;
					});

				}
			}
		];
		//包子写的，配置蓝牙里面的回调方法，遍历一整遍，配置好函数
		callbackArr && callbackArr.forEach(function (per) {
			var res = blueTooth.setApi(per['devName'], per['statusName'], per['callback']);
			//console.log(res[1]);
		});
		var co2CallbackArr = [{
				statusName : "预热完成",
				callback : function (Res) {
					_android("readMsg", "二氧化碳：" + (Res ? "预热完成！" : "预热检测超时！"));
					debug.Tips("==> 二氧化碳：" + (Res ? "预热完成！" : "预热检测超时！"), "color:green;");
				}
			}, {
				statusName : "需要校零",
				callback : function (Res) {
					_android("readMsg", "二氧化碳：需要校零！");
					debug.Tips("==> 二氧化碳：需要校零！", "color:goldenrod;");
				}
			}, {
				statusName : "校零完成",
				callback : function (Res) {
					_android("readMsg", "二氧化碳：校零完成！");
					debug.Tips("==> 二氧化碳：校零完成！", "color:green;");
				}
			}
		];
		co2CallbackArr && co2CallbackArr.forEach(function (per) {
			co2.setApi(per['statusName'], per['callback']);
		});
	};

	设置蓝牙回调();

	//检测回调函数
	//这里是因为device需要传入一个回调函数
	function 执行检测(Name, CheckTimes) {
		// 获得结果的回调在每次调用open时传入 // 业务：数据显示、下一次检测
		checkQueue ? checkQueue.pushIn(Name, $scope.manage_index.Monitor.callback, (Name == "体重计") && 160, CheckTimes) : console.error("缺少checkQueue！");
	};


//--------------
// name        : Function
// type        : （表现级）这里是模板展示，判断是否采纳，判断是否存储，转盘变化等。
// dependences : 这里依赖了devices.js bluethooth.js checkQueue.js
// usage       : 
//             : 
// copyright   : 
//--------------
	function Function(Scope) {
		var Fn = $rootScope.Fn,
		infoList = $rootScope.Pad_user.infoList;
		var co2CheckModel = $rootScope.co2CheckModel;
		var isDeviceAble = $rootScope.isDeviceAble;
		//为了适配安卓和PC调试
		// if(!window.rootPath)
		// 	window.rootPath = '/web/hos/';
		if(debug)
		{
			//当运行环境是PC时,使用http协议,模板是通过get请求获取的
			$ionicModal.fromTemplateUrl(window.rootPath + "templates/modal/modal_deviceMonitor.html", {
				scope : Scope
			}).then(function (Modal) {
				Scope.modal = Modal;
			});
		}
		else
		{
			//当运行环境是安卓时,使用file协议,模板是通过阻塞读取本地文件获取的
			Scope.modal = $ionicModal.fromTemplate(Android.getURL(window.rootPath + "templates/modal/modal_deviceMonitor.html"), {
				scope : Scope
			});
		}
		var pair = {
			light : function (Device) { // 对应设备亮灭
				if (Device) {
					Scope.chosenDevice = Device['deviceId'];
				} else {
					Scope.chosenDevice = '';
				}
			},
			//这里是展示模块的部分
			//小写modal 是真正的模板，大写的Modal是包子写的方法
			Modal : {
				//打开模板展示
				open : function () {
					Scope.Monitor_on = true;
					Scope.modal.show();
					Fn.shake();
					$rootScope.isDeviceAble = true;
					$timeout.cancel();
				},
				//退出模板展示，一般是点击按钮触发
				exit : function ()	{
					pair.Modal.close();    							//关闭模板
					checkQueue.stopCurrentGroup();					//退出整个检测队列
					$timeout(function() {
						$rootScope.isDeviceAble = false;   			//仪器可用
					}, 2000);
				},
				//真正的底层
				close : function () {
					Scope.Monitor_on = false;
					Scope.modal.hide();
					Fn.shake();
					//安卓退出检测
					Android_do_cmd("exitMonitor");
					debug && setTimeout(function () {
						AndroidCallBack('用户退出'); 				// '{"code":"0","data":["呼末二氧化碳","用户退出"],"msg":"用户退出"}'
					}, 500);
					//对应设备灰掉
					$timeout(function () {
					Scope.chosenDevice = undefined;    				 //仪器不亮了
					}, 500 + 10 * 1000);

				}
			},
			/* 点击指标设备，显示指标检测界面，既指针转动的那一块 */
			Monitor : {
				init : function () {

					//清除仪表盘样式
					$rootScope.deviceMsg.content = "消息服务还没有发消息过来……";
					$("#js_style_2").empty();
					//清除仪表盘之前数据
					var i;
					var j;
					for (i in DEVICE) {
						var dashboard = DEVICE[i]['dashboard'];
						for (j in dashboard) {
							//console.log(dashboard[j]['val']);
							delete dashboard[j]['val'];
						}
					}
				},
				//判断，每次点击都要来判断的
				check : function (Device) {
					//模板展示
					if (Device['dashboard'] == '') {
						$ionicPopup.alert({
							title : "提示",
							content : "设备未启用"
						}).then(function () {
							pair.light();
						});
						return false;
					} else {
						if (Device['id'] == "体重计" && (!infoList.Height)) {
							Scope.data = new Object;
							$ionicPopup.prompt({
								title : "请先设置身高",
								template : "<input type='text' style='text-align:center' ng-model='data.Height'>",
								scope : Scope,
								buttons : [{
									text : "取消",
									type : "button-default"
								}, {
									text : "确认",
									type : "button-calm",
									onTap : function (e) {
										var set_height = Scope.data.Height;
										if (set_height > 140 && set_height < 200) {
											Fn.setCfg("Height", set_height);
										};
										$timeout(function () {
											pair.Monitor.on(DEVICE['Weight'])
										}, 500);
									}
								}]
							});
							return false;
						}
						else if (Device['id'] == "肺功能仪" && (!infoList.Height) && (!infoList.Sex) && (!infoList.Weight) &&(!infoList.Age)) {
							Scope.data = new Object;
							$ionicPopup.prompt({
								title : "请先设置身高",
								template : '<label class="item item-input"><span class="input-label">体重(kg)</span><input ng-model="data.Weight" type="number"></label><label class="item item-input"><span class="input-label">身高(cm)</span><input type="number" ng-model = "data.Height"></label><label class="item item-input"><span class="input-label">性别</span><input ng-model="data.Sex" type="text"></label><label class="item item-input"><span class="input-label">年龄</span><input ng-model="data.Age" type="number"></label>',
								scope : Scope,
								buttons : [{
									text : "取消",
									type : "button-default"
								}, {
									text : "确认",
									type : "button-calm",
									onTap : function (e) {
										var set_height = Scope.data.Height;
										if (set_height > 140 && set_height < 200) {
											Fn.setCfg("Height", set_height);
										};
										$timeout(function () {
											pair.Monitor.on(DEVICE['Lung'])
										}, 500);
									}
								}
								]
							});
							return false;
						}
						else if (Device['id'] == "呼末二氧化碳" && $rootScope.co2CheckModel == "监测模式" && !$rootScope.isCheckCo2Router) {
							      window.location.href = "#/check_co2";
							      return false;
						}
						else {
						//开启设备服务
						    return true;
						}
					}
				},
				//开启仪器就要开这里，点击触发的
				//点击出发后会打开modal，执行Modal
				on : function (Device) {
					this.init();     //初始化
					this.de = Device;
					//某个仪器高亮
					pair.light(Device);     //灯亮

					//表盘选择
					Scope.activeDevice = Device;    //活动仪器
					if (!this.check(Device)) {
							return;
					};

					执行检测(Device['id'],Device['checkTimes']);   //执行检查
					pair.Modal.open();
					
				},

				//这里是回调函数，每次检测成功都会过来执行的
				callback : function (Signal, Result) {
					pair.Modal.close();       //关闭了模板
					合成语音("检测成功！");
					//$timeout(function () { // 延时关闭遮罩层
						//checkQueue.finalRes().push(res);
						Android_do_cmd("exitMonitor");
						// debug && setTimeout(function () {
						// 	AndroidCallBack('用户退出'); // '{"code":"0","data":["呼末二氧化碳","用户退出"],"msg":"用户退出"}'
						// }, 500);
						debug && AndroidCallBack('用户退出');
						//DeviceStatus.close();
					    var 仪表盘序号 = 1;
						var i;
						for (i in Result) {
							var j;
							for (j in DEVICE[Signal].dashboard) {
								var pre = DEVICE[Signal].dashboard[j];
								if (pre['type'] == i) {
									pair.Monitor.result.Rising(pre, Result[i], 仪表盘序号);
									pair.Monitor.result.Pointing(仪表盘序号, Result[i], pre['level']);
									仪表盘序号++;
								}
							}
						};
						if (!$scope.ischarge) {
							$timeout(function() {
								合成语音("是否采纳本次结果？");
								$ionicPopup.prompt({
									title : "是否采纳本次结果",
									template : "",
									scope : Scope,
									buttons : [{
									text : "取消",
									type : "button-default",
									onTap : function (e) {
										Scope.manage_index.Monitor.init();   //初始化指针样式
										Scope.manage_index.Modal.exit();     //退出模板
										$rootScope.isDeviceAble = false;
										合成语音("已取消本次测量结果！");
									}
									}, {
										text : "确认",
										type : "button-calm",
										onTap : function(e){
										合成语音("采纳成功！");
										$timeout(function () { 
							 	            pair.Monitor.checkAgain(Signal);    //进行下一次检测判断
							            }, 500);
										}
									}]
								});	
							}, 4000);
						} else {
							$timeout(function () { 
				 	            pair.Monitor.checkAgain(Signal);    //进行下一次检测判断
				            }, 500);
						}
					//}, 500);
					
				},
				checkAgain : function (Signal) { 						// 多次测量机制
					
					var resObj = Scope.resObj = kfDevices.getCurrentDevice_BySignal(Signal)['最后检测参数'];
					var Device = DEVICE[Signal];
					if (Device.checkTimes > 1) { 						// 需要多次测量
						Device.currentTimes++;
						if (Device.currentTimes < Device.checkTimes) {  	//还没到达检测次数
							Scope.manage_index.Monitor.init();   		//初始化
							Scope.manage_index.Modal.open();     		//打开模板
						} else {    									//已经到达
							kfDevices.save(Signal,infoList.Name);    					//保存
							$timeout(function() {
								$rootScope.isDeviceAble = false;    	//仪器点击可用
							}, 2000);
							Device.currentTimes = 0;
						}
					} else {
						kfDevices.save(Signal,infoList.Name);    		//保存结果
						$timeout(function() {
							$rootScope.isDeviceAble = false;  			 //仪器可用
						}, 2000);
						Device.currentTimes = 0;
					}
					//进行下一次检测
					checkQueue.goNext();
				},
				result : {
					Rising : function (Key, Val, Num) { // 检测结果”爬升“效果
						var valNum = 0;
						var interval = $interval(function () {
								if (valNum < Val) {
									Key['val'] = valNum++;
								} else {
									Key['val'] = Val;
									$interval.cancel(interval);
								}
							}, 10);
					},
					Pointing : function (Index, Val, Range) { // 检测结果“指针滑动”效果
						var level;
						var i;
						for (i = Range.length - 1; i >= 0; i--) {
							if (Val < Range[i]) {
								level = i;
							}
						}

						// 区间平均角度，基础角度，当前等级区间大小，偏移量，偏移角度
						var averageDeg = 180 / (Range.length - 1);
						var currentBasicDeg = (level - 1) * averageDeg;
						var currentIntervalSize = Range[level] - Range[level - 1];
						var currentOffsetVal = Val - Range[level - 1];
						var currentOffsetDeg = currentOffsetVal / currentIntervalSize * averageDeg;
						var realResult = currentBasicDeg + currentOffsetDeg;
						// 测量最大值
						var rangeMax = Math.max.apply(null, Range);
						// 最后数值
						var finalResult = realResult - 90;

						var js_style_name = "js_style_2";
						var js_style_content = '#manage_index .index_dashboard:nth-child(' + Index + ') .pointer {__sub__animation:pointer_play' + Index + ' 2s ease-in-out 1 forwards;}' + '@__sub__keyframes pointer_play' + Index + ' {from{__sub__transform:rotate(-90deg)}to{__sub__transform:rotate(' + finalResult + 'deg)}}';

						if ($("#" + js_style_name + "").index() < 0) {
							$("head").append('<style id="' + js_style_name + '"></style>');
						};

						var sub_array = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
						var i;
						for (i in sub_array) {
							$("#" + js_style_name + "").append(js_style_content.replace(/\__sub__/g, sub_array[i]));
						};
					}
			}
			}
		};
		return pair;
	};

});