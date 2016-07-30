'use strict';
//--------------
// name        : CheckController.js
// type        : 快速检测页面对应的控制器
// dependences : 
// usage       : 
//             : 
// copyright   : 
//--------------
angular.module('chafangbao.controllers')
.controller('CheckController', function($scope,$timeout, $ionicLoading,$window,$ionicHistory,$ionicPopup,$ionicModal,ThePerson,kfDevices,locals,MeasureService,$rootScope) {

	//通过rootScope的Pad_user来获取用户信息
	// window.onload = function () {
	// $scope.people = angular.copy(ThePerson.get());//获取传入的人的参数
	// }
	//$scope.checkWord = window.checkWord;
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
	  	$rootScope.Fn.shake();
	  	//Android.qrcode();
	  	kfDevices.qrcode(function(msg)
	  		{
	  			alert(msg);
	  			var clearword = ThePerson.backqrcord(msg);
	  			alert(clearword);
	  			var peopleOne = ThePerson.get()
	  			var Info = ThePerson.restore(peopleOne,clearword);
	  			ThePerson.setPeople(Info);
	  			alert(Info);
	  			$window.location.href = "#/addperson";
	  		});
	}

	$scope.exit = function (){
		Android_do_cmd("exitMonitor");
		$ionicPopup.alert({
			 title: '退出成功，如果依旧无法启动服务请关闭kf服务并再次启动'
		})
	}
	//输出设备
	$scope.device = DEVICE;
	//使用devices_IndexCheck服务
	$scope.manage_index = MeasureService($scope);
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