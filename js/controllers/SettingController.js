'use strict';
angular.module('chafangbao.controllers')
.controller('SettingController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,$http,$rootScope,$ionicPopup) {
	//页面返回
	$scope.back = function () {
		if(systemSet){
			var str = systemSet;  
			$scope.systemSet = JSON.parse(str);  //返回时恢复保存时的数据
			window.history.go(-1);
		} else{
			window.history.go(-1);
		}
	}
	//页面跳转
	$scope.toPassword = function(){window.location.href = "#/setting_password";}
	$scope.toInformation = function(){window.location.href = "#/setting_information";}
	$scope.toLanguage = function(){window.location.href = "#/setting_language";}
	$scope.user = {};
	//编辑按钮的逻辑
	$scope.isDisabled = true;
	$scope.toEditor = function(){
		$ionicPopup.prompt({
			title : "请先输入管理员账号及登录密码",
			template : '<label class="item item-input"><span class="input-label">账号</span><input ng-model="user.username" type="text"></label><label class="item item-input"><span class="input-label">密码</span><input ng-model="user.password" type="password"></label>',
			scope : $scope,
			rootScope : $rootScope,
			buttons : [{
					text : "取消",
					type : "button-default"
				}, {
					text : "确认",
					type : "button-calm",
					onTap : function (e) {
						var UN = $scope.user.username;
						var PW = $scope.user.password;
						console.log($rootScope.userName);
						console.log($rootScope.passWord);
						console.log($scope.user.username);
						if ($scope.user.username == $rootScope.userName && $scope.user.password == $rootScope.passWord) {
							$scope.editor();
						}else{
							alert("账号或密码错误");
						}
						
					}
				}
			]
		});
	}
	$scope.editor = function(){
		$scope.isDisabled = false;
	};
	
	//保存按钮的逻辑
	$scope.save = function(){
		$scope.isDisabled = true;
		systemSet = JSON.stringify($scope.systemSet);
		Android.setcfg("systemSet",systemSet);
		
		alert("保存成功!");
		console.log('保存完毕,刷新');
		location.reload();
		//alert("保存成功，下次登陆生效");
		//window.href.location = window.href.location;
	}
	
	//初始化系统设置
	
	var systemSet = Android.getcfg("systemSet");
	var password = Android.getcfg("passWord");
	var username = Android.getcfg("userName");
	if (systemSet) {
		$scope.systemSet = JSON.parse(systemSet);
		$scope.username = username;
		$scope.password = password;
	}else if (debug) {
		$http.get('json/systemsetting.json')
		.success(function(response){
		$scope.systemSet = response;
		});
	} else {
		if(!window.rootPath)
			window.rootPath = '/web/hos/';
		var str = Android.getURL(window.rootPath + 'json/systemsetting.json');
		$scope.systemSet = JSON.parse(str);
	}
	$scope.editPassword = function (){
		if ($scope.oldPassword == $rootScope.passWord) {   //如果密码正确
			if ($scope.newPassword_1 == $scope.newPassword_2) {
				$rootScope.passWord = $scope.newPassword_2;   //保存密码
				Android.setcfg("passWord",$scope.newPassword_2);  //保存本地
			}else{
				alert("前后密码不一致");
			}
		}else{
			alert("旧密码错误");
		}
	}
});