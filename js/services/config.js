

/* 设备设置 */
var 氧气机 = "氧气机";
var 呼吸机 = "呼吸机";
var 用药管理 = "用药管理";
var DEVICE = {
	"SPO2" : {
		"id" : "血氧检测仪",
		"name" : "血氧饱和度检测仪",
		deviceId : "device_SPO2",
		deviceImg : "./img/devices/device_SPO2.png",
		"dashboard" : [{
				type : "spo2",
				"pic" : "./img/manage_index/SPO2.png",
				"name" : "血氧饱和度",
				"level" : [50, 88, 92, 100],
				"text" : ["您的血氧正常！", "您的血氧偏低哦！", "您的血氧偏低，要吸氧哦！"],
				"unit" : "%"
			}, {
				type : "hr",
				"pic" : "./img/manage_index/HR.png",
				"name" : "脉率",
				"level" : [30, 60, 100, 150],
				"unit" : "次/分"
			}
		]
	},
	"co2" : {
		"id" : "呼末二氧化碳",
		"name" : "呼末CO2检测仪",
		deviceId : "device_co2",
		deviceImg : "./img/devices/device_co2.png",
		"dashboard" : [{
				type : "co2",
				"pic" : "./img/manage_index/CO2.png",
				"name" : "呼末二氧化碳分压",
				"level" : [0, 35, 45, 60, 80, 150],
				"text" : ["您的二氧化碳偏低哦！", "您的二氧化碳正常哦！", "您的二氧化碳轻度偏高，建议用呼吸机哦！", "您的二氧化碳中度度偏高，要用呼吸机哦！", "您的二氧化碳严重偏高，一定要用呼吸机哦！"],
				"unit" : "mmHg"
			}
		]
	},
	"Lung" : {
		"id" : "肺功能仪",
		"name" : "肺功能仪",
		deviceId : "device_Lung",
		deviceImg : "./img/devices/device_Lung.png",
		"dashboard" : [{
				type : "fev1",
				"pic" : "./img/manage_index/FEV1.png",
				"name" : "FEV1",
				"level" : [0, 2.0, 2.5, 3.5],
				"text" : ["您的肺功能很差，要坚持用药哦！", "您的肺功能不是很好哦！", "您的肺功能很好哦！"],
				"unit" : "L"
			}
		]
	},
	// "Lung4" : {
	// 	"id" : "肺功能仪4",
	// 	"name" : "肺功能仪4",
	// 	deviceId : "device_Lung4",
	// 	deviceImg : "./img/devices/device_Lung4.png",
	// 	"dashboard" : [{
	// 			type : "fev1",
	// 			"pic" : "./img/manage_index/FEV1.png",
	// 			"name" : "FEV1",
	// 			"level" : [0, 2.0, 2.5, 3.5],
	// 			"unit" : "L"
	// 		}
	// 	]
	// },
	"Weight" : {
		"id" : "体重计",
		"name" : "体重计",
		deviceId : "device_Weight",
		deviceImg : "./img/devices/device_Weight.png",
		"dashboard" : [{
				type : "weight_null",
				"pic" : "./img/manage_index/WEIGHT.png",
				"name" : "体重",
				"level" : [10, 35, 75, 150],
				"unit" : "kg"
			}, {
				type : "weight_null_2",
				"pic" : "./img/manage_index/BMI.png",
				"name" : "体重指数",
				"level" : [10, 18.5, 23.9, 27.9, 40],
				"text" : ["您偏廋哟，要加强营养哦！", "您的体重正常，好好保持哦！", "您有点胖，要注意饮食哦！", "您好胖哟，一定要注意饮食哦！"],
				"unit" : "kg/m2"
			}
		]
	},
	"血压" : {
		"id" : "血压计",
		"name" : "血压计",
		deviceId : "device_Bp",
		deviceImg : "./img/devices/device_Bp.png",
		"dashboard" : [{
				type : "收缩压",
				"pic" : "./img/manage_index/SBP.png",
				"name" : "收缩压",
				"level" : [60, 90, 140, 160, 180, 200],
				"text" : ["您的高血压有点低哟，建议去看医生哦！", "您的高血压正常哟，好好保持喔！", "您的高血压轻度哟，注意控制喔！", "您的高血压中度哟，要注意控制喔！", "您的高血压重度哟，要注意控制啦！"],
				"unit" : "mmHg"
			}, {
				type : "舒张压",
				"pic" : "./img/manage_index/DBP.png",
				"name" : "舒张压",
				"level" : [0, 60, 90, 100, 110, 120],
				"unit" : "mmHg"
			}
		]
	},
	"GLU" : {
		"id" : "血糖仪",
		"name" : "血糖仪",
		deviceId : "device_GLU",
		deviceImg : "./img/devices/device_GLU.png",
		"dashboard" : [{
				type : "GLU",
				"pic" : "./img/manage_index/GLU.png",
				"name" : "血糖值",
				"level" : [0, 3.9, 6.1, 7.0, 8.4, 10.1, 12],
				"text" : ["您的血糖偏低哟，要及时就医哦！", "您的血糖正常，好好保持哦！", "您的血糖稍微有点高，注意保健哦！", "您的糖尿病轻度，要注意饮食哦！", "您的糖尿病中度，要注意控制哦！", "您的糖尿病有点重，要好好控制哦！"],
				"unit" : ""
			}
		]
	},
	"SLEEP" : {
		"id" : "睡眠呼吸初筛仪",
		"name" : "睡眠初筛仪",
		deviceId : "device_SLEEP",
		deviceImg : "./img/devices/device_SLEEP.png",
		"dashboard" : []
	}
};
for (var i in DEVICE) {
	eval("var " + DEVICE[i].id + " = " + DEVICE[i].id);
}
