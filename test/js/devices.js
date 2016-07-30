/**
 * 依赖 [blueTooth]
 */
var devices = (function () {
	var 设备名;
	var 回调函数;
	var 相关数据;

	var 设备检测 = {
		open : function (Name, Callback, Data) {
			// console.log("111", arguments);
			设备名 = Name;
			回调函数 = Callback;
			相关数据 = Data;
			Android_do_cmd("onBtnClick", "00000", Name + 'APP', "window.AndroidCallBack");
			blueTooth.init(Name);
		},
		convert : function (data) {
			var reg = new RegExp("\\[(.*?),(.*)\\]", "igm");
			var res = reg.exec(data);
			var realRes = res && res[2];
			if (realRes) {
				if (typeof realRes == "string") {
					realRes = eval("(" + realRes + ")");
					if (typeof realRes == "string") {
						realRes = eval("(" + realRes + ")");
					}
				}
				数据样式表[设备名] && (realRes = 数据样式表[设备名](realRes));
			}
			realRes && this.storage(realRes);
			return realRes;
		},
		storage : function (Data) {
			var date = new Date;
			var ms = date.getTime();
			console.log("存储检测结果", {
				设备名 : 设备名,
				最后检测参数 : Data,
				最后检测时间 : ms
			});
		}
	};

	var 数据样式表 = {
		"呼末二氧化碳" : function (data) {
			return {
				co2 : data
			};
		},
		"血糖仪" : function (data) {
			return {
				gul : data
			};
		},
		"体重计" : function (data) { // 在用户点击检测时传入身高
			var res = {
				weight : data
			};
			相关数据 && (res.bmi =  + ( + (相关数据 / (Math.pow(height / 100, 2))).toFixed(1).replace(/.0/, '')));
			return res;
		},
		"用药管理" : function (data) {
			return data && ({
				drug : data
			});
		},
		"COPD行动管理" : function (data) {
			return data && ({
				copd : data
			});
		}
	};

	/*
	 * 设备检测的回调
	 */
	window.AndroidCallBack = function (MsgKey1, MsgKey2) {
		var 消息内容 = [Android_do_cmd("getMsg", MsgKey1) || MsgKey1];
		var isMsg = false;
		MsgKey2 && 消息内容.push(Android_do_cmd("getMsg", MsgKey2) || MsgKey2);

		debug.Tips("AndroidCallBack ==> ", 消息内容.map(function (per) {return "'" + per + "'";}).join('；'));

		var 完整数据 = 消息内容.join('');
		isMsg = blueTooth.analyse(完整数据);
		if (isMsg) {
			if (isMsg == "isRes") {
				console.log("%c这是检测结果", "color:cornflowerblue");
				var 检测结果 = 设备检测.convert(完整数据);
				回调函数 && 检测结果 && 回调函数(检测结果);
			} else {
				console.log("%c这是回调消息", "color:blue");
			}
		}
	};
	return 设备检测;
})();
