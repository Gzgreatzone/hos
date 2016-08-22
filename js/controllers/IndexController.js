'use strict';
angular.module('chafangbao.controllers')
.controller('IndexController', function($scope,	$window,$timeout,$ionicPopup, $ionicLoading,$http,ThePerson,$rootScope,kfDevices) {
//路由配置
	$scope.toCheck = function(){
		$window.location.href = "#/check";
		ThePerson.setTure();
		ThePerson.clear();
	};
	$scope.toAddPerson = function(){
		$window.location.href = "#/addperson";
		ThePerson.clear();
	};
	$scope.logOut = function(){
		$ionicPopup.prompt({
			title : "确定要退出吗",
			template : "",
			buttons : [{
				text : "取消",
				type : "button-default"
			}, {
				text : "确认",
				type : "button-calm",
				onTap : function (e) {
				$rootScope.islogin = false;
		        $window.location.href = '#/login';
				}
			}]
		});
		
	};

	$scope.myOrderBy = "+bedNumber";

//每次进入都需要刷新
	$scope.$on("$ionicView.beforeEnter", function () {
		var peoples = Android.getcfg("peoples");
		if (peoples) {
			$scope.peoples = JSON.parse(peoples);
		}else if (debug ) {
			$http.get('json/peoples.json')
			.success(function(response){
				$scope.peoples = response;
				peoples = JSON.stringify($scope.peoples);
				Android.setcfg("peoples",peoples);
			});
		} else {
			// if(!window.rootPath)
			// 	window.rootPath = '/web/hos';
			var str = Android.getURL(window.rootPath + 'json/peoples.json');
			$scope.peoples = JSON.parse(str);
			peoples = JSON.stringify($scope.peoples);
			Android.setcfg("peoples",peoples);
		}
	});


	$scope.toThePerson = function(people){
		$rootScope.Fn.shake();
		ThePerson.setFalse();
		ThePerson.setPeople(people);
		window.location.href = "#/check";
	}
	$scope.sannerCR = function(){
	  	$rootScope.Fn.shake();
	  	//Android.qrcode();
	  	kfDevices.qrcode(function(msg)
	  		{
	  			//alert(msg);
	  			var clearword = ThePerson.backqrcord(msg);
	  			alert(clearword);
	  			var peopleOne = ThePerson.get()
	  			if (ThePerson.restore(peopleOne,clearword)) {
		  			var Info = ThePerson.restore(peopleOne,clearword);
		  			ThePerson.setPeople(Info);
		  			alert(Info);
		  			$window.location.href = "#/addperson";
	  			}
	  		});
	}
	$('img').error(function(){
            $(this).attr('src', "img/unset.jpg");
     });
	
})