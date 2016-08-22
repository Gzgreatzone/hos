'use strict';
angular.module('chafangbao.controllers')
.controller('AddPersonController', function($scope,$timeout,$ionicPopup,$ionicLoading,$ionicHistory,$window,ThePerson,$filter,$http,kfDevices) {
	$scope.back = function () {
		window.history.go(-1);
	}
	$scope.isDisabled = false;
			
	$scope.toSetting = function(){// 新的编辑保存切换逻辑
		if($scope.setting == "编辑"){
			$scope.setting = "保存";
			$scope.editor()
		}else{
			// $scope.setting = "编辑";
			$scope.save()
		}
	} 



	$scope.editor = function(){
		$scope.isDisabled = false;
	};
	$scope.people = ThePerson.get();

	//专门生成二维码的一块
	$scope.peopleCRcode = angular.copy($scope.people);

	if ($scope.people.beginDate) {
		$scope.peopleCRcode.beginDate = $scope.people.beginDate.valueOf();
	} else {
		//r如果没有开始时间，则默认从当前时间开始
		$scope.people.beginDate = new Date();    
		$scope.peopleCRcode.beginDate = $scope.people.beginDate.valueOf();
	}

	$scope.people.endDate ? $scope.peopleCRcode.endDate = $scope.people.endDate.valueOf(): '';
	$scope.people.editDate ? $scope.peopleCRcode.editDate = $scope.people.editDate.valueOf(): '';
	//ThePerson.restore($scope.people,"@kf580@等等#女#true#11#81#12#2057#169#60#第一区###");


	//这段代码保证了时间是时间格式
	if ($scope.people.beginDate) {
	   $scope.people.beginDate = new Date($scope.people.beginDate);
	   //$scope.beginDate = $scope.people.beginDate;
	}
	if ($scope.people.endDate) {
		$scope.people.endDate = new Date($scope.people.endDate);
		//$scope.endDate = $scope.people.endDate;
	}
	if ($scope.people.editDate) {
		$scope.people.editDate = new Date($scope.people.editDate);
	}
	//有几个变量需要数字化
	var paraList = ["address","age","bedNumber","height","weight","number"]

	for(var i in paraList)	{
		if ($scope.people[paraList[i]]) {
			$scope.people[paraList[i]] = parseInt($scope.people[paraList[i]]) ;      //数字化
		}
	}

	//检测住院中和已出院
	$scope.creatDate = function (val) {
		if (val == "false") {
			$scope.people.endDate = new Date ();
		} else {
			$scope.people.endDate = "";
		}

	}


	$scope.save = function(){
		var peoples = Android.getcfg("peoples");
		$scope.peoples = JSON.parse(peoples);
		if ($scope.people.name && $scope.people.beInHospital && $scope.people.bedNumber) {  //三个关键信息
			$scope.isDisabled = true;
			var isSame = false;
				for (var i = 0; i < $scope.peoples.length; i++) {
				if ($scope.people.number==$scope.peoples[i]["number"]) {
					//存在则拷贝，存入，设置判断值，跳出
					$scope.peoples[i] = angular.copy($scope.people);
					var peoples = JSON.stringify($scope.peoples);
					Android.setcfg("peoples",peoples);  
					isSame = true;
					$ionicPopup.alert({
				       title: '保存成功！'
				     });
					$scope.setting = "编辑";
					break;
				}
				
			}
			if (!isSame) {
				//不存在则推入一个数组
				console.log($scope.peoples);
				$scope.peoples.push($scope.people);
				var peoples = JSON.stringify($scope.peoples)
				Android.setcfg("peoples",peoples);  
				$window.location.href = "#/index";
				$ionicPopup.alert({
				   title: '保存成功！'
				});
				$scope.setting = "编辑";
			}

	        //更新二维码
	        $scope.peopleCRcode = angular.copy($scope.people);
	        if ($scope.people.beginDate) {
				$scope.peopleCRcode.beginDate = $scope.people.beginDate.valueOf();
			}
			if ($scope.people.endDate) {
				$scope.peopleCRcode.endDate = $scope.people.endDate.valueOf();
			}
			//最后编辑时间是自动生成的，而且不需要添加到二维码里面的
			 $scope.people.editDate = new Date();
	        $("#takephoto").empty();
	        //生成二维码
	       	$timeout(function() {
	       	 	ThePerson.qrcod($scope.peopleCRcode);
	       	});
	        $scope.people.number = $scope.peopleCRcode.number;   //确保编号一致
		}else{
			alert("住院状态。人名，床号等关键信息不完整！");
		}
	
	}

	$scope.takephoto = function () {
		kfDevices.getPicReturn(function(str){
			$scope.people.img = str;
			$scope.$apply();
		})
	}
	

	ThePerson.qrcod($scope.peopleCRcode);//生成二维码

	$scope.people.number = $scope.peopleCRcode.number; //编号在生成二维码时候生成，因此要拷贝到model

	$scope.isQrcord = true;    //二维码是否展开

	$scope.isQrcord_text = "展开二维码"
	$scope.turnQrcord = function(){
	    $scope.isQrcord = !$scope.isQrcord;
	    if ($scope.isQrcord_text =="展开二维码") {
		    $scope.isQrcord_text ="收起二维码";
	    }else{
	    	$scope.isQrcord_text ="展开二维码";
	    }
	}
	//给没有定义头像的添加默认头像
	$('img').error(function(){
            $(this).attr('src', "img/unset.jpg");
     });
});


 