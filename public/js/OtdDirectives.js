
angular.module('OtdDirectives', []).
            directive('googlePlaces', function(){
                return {
                    restrict:'E',
                    replace:true,
                    scope: {location:'='},
                    template: '<input name="location" id="google_places_ac" type="text" class="form-control" ng-model="newUser.loc" placeholder=" eg. 2222 4th Ave San Francisco" style="z-index:1000;" required>',
                      	link: function($scope, elm, attrs) {
                      		console.log("the input is", $("#google_places_ac")[0] );
	                        var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
	                        google.maps.event.addListener(autocomplete, 'place_changed', function() {
	                            var place = autocomplete.getPlace();
	                            $scope.location = {
	                            	latitude : place.geometry.location.lat(),
	                            	longitude: place.geometry.location.lng()
	                            }
	                            $scope.$apply();
                        });
                    }
                }
            });
