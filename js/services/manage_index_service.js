'use strict';


angular.module('chafangbao.services')
.service('Manage_Index_Service',
	['$ionicModal', 'kfDevices', '$timeout', '$ionicPopup', '$rootScope',
		function ($ionicModal, kfDevices, $timeout, $ionicPopup, $rootScope) {
			function Function(Scope) {
				var Fn = $rootScope.Fn,
				infoList = $rootScope.Pad_user.infoList;
				
				$ionicModal.fromTemplateUrl("modal_deviceMonitor.html", {
					scope : Scope
				}).then(function (Modal) {
					Scope.modal = Modal;
				});
				
				var Array = {
					Modal : {
						//打开模板展示
						open : function () {
							Scope.Monitor_on = true;
							Scope.modal.show();
							Fn.shake();

							$timeout.cancel();
						},
						//关闭模板展示
						close : function () {
							Scope.Monitor_on = false;
							Scope.modal.hide();

							Fn.shake();

							//安卓退出检测
							Android_do_cmd("exitMonitor");

							//对应设备灰掉
							$timeout(function () {
								Scope.chosenDevice = ''
							}, 500 + 10 * 1000)
						}
					},
					/* 点击指标设备，显示指标检测界面 */
					Monitor : {
						save : function (msg) {
							kfDevices.save(msg);
						},
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
						on : function (Device) {
							this.init();
							console.log(Device);
							this.de = Device;
							//某个仪器高亮
							Scope.chosenDevice = Device['deviceId'];

							//表盘选择
							Scope.activeDevice = Device;

							if (Device['id'] == "肺功能仪") {
								$rootScope.txt_activeDevice = infoList.address + "，请打开" + Device['name'] + "，请用最大力吹气";
							} else {
								$rootScope.txt_activeDevice = infoList.address + "，您正在使用" + Device['name'] + "，请耐心等待检测结果";
							}

							//模板展示
							if (Device['dashboard'] == '') {
								$ionicPopup.alert({
									title : "提示",
									content : "设备未启用"
								}).then(function () {
									Scope.chosenDevice = '';
								});
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
												type : "button-positive",
												onTap : function (e) {
													var set_height = Scope.data.Height;
													if (set_height > 140 && set_height < 200) {
														Fn.setCfg("Height", set_height);
													};
													$timeout(function () {
														Array.Monitor.on(DEVICE['Weight'])
													}, 500);
												}
											}
										]
									});
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
												type : "button-positive",
												onTap : function (e) {
													var set_height = Scope.data.Height;
													if (set_height > 140 && set_height < 200) {
														Fn.setCfg("Height", set_height);
													};
													$timeout(function () {
														Array.Monitor.on(DEVICE['Lung'])
													}, 500);
												}
											}
										]
									});
								}
								 else {
									//开启设备服务
									if (debug == "true") {
										$timeout(function () {
											AndroidCallBack("设备服务输出消息", "{msg:" + Device['id'] + ",type:'" + Device['id'] + "n正在连接中……请保持设备'}");
										}, 500)

										$timeout(function () {
											AndroidCallBack("设备服务输出消息", "{msg:" + Device['id'] + ",type:'" + Device['id'] + "n设备连接成功，请大力吹气'}");
										}, 1000)

										$timeout(function () {
											AndroidCallBack("设备服务输出消息", "{msg:" + Device['id'] + ",type:'" + Device['id'] + "n检测成功'}");
											kfDevices.open(Device['id'], Array.Monitor.callback, Device);
										}, 4000)
									} else if (debug == "false") {
										kfDevices.open(Device['id'], Array.Monitor.callback, Device);
									}

									Array.Modal.open();

									//播报
									合成语音($rootScope.txt_activeDevice);
								}
							}
						},
						callback : function (msg) {
							//console.log(JSON.stringify(msg));
							//var abc = JSON.stringify(msg);
							//console.log(JSON.parse(abc));
							if (msg) {

								Scope.$apply(function () {
									msg = eval("(" + msg + ")");
									//console.log(msg);
									if (msg.msg == "操作成功") {
										合成语音("检测成功！");
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
														type : "button-positive",
														onTap : function(e){
															合成语音("采纳成功！");
															//Scope.manage_index.Monitor.save(msg);
															kfDevices.save(msg);

														}
													}
												]
											});	
										}, 4000);
										

									} else {
										合成语音("检测失败，请重试！");
									}

									//设置仪表盘样式

									var msg_angle_array = eval("(" + msg.data[1] + ")");

									//设备值数目 < 表盘数目
									if (msg.data[0] == "Weight") {
										console.log("对于”体重“，返回值是一个number,要先把返回值变成一个object再让其进入object的操作中！");
										msg_angle_array = eval("(" + '{weight_null:' + msg_angle_array + ',weight_null_2:"' + msg_angle_array / (Math.pow(infoList.Height / 100, 2)) + '"}' + ")");
									}

									//设备值数目 > 表盘数目
									var current_device_about = DEVICE[msg.data[0]].dashboard;

									//判断"msg.data[1]"类型
									//console.log(typeof(msg_angle_array))

									//延时关闭遮罩层
									$timeout(function () {
										var dashboard_index = 1;

										Array.Modal.close();

										//console.log(JSON.stringify(msg_angle_array))
										if (typeof(msg_angle_array) == "object") {

											//当数据是一个数组时
											for (var i in msg_angle_array) {

												for (var j in current_device_about) {
													if (current_device_about[j].type == i) {
														//console.log(current_device_about[j])
														current_device_about[j]['val'] = parseFloat(msg_angle_array[i]).toFixed(2).replace('.00', '');
														var device_level = current_device_about[j].level
													}
												}
												//console.log(dashboard_index, msg_angle_array, device_level)
												Array.Monitor.result(dashboard_index, msg_angle_array[i], device_level);

												dashboard_index++;

											};

										} else if (typeof(msg_angle_array) == "number") {

											//当数据是一个数字时

											for (var j in current_device_about) {
												if (current_device_about[j].type == msg.data[0]) {
													//console.log(current_device_about[j])
													current_device_about[j]['val'] = parseFloat(msg_angle_array).toFixed(2).replace('.00', '');
													var device_level = current_device_about[j].level
												}
											}
											//console.log(dashboard_index, msg_angle_array, device_level)
											Array.Monitor.result(dashboard_index, msg_angle_array, device_level);
										}

									}, 500);
								});
							};
						},
						/* 要在不同浏览器使用，需要添加前缀 开始 */
						style : function (js_style_name, js_style_content) {
							if ($("#" + js_style_name + "").index() < 0) {
								$("head").append('<style id="' + js_style_name + '"></style>');
							};
							var sub_array = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
							for (var i = 0; i < sub_array.length; i++) {
								$("#" + js_style_name + "").append(js_style_content.replace(/\__sub__/g, sub_array[i]));
							};
						},
						result : function (Index, Val, Range) {

							for (var i = Range.length - 1; i >= 0; i--) {
								if (Val < Range[i]) {
									var level = i;
								}
							}

							if (debug == "true" && !level) {
								alert("debug模式下的调试信息：如果angle_val不在angle_level的范围内，就会报错！")
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

							console.log("\n|----->等级划分：" + Range + "\n|----->当前数值对应：最小值" + Range[level - 1] + "；最大值" + Range[level] + "\n|----->当前数值" + Val + "\n|----->获得当前数值对应等级" + level);

							console.log("\n|----->区间平均角度" + averageDeg, "\n|----->基础角度" + currentBasicDeg, "\n|----->当前等级区间大小" + currentIntervalSize, "\n|----->偏移量" + currentOffsetVal, "\n|----->偏移角度" + currentOffsetDeg, "\n|----->真实角度" + realResult)

							console.log("\n		显示值：", Val, "显示比例：", Val / rangeMax, " | 最终角度：", finalResult)

							Array.Monitor.style("js_style_2", '#manage_index .index_dashboard:nth-child(' + Index + ') .pointer {__sub__animation:pointer_play' + Index + ' 2s ease-in-out 1 forwards;}' + '@__sub__keyframes pointer_play' + Index + ' {from{__sub__transform:rotate(-90deg)}to{__sub__transform:rotate(' + finalResult + 'deg)}}');
						},
						pointer : function () {}
					}
				};
				return Array;
			};
			return Function;
		}
	]);
