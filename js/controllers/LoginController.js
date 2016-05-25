'use strict';
angular.module('chafangbao.controllers')
.controller('LoginController', function($scope,$rootScope,$timeout, $ionicLoading,$window,$http,locals,kfLogin,$cordovaSplashscreen) {

 

  var Arrey = {
    "systemSet":"",
    "password":"",
    "username":""
  }
  for(var i in Arrey){
     Arrey[i] = 安卓用键获取值(i);
  }
  if (Arrey.systemSet) {
    $scope.systemSet = JSON.parse(Arrey.systemSet);
    $scope.username = Arrey.username;
    $scope.password = Arrey.password;
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

  $scope.toIndex = function(){
      Arrey.systemSet = JSON.stringify($scope.systemSet);
  		Arrey.username = $scope.username;
      Arrey.password = $scope.password;
      for(var i in Arrey){
        安卓设置键值对(i,Arrey[i]);
      }
      $rootScope = true;
      kfLogin.login($scope.username, $scope.password, true, function(Res){
        console.log(Res);
      });
      //$window.location.href = "#/index";
    
  	
  }   
 });