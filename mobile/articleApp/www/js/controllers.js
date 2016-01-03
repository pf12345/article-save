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
      $http.post('http://192.168.0.103:8000/user/login', {name: user.username, password: user.password}).
        success(function(data, status, headers, config) {
         if(data.code == 0) {
           $location.path('/app/articles');
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

.controller('ArticlesCtrl', function($scope , Articles, $timeout) {
    $timeout(function(){
      angular.element(document.querySelector('#leftMenu' )).removeClass("hide");
    },1000);
    Articles.all($scope);
  })

.controller('ArticleCtrl', function($scope, $stateParams , Articles, $rootScope) {
    $scope.article = {
      title: '标题',
      content: '加载中...'
    }
    Articles.get($stateParams.articleId, $scope);
})

.controller('DashCtrl', function($scope, $stateParams , Articles) {
	$scope.articles = Articles.all($scope);
})

.controller('SignInCtrl', function($scope) {

});

