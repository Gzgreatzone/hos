'use strict';
angular.module('chafangbao.controllers')
.controller('CheckReportController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,ThePerson,$filter) {
	$scope.people = ThePerson.get();
	$scope.back = function () {
		window.history.go(-1);
	}
	$scope.toCheckReport = function(x){
		ThePerson.setReportName(x);
		$window.location.href = "#/checkreport";
	}

	
	$scope.reportCass = {
		"血氧测量报告":"SPO2",
		"二氧化碳测量报告" :"co2",
		"二氧化碳监测报告" :"co2_",
		"肺功能测量报告":"Lung",
		"肺功能COPD6测量报告":"Lung",
		"体重测量报告":"Weight",
		"血压测量报告":"血压",
		"血糖测量报告":"GLU"
	}
	$scope.selectValue = {
		"单次检测报告":"single",
		"趋势分析报告报告":"time"
		//"综合报告":"allReport"
	}
	$scope.selected = "single";

	//选择哪个以及他的样式变化
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
	var systemSet = Android.getcfg("systemSet");
	$scope.systemSet = JSON.parse(systemSet);

	//日期选择插件
	$scope.canNotBeNext = false;
	$scope.theDate = {
       begin: new Date(2015, 0, 2, 0, 1, 0),
       end:   new Date(2017, 0, 1, 23, 59, 59)
    }
	$scope.creatReportTime = function () {
		if ($scope.reportList) {
			var dataNumber = [];
			//var dataNumberName = $scope.reportList[0]['消息标识'];
			for (var i = 0; i < $scope.reportList.length; i++) {
			dataNumber.push(eval($scope.reportList[i]["最后检测参数"]));
				//console.log(dataNumber);
				ThePerson.savePara(dataNumber);	
			}	
			//给不同的报告定义不同的参数
			$scope.para = dataNumber;
			ThePerson.savePara(dataNumber);		
			
	    }

	}
    //获取数据函数
     //indexName是人名+仪器名，timeIndex是保存在indexName里面的时间戳
     //dataIndex是数据的索引名字，indexNameTime是其中的数据
     //reportName是报告名字，reportlist是报告的列表
     $scope.getData = function (){
     	    $scope.reportList = [];
			var dateBegin = $scope.theDate.begin;
			var dateEnd = $scope.theDate.end;
			//获取索引值
			$scope.reportName = ThePerson.returnReportName();
			$scope.indexName = $scope.people.name + "_" + $scope.reportCass[$scope.reportName];
			console.log($scope.indexName);
			if (Android.getcfg($scope.indexName)) {
		        var timeIndex = Android.getcfg($scope.indexName).split("#");
			    console.log(timeIndex);
				for (var i = 0; i < timeIndex.length; i++) {
					//timeIndex[i]$scope.theDate.begin.valueOf()<=timeIndex[i]<=$scope.theDate.end.valueOf()
					if (timeIndex[i] > $scope.theDate.begin.valueOf() && timeIndex[i] < $scope.theDate.end.valueOf()) {
						var dataIndex = $scope.indexName + "_" + timeIndex[i].valueOf();
						var indexNameTime = JSON.parse(Android.getcfg(dataIndex));
						$scope.reportList.push(indexNameTime);
						//console.log($scope.reportList);
						ThePerson.saveReportList($scope.reportList);
						$scope.creatReportTime();
					}
				}
				
			}
     }
    

	$scope.checkTime = function(){
		$scope.canNotBeNext = true;
		$scope.nowDt = new Date();
		console.log($scope.nowDt.valueOf());
		if ($scope.theDate.begin.valueOf()>$scope.nowDt.valueOf()) {
			alert("开始日期不能选择未来的日期");
		}else if ($scope.theDate.begin.valueOf()>$scope.theDate.end.valueOf()) {
			alert("开始日期大于结束日期");
		}else{
			$scope.canNotBeNext = false;
			$scope.getData();
			$scope.co2List = angular.copy($scope.reportList);
		}
	}

	 
     //alert($scope.theDate.begin.valueOf());
     $scope.reportName = ThePerson.returnReportName();

     $scope.next = function(){		
		if (!$scope.canNotBeNext) {
			 try{
			 	$scope.getData();
			 }
			 catch(e){
				alert(e);
			}
			//alert(Android.getcfg($scope.indexName));
			if (Android.getcfg($scope.indexName)) {
		        //跳转
				if ($scope.selected == "single") {
					//alert("woalicscs");
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
			else {
				alert("没有测量数据！");
			}			
		}
		else{alert("不可以");}
	}

	$scope.co2AddList=[];    //初始化数组，以便为每一个ng-model分配一个对象
   // var i=0;
    
    $scope.co2Add= {
       	co2Init:{
	   		"time":"",
	   		"PH":0,
	   		"PaCO2":0,
	   		"PaO2":0
	    },
        add: function () {         
            this.co2Init['time'] =  new Date();
            var list = angular.copy(this.co2Init)
            $scope.co2AddList.push(list);
            console.log($scope.co2AddList);
        },
        del: function (key) {      
            console.log(key);
            $scope.co2AddList.pop(key);
        }
    }
    $scope.watchSet = function (key,val,value){
    	 $scope.co2AddList[key][val] = val[value];
    	 ThePerson.saveCo2List($scope.co2AddList);
    }
});


