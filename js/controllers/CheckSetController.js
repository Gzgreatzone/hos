'use strict';
angular.module('chafangbao.controllers')
.controller('CheckSetController', function($scope,$timeout,$http, $ionicLoading,$ionicHistory,$window,$ionicPopup,ThePerson,locals,$cacheFactory,$ionicModal) {
 	$scope.people = ThePerson.get();
  var Arrey = {
      "setting":""
  }
  for(var i in Arrey){
     Arrey[i] = 安卓用键获取值(i);
  }

  $scope.back = function(){    //复原没有保存的数据（修改但是没有保存）
     if(Arrey.setting){
        var str = Arrey.setting;  
        $scope.setting = JSON.parse(str);  
        window.history.go(-1);
    }else{
        window.history.go(-1);
    }
     
   }	
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
      if (debug =="true") {
        $http.get('json/base.json').success(function(response){
         $scope.setting[num] = response[num];   //还原被复原的一块
         var str = JSON.stringify($scope.setting);
          安卓设置键值对("setting",str);
         $scope.openModal();
         $timeout(function() {
          $scope.closeModal();
         }, 1000);   
     });
      } else if (debug =="false") {
         var str = Android.getURL('/web/hos/json/base.json');
         var response = JSON.parse(str);
         $scope.setting[num] = response[num];   //还原被复原的一块
         var str = JSON.stringify($scope.setting);
         安卓设置键值对("setting",str);  //保存到本地
         $scope.openModal();
         $timeout(function() {
          $scope.closeModal();
         }, 1000);
      } 
     }
     $scope.reset = function(num){
      
      if (debug =="true") {
        $http.get('json/base.json').success(function(response){
         $scope.setting[num] = response[num];   //还原被复原的一块
         var str = JSON.stringify($scope.setting);
         安卓设置键值对("setting",str);  //保存到本地
         $scope.openModal();
         $timeout(function() {
          $scope.closeModal();
         }, 1000);   
     });
      } else if (debug =="false") {
         var str = Android.getURL('/web/hos/json/base.json');
         var response = JSON.parse(str);
         $scope.setting[num] = response[num];   //还原被复原的一块
         var str = JSON.stringify($scope.setting);
         安卓设置键值对("setting",str);  //保存到本地
         $scope.openModal();
         $timeout(function() {
          $scope.closeModal();
         }, 1000);
      } 
     }
     $scope.toClear = function(num){
       var toCLearAlert = $ionicPopup.show({
          title:"确定要清空吗",
          scope :$scope,
          buttons: [
               { text: '取消' },
               {
                 text: '<b>确定</b>',
                 type: 'button-positive',
                 onTap:function(e) {
                  $scope.clear(num);
                 }
               },
             ] ,
          template: ''
                 
       })          
     }
     $scope.toReset = function(num){
       var toCLearAlert = $ionicPopup.show({
          title:"确定要恢复默认值吗",
          scope :$scope,
          buttons: [
               { text: '取消' },
               {
                 text: '<b>确定</b>',
                 type: 'button-positive',
                 onTap:function(e) {
                  $scope.reset(num);
                 }
               },
             ] ,
          template: ''
                 
       })          
     }


     $scope.ready = function(){
       $scope.isShow = 'show';
     $timeout(function () {
          $scope.isShow = 'unshow';
            }, 1500);
    }

    //初始化
    if(Arrey.setting) {
      var str = Arrey.setting;
      $scope.setting = JSON.parse(str);
    } else if (debug =="true") {
      $http.get('json/base.json').success(function(response){
      $scope.setting = response;
     });
    } else if (debug == "false") {
      var str = Android.getURL('/web/hos/json/base.json');
       //$scope.$apply($scope.setting , function(){console.log($scope.setting)})
      $scope.setting = JSON.parse(str);
    }
    //结束
    
    $scope.saveSet = function(){
         var str  = JSON.stringify($scope.setting);
         console.log($scope.setting[0]);

         //console.log(str);
         安卓设置键值对("setting",str);
         //console.log(安卓用键获取值("setting"));
    }
   
    $ionicModal.fromTemplateUrl('modal_ready.html', {
      scope : $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };


 });

  