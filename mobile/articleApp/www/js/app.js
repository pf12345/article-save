// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers' , 'starter.services'])

.run(function($ionicPlatform , $rootScope, $timeout, $http, $location, $ionicPopup, apiHelper, localStorage) {
        $rootScope.BaseApiUrl = 'http://120.27.112.25';
    $rootScope.showAlert = function(msg) {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: msg
      });
    };
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

     $rootScope.authStatus = false;
	 //stateChange event
	  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      console.log(toState)
      console.log(35)
      if(toState.name == 'app.init') {
        if(localStorage.get('isLogin')) {
          $location.path('/app/articles');
        }else {
          $location.path('/app/login');
        }
      }
      if(toState.name != 'app.login' && toState.name != 'app.article') {
        $timeout(function(){
          alert(angular.element(document.querySelector('#leftMenu' )))
          angular.element(document.querySelector('#leftMenu' )).removeClass("hide");
        },1000);
      }
      $rootScope.authStatus = toState.authStatus;
    });

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		console.log("URL : "+toState.url);
	});

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

//--------------------------------------

 .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signin.html'
      }
    },
	authStatus: false
  })
 .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signup.html',
      }
   },
	authStatus: false
  })
//--------------------------------------


  .state('app.articles', {
    url: '/articles',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
		controller: 'ArticlesCtrl'
      }
     },
	 authStatus: true
  })
  .state('app.init', {
      url: '/init'
    })
    .state('app.set', {
      url: '/set',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })
  .state('app.article', {
    url: '/article/:articleId',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-detail.html',
        controller: 'ArticleCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/init');
});
