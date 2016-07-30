var report = (function () {
	var 治疗类型; // 当前治疗类型

	var 事件映射; // 用于”获取事件“
	var 事件列表对象; // 用于检索”事件映射“，获取事件

	var 事件管理 = { // 存储事件
		"bre" : {
			url : "./json/bre.json",
			data : ''
		},
		"oxy" : {
			url : "./json/oxy.json",
			data : ''
		}
	};

	var 分析报告 = { // 分析报告
		"oxy" : [{
				name : "吸氧及时性",
				txt : null,
				res : null,
				total : 100,
				percentage : 5,
				ruleList : [{
						score : 30,
						name : "治疗前血氧饱和度检测",
						rule : [{
								name : "配合",
								func : function () {
									console.log("0 111");
									console.log(获取事件(/oxy_oxy_(.*?)_tips/igm, "RegExp")); // 测试“获取事件”
									/* "co2_bre_before_tips",
									"##.执行次数" */
									/* this.total -= 0; */
								}
							}, {
								name : "不配合",
								func : function () {
									console.log("0 222");
									/* "co2_bre_before_tips",
									"##.中断提醒=='正在使用氧气机'",
									"co2_bre_before_imparity" */
								}
							}
						]
					}, {
						name : "",
						score : 30,
						rule : [{
								func : function () {
									console.log("0 333");
									/* "co2_bre_after_tips",
									console.log("不扣分");
									this.total = 0; */
								}
							}, {
								key : "##.执行次数==2",
								func : function () {
									console.log("0 444");
									/* console.log("扣十分");
									this.total -= 10; */
								}
							}, {
								key : "##.中断提醒=='正在使用氧气机'",
								func : function () {
									console.log("0 555");
									/* this.total = 0; */
								}
							}
						]
					}
				]
			}
		]
	};

	/**
	 * 1
	 */
	function 获取事件管理(Callback) {
		var eventObj = 事件管理[治疗类型]['data'];
		function temp(obj) {
			生成事件映射(obj);
			Callback && Callback(obj);
		}
		if (eventObj) {
			temp(eventObj);
		} else {
			$.ajax({
				url : 事件管理[治疗类型]['url'],
				success : function (Res) {
					事件管理[治疗类型]['data'] = Res[治疗类型];
					temp(Res[治疗类型]);
				},
				error : function (Err) {
					console.error(Err);
				}
			});
		}
	};

	/**
	 * 2
	 */
	function 生成事件映射(事件列表) { // 事件映射 用于获取事件
		!事件映射 && (事件映射 = {});
		!事件列表对象 && (事件列表对象 = {});
		if (!事件映射[治疗类型]) {
			事件映射[治疗类型] = {};
			事件列表.forEach(function (per, i) {
				事件映射[治疗类型][per['事件代码']] = i;
			});
		};
		if (!事件列表对象[治疗类型]) {
			事件列表对象[治疗类型] = [];
			事件列表.forEach(function (per, i) {
				事件列表对象[治疗类型].push(per['事件代码']);
			});
		}
		// console.log("111 事件映射", 事件映射, "事件列表对象", 事件列表对象);
	};

	/**
	 * 3
	 */
	function 获取事件(EventCode, Type) {
		var res = false;
		if (Type == "RegExp") { // 返回一个数组
			res = [];
			var tempArr = 事件列表对象[治疗类型];
			tempArr.forEach(function (per) {
				if (EventCode.test(per)) {
					var num = 事件映射[治疗类型][per];
					res.push(事件管理[治疗类型]['data'][num]);
				}
			});
		} else {
			var num = 事件映射[治疗类型][EventCode];
			res = 事件管理[治疗类型]['data'][num];
		}
		return res;
	};

	/**
	 * 4
	 */
	function 事件集分析(回调函数) {
		获取事件管理(function () {
			var res = [];
			分析报告[治疗类型] && 分析报告[治疗类型].forEach(function (project) { // 治疗类型
				project['ruleList'] && project['ruleList'].forEach(function (ruleList) { // 大项目
					ruleList['rule'] && ruleList['rule'].forEach(function (rule) { // 子项目
						rule['func'] && rule['func']();
					});
				});
				var tempRes = {
					name : project['name'],
					txt : project['txt'],
					res : project['res'],
					total : project['total'],
					percentage : project['percentage']
				};
				res.push(tempRes);
			});
			回调函数 && 回调函数(res);
		});
	};

	return {
		analyse : function (eventName, Callback) {
			治疗类型 = eventName;
			事件集分析(Callback);
		}
	};
})();
