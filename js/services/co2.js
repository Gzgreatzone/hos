/**
 * 呼末二氧化碳
 * 预热、校零、吹起提醒插件
 */
var co2 = (function () {
	var 状态对象;
	var 二氧化碳状态列表;
	function 生成二氧化碳状态列表() {
		var tempObj = {
			/**
			 * 预热检测流程 ==> 正在预热（预热中） - 预热完成 / 预热超时
			 */
			"预热检测" : {
				正在预热 : {
					times : 1,
					callback : function () { // 不用times判断会多次触发，要防止多次触发
						console.log("_co2.js ==> %c正在预热！", "color:yellowgreen;");
					}
				},
				预热完成 : {
					callback : function () {
						console.log("_co2.js ==> %c预热完成！", "color:green;");
					}
				},
				预热超时 : {
					callback : function () {
						console.log("_co2.js ==> %c预热超时！", "color:goldenrod;");
					}
				}
			},
			/**
			 * 校零检测流程 ==>
			 * 需要校零（检测是否要校零） - 开始校零（用户点击了校零按钮） - 正在校零（校零过程中又触发校零会提醒”正在校零“） - 校零完成 - 校零检测到时（不再检测是否要校零）
			 */
			"校零检测" : {
				需要校零 : {
					times : 1,
					callback : function () { // 不用times判断会多次触发，要防止多次触发
						console.log("_co2.js ==> %c需要校零！", "color:goldenrod;");
					}
				},
				校零检测到时 : {
					callback : function () {
						console.log("_co2.js ==> %c校零检测到时！", "color:green;");
					}
				}
			},
			"进行校零" : {
				开始校零 : {
					callback : function () {
						console.log("_co2.js ==> %c开始校零！", "color:darkseagreen;");
					}
				},
				正在校零 : {
					times : 1,
					callback : function () { // 不用times判断会多次触发，要防止多次触发
						console.log("_co2.js ==> %c正在校零，请稍候！", "color:yellowgreen;");
					}
				},
				校零完成 : {
					callback : function () {
						console.log("_co2.js ==> %c校零完成！", "color:green;");
					}
				}
			}
		};
		var res = false;
		var i;
		for (i in tempObj) {
			var typeObj = tempObj[i];
			var j;
			for (j in typeObj) {
				var per = typeObj[j];
				!res && (res = {});
				per['type'] = i;
				var times = per['times'];
				if (times) {
					if (times instanceof Array) {
						times = times.map(function (per1) {
								return '^' + per1 + '$';
							}).join('|');
					} else {
						times = '^' + times + '$';
					}
					per['timesReg'] = new RegExp(times);
				}
				res[j] = per;
			}
		}
		// console.log("111", res);
		二氧化碳状态列表 = res;
	};
	生成二氧化碳状态列表();

	/**
	 * 初始化
	 */
	function 初始化状态对象(Type) {
		console.log("------ %c初始化状态对象['" + Type + "']%c ------", "color:green;", "");
		if (Type) {
			!状态对象 && (状态对象 = {});
			var i;
			for (i in 二氧化碳状态列表) {
				var per = 二氧化碳状态列表[i];
				if (Type == per['type']) {
					状态对象[i] = 0;
				}
			}
		}
	}
	/**
	 * 状态计数器
	 */
	function 存入状态对象(状态) {
		!状态对象 && (状态对象 = {});
		if (!状态对象[状态]) {
			状态对象[状态] = 0;
		};
		状态对象[状态]++;
		return 状态对象[状态];
	}
	/**
	 * 状态触发条件
	 */
	function 触发状态回调(状态) {
		var currentTimes = 存入状态对象(状态);
		console.log(currentTimes);
		if (!二氧化碳状态列表[状态]['timesReg'] || 二氧化碳状态列表[状态]['timesReg'].test(currentTimes)) {
			二氧化碳状态列表[状态]['callback']();
		}
	}

	/**
	 * 1
	 * 开始检测_预热
	 */
	var 预热完成提醒最大时长 = 60 * 1000; // 到达时间即使没有达到预热完成状态也提醒可以吹气了
	var 预热状态获取间隔 = 5 * 1000;

	var 预热检测_定时器;
	function 停止检测_预热完成() {
		预热检测_定时器 && clearInterval(预热检测_定时器);
		预热检测_定时器 = null;
	}
	var 预热超时_计时器;
	function 停止检测_预热超时() {
		预热超时_计时器 && clearInterval(预热超时_计时器);
		预热超时_计时器 = null;
	}

	function 开始检测_预热() {
		终止检测_预热();
		var 呼末二氧化碳检测仪预热完成 = false;
		function temp() {
			if (_android("getDeviceStatus", "CO2Heater") == "true") {
				呼末二氧化碳检测仪预热完成 = true;
				触发状态回调("预热完成");
				终止检测_预热();
			} else {
				触发状态回调("正在预热");
			}
		};
		预热超时_计时器 = setTimeout(function () {
				停止检测_预热完成();
				触发状态回调("预热超时");
			}, 预热完成提醒最大时长);
		预热检测_定时器 = setInterval(temp, 预热状态获取间隔);
		temp();
	}
	function 终止检测_预热() {
		停止检测_预热完成();
		停止检测_预热超时();
	}

	/**
	 * 2
	 * 开始检测_校零
	 * 每一次检测中，如果每次获取”co2“（CO2浓度）都超过浓度上限，将写入“校零检测持续时长/校零检测间隔”（如：2*60*1000/5*1000=64）个”co2“
	 */
	var 校零检测持续时长 = 2 * 60 * 1000; // 获取CO2浓度时长
	var 校零检测间隔 = 5 * 1000; // 获取CO2浓度间隔
	var CO2浓度上限超额上限 = 50; // 达到这个数就提醒
	var CO2浓度上限 = 2;
	var CO2浓度记录表;
	function 获取CO2浓度记录表() {
		CO2浓度记录表 = eval("(" + (_android("getcfg", "CO2浓度记录表") || "[]") + ")");
	}
	function 存储CO2浓度记录表() {
		_android("setcfg", "CO2浓度记录表", JSON.stringify(CO2浓度记录表 || []));
	}

	var 校零提醒_计时器;
	function 终止检测_需要校零() {
		clearInterval && clearInterval(校零提醒_计时器);
		校零提醒_计时器 = null;
	}
	var 需要校零检测到时_计时器;
	function 终止检测_校零到时() {
		clearInterval && clearInterval(需要校零检测到时_计时器);
		需要校零检测到时_计时器 = null;
	}

	function 开始检测_校零() {
		终止检测_校零();
		function temp() {
			获取CO2浓度记录表();
			var co2 = +_android("getDeviceStatus", "CO2");
			if (co2 >= CO2浓度上限) {
				CO2浓度记录表.push(co2);
				存储CO2浓度记录表();
			}
			if (CO2浓度记录表.length >= CO2浓度上限超额上限) {
				触发状态回调("需要校零");
			}
		}
		校零提醒_计时器 = setInterval(temp, 校零检测间隔);
		temp();
		需要校零检测到时_计时器 = setTimeout(function () {
				终止检测_需要校零();
				触发状态回调("校零检测到时");
			}, 校零检测持续时长);
	}
	function 终止检测_校零() {
		终止检测_需要校零();
		终止检测_校零到时();
	}

	/**
	 * 3
	 * 设备校零
	 */
	var 校零时长 = 10 * 1000;
	var 正在校零;
	function 设备校零() {
		if (!正在校零) {
			初始化状态对象("进行校零");
			正在校零 = true;
			触发状态回调("开始校零");
			_android("setcfg", "CO2浓度记录表", "[]");
			_android("zeroMonitor");
			setTimeout(function () {
				触发状态回调("校零完成");
				正在校零 = false;
			}, 校零时长);
		} else {
			触发状态回调("正在校零");
		}
	}

	return {
		btn : function (Type) { // 校零接口
			var temp = {
				"Zero" : 设备校零
			}
			[Type];
			temp && temp();
		},
		check : function (Type) { // 检测状态接口
			var temp = {
				"Heater" : {
					func : 开始检测_预热,
					type : "预热检测"
				},
				"Zero" : {
					func : 开始检测_校零,
					type : "校零检测"
				}
			}
			[Type];
			if (temp) {
				初始化状态对象(temp['type']);
				temp['func']();
			}
		},
		stopAllCheck : function () {
			终止检测_预热();
			终止检测_校零();
		},
		setApi : function (StatusName, Callback) {
			var res = false;
			var i;
			for (i in 二氧化碳状态列表) {
				StatusName == i && (res = 二氧化碳状态列表[i]);
			}
			if (res && Callback && typeof Callback == "function") {
				!res['originalCallback'] && (res['originalCallback'] = res['callback']);
				res['callback'] = function () {
					res['originalCallback'].apply(this, arguments);
					Callback.apply(this, arguments);
				}
			}

			// 提醒而已
			if (res) {
				try {
					debug.Tips("==> _co2.js “二氧化碳状态列表['" + StatusName + "']”存在，回调函数写入成功！", "color:green;");
				} catch (e) {
					console.log("==> _co2.js %c“二氧化碳状态列表['" + StatusName + "']”存在，回调函数写入成功！", "color:green;");
				}
			} else {
				try {
					debug.Tips("==> _co2.js “二氧化碳状态列表['" + StatusName + "']”不存在，回调函数写入失败！", "color:red;");
				} catch (e) {
					console.log("==> _co2.js %c“二氧化碳状态列表['" + StatusName + "']”不存在，回调函数写入失败！", "color:red;");
				}
			}
		},
		clearApi : function () {
			var i;
			for (i in 二氧化碳状态列表) {
				var per = 二氧化碳状态列表[i];
				per['originalCallback'] && (per['callback'] = per['originalCallback']);
				delete per['originalCallback'];
			}

			// 提醒而已
			try {
				debug.Tips("_co2.js ==> 清空检测回调函数", "color:green;");
			} catch (e) {
				console.log("_co2.js ==> %c清空检测回调函数", "color:green;");
			}
		}
	}
})();
