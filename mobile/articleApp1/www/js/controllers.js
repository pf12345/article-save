var app = angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,  $location, $ionicPopup, $http) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};


  //--------------------------------------------
   $scope.login = function(user) {

		if(typeof(user)=='undefined'){
			$scope.showAlert('Please fill username and password to proceed.');
			return false;
		}

		if(user.username && user.password){
      $http.post('http://192.168.199.103:8000/user/login', {name: user.username, password: user.password}).
        success(function(data, status, headers, config) {
         if(data.code == 0) {
           $location.path('/app/dashboard');
         } else{
           $scope.showAlert(data.message);
         }
        }).
        error(function(data) {
          $scope.showAlert(data.message);
        });
			//$location.path('/app/dashboard');
		}else{
			$scope.showAlert('Invalid username or password.');
		}

	};
  //--------------------------------------------
  $scope.logout = function() {   $location.path('/app/login');   };
  //--------------------------------------------
   // An alert dialog
	 $scope.showAlert = function(msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: 'Warning Message',
		 template: msg
	   });
	 };
  //--------------------------------------------
})

.controller('ProfilesCtrl', function($scope , Profiles) {
    $scope.profiles = Profiles.all();
})

.controller('ProfileCtrl', function($scope, $stateParams , Profiles) {
	$scope.profile = Profiles.get($stateParams.profileId);
})

.controller('DashCtrl', function($scope, $stateParams , Profiles) {
	$scope.profiles = Profiles.all();
})

.controller('SignInCtrl', function($scope) {

});

