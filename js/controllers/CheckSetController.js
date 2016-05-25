'use strict';
angular.module('chafangbao.controllers')
.controller('CheckSetController', function($scope,$timeout,$http, $ionicLoading,$ionicHistory,$window,$ionicPopup,ThePerson,locals,$cacheFactory,$ionicModal) {
 	$scope.people = ThePerson.get();
    $scope.back = function(){    //复原没有保存的数据（修改但是没有保存）
     if(typeof(sessionStorage.userset) !== "undefined"){
     	var str = sessionStorage.userset;
      $scope.setting = JSON.parse(str);
       window.history.go(-1);
    }else{
       window.history.go(-1);
    }
     
   }	
     $scope.toOne = function(){$window.location.href = "#/checkset_1";}
     $scope.toTwo = function(){$window.location.href = "#/checkset_2";}
     $scope.toThree = function(){$window.location.href = "#/checkset_3";}
     $scope.toFour = function(){$window.location.href = "#/checkset_4";}
     $scope.toFive = function(){$window.location.href = "#/checkset_5";}
     $scope.toSix = function(){$window.location.href = "#/checkset_6";}
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
     
    //避免指针而引起的数组混乱,深度拷贝函数
     var deepCopy= function(source) { 
      var result={};
        for (var key in source) {
              result[key] = typeof source[key]==='object'? deepCopy(source[key]):source[key];
           } 
           return result;
     }
    
     /*基本值设定*/
     
     /*$scope.setting = basicParameter;*/
     /*血氧*/
     $scope.show_OS1 = {"val":false,}
     $scope.show_OS2 = {"val":false,}
     /*二氧化碳*/
     $scope.show_CO21 = {"val":false,}
     $scope.show_CO22 = {"val":false,}
     $scope.show_CO23 = {"val":false,}
     $scope.show_CO24 = {"val":false,}
     /*肺功能*/
     $scope.show_PFT1 = {"val":false,}
     $scope.show_PFT2 = {"val":false,}
     $scope.show_PFT3 = {"val":false,}
     /*体重*/
     $scope.show_WEI1 = {"val":false,}
     $scope.show_WEI2 = {"val":false,}
     $scope.show_WEI3 = {"val":false,}
     /*血压*/
     $scope.show_BP1 = {"val":false,}
     $scope.show_BP2 = {"val":false,}
     $scope.show_BP3 = {"val":false,}
     /*血糖*/
     $scope.show_BS1 = {"val":false,}
     $scope.show_BS2 = {"val":false,}
     $scope.show_BS3 = {"val":false,}
     


     $scope.toggle = function(theShow){
          $scope.isAnimate = 'option animated bounceInRight';
          theShow.val = !theShow.val;

     }
     

              /*数据的设定，清除与恢复默认参数*/

     $scope.clear = function(num){
      if (debug =="true") {
        $http.get('json/base.json').success(function(response){
         $scope.setting[num] = response[num];   //还原被复原的一块
         sessionStorage.userset = JSON.stringify($scope.setting);  //保存到本地
         $scope.openModal();
         $timeout(function() {
          $scope.closeModal();
         }, 1000);   
     });
      } else if (debug =="false") {
         var str = Android.getURL('/web/hos/json/base.json');
         var response = JSON.parse(str);
         $scope.setting[num] = response[num];   //还原被复原的一块
         sessionStorage.userset = JSON.stringify($scope.setting);  //保存到本地
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
         sessionStorage.userset = JSON.stringify($scope.setting);  //保存到本地
         $scope.openModal();
         $timeout(function() {
          $scope.closeModal();
         }, 1000);   
     });
      } else if (debug =="false") {
         var str = Android.getURL('/web/hos/json/base.json');
         var response = JSON.parse(str);
         $scope.setting[num] = response[num];   //还原被复原的一块
         sessionStorage.userset = JSON.stringify($scope.setting);  //保存到本地
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
    if(typeof(sessionStorage.userset) !== "undefined") {
      var str = sessionStorage.userset;
      $scope.setting = JSON.parse(str);
    } else if (debug =="true") {
      $http.get('json/base.json').success(function(response){
      $scope.setting = response;
     });
    } else if (debug == "false") {
      var str = Android.getURL('/web/hos/json/base.json');
      $scope.setting = JSON.parse(str);
    }
    //结束
    
    $scope.saveSet = function(){
       var setStr = JSON.stringify($scope.setting); 
            sessionStorage.userset = setStr; 
            console.log(sessionStorage.userset);
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

    /*
    if (!locals.get("userset","")) {
     $scope.setting = basicParameter;
    } else {
      $scope.setting = locals.get("userset","");
    }
    $scope.$on("$ionicView.leave",function(){
        locals.set("userset",$scope.setting);
      }) */