'use strict';
angular.module('chafangbao.controllers')
.controller('CheckReportDetailController', function($scope,$timeout, $ionicLoading,$ionicHistory,$http,$window,ThePerson,$filter) {
	$scope.people = ThePerson.get();
	$scope.back = function () {
		window.history.go(-1);
	}
//参数获取
	$scope.reportName = ThePerson.returnReportName();
	var systemSet = Android.getcfg("systemSet");
	$scope.systemSet = JSON.parse(systemSet);
	$scope.reportList = ThePerson.getReportList();
	$scope.para = ThePerson.getPara();
	$scope.co2AddList = ThePerson.getCo2List();
	//console.log($scope.co2AddList);
	console.log($scope.para);
	
//数据初步处理函数定义
	//时间列表函数
	$scope.getTimelist = function (){
		//获取时间列表
		var list = [];
		for (var i = 0; i < $scope.reportList.length; i++) {
			list.unshift($filter('date')($scope.reportList[i]["最后检测时间"],'MM-dd hh:mm:ss'));
		}
		return list;																//返回时间列表给图标用
	}
	//获取数据列表函数
	$scope.getDataList = function (val){
		var list = [];
		if ($scope.para[0][val]){						
		 //有些数据他是fev1:6; 这样的形式 判断是不是这样的格式
			for (var i = 0; i < $scope.para.length; i++) {
			    if ($filter('max')($scope.para[i][val]) == undefined) {				//里面的数据是不是数组形式的
			    	list.unshift($scope.para[i][val]);								//不是的话直接推入
			    }else{
			    	list.unshift($filter('max')($scope.para[i][val]));				//是的话取最大数值放入
			    }
			    
		    }
		    return list;															//返回数据，给图表用
		}				
	}


	//最大值过滤器函数
	$scope.getMax = function(input,name) {
		var out;
        var list = [];
		if (input[0][name]) {
			for(var i = 0; i < input.length; i++){
				list.push(input[i][name]);
			}
			for (i = 0;i < input.length;i++) {
		        if (list[i] > out || out === undefined || out === null) {
		          out = list[i];
		        }
	        }
		}
        return out;
	}

	//最小值过滤器函数
	$scope.getMin = function(input,name) {
		var out;
        var list = [];
		if (input[0][name]) {
			for(var i = 0; i < input.length; i++){
				list.push(input[i][name]);
			}
			for (i = 0;i < input.length;i++) {
		        if (list[i] < out || out === undefined || out === null) {
		          out = list[i];
		        }
	        }
		}
        return out;
	}
	//平均值过滤器函数
	$scope.getAvg = function(input,name) {
		var out;
	    var list = [];
	    var sum = 0;
	    if (input[0][name]) {
	    	for(var i = 0; i < input.length; i++){
	          list.push(input[i][name]);
	      }
	      for (i = 0;i < list.length;i++) {
	           sum = list[i] + sum;
	      }
	           out = sum / list.length;
	    }
	    return out;
	  }



// 图表的展示/**/

	//这个是血氧spo02
	$scope.spo2_labels = $scope.getTimelist();
		 $scope.spo2_series = ['脉搏血氧饱和度趋势图'];
		 $scope.spo2_data = [
		    $scope.getDataList('spo2')
	];

	//这个是血氧hr的
	$scope.hr_labels = $scope.getTimelist();
	 $scope.hr_series = ['心率趋势图'];
	 $scope.hr_data = [
	    $scope.getDataList('hr')
	];
	//这个是肺功能的
	$scope.lungReference1 =  $scope.getDataList('fev1');
	$scope.lungReference2 =  $scope.getDataList('fev1');
	$scope.lungReference3 =  $scope.getDataList('fev1');
	for(var i in $scope.lungReference1){
		$scope.lungReference1[i] = '2.1';
		$scope.lungReference2[i] = '3.1';
		$scope.lungReference3[i] = '2.4';
	}

	$scope.lung_labels = $scope.getTimelist();
	 $scope.lung_series = ['fev1','','红色预警','蓝色预警','黄色预警'];
	 $scope.lung_data = [
	    $scope.getDataList('fev1'),
	    [],
	    $scope.lungReference1,
	    $scope.lungReference2,
	    $scope.lungReference3,

	];

	$scope.lung_colours = ['#FD1F5E','#1EF9A1','#7FFD1F','#68F000'];

	//co2的检测的
	$scope.co2_labels = $scope.getTimelist();
	 $scope.co2_series = ['二氧化碳'];
	 $scope.co2_data = [
	    $scope.getDataList('co2')
	];
	

	//收缩压的
	$scope.BP1_labels = $scope.getTimelist();
	 $scope.BP1_series = ['收缩压趋势图'];
	 $scope.BP1_data = [
	    $scope.getDataList('收缩压')
	];
    //舒张压的
	$scope.BP2_labels = $scope.getTimelist();
	 $scope.BP2_series = ['舒张压趋势图'];
	 $scope.BP2_data = [
	    $scope.getDataList('舒张压')
	];

	//血糖的
	$scope.GLU_labels = $scope.getTimelist();
	 $scope.GLU_series = ['血糖趋势图'];
	 $scope.GLU_data = [
	    $scope.getDataList('GLU')
	];



	$scope.adderlist = [];

	//取值函数，获取二氧化碳添加的参数列表
	$scope.creatCo2Adder = function (val){
		$scope.co2Add = $scope.getTimelist();
		$scope.co2Add_Data = $scope.getDataList('co2');
		var list = [];
		var addList = [];
		var sortList = [];
		var sortAddList = [];
		var theList = [];
		var theAddList = [];
		for (var i = 0; i < $scope.co2Add.length; i++) {
			list[$scope.co2Add[i]] = $scope.co2Add_Data[i];
		}
		if ($scope.co2AddList) {
		    for(var i in list){
		    	addList[i] = 0;
		    }
		    for (var i = 0; i < $scope.co2AddList.length; i++) {
		       list[($filter('date')($scope.co2AddList[i]['time'].valueOf(),'MM-dd hh:mm:ss'))] = 0;
		       addList[($filter('date')($scope.co2AddList[i]['time'].valueOf(),'MM-dd hh:mm:ss'))] = $scope.co2AddList[i][val];

		    }
		    //键值取出来，排序
		    sortList = Object.keys(list);
		    sortAddList = Object.keys(addList);
		    sortList.sort();
		    sortAddList.sort();
		    //放回排序后的值
		    for (var i = 0; i < sortList.length; i++) {
		    	theList[sortList[i]] = list[sortList[i]];
		    	theAddList[sortList[i]] = addList[sortList[i]];
		    }
		    $scope.adderlist = theList;
		    //console.log(theList);
		    return theAddList;
		}
	}

	//获取取值函数的时间列表
	$scope.getCo2AdderTimeList = function (val) {
		var list = [];
		for(var i in val) {
			list.push(i)
		}
		//console.log(list);
		return list;
	}

	//数据列表
	$scope.getCo2AdderDataList = function (val) {
		var list = [];
		for(var i in val){
			list.push(val[i])
		}
		return list;
	}

    if ($scope.reportList[0].消息标识 =="co2") {
    	//获取操作
		$scope.PHList = $scope.creatCo2Adder('PH');
		$scope.PaCO2List = $scope.creatCo2Adder('PaCO2');
		$scope.PaO2List = $scope.creatCo2Adder('PaO2');
		$scope.co2AdderTimeList = $scope.getCo2AdderTimeList($scope.PHList);
		//console.log($scope.adderlist);
		//生成co2添加的以及数据图表
		$scope.co2Adder_labels = $scope.co2AdderTimeList;
		 $scope.co2Adder_series = ['co2','PH','PaCO2','PaO2'];
		 $scope.co2Adder_data = [
		    $scope.getCo2AdderDataList( $scope.adderlist),
		    $scope.getCo2AdderDataList($scope.creatCo2Adder('PH')),
		    $scope.getCo2AdderDataList($scope.creatCo2Adder('PaCO2')),
		    $scope.getCo2AdderDataList($scope.creatCo2Adder('PaO2'))
		];
    }


	//体重的
	$scope.Weight_labels = $scope.getTimelist();
	 $scope.Weight_series = ['体重'];
	 $scope.Weight_data = [
	    $scope.getDataList('weight')
	];	




	//为体重准备
	$scope.weightMax = $scope.getMax($scope.para,'weight');
	$scope.weightMin = $scope.getMin($scope.para,'weight');
	$scope.weightAvg = $scope.getAvg($scope.para,'weight');
	$scope.BMImax = $scope.getMax($scope.para,'bmi');
	$scope.BMImin = $scope.getMin($scope.para,'bmi');
	$scope.BMIavg = $scope.getAvg($scope.para,'bmi');
	

	//$scope.mac = $filter('avgForBP2')($scope.para);


	//肺功能cd6
	$scope.getLungAge = function(){
		var age = 0;
		if ($scope.people.sex == '男') {
			age = (0.0418*$scope.people.height + 0.0065*$scope.people.weight - 2.9614 - $filter("max")($scope.para[0]['fev1'])) / 0.0246;
		}else if ($scope.people.sex == '女') {
			age = (0.0400*$scope.people.height + 2.9907 - $filter("max")($scope.para[0]['fev1'])) / 0.0166;
		}
		//console.log('age:' + age);
		return age;
	}

	$scope.lungAge = $scope.getLungAge();

	//肺功能各个参数
	
	//console.log($scope.mac);
	//获取参考值


//debug
	if (debug) {
		$http.get('json/reference.json')
		.success(function(response){
		$scope.referenceValue = response;
		});
	} else {
		// if(!window.rootPath)
			// window.rootPath = '/web/hos/';
		var str = Android.getURL(window.rootPath + 'json/reference.json');
		$scope.referenceValue = JSON.parse(str);
	}


	



});

