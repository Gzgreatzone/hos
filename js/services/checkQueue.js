/**包子写的代码
 * 实现检测队列的插件
 * 依赖 [devices]
 */ 
 'use strict';

angular.module('chafangbao.services')
.service('checkQueue',['kfDevices', function (kfDevices) {
 function checkQueue () {

	var 模拟数据 = {
		timer : [],
		cancel : function () {
			clearInterval(this.timer);
		},
		func : function (name) {
			if (debug) {
				var This = this;
				var i = 0;
				var temp =  function () {
					i++;
					if (name == "呼末二氧化碳") {
						if (i > 23) {
							clearInterval(This.timer);
							return;
						} else if (i >= 20) {
							window.AndroidCallBack('{"code":"0","data":["msgid:312-co2","30.23"],"msg":"操作成功"}' );
							//window.AndroidCallBack('co2','{"code":"0","data":["co2","31.36"],"msg":"操作成功"}');
							//window.AndroidCallBack("设备服务输出消息","{msg:'呼末二氧化碳:<br/>[获得结果, 38.39]',msg:'操作成功'}"); // "设备服务输出消息","{msg:'呼末二氧化碳:<br/>[获得结果, 38.39]',type:'呼末二氧化碳'}"
						} else if (i > 15) {
							window.AndroidCallBack("msgid:295-设备服务输出消息{msg:'呼末二氧化碳:<br/>[结果, 待命]',type:'呼末二氧化碳'} ");
						} else if (i > 13) {
							window.AndroidCallBack("msgid:293-设备服务输出消息{msg:'呼末二氧化碳:<br/>[请呼气...]',type:'呼末二氧化碳'} ");
						} else if (i > 9) {
							window.AndroidCallBack('msgid:203-设备服务输出消息', '[当前co2, 基线回复 [277.58997, 241.82002, 201.14995] 0.0 -1000.0]');
						} else if (i > 7) {
							window.AndroidCallBack('适配器脱落');
						} else {
							window.AndroidCallBack('[CO2状态, null]');
						}
					} else if (name == "血氧检测仪") {
						if (i > 14) {
							clearInterval(This.timer);
							return;
						} else if (i > 12) {
							window.AndroidCallBack(' {"code":"0","data":["msgid:11-SPO2","{spo2:98,hr:70}"],"msg":"操作成功"}');
						} else if (i > 11) {
							window.AndroidCallBack('<br/>[失败, 1次]');
						} else if (i > 6) {
							window.AndroidCallBack('<br/>[重试, ' + (i - 7) + '次]');
						} else if (i > 5) {
							window.AndroidCallBack('<br/>[失败, 0次]');
						} else {
							window.AndroidCallBack('<br/>[重试, ' + (i - 1) + '次]');
						}
					} else if (name == "体重计") {
						if (i > 14) {
							clearInterval(This.timer);
							return;
						} else if (i > 12) {
							window.AndroidCallBack('{"code":"0","data":["msgid:11-Weight","54.1"],"msg":"操作成功"}');
						} else if (i > 11) {
							window.AndroidCallBack('<br/>[失败, 1次]');
						} else if (i > 6) {
							window.AndroidCallBack('<br/>[重试, ' + (i - 7) + '次]');
						} else if (i > 5) {
							window.AndroidCallBack('<br/>[失败, 0次]');
						} else {
							window.AndroidCallBack('<br/>[重试, ' + (i - 1) + '次]');
						}
					} else if (name == "肺功能仪") {
						if (i > 23) {
							clearInterval(This.timer);
							return;
						} else if (i >= 20) {
							window.AndroidCallBack( {"code":"0","data":["msgid:12-[{name:'测试不成功，请调整吹气方式',speak:'肺功能检测评价',rate:0,txt:'检测不成功'}]"],"msg":"操作成功"} ); // "设备服务输出消息","{msg:'呼末二氧化碳:<br/>[获得结果, 38.39]',type:'呼末二氧化碳'}"
						} else if (i > 15) {
							window.AndroidCallBack('{"code":"0","data":["msgid:11-Lung","{fev1:1.01,fev6:1.40}"],"msg":"操作成功"}' );
						} else if (i > 13) {
							window.AndroidCallBack('设备服务输出消息', "{msg:'肺功能仪:<br/>[连接成功]',type:'肺功能仪'}");
						} else if (i > 9) {
							window.AndroidCallBack('设备服务输出消息', "{msg:'肺功能仪<br/>正在连接设备',type:''}");
						} else if (i > 7) {
							//window.AndroidCallBack('适配器脱落');
						} else {
							//window.AndroidCallBack('[CO2状态, null]');
						}
					}
				}
				This.timer = setInterval(temp, 50);
			}
		}
	};

	var 最终检测结果;
	var 检测列表 = [];
	function 加入检测列表(Name, Callback, Data, CheckTimes) {
		检测列表.push([Name, Callback, Data, CheckTimes]);
		if (检测列表.length == 1) {
			最终检测结果 = [];
			进行检测(Name, Callback, Data);
		};
	};

	function 进行检测(Name, Callback, Data) {
		// console.log("111", arguments);
		kfDevices.open(Name, Callback, Data);
		模拟数据.cancel();
		setTimeout(function () {
			模拟数据.func(Name);
		}, 500);
	};
	function 清空检测列表() {
		检测列表 = [];
	}
	function 自动进行下一个检测() {
		var arr0 = 检测列表[0];
		if (arr0 && arr0[3]-- > 1) {
			进行检测(arr0[0], arr0[1], arr0[2]);
		} else {
			最终检测结果 = [];
			检测列表.splice(0, 1);
			var arr1 = 检测列表[0];
			arr1 && 进行检测(arr1[0], arr1[1], arr1[2]);
		}
	};

	return {
		pushIn : 加入检测列表,
		show : function () {
			return 检测列表;
		},
		finalRes : function(){
			return 最终检测结果;
		},
		goNext : 自动进行下一个检测,
		stopCurrentGroup : function () {
			var arr0 = 检测列表[0];
			if (arr0) {
				arr0[3] = 0;
				//setTimeout(function(){
				自动进行下一个检测();
				//},1000);
				console.log("111 1", 检测列表);
			} else {
				console.log("111 2");
			}
		}
	}
};
return checkQueue();
}]);