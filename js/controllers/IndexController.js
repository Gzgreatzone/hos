'use strict';
angular.module('chafangbao.controllers')
.controller('IndexController', function($scope,	$window,$timeout, $ionicLoading,$http,ThePerson,$cordovaBarcodeScanner,kfLogin,$rootScope) {
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
		alert("gg");
		$rootScope.islogin = false;
		$window.location.href = '#/login';
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

	var pairs = {
		"peoples":""
	}
	for(var i in pairs){
		pairs[i] = 安卓用键获取值(i);
	}
	if (pairs.peoples) {
		$scope.peoples = JSON.parse(pairs.peoples);
	}else if (debug == "true") {
		$http.get('json/peoples.json')
		.success(function(response){
			$scope.peoples = response;
			pairs.peoples = JSON.stringify($scope.peoples);
			安卓设置键值对("peoples",pairs["peoples"]);
		});
	} else if(debug == "false") {
		var str = Android.getURL('/web/hos/json/peoples.json');
		$scope.peoples = JSON.parse(str);
	}



	$scope.toThePerson = function(people){
		$rootScope.Fn.shake();
		ThePerson.setFalse();
		ThePerson.setPeople(people);
		window.location.href = "#/check";
	}
	$scope.sannerCR = function(){
	  	$rootScope.Fn.shake();
	  	Android.qrcode();
	  // if (debug==false) {
	  // 	if (ThePerson.backqrcord(Android.qrcode())) {
	  // 	 var restoreInfo = ThePerson.restore(ThePerson.get(),ThePerson.backqrcord(Android.qrcode()));
	  //    ThePerson.setPeople(restoreInfo);
	  //    $window.location.href = "#/addperson";
	  //   }
	  // }
	}
})