var BaseApiUrl = "http://service.ireadhome.com/"; //服务地址
var softwareName = "chrome extension";
var softwareVersion = "1.0.1"; //软件信息 softwareName='windowsApp' 表示桌面程序
var OPERATION_PLATFORM = "app";
var inoteIndexImgTimer; //主页图片轮播定时器


var User = {
    isLoggedIn: false
};

var inoteApp = angular.module('inoteApp', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ngSanitize',
        'ngDragDrop'
    ])
    .config(function ($routeProvider, $compileProvider ,$controllerProvider) {
        inoteApp.registerCtrl = $controllerProvider.register;
        inoteApp.resolveScriptDeps = function(dependencies){
            return function($q,$rootScope){
                var deferred = $q.defer();
                $script(dependencies, function() {
                    // all dependencies have now been loaded by $script.js so resolve the promise
                    $rootScope.$apply(function()
                    {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }
        };
        $routeProvider
            //.when('/login', {
            //    controller: 'LoginCtrl',
            //    templateUrl: 'content/views/login.html',
            //    publicAccess: true
            //})
            .when('/article/edit/:id', {
                controller: 'EditArticleCtrl',
                templateUrl: 'content/views/editArticle.html',
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'plugins/redactor9/lang/zh_cn.js',
                        'plugins/redactor9/fullscreen.js'
                    ])
                }

            })
            .when('/article/:id', {
                controller: 'ArticleCtrl',
                templateUrl: 'content/views/article.html',
                publicAccess: true,
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'plugins/redactor9/lang/zh_cn.js',
                        'plugins/redactor9/fullscreen.js',
                        'js/jquery.zclip.min.js'
                    ])
                }
            })
            .otherwise({
                redirectTo: '/'
            });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
    })
    .controller('ArticleCtrl', function ($scope, $http, $routeParams, $location, $sce, $window, $modal, $timeout, apiHelper) {

        $('#index-exploreLoading').show();

        $scope.comeBackSource = function () {
            chromePageClose();
        };
        var articleID = $routeParams.id;
        $scope.showLowQuaility = false;

        if (articleID == 0) {
            $('#index-exploreLoading').hide();
            var article = {
                ID: '0',
                content: localStorage.articleContent,
                title: localStorage.articleTitle,
                fromURL: decodeURIComponent(localStorage.localsite)
            };
            $scope.magazine = {
                coverURL: ''
            };
            $scope.article = article;
            $scope.articleType_read = true; //纯净阅读
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = localStorage.articleContent;
            if (tempDiv.innerText.length < 100) {
                $scope.showLowQuaility = true;
            }
        }

        $scope.allFonts = [
            {
                _class: 'yahei',
                name: '微软雅黑'
            },
            {
                _class: 'songfont',
                name: '宋体'
            },
            {
                _class: 'kaiti',
                name: '楷体'
            }
        ];
        $scope.themeStyle = themeStyle() || {fontIndexVar: '0', fontSizeIndex: '1', themeIndexVar: '0'};
        $scope.selectedFontIndex = $scope.themeStyle.fontIndexVar;
        $scope.chooseFont = function (index) {
            $scope.themeStyle.fontIndexVar = $scope.selectedFontIndex = index;
            themeStyle($scope.themeStyle);
        };

        $scope.selecteFontSizeIndex = $scope.themeStyle.fontSizeIndex;
        $scope.chooseFontSizeAdd = function () {
            $scope.selecteFontSizeIndex++;
            if ($scope.selecteFontSizeIndex > 3) {
                $scope.selecteFontSizeIndex = 3;
            }
            $scope.themeStyle.fontSizeIndex = $scope.selecteFontSizeIndex;
            themeStyle($scope.themeStyle);
        };
        $scope.chooseFontSizeMin = function () {
            $scope.selecteFontSizeIndex--;
            if ($scope.selecteFontSizeIndex < 0) {
                $scope.selecteFontSizeIndex = 0;
            }
            $scope.themeStyle.fontSizeIndex = $scope.selecteFontSizeIndex;
            themeStyle($scope.themeStyle);
        };
        $scope.backgroundStyle = [
            "white-tea",
            "black-calm",
            "Malted",
            "curtain-grey"
        ];
        $scope.selectedBgStyleIndex = $scope.themeStyle.themeIndexVar;
        $scope.chooseTheme = function (index) {
            $scope.themeStyle.themeIndexVar = $scope.selectedBgStyleIndex = index;
            themeStyle($scope.themeStyle);
        };
    })
    .controller('EditArticleCtrl', function ($scope, $http, $routeParams, $sce, $timeout, $location, apiHelper, $window) {
        $scope.myMagazines = myMagazines();
        $scope.chooseMagazine = $scope.myMagazines[0];
        var articleID = $routeParams.id;

        $scope.save = function () {
            $('#index-exploreLoading').show();
            apiHelper.post('api/Article/EditArticle', {
                articleID: $scope.article.ID,
                magazineID: $scope.chooseMagazine.ID,
                title: $scope.article.title,
                content: $scope.article.content,
                imgURL: $scope.article.imgURL
            }, function (data) {
                $('#index-exploreLoading').hide();
                if (data.code === 0) {
                    showMessage('保存成功', 2, function () {
                        $window.history.back();
                    })

//                    $location.path('/article/' + $scope.article.ID);
                } else {
                    showMessage(data.message);
                }
            });
        };

        apiHelper.get('api/Article/GetArticle', {
            id: articleID
        }, function (data) {
            if (data.code === 0) {
                $scope.article = data.value;
                for (var i = 0; i < $scope.myMagazines.length; i++) {
                    if ($scope.myMagazines[i].ID == data.value.magazineID) {
                        $scope.chooseMagazine = $scope.myMagazines[i];
                    }
                }
                $timeout(function () {
                    jQuery('#articleContent').redactor({
                        buttons: ['formatting', 'bold', '|',
                            'image', 'link', 'horizontalrule', '|',
                            'alignleft', 'aligncenter', 'alignright'
                        ],
                        imageUpload: 'http://www.ireadhome.com/upload/redactorimage',
                        clipboardUploadUrl: 'http://www.ireadhome.com/upload/redactorclipboardimage',
                        minHeight: 300,
                        lang: 'zh_cn',
                        plugins: ['fullscreen'],
                        autoresize: false,
                        changeCallback: function () {
                            $scope.article.content = jQuery('#articleContent').val();
                        }
                    });
                }, 10);
            } else {
                showMessage(data.message);
            }
        });
    })
    .controller('backToTop', function ($scope, $window) {
        $scope.backTotop = function () {
            $window.scrollTo(0, 0);
        }
    })
    .controller('mainCtrl', function ($scope, UserService, apiHelper, $location) {
        var phoneDownShow = false;

        $scope.phoneDownLoadShow = function () {
            if (phoneDownShow == false) {
                $("#phoneDownLoadList").show();
                phoneDownShow = true;
                return;
            } else if (phoneDownShow == true) {
                $("#phoneDownLoadList").hide();
                phoneDownShow = false;
                return;
            }
        };
        $("body").click(function (e) {
            if (e.target.className.match('phoneIcon')) {
                return;
            };

            if (phoneDownShow == true) {
                $("#phoneDownLoadList").hide();
                phoneDownShow = false;
            }
        });
        $scope._random = Math.random();

        $scope.curUserID = getCurrentUserID();

        $('#small-header-icon').click(function() {
            var $this = $('.main-div');
            if($this.css('left') == '0px' ) {
                smallHeaderMoveToRight();
            }else {
                smallHeaderMoveToLeft();
            }
        });

        $(document).click(function(e) {
            if(e.target.className.match('small')) {
               return
            }else {
                smallHeaderMoveToLeft();
            }
        });

        if(localStorage.userData && localStorage.token) {
            $scope.userHeader = JSON.parse(localStorage.userData);
            $scope.login = true;
        }

        /**
         * 退出方法
         */
        $scope.logout = function () {
            UserService.Logout();
        };

        if($(window).width() < 820) {
            if ($scope.login) {
                apiHelper.get('api/User/GetMessage', {
                    pageIndex: 1,
                    pageSize: 5
                }, function (data) {
                    var messages = data.value.List;
                    for (var i = 0, _i = messages.length; i < _i; i++) {
                        if (messages[i].hasRead == false) {
                            $scope.haveLetter = true;
                        }
                    }
                });
            }
        }

        /**
         * 关闭iframe
         */
        $scope.closeIframe = function () {

            //检测是否通过iframe标签创建
            try{
               var tempUrl = parent.window.location.href;
            }catch (e) {
                chromePageClose();
                return;
            }

            window.open('', '_self', '');
            window.close();
        };


    })

