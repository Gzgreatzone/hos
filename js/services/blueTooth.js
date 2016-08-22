/**
 * author               包子约翰
 * time                 2016-07-22
 * title                蓝牙体验插件
 * desc(介绍)           提供了一个全局的“_blueTooth”方法，处理设备检测数据，优化蓝牙体验：

 * --- 接口列表 ---

 * init                 初始化接口
 *    param(参数)       设备名（为空时默认null）；
 *    func(功能)        设置当前检测设备的“devName(设备名)”、“状态对象(一个记录状态触发次数的Object对象)”；
 *    howToUse(使用)    1、在device.js中的device.open接口被调用时应触发”init(某设备)“；
 *                      2、全局对象AndroidCallBack接收到analyse的返回值为“isRes”时应触发“init(null)”；
 *                      3、在analyse触发”用户退出“状态时，其回调函数应触发”init(null)“；

 * setApi               调配置接口
 *    param             设备名，状态名，回调函数；
 *    func              在业务层中配置对应状态的”callback(回调)“，
 *                      回调函数被触发时，返回当前状态接收到的“currentTimes次数”；                                             {number}

 * analyse              分析接口
 *     desc             解析当前消息，分析当前消息处于何种状态，满足”timesList(次数)“和“key(关键字)”时触发其回调；
 *     param            安卓端接到的消息；
 *     func             通过分析消息是否匹配“消息对照表”中的“key(关键字)”，确定当前“name(状态名称)”；
 *     return           当前消息是否在消息对照表中已定义(是否检测结果)；                                                       {boolean}
 */

/**
 * 依赖 [_checkQueue]
 */

