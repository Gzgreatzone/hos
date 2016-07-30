'use strict';
//--------------
// name        : CheckCo2Controller.js
// type        : co2监测测页面对应的控制器
// dependences : 
// usage       : 
//             : 
// copyright   : 
//--------------
angular.module('chafangbao.controllers')
.controller('CheckCo2Controller', function($scope,$timeout, $ionicLoading,$window,$ionicHistory,$ionicPopup,$ionicModal,ThePerson,kfDevices,locals,MeasureService,$rootScope) {
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
	$scope.manage_index = MeasureService($scope);

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


    // $scope.timeCounter = function(){
    // 	$scope.counter();
    // 	$scope.openCo2();
    	
    // }
    // $scope.openCo2 =  function (){
    // 	$rootScope.txt_activeDevice = infoList.address + "，请打开" + "二氧化碳监测仪" + "，请用最大力吹气";
    // 	合成语音($rootScope.txt_activeDevice);
    // 	kfDevices.open('呼末二氧化碳',$scope.callback, $scope.device);
    	
    // }
    	// $scope.counter = function () {
	// 	var timeVal = 0;
	// 	var time;
	// 	$scope.count = function(){
	// 		$scope.timeCount = timeVal;
	// 	    timeVal++;
	// 		$timeout(function() {
	// 			$scope.count();
	// 		}, 1000);
	// 	}
	// 	$scope.count();
	// }
});