//--------------------end custom directive----------------------------

/**
 * 运行时
 */
inoteApp.run(function ($rootScope, $location, UserService, apiHelper, $route, $window) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        /**
         * 解除绑定的scroll事件
         */
        angular.element($window).unbind("scroll");

        $window.scrollTo(0, 0);
        smallHeaderMoveToLeft();
        if(next.headerNav) {
            var id = '#' + next.headerNav;
            var smallId = '#small-' + next.headerNav;
            headerHover(id);
            smallHeaderHover(smallId);
        }else {
            headerHover();
            smallHeaderHover();
        }

        if (!next.publicAccess && !User.isLoggedIn) {
            if (localStorage.token && localStorage.userData) {
                User.isLoggedIn = true;
            }
            else {
                if($location.path() != '/login') {//避免无限刷新
                    $route.reload();
                }
                $location.path('/login');
            }
        }
    });
});

/**
 * api服务
 */
inoteApp.service('apiHelper', function ($http, UserService) {
    $http.defaults.useXDomain = true;
    this.get = function (apiUrl, params, onSuccess, onError) {
        getService(apiUrl, params, onSuccess, function (data, status) {
            if (status && status === 401) {
                showMessage('请登录');
                UserService.LoggedOperate(function () {
                    getService(apiUrl, params, onSuccess, onError);
                });
                return false;
            }
        });
    };

    this.post = function (apiUrl, params, onSuccess, onError) {
        postService(apiUrl, params, onSuccess, function (data, status) {
            if (status && status === 401) {
                showMessage('请登录');
                UserService.LoggedOperate(function () {
                    postService(apiUrl, params, onSuccess, onError);
                });
            }
        });
    };

    /**
     * get方式访问服务
     * @param apiUrl
     * @param params
     * @param onSuccess
     * @param onError
     */
    function getService(apiUrl, params, onSuccess, onError) {
        $http.defaults.headers.common["Authorization"] = getAuthHeader();
        $http.get(BaseApiUrl + apiUrl, {
            params: params
        }).success(function (data) {
                if (data) {
//                    if (data.code === 1) {
//                        showMessage(data.message);
//                    } else {
                    if (onSuccess && typeof onSuccess === 'function') {
                        onSuccess(data);
                    }
//                    }
                }
            }).error(function (data, status) {
                showMessage('error');
                if (onError === undefined || typeof onError !== 'function') {
                    showMessage("发生错误!");
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            }
        }).success(function (data) {
                if (data.code === 1) {
                    showMessage(data.message);
                } else {
                    onSuccess(data);
                }
            }).error(function (data, status) {
                if (onError === undefined || typeof onError !== 'function') {
                    showMessage("发生错误");
                } else {
                    onError(data, status);
                }
            });
    };
    /**
     * 获取验证头
     * @return {String} [description]
     */

    function getAuthHeader() {
        try {
            var user = JSON.parse(localStorage.userData);
            var id = user.ID;
            var token = localStorage.token;
            var encodeData = window.btoa(id + ':' + token);
            return 'Basic ' + encodeData;
        } catch (e) {
            console.log(e);
        }
        return 'Basic ' + window.btoa('1:abc');
    }
});

/**
 * 用户服务
 */
inoteApp.service('UserService', function ($modal, $location, $window) {
    /**
     * 登录后操作
     * @param onSuccess
     * @param onFail
     * @constructor
     */
    this.LoggedOperate = function (onSuccess, onFail) {
        $location.path('/login');
    };

    /**
     * 退出
     * @constructor
     */
    this.Logout = function () {
        User.isLoggedIn = false;
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        $location.path('/login');
    };
});

