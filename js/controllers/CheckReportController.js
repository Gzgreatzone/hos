'use strict';
angular.module('chafangbao.controllers')
.controller('CheckReportController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,ThePerson) {
 	$scope.people = ThePerson.get();
     $scope.back = function () {
 			    window.history.go(-1);
 		}
     $scope.toCheckReport = function(){
               $window.location.href = "#/checkreport";
          }
     $scope.next = function(){
          if (document.getElementsByName("group")[0].checked) {
     		$window.location.href = "#/checkreport_1";
     	}
     	else if (document.getElementsByName("group")[1].checked) {
     		$window.location.href = "#/checkreport_2";
           } 
     	else if (document.getElementsByName("group")[2].checked) {
               $window.location.href = "#/checkreport_2";
          } 
          else{
     		}
     }
     

 });
