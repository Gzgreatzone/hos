'use strict';

angular.module('chafangbao.services')
.service('MeasureService',['$ionicModal', 'kfDevices', '$timeout','$ionicPopup', '$rootScope','$window','$interval',function ($ionicModal, kfDevices, $timeout, $ionicPopup, $rootScope,$window,$interval) {
	function Function(Scope) {
		var Fn = $rootScope.Fn,
		infoList = $rootScope.Pad_user.infoList;
		var co2CheckModel = $rootScope.co2CheckModel;
		var isDeviceAble = $rootScope.isDeviceAble;
		//为了适配安卓和PC调试
		if(!window.rootPath)
			window.rootPath = '/web/hos/';
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
		Fn.deviceMsg.init();

		var pair = {
			light : function (Device) { // 对应设备亮灭
				if (Device) {
					Scope.chosenDevice = Device['deviceId'];
				} else {
					Scope.chosenDevice = '';
				}
			},
			Modal : {
				//打开模板展示
				open : function () {
					Scope.Monitor_on = true;
					Scope.modal.show();
					Fn.shake();
					isDeviceAble = true;
					$timeout.cancel();
				},
				//关闭模板展示
				exit : function ()	{
					pair.Modal.close();
					$timeout(function() {
						$rootScope.isDeviceAble = false;
					}, 3000);
				},
				close : function () {
					Scope.Monitor_on = false;
					Scope.modal.hide();

					Fn.shake();

					//安卓退出检测
					Android_do_cmd("exitMonitor");

					//对应设备灰掉
					$timeout(function () {
					Scope.chosenDevice = undefined;
					}, 500 + 10 * 1000);
					$timeout(function () {
						Fn.deviceMsg.init();
					}, 500);
					
				}
			},
			/* 点击指标设备，显示指标检测界面 */
			Monitor : {
				init : function () {

					//清除仪表盘样式
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
						else if (Device['id'] == "肺功能仪" && (!infoList.Height)) {
							Scope.data = new Object;
							$ionicPopup.prompt({
								title : "请先设置身高",
								template : '<label class="item item-input"><span class="input-label">体重</span><input ng-model="data.Weight" type="number"></label><label class="item item-input"><span class="input-label">身高</span><input type="number" ng-model = "data.Height"></label><label class="item item-input"><span class="input-label">性别</span><input ng-model="data.Sex" type="text"></label><label class="item item-input"><span class="input-label">年龄</span><input ng-model="data.Age" type="number"></label>',
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
				on : function (Device) {
					this.init();
					console.log(Device);
					this.de = Device;
					//某个仪器高亮
					pair.light(Device);
					//Scope.chosenDevice = Device['deviceId'];

					//表盘选择
					Scope.activeDevice = Device;
					当前设备.read(Device['tips'][0]);
					//pair.Modal.open();
					if (!this.check(Device)) {
							return;
					};

					// if (Device['id'] == "肺功能仪") {
					// 	$rootScope.txt_activeDevice = infoList.address + "，请打开" + Device['name'] + "，请用最大力吹气";
					// } else {
					// 	$rootScope.txt_activeDevice = infoList.address + "，您正在使用" + Device['name'] + "，请耐心等待检测结果";
					// }
					//console.log(debug);
					if (debug) {
							 
							 var aaa = function (Txt) {
							 	var Name = Device['id'];
								var res = "{msg:'" + Name + "<br/>" + Txt + "',type:'" + Name + "'}";
								window.AndroidCallBack("设备服务输出消息", res);
							};
							var bbb = function (txt, time) {
								$timeout(function () {
									aaa(txt);
								}, time);
							};
							var arr1 = [
								["正在连接设备"],
								[["重试", "0次"]],
								[["重试", "1次"]],
								/* [["重试", "2次"]],
								[["重试", "3次"]],
								[["重试", "4次"]],
								[["重试", "5次"]], */
								[["连接成功"]],
								/* [["失败", "0次"]] */
							];
							var i;
							for (i = 0; i < arr1.length; i++) {
								bbb(arr1[i][0], i * 1000);
							};
							// var res = "{msg:'" + Name + "<br/>" + "连接成功" + "',type:'" + Name + "'}";
							// window.AndroidCallBack("设备服务输出消息", res);
							$timeout(function () {
								kfDevices.open(Device['id'], pair.Monitor.callback, Device);
							}, 1000);
						} 
					else {
							kfDevices.open(Device['id'], pair.Monitor.callback, Device);
						 }

							pair.Modal.open();

							//播报
							//合成语音($rootScope.txt_activeDevice);
					
				},
				callback : function (Signal, Result) {
					合成语音("检测成功！");
					$timeout(function () { // 延时关闭遮罩层
						Fn.tips.show("检测成功", 500);
						pair.Modal.close();
						DeviceStatus.close();
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
									Scope.manage_index.Monitor.init();
									合成语音("已取消本次测量结果！");
								}
								}, {
									text : "确认",
									type : "button-calm",
									onTap : function(e){
									合成语音("采纳成功！");
									$timeout(function () { 
						 	            pair.Monitor.checkAgain(Signal);
						            }, 500);
									}
								}]
							});	
						}, 4000);
					}, 500);

				},
				checkAgain : function (Signal) { // 多次测量机制
					var resObj = Scope.resObj = kfDevices.getCurrentDevice_BySignal(Signal)['最后检测参数'];
					var Device = DEVICE[Signal];
					if (Device.checkTimes > 1) { // 需要多次测量
						try {
							pair.showResArr(true);
						} catch (e) {
							Device.currentTimes++;
						}
						Fn.tips.show("当前正在检测" + Device.name + "第" + Device.currentTimes + "次，一共需要测量" + Device.checkTimes + "次", 500);
						if (Device.currentTimes < Device.checkTimes) { // 未达到检测总次数
							$timeout(function () {
								pair.Monitor.on(Device);
							}, 500);
						} else { // 达到检测总次数
							Device.currentTimes = 0;
							var res = {
								id : infoList.id,
								type : '治疗前血氧检测',
								data : resObj
							};
							kfDevices.save(Signal);
							$timeout(function() {
								$rootScope.isDeviceAble = false;
							}, 2000);
							//发送信息到MQTT(JSON.stringify(res));
						}
					} else {
						pair.Monitor.showResArr();
						kfDevices.save(Signal);
						$timeout(function() {
							$rootScope.isDeviceAble = false;
						}, 2000);
					}
				},
				showResArr : function (isTrue) {
					$timeout(function () {
						if (isTrue) {
							Scope.showResArr = true;
						} else {
							Scope.showResArr = false;
						}
					  });
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

						// console.log("\n|----->等级划分：" + Range + "\n|----->当前数值对应：最小值" + Range[level - 1] + "；最大值" + Range[level] + "\n|----->当前数值" + Val + "\n|----->获得当前数值对应等级" + level);

						// console.log("\n|----->区间平均角度" + averageDeg, "\n|----->基础角度" + currentBasicDeg, "\n|----->当前等级区间大小" + currentIntervalSize, "\n|----->偏移量" + currentOffsetVal, "\n|----->偏移角度" + currentOffsetDeg, "\n|----->真实角度" + realResult);

						// console.log("\n		显示值：", Val, "显示比例：", Val / rangeMax, " | 最终角度：", finalResult);

						// 为不同浏览器使用，添加必要的前缀
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
		var 当前设备 = {
			设备名 : '',
			设备状态 : '',
			设备状态提示次数 : 0,
			大重复次数 : 0,
			init : function () {
				Fn.tips.show("恢复设备初始化", 500);
				this.设备名 = '';
				this.设备状态 = '';
				this.设备状态提示次数 = 0;
				this.大重复次数 = 0;
			},
			getDeviceTips : function (设备名) {
				for (var i in DEVICE) {
					var pre = DEVICE[i];
					if (pre['id'] == 设备名) {
						return pre['tips'];
					}
				}
			},
			read : function (Txt) {
				var 用户昵称 = infoList.address;
				var readTxt = (用户昵称 ? 用户昵称 + "，" : "") + Txt;
				$timeout(function () {
					Scope.txt_activeDevice = readTxt;
				});
				合成语音(readTxt);
			},
			// 接收设备消息匹配
			Mapper : [{
					key : "正在连接设备",
					func : function (设备名, msg) {
						DeviceStatus.isOpening = true;
						当前设备['设备名'] = msg.split('<br/>')[0];
					}
				}, { // 对应 连接成功
					key : "连接成功",
					func : function (设备名, msg) {
						for (var i in DEVICE) {
							var pre = DEVICE[i];
							if (pre['id'] == 设备名) {
								当前设备.read(设备名 + pre['linked']);
							}
						}
					}
				}, { // 用户手动退出
					key : "用户退出",
					func : function (设备名, msg) {
						DeviceStatus.close();
						当前设备.init();
					}
				}, { // 对应 血氧检测仪
					key : "重试",
					func : function (设备名, msg) {
						var 重试次数 = msg.match(/([0-5]{1})/)[0];
						var tips = 当前设备.getDeviceTips(设备名);
						if (重试次数 == 1) {
							当前设备.read(tips[1]);
						} else if (重试次数 == 3) {
							当前设备.read(tips[2]);
							$timeout(function () {
								Array.Modal.close();
							}, 1000);
						}
					}
				}, {
					key : "失败",
					func : function (设备名, msg) {
						当前设备.read("我好伤心哦，我还会回来的");
						$timeout(function () {
							Array.Modal.close();
						}, 1000);
					}
				}, { // 对应 呼末二氧化碳
					key : "待命",
					func : function (设备名, msg) {
						Fn.tips.show(msg, 500);
						//当前设备.read("呼末二氧化碳仪已连接，仪器需要预热几分钟，请耐心等待");
					}
				}, {
					key : "请呼气",
					func : function (设备名, msg) {
						当前设备.设备状态 = '预热完成';
						if (当前设备.设备状态提示次数 == 0) {
							当前设备.read("预热完成，请测量二氧化碳哟，缓缓的往外吹气，直到把肺内气体全部吹完，记得最后要含着吹嘴吸一下喔");
						}
						当前设备.设备状态提示次数++;
						Fn.tips.show(当前设备.设备状态提示次数, 500);
					}
				}
			],
			recieveMsg : function (Data) {
				try {
					var msg = eval("(" + Data + ")")['msg'];
					var i;
					for (i in this.Mapper) {
						var per = this.Mapper[i];
						if (msg.match(per['key'])) {
							per['func'](this.设备名, msg);
							//alert(msg);
						}
					}
				} catch (e) {
					alert(e);
				}
			},
			func : function (消息标识, getMsg) {
				// 展示参数
				Fn.deviceMsg.func("消息标识:" + 消息标识 + "<br />getMsg:" + getMsg, true);
				// 处理参数
				if (消息标识.match(/设备服务输出消息/)) { // 正常接收到信息 
					当前设备.recieveMsg(getMsg);
					return false;
				} else if (消息标识.match(/用户退出/)) { // 当用户点击退出，安卓输出“用户退出”的情况
					当前设备.recieveMsg(消息标识);
					return false;
				} else if (getMsg && getMsg.match(/用户退出/)) { // 当检测完后，安卓输出“用户退出”的情况
					当前设备.recieveMsg(getMsg);
					return false;
				} else {
					return true;
				}
			}
		};
		$window.recieveDeviceMsg = 当前设备.func;
		var DeviceStatus = Scope.DeviceStatus = {
			isOpening : false,
			show : false,
			txt : '',
			close : function () { // 设备状态改为关闭
				var This = this;
				This.txt = '设备退出成功';
				This.isOpening = false;
				// 延迟关闭，展示一下状态
				$timeout(function () {
					This.show = false;
				}, 500);
			}
		};
		return pair;
	};
	return Function;
}
]);


