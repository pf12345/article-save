var BaseApiUrl = '192.168.0.103:8000';
angular.module('starter.services', [])

.factory('Articles', function($http, $rootScope, $ionicLoading) {
    var articles = [];
  // Might use a resource here that returns a JSON array

  // Some fake testing data

  return {
    all: function($scope) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.get('http://192.168.0.103:8000/article/getArticles').
        success(function(data, status, headers, config) {
          $ionicLoading.hide();
          if(data.code == 0) {
            $scope.articles = data.article;
          } else{
            $rootScope.showAlert(data.message);

          }
        }).
        error(function(data) {
          $ionicLoading.hide();
          $rootScope.showAlert(data.message);
        });
    },
    get: function(articleId, $scope) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.get('http://192.168.0.103:8000/article/getArticle/'+articleId).
        success(function(data) {
          $ionicLoading.hide();
          $scope.showHtml = true;
          if(data.code == 0) {
            $scope.article = data.article;
          } else{
            $rootScope.showAlert(data.message);
          }
        }).
        error(function(data) {
          $scope.showHtml = true;
          $ionicLoading.hide();
          $rootScope.showAlert(data.message);
        });
    }
  };
});
