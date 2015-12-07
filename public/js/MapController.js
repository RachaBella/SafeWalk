
var app = angular.module("SafeWalk", ['uiGmapgoogle-maps','OtdDirectives']);


app.controller("MapController", ['$scope','$http', function($scope, $http) {
	var geoLoc;
	var watchID;
	$scope.result1="";
	$scope.location = '';
	$scope.map = {};
	$scope.user= {};

	function success(pos) {
		  var crd = pos.coords;
		  // console.log('Your current position is:');
		  // console.log('Latitude : ' + crd.latitude);
		  // console.log('Longitude: ' + crd.longitude);
		  // console.log('More or less ' + crd.accuracy + ' meters.');
		  return $scope.map = { 
				center: { 
					latitude: crd.latitude, 
					longitude: crd.longitude
				}, 
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				marker:[{
			      id: "50651",
			      latitude: crd.latitude,
			      longitude: crd.longitude,
			      title: "You are here",
			      distance: "585m",
			      hoofdcat: "70",
			      img: "http://snm-crm.nl/wealert/img/70/ambu_6_thumb.jpg?2u",
			      reactiecount: "0",
			      likecount: "0",
			      showWindow: true,
			      date: "2u",
			      options: {
			        labelContent: "&nbsp;&nbsp;&nbsp;585m<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2u",
			        labelAnchor: "0 0",
			        labelClass: "labelClass",
			        animation: 1
			      }
    			}]
			};
	}

	function error(error) {
		alert('Unable to get location, you should autorize the app to track you and to tell them you are fine' + error.message);
	};

	navigator.geolocation.getCurrentPosition(success, error);
	
	console.log($scope.map)	
		
	function refreshScope(lat, longi) {
		$scope.map = { 
			center: { 
				latitude: lat, 
				longitude: longi
			}, 
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			marker:[{
		      id: "50651",
		      latitude: lat,
		      longitude: longi,
		      title: "You are here",
		      distance: "585m",
		      hoofdcat: "70",
		      img: "http://snm-crm.nl/wealert/img/70/ambu_6_thumb.jpg?2u",
		      reactiecount: "0",
		      likecount: "0",
		      showWindow: true,
		      date: "2u",
		      options: {
		        labelContent: "&nbsp;&nbsp;&nbsp;585m<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2u",
		        labelAnchor: "0 0",
		        labelClass: "labelClass",
		        animation: 1
		      }
			}]
		
		};	

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
        		debugger;
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
				console.log("the fucking location is",$scope.location);
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
  //  		google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
	 //        var place = autocompleteFrom.getPlace();
	 //        $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
  //           $scope.$apply();
  //           console.log($scope.location)
	        // $scope.user.fromLng = place.geometry.location.lng();
	        // $scope.user.from = place.formatted_address;

    	// });
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
