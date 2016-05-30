'use strict';
angular.module('chafangbao.controllers')
.controller('CheckReportController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,ThePerson) {
	$scope.people = ThePerson.get();
	$scope.back = function () {
		window.history.go(-1);
	}
	$scope.toCheckReport = function(x){
		ThePerson.setReportName(x);
		$window.location.href = "#/checkreport";
	}
	$scope.next = function(){
		if ($scope.selected == "single") {
			$window.location.href = "#/checkreport_1";
		}
		else if ($scope.selected == "time") {
			$window.location.href = "#/checkreport_2";
		} 
		else if ($scope.selected == "allReport") {
			$window.location.href = "#/checkreport_3";
		} 
		else{
		}
	}
	$scope.reportName = ThePerson.returnReportName();
	$scope.reportCass = [
		"血氧测量报告",
		"二氧化碳测量报告",
		"肺功能测量报告",
		"体重测量报告",
		"血压测量报告",
		"血糖测量报告"
	]
	$scope.selectValue = {
		"单次检测报告":"single",
		"趋势分析报告报告":"time",
		"综合报告":"allReport"
	}
	$scope.selected = "single";

	$scope.choose =  function (val) {
	$scope.selected = val;
	for(var i in $scope.selectValue){
		if ($scope.selectValue[i] != val) {
			$("#"+i).removeClass("b-blue c-white");
		}else{
			$("#"+i).addClass("b-blue c-white");
		}
		if (val =="time") {
			$("#dateSelect").removeClass("dpn");
		}else{
			$("#dateSelect").addClass("dpn");
		}
	}
	}
	var Arrey = {
		"systemSet":"",
	}
	for(var i in Arrey){
		Arrey[i] = 安卓用键获取值(i);
	}
	$scope.systemSet = JSON.parse(Arrey.systemSet);

	//日期选择插件
	$scope.dt1 = new Date();
	$scope.dt2 = new Date();

	$scope.checkTime = function(){
		$scope.nowDt = new Date();
		if ($scope.dt2.valueOf()>$scope.nowDt.valueOf()) {
			alert("您不能选择未来的日期");
		}else if ($scope.dt1.valueOf()>$scope.dt2.valueOf()) {
			alert("开始日期大于结束日期");
		}
		alert($scope.dt2.valueOf());
	}

	$scope.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	$scope.dateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		return mode === 'day' && (date.getDay() === -1 || date.getDay() === -2);
	}

	$scope.toggleMin = function() {
		$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	};

	$scope.toggleMin();

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.dt1 = new Date(year, month, day);
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[1];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [
		{
			date: tomorrow,
			status: 'full'
		},
		{
			date: afterTomorrow,
			status: 'partially'
		}
	];

	function getDayClass(data) {
		var date = data.date,
		mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0,0,0,0);

			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}
		return '';
	}
});
