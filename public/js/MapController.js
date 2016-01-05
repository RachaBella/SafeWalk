
var app = angular.module("SafeWalk", ['uiGmapgoogle-maps','OtdDirectives']);


app.controller("MapController", ['$scope','$http', function($scope, $http) {
	var geoLoc;
	var watchID;
	$scope.result1="";
	$scope.location = '';
	$scope.map = {};
	$scope.user= {};

	$scope.initialize = function () {
		  if(navigator.geolocation) {
		    var browserSupportFlag = true;
		    navigator.geolocation.getCurrentPosition(function(position) {
		    var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		    var myOptions = {
		    zoom: 16,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
		  	};
		  	var map2 = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
		  	var marker = new google.maps.Marker({
			    position: initialLocation,
			    map: map2,
			    title: "You are here",
			      img: "http://snm-crm.nl/wealert/img/70/ambu_6_thumb.jpg?2u",
			      showWindow: true,
			      date: "2u",
			      options: {
			        labelContent: "&nbsp;&nbsp;&nbsp;585m<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2u",
			        labelAnchor: "0 0",
			        labelClass: "labelClass",
			        animation: 1
			      }
			});
		    map2.setCenter(initialLocation);
		    $scope.map = map2;
		    }, function() {
		      handleNoGeolocation(browserSupportFlag);
		    });
		  }

	}

	function refreshScope(lat, longi) {
		
		$scope.initialize();

	}

	function showLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        //alert("Latitude : " + latitude + " Longitude: " + longitude);
        console.log('the lat', parseFloat($scope.current_user.safeLocationLat) );
        console.log("the long", parseFloat($scope.current_user.safeLocationLong))
        if (( Math.abs(latitude -parseFloat($scope.current_user.safeLocationLat)) <= 0.005) && ( Math.abs(longitude - parseFloat($scope.current_user.safeLocationLong)) <= 0.005)) {
        	alert("heeeey your are in your safe location");
        	$http
        	.post("/send_sms", $scope.current_user)
        	.then(function (response) {
        		alert(response.data);
        		console.log("the watchID is", watchID);
        		navigator.geolocation.clearWatch(watchID);
        	});
        }
        refreshScope(latitude,longitude);
    }
     
    function errorHandler(err) {
        if(err.code == 1) {
           alert("Error: Access is denied!");
        }
        
        else if( err.code == 2) {
           alert("Error: Position is unavailable!");
        }
     }

	function getLocationUpdate(){
        if(navigator.geolocation){
           // timeout at 60000 milliseconds (60 seconds)
           geoLoc = navigator.geolocation;
           watchID = geoLoc.watchPosition(showLocation, errorHandler);
           console.log('the watchId is', watchID);
        }
        
        else{
           alert("Sorry, browser does not support geolocation!");
        }
    }
    	
	
	$scope.trackMe = function() {
		console.log("clicked");
		$scope.render = true;
		$scope.initialize();
		console.log($scope.map)	
		getLocationUpdate();
	};

	$scope.login = function () {
		console.log("the user is ", $scope.user);
		$http
		.post("/login", $scope.user)
		.then(function (response) {
			if (response.data === "User doesn't exist") {
				alert("This user doesn't exist, try again");

			}else if (response.data === "Incorrect Password") {
				alert("Incorrect Password, try again");

			}else if ((response !== null) && (response.data !== "Incorrect Password") && (response.data !== "User doesn't exist")) {
				console.log("logging in with: ", response.data);
				$scope.current_user= response.data;
			}
		});

	};

	$scope.logout = function () {
		$http
		.get("/logout")
		.then( function (response) {
			$scope.current_user = null;
			console.log("logged Out");
		});
	};
	
	$scope.signUp = function() {
		if ($scope.location ===''){
			alert('You should enter a safe location. Try again');
			}
			else {
				console.log("the location is",$scope.location);
				$scope.newUser.location = $scope.location
				console.log($scope.newUser);
				$http
			      .post('/users', $scope.newUser)
			      .then(function(response){
			      	console.log('the response is', response.data);
			      	$scope.current_user = response.data;
			        // self.all = response.data.criminals;
			    });
			}
	}
  
	$scope.checkAuth = function () {
		$http
			.get("/current_user")
			.then( function (response) {
				console.log('the current session is', response.data)
				if (response.data) {
					$scope.current_user = response.data.user;
				}else {
					$scope.current_user = null;
				}
			});
	}		

	

}]);
