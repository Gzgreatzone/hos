'use strict';
angular.module('chafangbao.controllers')
.controller('CheckSetController', function($scope,$timeout,$http, $ionicLoading,$ionicHistory,$window,$ionicPopup,ThePerson,locals,$cacheFactory,$ionicModal,$rootScope) {

	//初始化
	$scope.people = ThePerson.get();
	var setting = Android.getcfg("setting");
	if(setting) {
		var str = setting;
		$scope.setting = JSON.parse(str);
	} else if (debug) {
		$http.get('json/base.json').success(function(response){
			$scope.setting = response;
		});
	} else {
		var str = Android.getURL('/web/hos/json/base.json');
		//$scope.$apply($scope.setting , function(){console.log($scope.setting)})
		$scope.setting = JSON.parse(str);
	}
	//结束
	$scope.back = function(){
		//复原没有保存的数据（修改但是没有保存）跳回时候如果不点击保存时不会保存的
		if(setting){
			var str = setting; 
			$scope.setting = JSON.parse(str);  
			window.history.go(-1);
		}else{
			window.history.go(-1);
		}
	}	

	$scope.settingList = [
		"血氧测量设置",
		"二氧化碳测量设置",
		"肺功能测量设置",
		"体重测量设置",
		"血压测量设置",
		"血糖测量设置"
	]

	$scope.tosetting = function(val){
		$window.location.href = "#/checkset_"+val;
	}

	$scope.post = function(){
		$http({
			url: '/',
			method: "POST",
			data: $scope.setting
		})
		.then(function(response) {
			console.log("dd");
		})
		$scope.openModal();
		$timeout(function() {
			$scope.closeModal();
		}, 1000);
	}

	/*基本值设定*/
	$scope.toggle = function(val){
		$(document).ready(function(){
			$("."+val).toggle(500);
		});
	}

	/*数据的设定，清除与恢复默认参数*/
	$scope.clear = function(num){
		if (debug) {
			$http.get('json/base.json').success(function(response){
				$scope.setting[num] = response[num];   //还原被复原的一块
				var str = JSON.stringify($scope.setting);
				Android.setcfg("setting",str);
				// $scope.openModal();
				// $timeout(function() {
				// 	$scope.closeModal();
				// }, 1000);   
			});
		} else {
			var str = Android.getURL('/web/hos/json/base.json');
			var response = JSON.parse(str);
			$scope.setting[num] = response[num];   //还原被复原的一块
			var str = JSON.stringify($scope.setting);
			Android.setcfg("setting",str);  //保存到本地
			// $scope.openModal();
			// $timeout(function() {
			// 	$scope.closeModal();
			// }, 1000);
		} 
	}

	$scope.reset = function(num){
		if (debug) {
			$http.get('json/base.json').success(function(response){
				$scope.setting[num] = response[num];   //还原被复原的一块
				var str = JSON.stringify($scope.setting);
				Android.setcfg("setting",str);  //保存到本地
				// $scope.openModal();
				// $timeout(function() {
				// 	$scope.closeModal();
				// }, 1000);   
			});
		} else {
			var str = Android.getURL('/web/hos/json/base.json');
			var response = JSON.parse(str);
			$scope.setting[num] = response[num];   //还原被复原的一块
			var str = JSON.stringify($scope.setting);
			Android.setcfg("setting",str);  //保存到本地
			// $scope.openModal();
			// $timeout(function() {
			// 	$scope.closeModal();
			// }, 1000);
		} 
	}
	$scope.toClear = function(num){
		var toCLearAlert = $ionicPopup.show({
			title:"确定要较零吗",
			scope :$scope,
			buttons: [
				{
					text: '取消'
				},
				{
					text: '<b>确定</b>',
					type: 'button-calm',
					onTap:function(e) {
						//$scope.clear(num);
						$scope.openModal();
					}
				},
			] ,
			template: '注意，较零需要将仪器放置10秒，不能进行其他操作'
		})
	}
	$scope.toReset = function(num){
		var toCLearAlert = $ionicPopup.show({
			title:"确定要恢复默认值吗",
			scope :$scope,
			buttons: [
			{
				text: '取消'
			},
			{
				text: '<b>确定</b>',
				type: 'button-calm',
				onTap: function(e) {
					$scope.reset(num);
				}
			}],
			template: ''
		})
	}

	$scope.ready = function(){    //动画
		$scope.isShow = 'show';
		$timeout(function () {
			$scope.isShow = 'unshow';
		}, 1500);
	}

	//初始化
	$scope.saveSet = function(){
		var str  = JSON.stringify($scope.setting);
		console.log($scope.setting[0]);

		//console.log(str);
		Android.setcfg("setting",str);
		$ionicPopup.alert({
			title	: "保存成功"
		})
	}
	//为了适配PC调试和安卓真实环境
	if(!window.rootPath)
			window.rootPath = '/web/hos/';
	if(debug)
	{
		//当运行环境是PC时,使用http协议,模板是通过get请求获取的
		$ionicModal.fromTemplateUrl(window.rootPath + 'templates/modal/modal_ready.html', {
			scope : $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});
	}
	else
	{
		//当运行环境是安卓时,使用file协议,模板是通过阻塞读取本地文件获取的
		$scope.modal = $ionicModal.fromTemplate(Android.getURL(window.rootPath + 'templates/modal/modal_ready.html'), {
			scope : $scope
		});
	}

	$scope.openModal = function () {
		$scope.modal.show();
		//翁老师的接口
		$scope.exitBoole = true;
		$scope.inforText = "请放置好仪器，不要进行任何操作";
		$scope.exitText = "请耐心等候大约10秒";
		$timeout(function() {
				$scope.inforText = "操作成功";
				$scope.exitText = "退出"
				$scope.exitBoole = false;
		}, 15000);
		
	};
	$scope.closeModal = function () {
		$scope.modal.hide();
	};
	$scope.setModel = function (val) {
		$rootScope.co2CheckModel = val;
	}
	$scope.watchSet =function(num,key,key1,val1){  
		//监视修改值，若有修改，马上与setting绑定
		$scope.setting[num][key][key1] = val1;
		console.log($scope.setting[num][key]);
	}


});

  