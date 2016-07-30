'use strict';
var tree = (function () {
	var 更新间隔 = 30 * 1000;
	var 循环间隔 = 5 * 1000;
	// 策略树父节点，节点
	var 策略树 = {
		配置 : {
			id : "1",
			child : [{
					id : "1.1",
					child : [{
							id : "1.1.1",
							child : [{
									id : "1.1.1.1"
								}, {
									id : "1.1.1.2"
								}
							]
						}
					],
					item : [{
							key : 1,
							value : 1
						}, {
							key : 2,
							value : 2
						}, {
							key : 3,
							value : 3
						}, {
							key : 4,
							value : 4
						}
					]
				}, {
					id : "1.2",
					child : [{
							id : "1.2.1",
							child : [{
									id : "1.2.1.1"
								}, {
									id : "1.2.1.2",
									item : [{
											key : "处理函数",
											value : "试试看有没有提醒"
										}
									]
								}
							]
						}
					],
					item : [{
							key : "判断函数",
							value : "返回false"
						}, {
							key : "处理函数",
							value : "试试看有没有提醒"
						}, {
							key : 3,
							value : 3
						}, {
							key : 4,
							value : 4
						}
					]
				}
			],
			item : [{
					key : 1,
					value : 1
				}, {
					key : 2,
					value : 2
				}, {
					key : 3,
					value : 3
				}, {
					key : 4,
					value : 4
				}
			]
		},
		挂接函数 : function () {
			节点递归(null, this.配置, null, null, function (父节点, 节点) {
				节点.get = 获取参数;
				节点.set = 设置参数;
				var i;
				for (i in 节点.item) {
					var per = 节点.item[i];
					if (per.key == '判断函数') {
						节点.judge = 生成函数(per.value);
					} else if (per.key == '处理函数') {
						节点.handle = 生成函数(per.value);
					}
				}
				if (!节点.judge) {
					节点.judge = 默认判断函数;
				}
				if (!节点.handle) {
					节点.handle = 默认处理函数;
				}
			});
		}
	};

	var 配置更新 = {
		timer : false,
		off : function () {
			var 计时器 = this.timer;
			计时器 && clearInterval(计时器);
		},
		main : function () {
			策略树.挂接函数();
		}
	};

	var 事件循环 = {
		timer : false,
		off : function () {
			var 计时器 = this.timer;
			计时器 && clearInterval(计时器);
		},
		main : function () {
			var 节点 = 策略树.配置;
			节点递归(null, 节点, 节点.handle, 节点.judge);
		}
	};

	function 节点递归(父节点, 节点, 函数, 条件, 默认函数) {
		try {
			if (默认函数) {
				默认函数(父节点, 节点);
				var i;
				for (i in 节点.child) {
					节点递归(节点, 节点.child[i], null, null, 默认函数);
				}
			} else if (条件(父节点, 节点)) {
				函数(父节点, 节点);
				for (i in 节点.child) {
					var 子节点 = 节点.child[i];
					节点递归(节点, 子节点, 子节点.handle, 子节点.judge);
				}
			}
		} catch (e) {
			console.error("节点.id：", 节点.id, "，错误信息：", e);
		}
	};

	function 获取参数(Key) {
		var i;
		var val = false;
		for (i in this.item) {
			var per = this.item[i];
			if (per.key == Key) {
				val = per.value;
			}
		}
		return val;
	};
	function 设置参数(Key, Val) {
		var i;
		var res = false;
		for (i in this.item) {
			var per = this.item[i];
			if (per.key == Key) {
				res = per;
				per.value = Val;
			}
		}
		if (!res) {
			this.item.push({
				key : Key,
				value : Val
			});
		}
	};

	function 试试看有没有提醒(父节点, 节点) {
		console.log("%c" + 节点.id, "color:blue", "试试看有没有提醒");
	}
	/* function 返回false(父节点, 节点) {
	console.log("%c" + 节点.id, "color:blue", "返回false");
	return false;
	} */
	function 默认判断函数(父节点, 节点) {
		//console.log("%c"+ 节点.id,"color:blue","大家好，我是默认判断函数，我在犯罪");
		return true;
	};
	function 默认处理函数(父节点, 节点) {
		//console.log("%c"+节点.id ,"color:blue","大家好，我是默认处理函数，我是好人");
	};
	function 生成函数(funcName) {
		var 函数 = false;
		try {
			函数 = eval("(" + funcName + ")");
		} catch (e) {
			console.info("函数 %c" + funcName, "font-weight:bold;", "不存在，用默认函数代替");
		}
		return 函数;
	};

	return {
		getTree : function () {
			return 策略树.配置;
		},
		updateConfig : function () {
			function temp() {
				配置更新.main();
			};
			temp();
			配置更新.off();
			配置更新.timer = setInterval(temp, 更新间隔);
		},
		doEvent : function () {
			function temp() {
				事件循环.main();
			};
			temp();
			事件循环.off();
			事件循环.timer = setInterval(temp, 循环间隔);
		},
		cancel : function () {
			配置更新.off();
			事件循环.off();
		}
	};
})();
