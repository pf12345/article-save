var BaseApiUrl = '192.168.199.103:8000';
angular.module('starter.services', [])

.factory('Profiles', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var profiles = [{
    id: 0,
    name: 'Anoop Kumar',
    deseg: 'Team Lead',
    face: 'img/150x165/anoop-kumar.png'
  }, {
    id: 1,
    name: 'Vijay Kumar',
    deseg: 'Project Manager',
    face: 'img/150x165/vijay-kumar.png'
  }, {
    id: 2,
	name: 'Durgesh Soni',
	deseg: 'Team Lead',
    face: 'img/150x165/durgesh-soni.png'
  }, {
    id: 3,
	 name: 'Manish Mittal',
    deseg: 'Project Manager',
    face: 'img/150x165/manish-mittal.png'
  }, {
    id: 4,
	name: 'Vinay Kumar',
	deseg: 'UI Designer',
    face: 'img/150x165/vinay-kumar.png'
  }, {
    id: 5,
	name: 'Ankit Gera',
	deseg: 'System Administrator',
    face: 'img/150x165/ankit-gera.png'
  }];

  return {
    all: function() {
      return profiles;
    },
    remove: function(id) {
      profiles.splice(profiles.indexOf(id), 1);
    },
    get: function(profileId) {
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].id === parseInt(profileId)) {
          return profiles[i];
        }
      }
      return null;
    }
  };
})

/**
 * api服务
 */
.service('apiHelper', function ($http) {
  this.get = function (apiUrl, params, onSuccess, onError) {
    getService(apiUrl, params, onSuccess, onError);
  };

  this.post = function (apiUrl, params, onSuccess, onError) {
    postService(apiUrl, params, onSuccess, onError);
  };

  /**
   * get方式访问服务
   * @param apiUrl
   * @param params
   * @param onSuccess
   * @param onError
   */
  function getService(apiUrl, params, onSuccess, onError) {
    alert(BaseApiUrl + apiUrl);
    console.log($http);
    $http.get(BaseApiUrl + apiUrl, {
      params: params
    }).success(function (data) {
      alert('123456')
      if (data) {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
      }
    }).error(function (data, status) {
      alert('error 123456')
      $scope.showAlert('error');
      if (onError === undefined || typeof onError !== 'function') {
        $scope.showAlert("发生错误!");
      } else {
        onError(data, status);
      }
    });
  };

  /**
   * post方式访问服务
   * @param apiUrl
   * @param params
   * @param onSuccess
   * @param onError
   */
  function postService(apiUrl, params, onSuccess, onError) {
    $http({
      url: BaseApiUrl + apiUrl,
      method: 'POST',
      data: JSON.stringify(params),
    }).success(function (data) {
      if (data.code === 1) {
        $scope.showAlert(data.message);
      } else {
        onSuccess(data);
      }
    }).error(function (data, status) {
      if (onError === undefined || typeof onError !== 'function') {
        $scope.showAlert("发生错误");
      } else {
        onError(data, status);
      }
    });
  };
});
