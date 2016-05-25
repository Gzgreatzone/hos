'use strict';
angular.module('chafangbao.controllers')
.controller('IndexController', function($scope,	$window,$timeout, $ionicLoading,$http,ThePerson) {
    $scope.toCheck = function(){
    	$window.location.href = "#/check";
      ThePerson.setTure();
      ThePerson.clear();
    };
    $scope.toAddPerson = function(){
    	$window.location.href = "#/addperson";
      ThePerson.clear();
    };
    $scope.letters_list = function(){
    	$scope.maxHeight =  document.documentElement.clientHeight;
    	$scope.allHeight = $scope.maxHeight*0.8;
    	$scope.myHeight = $scope.allHeight/28;
    	/*console.log($scope.myHeight);
    	console.log($scope.maxHeight);*/
    	$scope.lettersStyle = {
    		"height" :$scope.myHeight +"px" ,
    	}
    };
    $scope.letters_list();



    $scope.lettersClick = function(index){
    	$scope.isClick = 'click';
    	$scope.isShow = 'show';
        $scope.letter_onclick = index;
    	$timeout(function () {
          $scope.isClick = "unclick";
          $scope.isShow = 'unshow';
            }, 500);
    }

    $scope.myOrderBy = "+bedNumber";



    $scope.letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","#"];
    if (debug == "true") {
    $http.get('json/peoples.json')
    .success(function(response){
         $scope.peoples = response;
     });
    } else if(debug == "false") {
     var str = Android.getURL('/web/hos/json/peoples.json');
      $scope.peoples = JSON.parse(str);
    }



    $scope.toThePerson = function(people){
        ThePerson.setFalse();
        ThePerson.setPeople(people);
        window.location.href = "#/check";


    }
    // $scope.sannerCR = function(){
    //     document.addEventListener("deviceready", function () {

    //       $cordovaBarcodeScanner
    //         .scan()
    //         .then(function(barcodeData) {
    //            alert(barcodeData);
    //           // Success! Barcode data is here 扫描数据：barcodeData.text
    //         }, function(error) {
    //           // An error occurred
    //         });


    //       // NOTE: encoding not functioning yet
    //       $cordovaBarcodeScanner
    //         .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
    //         .then(function(success) {
    //           // Success!
    //         }, function(error) {
    //           // An error occurred
    //         });

    //     }, false);
    // }

 })