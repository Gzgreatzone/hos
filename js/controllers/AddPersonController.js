'use strict';
angular.module('chafangbao.controllers')
.controller('AddPersonController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,ThePerson,$filter,$http,$cordovaCamera,$cordovaSQLite) {
	$scope.back = function () {
		window.history.go(-1);
	}
	$scope.isDisabled = true;
	$scope.editor = function(){
		$scope.isDisabled = false;
	};
	$scope.save = function(){
		$scope.isDisabled = true;
		$scope.today = new Date();
		$scope.people.endDate = $filter('date')($scope.today,'yyyy-MM-dd');
		var peopleSt = 安卓用键获取值("peoples");
		$scope.peoples = JSON.parse(peopleSt);
		for (var i = 0; i < $scope.peoples.length; i++) {
			if ($scope.people.number==$scope.peoples[i]["number"]) {
				$scope.peoples[i] = angular.copy($scope.people);
				安卓设置键值对("peoples",JSON.stringify($scope.peoples));  //保存本地
			}
			
		}
	}
	$scope.people = ThePerson.get();
	ThePerson.qrcod($scope.people);//生成二维码
	$scope.isQrcord = true;
	$scope.isQrcord_text = "展开二维码"
	$scope.turnQrcord = function(){
	    $scope.isQrcord = !$scope.isQrcord;
	    if ($scope.isQrcord_text =="展开二维码") {
		    $scope.isQrcord_text ="收起二维码";
	    }else{
	    	$scope.isQrcord_text ="展开二维码";
	    }
	}
});


 //还原二维码的数据
 // $scope.backqrcord = function(str){
 //  var clearword = new Base64();
 //  var clearWord = clearword.decode(str);
 //  return clearWord;
 // }
//如果调用二维码用这个
//var dateee =  "@kf580@等等#女#true#11#81#12#2053#169#60#第一区#2016年6月15日##";
//restore($scope.people,dateee);


 //ionic参数函数
			 //数组的精简,减少二维码赘余
// var decline = function(obj){
//    var word = "@kf580@";
//    for(var i in obj){
//     var word =  word  + obj[i] +"#";
//    }
//    console.log(word);
//    return word
//    //alert(word.split("#"));
// }

// //还原并且恢复数组
// var restore = function(obj,str) {
//   if (str.indexOf("@kf580@")!= -1) {
//     var baseW = str.replace(/@kf580@/, "");
//     console.log(baseW);
//     var baseWord = baseW.split("#");
//     console.log(baseWord);
//     var j = 0;
//     for(var i in obj){
//       obj[i] = baseWord[j];
//       j++;
//     }
//     console.log(obj);
//   } else {}
// }

// //生成二维码，用的是病人的编号
//   $scope.createNumber = function() {
//     var peopleSt = 安卓用键获取值("peoples");
//     var ran = Math.round(10000*Math.random());
//     var random = ran.toString();
//     if(peopleSt.indexOf(random)!=-1){
//        $scope.createNumber();
//     }else{
//        return random;
//     }

//   }
//   $scope.qrcod = function(){
//      if ($scope.people.number) { //假如存在，
//        var baseqrcord = new Base64();
//        var baseWord = baseqrcord.encode(decline($scope.people));
//        $("#takephoto").qrcode({ 
//         width: 300,
//         height:300, 
//         text: baseWord
//         });
//      } else {
//       $scope.people.number = $scope.createNumber();//生成编号
//       var baseqrcord = new Base64();
//        var baseWord = baseqrcord.encode(decline($scope.people));
//        $("#takephoto").qrcode({ 
//         width: 300,  
//         height:300, 
//         text: baseWord
//         }); 
//      }
	 
//    }
 //$scope.qrcod();