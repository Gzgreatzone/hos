'use strict';
angular.module('chafangbao.controllers')
.controller('LoginController', function($scope,$rootScope,$timeout, $ionicLoading,$window,$http,locals,kfLogin,$cordovaSplashscreen) {
	var pairs = {
		"systemSet":"",
		"password":"",
		"username":""
	}
	for(var i in pairs){
		pairs[i] = 安卓用键获取值(i);
	}
	if (pairs.systemSet) {
		$scope.systemSet = JSON.parse(pairs.systemSet);
		$scope.username = pairs.username;
		$scope.password = pairs.password;
	}else if (debug=="true") {
		$http.get('json/systemsetting.json')
		.success(function(response){
			$scope.systemSet = response;
		});
	}else if(debug=="false"){
		var str = Android.getURL('/web/hos/json/systemsetting.json');
		$scope.systemSet = JSON.parse(str);
	}
	$scope.toSetting = function () {
		$window.location.href = '#/setting';
	};

	$scope.toIndex = function(){   //判断登陆逻辑
		if($scope.username ==$rootScope.userName && $scope.password == $rootScope.passWord){
			pairs.systemSet = JSON.stringify($scope.systemSet);
			pairs.username = $scope.username;
			pairs.password = $scope.password;
			for(var i in pairs){
				安卓设置键值对(i,pairs[i]);
			}
			$rootScope.islogin = true;
			$window.location.href = "#/index";
			// kfLogin.login($scope.username, $scope.password, true, function(Res){
			//   console.log(Res);
			// });
		}else{
			alert("错误");
		}
	}
 });