var blueTooth = (function () {
	var 设备名;
	var 状态对象;
	var 状态粒度对象; // 用于判断”蓝牙未连接“等复杂事件
	var 计数器;
	var 执行计数器对象;

	function 生成消息对照表() { // 进入controller只执行一次
		var 对照表 = {
			"呼末二氧化碳" : [{
					name : "查找设备",
					keys : "正在连接设备",
					times : 1,
					callback : function () {}
				}, {
					name : "蓝牙未连接",
					keys : "CO2状态, null",
					timesFunc : function () {
						var res = false;
						// 获取连续的状态
						var tmp;
						var arr = 状态粒度对象["蓝牙未连接"].concat();
						var tempArr = [];
						while (tmp = arr.shift()) {
							if (tempArr.length == 0) {
								tempArr.push([tmp]);
								continue;
							}
							var e = tempArr[tempArr.length - 1];
							if (tmp == e[e.length - 1] + 1) {
								e.push(tmp);
							} else {
								tempArr.push([tmp]);
							}
						}
						// 获取n个连续状态
						var num = 0;
						var deleteArr = [];
						tempArr.forEach(function (per) {
							if (per.length == 3) {
								num++;
								deleteArr = per.concat(deleteArr);
							}
						});
						// 判断结果，有至少一个数组为“n个连续”
						if (num >= 1) {
							res = true;
						}
						// 将已经判断过的粒度删除
						var deleteReg = deleteArr.map(function (per) {
								return '^' + per + '$';
							}).join('|');
						if (deleteReg) {
							deleteReg = new RegExp(deleteReg, "igm");
							var newArr = [];
							var arr2 = 状态粒度对象["蓝牙未连接"];
							arr2.forEach(function (a) {
								if (!deleteReg.test(a)) {
									newArr.push(a);
								}
							});
							状态粒度对象["蓝牙未连接"] = newArr;
						}
						return res;
					},
					callback : function () {}
				},
				// 要添加的主要逻辑①
				{
					name : "已连接",
					keys : "设备连接中",
					times : 1,
					callback : function () {
						console.log("111", "一连接上设备就开启一个”Interval定时器“来轮询“Android.getDeviceStatus('CO2Heater') =(立即返回)= true|false”，最长时间（20s）内仍然没有预热完成，就提醒可以吹气，预热完成“界面上有个黄色三角形指示灯变绿”");
					}
				}, /* {
				name : "等待回复基线",
				keys : ["基线回复", "平稳基线"],
				times : 4,
				callback : function () {}
				}, */
				{
					name : "适配器异常",
					// 匹配其中一条就添加一次，次数和times里的其中一个匹配就提醒
					keys : ["适配器脱落", "适配器接触不良", "未知异常错误处理"],
					// 第n次接收到会调用，为空时每次都会调用
					times : [1, 11, 21, 31, 41, 51, 61, 71, 81],
					callback : function () {}
				},  {
					name : "开始预热",
					keys : "正在预热中",
					times : 1,
					callback : function () {}
					},  
					 {
					name : "预热完成",
					times : 1,
					keysFunc : function (Txt) { // 通过判断是否有三次连续的“[-1000,-1000,-1000]”，来判断是否预热完成 // deprecate
						var res = false;
						if (!/等待回复基线|错误|等待回复平稳基线/.test(Txt)) {
						var dataArr = false;
						var data = Txt && Txt.match(/\[(.*?),(.*)\]/igm);
						if (data && data[0]) {
							dataArr = data[0].match(/-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)/igm);
						}
						if (dataArr && dataArr.length == 5) {
							var tempRes = true;
							dataArr.forEach(function (per, index) {
								(index < 3) && (tempRes = tempRes && (+per > -1000.0));
							});
							res = tempRes;
						}
					}
						return res;
					},
					callback : function () {}
					},  
				// 要添加的主要逻辑②
				{
					name : "基线已回复",
					keys : "结果, 待命",
					times : 1,
					callback : function () {
						console.log("111", "表示可以吹气了（界面上有个红色圆点标识变绿，表示可以吹气）（和预热完成与否无关），并且获取当前二氧化碳浓度，并把大于”2“的加入缓存中，累计二氧化碳浓度如果有100次大于”2“，就提醒用户可能要”校零（校零时间固定10S）“，用户校零就把当前二氧化碳浓度记录表清空，不校零就继续累加和提醒（需要校零的话界面上要有个黄色感叹号提醒，不需要校零就是绿色，需要校零就是黄色）");
					}
				}, {
					name : "检测成功",
					keys : [ "操作成功"],
					res : "isRes",
					times : 1,
					callback : function () {
						//checkQueue.closeCurrentCheck();
					}
				}, {
					name : "用户退出",
					keys : "用户退出",
					times : 1,
					callback : function () {
						console.log("------%c 检测结束 %c------", "color: darkgreen", "");
						// _blueTooth.init();
						//_checkQueue.goNext();
					}
				}
			],
			"血氧检测仪" : [{
					name : "查找设备",
					keys : "正在连接设备",
					times : 1,
					callback : function () {}
				}, {
					name : "检测成功",
					keys : ["操作成功", "检测成功"],
					res : "isRes",
					times : 1,
					callback : function () {
						//_checkQueue.closeCurrentCheck();
					}
				}, {
					name : "蓝牙未连接", //对于血氧而已，重试多次就是蓝牙没有连接或者设备没有开机
					keys : ["\\<br\\/\\>\\[重试, [0-4]次\\]", "\\<br/\\>\\[失败, [0-9]次\\]"],
					timesCreator : function () {
						var newTimes = [];
						var j;
						for (j = 2; j < 100; j++) {
							if ((j - 2) % 5 == 0) {
								newTimes.push(j);
							}
						}
						this['times'] = newTimes; // [1, 6, 11, 16, 21, 26]
					},
					callback : function () {}
				}, {
					name : "用户退出",
					keys : "用户退出",
					times : 1,
					callback : function () {
						console.log("------%c 检测结束 %c------", "color: darkgreen", "");
						//_blueTooth.init();
						//_checkQueue.goNext();
					}
				}
			],
			"肺功能仪" : [{
					name : "查找设备",
					keys : "正在连接设备",
					times : 1,
					callback : function () {}
				}, {
					name : "蓝牙未连接",
					keys : "请保持设备开启",
					timesFunc : function () {
						var res = false;
						// 获取连续的状态
						var tmp;
						var arr = 状态粒度对象["蓝牙未连接"].concat();
						var tempArr = [];
						while (tmp = arr.shift()) {
							if (tempArr.length == 0) {
								tempArr.push([tmp]);
								continue;
							}
							var e = tempArr[tempArr.length - 1];
							if (tmp == e[e.length - 1] + 1) {
								e.push(tmp);
							} else {
								tempArr.push([tmp]);
							}
						}
						// 获取n个连续状态
						var num = 0;
						var deleteArr = [];
						tempArr.forEach(function (per) {
							if (per.length == 3) {
								num++;
								deleteArr = per.concat(deleteArr);
							}
						});
						// 判断结果，有至少一个数组为“n个连续”
						if (num >= 1) {
							res = true;
						}
						// 将已经判断过的粒度删除
						var deleteReg = deleteArr.map(function (per) {
								return '^' + per + '$';
							}).join('|');
						if (deleteReg) {
							deleteReg = new RegExp(deleteReg, "igm");
							var newArr = [];
							var arr2 = 状态粒度对象["蓝牙未连接"];
							arr2.forEach(function (a) {
								if (!deleteReg.test(a)) {
									newArr.push(a);
								}
							});
							状态粒度对象["蓝牙未连接"] = newArr;
						}
						return res;
					},
					callback : function () {}
				}, {
					name : "已连接",
					keys : "连接成功",
					times : 1,
					callback : function () {}
				}, {
					name : "检测成功",
					keysFunc : function (Txt) {
						var res = false;
						if (Txt.match(/fev.*fev6.*操作成功/igm)) {
							res = true;
						}
						return res;
					},
					res : "isRes",
					times : 1,
					callback : function () {}
				}, {
					name : "不成功",
					keys : "检测不成功",
					times : 1,
					callback : function () {}
				}, {
					name : "成功",
					keys : "检测成功",
					times : 1,
					callback : function () {
						//_checkQueue.closeCurrentCheck();
					}
				}, {
					name : "用户退出",
					keys : "用户退出",
					times : 1,
					callback : function () {
						console.log("------%c 检测结束 %c------", "color: darkgreen", "");
						// _blueTooth.init();
						//_checkQueue.goNext();
					}
				}
			],
			"体重计" : [{
					name : "查找设备",
					keys : "正在连接设备",
					times : 1,
					callback : function () {}
				}, {
					name : "蓝牙未连接", //对于血氧而已，重试多次就是蓝牙没有连接或者设备没有开机
					keys : ["\\<br\\/\\>\\[重试, [0-4]次\\]", "\\<br/\\>\\[失败, [0-9]次\\]"],
					timesCreator : function () {
						var newTimes = [];
						var j;
						for (j = 2; j < 100; j++) {
							if ((j - 2) % 5 == 0) {
								newTimes.push(j);
							}
						}
						this['times'] = newTimes; // [1, 6, 11, 16, 21, 26]
					},
					callback : function () {}
				}, {
					name : "检测成功",
					keys : ["操作成功", "检测成功"],
					res : "isRes",
					times : 1,
					callback : function () {
						//_checkQueue.closeCurrentCheck();
					}
				}, {
					name : "用户退出",
					keys : "用户退出",
					times : 1,
					callback : function () {
						console.log("------%c 检测结束 %c------", "color: darkgreen", "");
						// _blueTooth.init();
						//_checkQueue.goNext();
					}
				}
			]
		};
		var i;
		for (i in 对照表) {
			var mapList = 对照表[i];
			mapList && mapList.forEach(function (per) {
				per['timesCreator'] && per['timesCreator']();
				var times = per['times'];
				if (times) {
					var timesReg;
					if (times instanceof Array) {
						// 对times进行除重和排序
						var timesTempObj = {};
						var timesTempArr = [];
						times.forEach(function (per1) {
							if (!timesTempObj[per1]) {
								timesTempObj[per1] = true;
								timesTempArr.push(per1);
							}
						});
						per['times'] = timesTempArr.sort(function (a, b) {
								return a < b ? -1 : 1;
							});
						times = per['times'];

						// 最后生成匹配次数的正则表达式
						timesReg = times.map(function (per2) {
								return '^' + per2 + '$';
							}).join('|');
					} else {
						timesReg = '^' + times + '$';
					}
					per['timesReg'] = new RegExp(timesReg); //,"igm");
				}

				var keys = per['keys'];
				if (keys instanceof Array) {
					keys = keys.join('|');
				}
				per['keysReg'] = new RegExp(keys);
			});
		};
		// console.log("111 _blueTooth.js 生成“对照表”", 对照表);
		return 对照表;
	};
	var 消息对照表 = 生成消息对照表();

	function 初始化(DevName) { // 开始结束都要执行初始化
		console.log("------%c %s %c------", "color: darkgreen", DevName ? "检测开始" : "检测结束", "");
		设备名 = DevName || null;
		状态对象 = {};

		状态粒度对象 = {};
		计数器 = 0;
		执行计数器对象 = {};

		false && console.log("111", DevName, JSON.stringify({
				设备名 : 设备名,
				状态对象 : 状态对象,
				执行计数器对象 : 执行计数器对象,
				计数器 : 计数器,
				状态粒度对象 : 状态粒度对象
			}));
	};

	function 条件匹配(KeysReg, Content, Callback, KeysFunc) {
		var res = false;
		if (Callback) {
			if (KeysFunc) { // 有”checkRule(独立判断规则)“，会按照checkRule的规则进行匹配，不会匹配“key(关键字)”
				res = KeysFunc(Content);
			} else {
				res = KeysReg.test(Content);
			}
		}
		res && Callback();
	};

	function 存入状态对象(Status) {
		// 记录状态的粒度
		计数器++;
		if (!状态粒度对象[Status]) {
			状态粒度对象[Status] = [];
		}
		状态粒度对象[Status].push(计数器);

		// 记录状态当前触发的次数
		if (!状态对象[Status]) {
			状态对象[Status] = 1;
		} else {
			状态对象[Status]++;
		}
		return 状态对象[Status];
	};

	function 存入执行计数器对象(Status) {
		if (!执行计数器对象[Status]) {
			执行计数器对象[Status] = 1;
		} else {
			执行计数器对象[Status]++;
		}
		return 执行计数器对象[Status];
	}

	function 轮询对照表(BlueToothMsg) {
		var res = false;
		if (BlueToothMsg) {
			var mapList = 消息对照表[设备名];
			mapList && mapList.forEach(function (per) {
				条件匹配(per['keysReg'], BlueToothMsg, function () {
					var statusName = per['name'];
					var currentTimes = 存入状态对象(statusName);
					function temp() {
						res = per['res'] || true;
						/** 满足条件触发临时函数，执行对应状态回调当前状态提醒次数
						 * 如果设置了timesFunc：
						 * @a 会用timesFunc去判断；
						 * 没有设置timesFunc时：
						 * @b 如果设置times，会生成”timesReg“并和”currentTimes“相匹配，则在对应次数运行回调；
						 * @c 没有设置times，每次都执行回调。
						 * @return 回调函数返回当前检测到某个状态对应的提醒次数。
						 */
						var 检测到某个状态的次数 = 存入执行计数器对象(statusName);
						// console.log(statusName, 检测到某个状态的次数);
						per['callback'] && per['callback'](检测到某个状态的次数);
					};
					if (per['timesFunc']) {
						per['timesFunc']() && temp();
					} else {
						var timesReg = per['timesReg'];
						((timesReg && timesReg.test(currentTimes)) || !timesReg) && temp();
					}
				}, per['keysFunc']);
			});
		}
		return res;
	};

	return {
		// 点击设备时，被调用
		init : 初始化,
		// 设备回调消息时，被调用
		analyse : function (BlueToothMsg) {
			return 轮询对照表(BlueToothMsg);
		},
		// 最后给controller调用的接口
		setApi : function (DevName, StatusName, Callback) {
			var res = false;
			var mapList = 消息对照表[DevName];
			mapList && mapList.forEach(function (per) {
				if (per['name'] == StatusName) {
					res = per;
				}
			});
			if (res && Callback && typeof Callback == "function") {
				!res['originalCallback'] && (res['originalCallback'] = res['callback']);
				res['callback'] = function () {
					res['originalCallback'].apply(this, arguments);
					Callback.apply(this, arguments);
				};
			}

			if (!res) {
				try {
					debug.Tips("==> _blueTooth.js “消息对照表['" + DevName + "']”（" + StatusName + "）不存在，回调函数写入失败！", "color:red");
				} catch (e) {
					console.log("==> _blueTooth.js %c“消息对照表['" + DevName + "']”（" + StatusName + "）不存在，回调函数写入失败！", "color:red");
				}
			}
		},
		clearApi : function () {
			var i;
			for (i in 消息对照表) {
				var mapList = 消息对照表[i];
				mapList && mapList.forEach(function (per) {
					per['originalCallback'] && (per['callback'] = per['originalCallback']) && (delete per['originalCallback']);
				});
			}
		}
	};
})();
