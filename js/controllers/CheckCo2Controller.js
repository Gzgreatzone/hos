'use strict';
//--------------
// name        : CheckCo2Controller.js
// type        : co2监测测页面对应的控制器
// dependences : 
// usage       : 林峰编写
//             : 
// copyright   : 
//--------------
angular.module('chafangbao.controllers')
.controller('CheckCo2Controller', function($scope,$timeout, $ionicLoading,$window,$ionicHistory,$interval,$ionicPopup,$ionicModal,ThePerson,kfDevices,$rootScope) {
	var infoList = $rootScope.Pad_user.infoList;
	
	$rootScope.isCheckCo2Router = true;
	$scope.back = function () {
		$rootScope.isCheckCo2Router = false;
		kfDevices.close('co2');
		window.history.go(-1);
	}
	 //co2实时监视图
	 $scope.co_labels = ['0','1','2','3','4','5','6','7','8','9','10'];
	 $scope.co_series = ['二氧化碳'];
	 $scope.co_data = [
	    ['30']
	];


	
	//为了调用表格打点
	var table = document.getElementById('co2table');
	var x,y,w,h;
	var X= table.getBoundingClientRect().left;
	y =table.getBoundingClientRect().top;
	var tablewidth = table.clientWidth ;
	var tableheight = table.offsetHeight ;
	console.log(X);
	console.log(y);
	console.log(X+tablewidth*0.0438);
	x = X+tablewidth*0.0438;
	table.onload = function(){
      h = table.height*0.97;
      w = tablewidth*0.929;
       console.log(tablewidth);
    }
    $scope.device = DEVICE;
	//使用devices_IndexCheck服务
	//$scope.manage_index = MeasureService($scope);

	$scope.callback = function(msg){
			try{
	    		Android.setCo2Grid(x,y,w,h);
	    	}catch(e){
	    		alert(e);
	    	}
			alert(msg);
    		//Android.setCo2Grid(x,y,w,h);
    		//alert(Android.setCo2Grid(x,y,w,h));

	}

	$scope.begin = function () {

		kfDevices.open('呼末二氧化碳',$scope.callback, $scope.device);
	}

	//计时器部分//WangLF
	$scope.work = "开始";
	$scope.timeCount = 0;
	var timer;

    $scope.timeCounter = function(){
    	$scope.counter();
    	// $scope.openCo2();	
    }

    $scope.counter = function(){
    var timeVal = 0;
    	if($scope.work == "开始"){
    		$scope.work = "停止";
    		$scope.timeCount = 0;
    		timer = $interval(function(){
				timeVal++;
				$scope.timeCount = timeVal;
			},1000)
    	}else{
    		$scope.work = "开始";
    		$interval.cancel(timer);
    	}
    }


});