
angular.module('starter.services', [])

  .factory('Articles', function($http, $rootScope, $ionicLoading, apiHelper) {
    var articles = [];
    // Might use a resource here that returns a JSON array

    // Some fake testing data

    return {
      all: function($scope, cb, noloading) {
        if(!noloading) {
          $ionicLoading.show({
            template: 'Loading...'
          });
        }
        apiHelper.get($rootScope.BaseApiUrl + '/article/getArticles', function(data) {
          $scope.articles = data.article;
          if(cb && typeof cb == 'function') {
            cb();
          }
        });
      },
      get: function(articleId, $scope) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        apiHelper.get($rootScope.BaseApiUrl + '/article/getArticle/'+articleId, function(data) {
          $scope.showHtml = true;
          $scope.article = data.article;
        });
      }
    };
  })

  .factory('apiHelper', function($http, $ionicLoading) {
    var articles = [];
    // Might use a resource here that returns a JSON array

    // Some fake testing data

    return {
      get: function(url, succCb, errCb) {
        $http.get(url).
          success(function(data, status, headers, config) {
            $ionicLoading.hide();
            if(data.code == 0) {
              if(succCb && typeof succCb == 'function') succCb(data);
            } else{
              $rootScope.showAlert(data.message);
            }
          }).
          error(function(data) {
            $ionicLoading.hide();
            $rootScope.showAlert(data.message);
          });
      },
      post: function(url, params, succCb, errCb) {
        $http.post(url, params).
          success(function(data, status, headers, config) {
            if(data.code == 0) {
              if(succCb && typeof succCb == 'function') succCb(data);
            } else{
              $rootScope.showAlert(data.message);
            }
          }).
          error(function(data) {
            $rootScope.showAlert(data.message);
          });
      }
    };
  })
  .factory('localStorage', function() {
    var articles = [];
    // Might use a resource here that returns a JSON array

    // Some fake testing data

    return {
      get: function (key) {
        var res = window.localStorage.getItem(key);
        if (res) {
          return JSON.parse(res);
        } else {
          return false;
        }
      },
      set: function (key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
      },
      delete: function (key) {
        window.localStorage.removeItem(key);
      }
    };
  })
