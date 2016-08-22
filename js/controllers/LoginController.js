'use strict';
angular.module('chafangbao.controllers')
.controller('LoginController', function($scope,$rootScope,$timeout, $ionicLoading,$window,$http,$ionicPopup) {

//初始化定义

	var systemSet = Android.getcfg("systemSet");
	var password = Android.getcfg("passWord");
	var username = Android.getcfg("userName");

	//看本地有没有，否则去拿
	if (systemSet) {
		$scope.systemSet = JSON.parse(systemSet);
		$scope.username = username;
		$scope.password = password;
	}else if (debug) {
		$http.get('json/systemsetting.json')
		.success(function(response){
			$scope.systemSet = response;
		});
	}else {
		var str = Android.getURL(window.rootPath+'json/systemsetting.json');
		$scope.systemSet = JSON.parse(str);
	}
	$scope.toSetting = function () {
		$window.location.href = '#/setting';
	};

//跳转

	$scope.toIndex = function(){   
	//判断登陆逻辑
		if($scope.username == $rootScope.userName && $scope.password == $rootScope.passWord){
			systemSet = JSON.stringify($scope.systemSet);
			username = $scope.username;
			password = $scope.password;
			Android.setcfg("systemSet",systemSet);
			Android.setcfg("userName",username);
			Android.setcfg("passWord",password);
			$rootScope.islogin = true;
			$window.location.href = "#/index";
			//这里是存储登陆的时间节点以便于判断登陆是否过期
			$rootScope.availableTime = true;
			var loginTime = new Date();
			$scope.loginTime = loginTime.valueOf();
			Android.setcfg("loginTime",$scope.loginTime);
			
		}else{
			$ionicPopup.alert({
		       title: '账号或者密码错误'
		     });
		}
	}
 });