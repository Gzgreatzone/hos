'use strict';
angular.module('chafangbao.controllers')
.controller('SettingController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,$http) {


    	$scope.back = function () {
 			    if(Arrey.systemSet){
          var str = Arrey.systemSet;  
          $scope.systemSet = JSON.parse(str);  //返回时恢复保存时的数据
 			     window.history.go(-1);
        } else{
          window.history.go(-1);
        }
    }
 	
        $scope.toPassword = function(){window.location.href = "#/setting_password";}
        $scope.toInformation = function(){window.location.href = "#/setting_information";}
        $scope.toLanguage = function(){window.location.href = "#/setting_language";}
        
        $scope.isDisabled = true;
 	    $scope.editor = function(){
 		  $scope.isDisabled = false;
 	    } ;
 	    $scope.save = function(){
 		  $scope.isDisabled = true;
 		     Arrey.systemSet = JSON.stringify($scope.systemSet);
        安卓设置键值对("systemSet",Arrey["systemSet"]);
 	}
 	 
 	 //初始化系统设置

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


    });