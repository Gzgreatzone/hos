'use strict';
angular.module('chafangbao.controllers')
.controller('LoginController', function($scope,$rootScope,$timeout, $ionicLoading,$window,locals,kfLogin) {
 		$scope.toSetting = function () {
      
 			$window.location.href = '#/setting';
 		};

  if(typeof(sessionStorage.username) !== "undefined" && typeof(sessionStorage.password) !== "undefined"){
      var str = sessionStorage.username;
      var str2 = sessionStorage.password;
      $scope.username = JSON.parse(str);
      $scope.password = JSON.parse(str2);
    }
  $scope.toIndex = function(){
    
  	var name = $scope.username;
  	var pw = $scope.password;
  	if (name == 'admin' && pw == '123') {
  		var str = JSON.stringify($scope.username);
      var str2 = JSON.stringify($scope.password);
      sessionStorage.username = str;
      sessionStorage.password = str2;
      $rootScope = true;
      $window.location.href = "#/index";
  	} else{
  		alert("error");
  	}
  	
  }   
 });