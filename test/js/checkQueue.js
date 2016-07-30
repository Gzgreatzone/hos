/**
 * 一系列业务相关的东东
 * 依赖 [devices, blueTooth]
 */
var checkQueue = (function () {

	function 设置蓝牙回调() {
		var callbackArr = [
			// 血氧检测仪
			 {
			 	devName : "血氧检测仪",
			 	statusName : "查找设备",
			 	callback : function () {
					Android_do_cmd("readMsg", "神啊，我要开始连接了");
					debug.Tips("==> 神啊，我要开始连接了");
				}
			 } ,{
				devName : "血氧检测仪",
				statusName : "蓝牙未连接",
				callback : function () {
					Android_do_cmd("readMsg", "血氧检测仪：您是不是没有开机或者没有连接蓝牙！！")
					debug.Tips("==> 血氧检测仪：蓝牙未连接啊啊啊！！");
				}
			}, {
				devName : "血氧检测仪",
				statusName : "尝试连接",
				callback : function (res) {
					Android_do_cmd("readMsg", "血氧检测仪：尝试第", res, "次！");
					debug.Tips("==> 血氧检测仪：尝试第", res, "次！");
				}
			}, {
				devName : "血氧检测仪",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "血氧检测仪：用户退出！");
					debug.Tips("==> 血氧检测仪：用户退出！");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					//blueTooth.init();
					自动进行下一个检测();
				}
			},
			// 呼末二氧化碳
			{
				devName : "呼末二氧化碳",
				statusName : "查找设备",
				callback : function () {
					Android_do_cmd("readMsg", "神啊，我要开始连接了");
					debug.Tips("==> 神啊，我要开始连接了");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "蓝牙未连接",
				callback : function (res) {
					if (res == 1) {
						Android_do_cmd("readMsg", "蓝牙未连接")
						debug.Tips("==> 呼末二氧化碳：蓝牙未连接啊啊啊！！");
					}
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "已连接",
				callback : function () {
					Android_do_cmd("readMsg", "哈哈哈哈让我连上了吧");
					debug.Tips("==> 哈哈哈哈让我连上了吧");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "等待回复基线",
				callback : function () {
					Android_do_cmd("readMsg", "喂！你的残留气体没有清理干净，还不可以吹气");
					debug.Tips("==> 喂！你的残留气体没有清理干净，还不可以吹气");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "适配器异常",
				callback : function () {
					Android_do_cmd("readMsg", "呼末二氧化碳适配器异常！我要报警了");
					debug.Tips("==> 呼末二氧化碳适配器异常！我要报警了");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "开始预热",
				callback : function () {
					Android_do_cmd("readMsg", "退后，本宝宝要开始预热了");
					debug.Tips("==> 退后，本宝宝要开始预热了");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "预热完成",
				callback : function () {
					Android_do_cmd("readMsg", "呼末二氧化碳预热完成！，请吹气啦啦啦啦");
					debug.Tips("==> 呼末二氧化碳预热完成！，请吹气啦啦啦啦");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "好了好了不用吹了搞定了");
					debug.Tips("==> 好了好了不用吹了搞定了");
				}
			}, {
				devName : "呼末二氧化碳",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "呼末二氧化碳：用户退出！");
					debug.Tips("==> 呼末二氧化碳：用户退出！");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					// blueTooth.init();
					自动进行下一个检测();
				}
			},
			//肺功能仪
				{
				 devName : "肺功能仪",
				 statusName: "查找设备",
				 callback : function () {
				 	Android_do_cmd("readMsg", "神啊，我要开始连接了");
					debug.Tips("==> 神啊，我要开始连接了");
				 }
			}, {
				devName : "肺功能仪",
				statusName : "蓝牙未连接",
				callback : function (res) {
					if (res == 1) {
						Android_do_cmd("readMsg", "蓝牙未连接")
						debug.Tips("==> 呼末二氧化碳：蓝牙未连接啊啊啊！！");
					}
				}
			}, {
				devName : "肺功能仪",
				statusName : "已连接",
				callback : function () {
					Android_do_cmd("readMsg", "哈哈哈哈让我连上了吧");
					debug.Tips("==> 哈哈哈哈让我连上了吧");
				}
			}, {
				devName : "肺功能仪",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "好了好了不用吹了搞定了");
					debug.Tips("==> 好了好了不用吹了搞定了");
				}
			}, {
				devName : "肺功能仪",
				statusName : "不成功",
				callback : function () {
					debug.Tips("==> 检测效果不好，您要不要吸一下氧");
				}
			}, {
				devName : "肺功能仪",
				statusName : "成功",
				callback : function () {
					debug.Tips("==> 检测效果很好");
				}
			}, {
				devName : "肺功能仪",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "肺功能仪：用户退出！");
					debug.Tips("==> 肺功能仪：用户退出！");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					// blueTooth.init();
					自动进行下一个检测();
				}
			},
			//体重计
			   {
			   	devName : "体重计",
			   	statusName : "查找设备",
			   	callback : function () {
				 	Android_do_cmd("readMsg", "神啊，我要开始连接了");
					debug.Tips("==> 神啊，我要开始连接了");
				 }
			}, {
				devName : "体重计",
				statusName : "蓝牙未连接",
				callback : function (res) {
					if (res == 1) {
						Android_do_cmd("readMsg", "蓝牙未连接")
						debug.Tips("==> 呼末二氧化碳：蓝牙未连接啊啊啊！！");
					}
				}
			}, {
				devName : "体重计",
				statusName : "检测成功",
				callback : function () {
					Android_do_cmd("readMsg", "搞定");
					debug.Tips("==> 搞定");
				}
			}, {
				devName : "体重计",
				statusName : "用户退出",
				callback : function () {
					Android_do_cmd("readMsg", "体重计：用户退出！");
					debug.Tips("==> 体重计：用户退出！");
					console.log("------%c 检测结束 %c------", "color: darkgreen", "");
					// blueTooth.init();
					自动进行下一个检测();
				}
			}
		];
		callbackArr && callbackArr.forEach(function (per) {
			var res = blueTooth.setApi(per['devName'], per['statusName'], per['callback']);
			debug.Tips(res[1]);
		});
	};

	var 模拟数据 = {
		timer : [],
		cancel : function () {
			clearInterval(this.timer);
		},
		func : function (name) {
			if (isDebug) {
				var This = this;
				var i = 0;
				function temp() {
					i++;
					if (name == "呼末二氧化碳") {
						if (i > 23) {
							clearInterval(This.timer);
							return;
						} else if (i >= 20) {
							AndroidCallBack('设备服务输出消息', '[获得结果, 38.39]'); // "设备服务输出消息","{msg:'呼末二氧化碳:<br/>[获得结果, 38.39]',type:'呼末二氧化碳'}"
						} else if (i > 15) {
							AndroidCallBack('设备服务输出消息', '[当前co2, 待命 [277.58997, 241.82002, 241.82002] 0.0 -1000.0]');
						} else if (i > 13) {
							AndroidCallBack('设备服务输出消息', '[当前co2, 待命 [277.58997, 241.82002, -1000.0] 0.0 -1000.0]');
						} else if (i > 9) {
							AndroidCallBack('设备服务输出消息', '[当前co2, 基线回复 [277.58997, 241.82002, 201.14995] 0.0 -1000.0]');
						} else if (i > 7) {
							AndroidCallBack('适配器脱落');
						} else {
							AndroidCallBack('[CO2状态, null]');
						}
					} else if (name == "血氧检测仪") {
						if (i > 14) {
							clearInterval(This.timer);
							return;
						} else if (i > 12) {
							AndroidCallBack('SPO2', '{"code":"0","data":["SPO2","{spo2:98,hr:70}"],"msg":"操作成功"}');
						} else if (i > 11) {
							AndroidCallBack('<br/>[失败, 1次]');
						} else if (i > 6) {
							AndroidCallBack('<br/>[重试, ' + (i - 7) + '次]');
						} else if (i > 5) {
							AndroidCallBack('<br/>[失败, 0次]');
						} else {
							AndroidCallBack('<br/>[重试, ' + (i - 1) + '次]');
						}
					}
				}
				This.timer = setInterval(temp, 50);
			}
		}
	};

	var 最终检测结果;  //将最后获得的结果返回
	var 检测列表 = [];  //每次点击都会在该列表里添加
	function 加入检测列表(Name, Callback, Data, CheckTimes) {  //传入四个参数，设备名，回调函数，数据？ 检查次数
		检测列表.push([Name, Callback, Data, CheckTimes]);      //推入检测列表
		if (检测列表.length == 1) {								//如果长度为1，马上检测？
			最终检测结果 = [];
			进行检测(Name, Callback, Data);
		};
	};

	function 进行检测(Name, Callback, Data) {      //执行的函数
		// console.log("111", arguments);
		devices.open(Name, Callback, Data);       //接下来的工作交给device去做了
		模拟数据.cancel();
		setTimeout(function () {
			模拟数据.func(Name);
		}, 500);
	};

	function 自动进行下一个检测() {            //每一次用户退出都要执行他，
		var arr0 = 检测列表[0];					//把执行列表第一个拿出来
		if (arr0[3]-- > 1) {					//
			进行检测(arr0[0], arr0[1], arr0[2]);    //检测
		} else {
			最终检测结果 = [];
			检测列表.splice(0, 1);
			var arr1 = 检测列表[0];
			arr1 && 进行检测(arr1[0], arr1[1], arr1[2]);
		}
	};

	return {
		setApi : 设置蓝牙回调,
		open : function (Name, CheckTimes) {
			// 获得结果的回调在每次调用open时传入 // 业务：数据显示、下一次检测
			加入检测列表(Name, function (res) {
				最终检测结果.push(res);
				debug.Tips("==> 执行检测成功回调！！", 最终检测结果);
				Android_do_cmd("exitMonitor");
				isDebug && setTimeout(function () {
					AndroidCallBack('用户退出'); // '{"code":"0","data":["呼末二氧化碳","用户退出"],"msg":"用户退出"}'
				}, 500);
			}, (Name == "体重计") && 160, CheckTimes);
		},
		show : function () {
			return 检测列表;
		}
	}
})();
