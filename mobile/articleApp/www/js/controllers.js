var app = angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout,  $location, $rootScope, apiHelper, localStorage) {

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
      $rootScope.showAlert('请输入用户名和密码！');
			return false;
		}

		if(user.username && user.password){
      apiHelper.post($rootScope.BaseApiUrl + '/user/login', {name: user.username, password: user.password}, function(data) {
        localStorage.set('isLogin', true);
        $location.path('/app/articles');
      });
			//$location.path('/app/dashboard');
		}else{
      $rootScope.showAlert('Invalid username or password.');
		}

	};
    $scope.register = function(user) {

      if(typeof(user)=='undefined'){
        $rootScope.showAlert('请输入用户名和密码！');
        return false;
      }
      if(user.r_password != user.r_repassword) {
        $rootScope.showAlert('辆次输入密码不一致！！');
        return false;
      }
      if(user.r_username && user.r_password){
        apiHelper.post($rootScope.BaseApiUrl + '/user/register', {name: user.r_username, password: user.r_password}, function(data) {
          console.log(data);
          localStorage.set('isLogin', true);
          $location.path('/app/articles');
        });
        //$location.path('/app/dashboard');
      }else{
        $rootScope.showAlert('Invalid username or password.');
      }

    };
  //--------------------------------------------
  $scope.logout = function() {
    apiHelper.get($rootScope.BaseApiUrl+'/mobile/user/signOut', function() {
      localStorage.delete('isLogin');
      $location.path('/app/login');
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

