'use strict';
angular.module('chafangbao.controllers')
.controller('CheckController', function($scope,$timeout, $ionicLoading,$window,$ionicHistory,$ionicPopup,$ionicModal,ThePerson,kfDevices,locals,Manage_Index_Service,$rootScope) {

	//避免指针而引起的数组混乱,深度拷贝函数
	var deepCopy= function(source) {
		var result={};
		for (var key in source) {
			result[key] = typeof source[key]==='object'? deepCopy(source[key]):source[key];
		} 
		return result;
	}

	$scope.people = angular.copy(ThePerson.get());//获取传入的人的参数
	$rootScope.Pad_user.infoList.Height = $scope.people.height;
	$rootScope.Pad_user.infoList.Sex = $scope.people.sex;
	$rootScope.Pad_user.infoList.Weight = $scope.people.weight;
	$rootScope.Pad_user.infoList.Age = $scope.people.age;
	$scope.isreport = ThePerson.returnIsReport();
	$scope.ischarge = ThePerson.returnIsCharge();

	//路由配置

	$scope.back = function(){
		window.history.go(-1);
	}
	$scope.toReport = function(){
		$window.location.href = "#/check_report";
	}
	$scope.toCheckSet = function(){
		$window.location.href = "#/checkset";
	}
	$scope.toAddperson = function(){
		$window.location.href = "#/addperson";
	}
	// console.log(localStorage);
	//扫描二维码
	$scope.sannerCR = function(){
	document.addEventListener("deviceready", function () {

		$cordovaBarcodeScanner
		.scan()
		.then(function(barcodeData) {
			alert(barcodeData);
			// Success! Barcode data is here 扫描数据：barcodeData.text
		}, function(error) {
			// An error occurred
		});


		// NOTE: encoding not functioning yet
		$cordovaBarcodeScanner
		.encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
		.then(function(success) {
			// Success!
		}, function(error) {
			// An error occurred
		});

		}, false);
	}

	//输出设备
	$scope.device = DEVICE;

	//使用devices_IndexCheck服务
	$scope.manage_index = Manage_Index_Service($scope);

	//进入页面 预设仪表盘
	$scope.$on("$ionicView.beforeEnter", function () {
		var i;
		var j = 0;
		for (i in DEVICE) {
			if (j == 0) {
				$scope.activeDevice = DEVICE[i];
				j++;
			}
		}
	});

	//离开页面初始化数据
	$scope.$on("$ionicView.leave", function () {
		$scope.manage_index.Monitor.init();
	});

});