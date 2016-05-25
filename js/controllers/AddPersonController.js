'use strict';
angular.module('chafangbao.controllers')
.controller('AddPersonController', function($scope,$timeout, $ionicLoading,$ionicHistory,$window,ThePerson,$filter,$http) {
 	$scope.back = function () {
 			    window.history.go(-1);
    }
 	$scope.isDisabled = true;
 	$scope.editor = function(){
 		$scope.isDisabled = false;
 	    } ;
 	$scope.save = function(){
 		$scope.isDisabled = true;
 		 $scope.today = new Date();
 		 $scope.people.endDate = $filter('date')($scope.today,'yyyy-MM-dd');
	 	 $http({
	        url: '/',
	        method: "POST",
	        data: $scope.people
	    })
	    .then(function(response) {
	            console.log("dd");
	    })
 	}

    $scope.people = ThePerson.get();
   
   //ionic参数函数
  $scope.takephoto = function() {
  	
  	document.addEventListener("deviceready", function () {
    console.log("chengg");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('takephoto');
      image.src = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });

  }, false);
  }
   
  $scope.insert = function(firstname, lastname) {
        var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("people");
        }, function (err) {
            console.error(err);
        });
    }
 
    $scope.select = function(lastname) {
        var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
        $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
            if(res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
    }


 });