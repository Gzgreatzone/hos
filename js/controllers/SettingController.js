'use strict';
angular.module('chafangbao.controllers')
.controller('SettingController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,$http) {
  		$scope.back = function () {
 			    if(typeof(sessionStorage.systemSet) !== "undefined"){
          var str = sessionStorage.systemSet;   
          $scope.systemsetting = JSON.parse(str);  //返回时恢复保存时的数据
 			     window.history.go(-1);
        } else{
          window.history.go(-1);
        }
 		};
        $scope.toPassword = function(){window.location.href = "#/setting_password";}
        $scope.toInformation = function(){window.location.href = "#/setting_information";}
        $scope.toLanguage = function(){window.location.href = "#/setting_language";}
        
        $scope.isDisabled = true;
 	    $scope.editor = function(){
 		  $scope.isDisabled = false;
 	    } ;
 	    $scope.save = function(){
 		  $scope.isDisabled = true;
 		    var setStr = JSON.stringify($scope.systemSetting); //转化为数组
            sessionStorage.systemSet = setStr;   //存储
            console.log(sessionStorage.systemSet);
 	}
 	 
 	 //初始化系统设置

 	 if(typeof(sessionStorage.systemSet) !== "undefined") {
      var str = sessionStorage.systemSet;
      $scope.systemSetting = JSON.parse(str);
    } else {
      $http.get('json/systemsetting.json').success(function(response){
         $scope.systemSetting = response;
         
     });
    }
    //


    });