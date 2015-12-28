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
            .when('/login', {
                controller: 'LoginCtrl',
                templateUrl: 'content/views/login.html',
                publicAccess: true
            })
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
            .when('/magazine/:id', {
                controller: 'MagazineCtrl',
                templateUrl: 'content/views/magazine.html',
                publicAccess: true,
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/jquery.zclip.min.js'
                    ])
                }
            })
            .when('/subscribe/add', {
                controller: 'AddSubscribeCtrl',
                templateUrl: 'content/views/addsubscribe.html'
            })
            .when('/subscribe', {
                controller: 'SubscribeCtrl',
                templateUrl: 'content/views/subscribe.html',
                headerNav: 'subscribe-nav'
            })
            .when('/novel', {
                controller: 'NovelCtrl',
                templateUrl: 'content/views/novel.html',
                publicAccess: true
            })
            .when('/contentNull', {
                controller: 'contentNullCtrl',
                templateUrl: 'content/views/contentNull.html',
                publicAccess: true
            })
            .when('/plan', {
                controller: 'readPlanCtrl',
                templateUrl: 'content/views/plan.html',
                headerNav: 'readPlan-nav',
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/jquery.zclip.min.js'
                    ])
                }
            })
            .when('/help', {
                controller: 'helpCtrl',
                templateUrl: 'content/views/help.html',
                publicAccess: true,
                headerNav: 'help-nav'
            })
            .when('/user/:id?', {
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/jquery.zclip.min.js',
                        'js/swfobject.js',
                        'js/jquery.uploadify.v2.1.4.min.js'
                    ])
                },
                controller: 'userCtrl',
                templateUrl: 'content/views/user.html',
                publicAccess: true,
                headerNav: 'user-nav'
            })
            .when('/explore', {
                controller: 'exploreCtrl',
                templateUrl: 'content/views/explore.html',
                publicAccess: true,
                headerNav: 'explore-nav',
                resolve: {
                    deps: inoteApp.resolveScriptDeps(['./js/jQueryUa.js'])
                }
            })
            .when('/search/:input', {
                controller: 'searchCtrl',
                templateUrl: 'content/views/search.html',
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/jquery.zclip.min.js'
                    ])
                }
            })
            .when('/download', {
                templateUrl: 'content/views/download.html',
                publicAccess: true,
                controller: 'downloadCtrl',
                headerNav: 'download-nav'
            })
            .when('/download/ireadAndroid', {
                templateUrl: 'content/views/ireadAndroid.html',
                publicAccess: true
            })
            .when('/download/inoteAndroid', {
                templateUrl: 'content/views/inoteAndroid.html',
                publicAccess: true
            })
            .when('/download/browser', {
                templateUrl: 'content/views/browser.html',
                publicAccess: true
            })
            .when('/download/iNotepc', {
                templateUrl: 'content/views/iNotepc.html',
                publicAccess: true
            })
            .when('/download/bookMark', {
                controller: 'bookMarkCtrl',
                templateUrl: 'content/views/bookMark.html',
                publicAccess: true,
                resolve: {
                    deps: inoteApp.resolveScriptDeps(['./js/jQueryUa.js'])
                }
            })
            .when('/joinUs', {
                templateUrl: 'content/views/joinUs.html',
                publicAccess: true
            })
            .when('/culture', {
                templateUrl: 'content/views/Culture.html',
                publicAccess: true
            })
            .when('/', {
                controller: 'inoteCtrl',
                templateUrl: 'content/views/inote.html',
                publicAccess: true
            })
            .when('/editInfo', {
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/swfobject.js',
                        'js/jquery.uploadify.v2.1.4.min.js'
                    ])
                },
                controller: 'EditInfoCtrl',
                templateUrl: 'content/views/EditInfo.html'
            })
            .when('/editPassword', {
                controller: 'EditPasswordCtrl',
                templateUrl: 'content/views/EditPassword.html'
            })
            .when('/messageInfo', {
                controller: 'messageInfoCtrl',
                templateUrl: 'content/views/messageInfo.html'
            })
            .when('/editMagazine/:id', {
                controller: 'editMagazineCtrl',
                templateUrl: 'content/views/editMagazine.html',
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/swfobject.js',
                        'js/jquery.uploadify.v2.1.4.min.js'
                    ])
                }
            })
            .when('/contactus', {
                templateUrl: 'content/views/contactus.html',
                publicAccess: true
            })
            .when('/policy', {
                templateUrl: 'content/views/Policy.html',
                publicAccess: true
            })
            .when('/Help/iNotePlugin', {
                templateUrl: 'content/views/iNotePlugin.html',
                controller: 'iNotePluginCtrl',
                publicAccess: true,
                resolve: {
                    deps: inoteApp.resolveScriptDeps([
                        'js/jquery.zclip.min.js'
                    ])
                }
            })
            .otherwise({
                redirectTo: '/'
            });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
    })
    .controller('NovelCtrl', function ($scope) {
        $scope.inotecjclose = function () {
            chrome.tabs.update(null, {
                url: localStorage.localsite
            });
        };
    })
    .controller('contentNullCtrl', function ($window, $scope, $http, $modal, apiHelper) {
        $scope.cancel = function () {
            chromePageClose();
        };
        $scope.saveUrl = function () {
            apiHelper.get('api/Article/AddBookmark', {
                title: localStorage.articleTitle,
                url: decodeURIComponent(localStorage.localsite)
            }, function (data) {
                if (data.code === 0) {
                    showMessage('保存成功,网页即将关闭');
                    var closePageSetTime = setTimeout(function () {
                        chromePageClose();
                        clearTimeout(closePageSetTime);
                    }, 3000);
                }
            });
        };
    })
    .controller('LoginCtrl', function () {
        $('#index-exploreLoading').hide();
        getIframeInfo(function (data) {
            var url = 'user/' + data.value.user.ID;
            var localUrl = window.location.href.replace('login', url);
            window.location.href = localUrl;
            window.location.reload();
        });
    })
    .controller('MagazineCtrl', function ($scope, $http, $routeParams, $location, $window, $timeout, $modal, apiHelper) {
        var id = $routeParams.id;
        var ownerID = $routeParams.userid;
        $scope.ownerID = ownerID;
        $('#index-exploreLoading').show();

        /**
         * 获取用户信息
         * */
        apiHelper.get('api/User/GetSingleUser', {
            ID: ownerID
        }, function (data) {
            if (data.code === 0) {
                $scope.user = data.value;
            }
        });

        if (id != '0') {
            var myMagas = myMagazines();
            if (myMagas) {
                for (var i = 0; i < myMagas.length; i++) {
                    if (myMagas[i].ID == id) {
                        $scope.magazine = myMagas[i];
                        break;
                    }
                }
            }
        }
        else {
            $location.path('/plan');
        }
        /*获取杂志信息*/
        apiHelper.get('api/Magazine/SingleMagazine', {
            ID: id
        }, function (data) {
            if (data.code === 0) {
                $scope.magazineName = data.value.name;
                $scope.summaryInfo = data.value.summary;
            }
        });

        $scope.curUserID = getCurrentUserID();


        getArticles(id, 1);

        /**
         * 获取杂志文章
         * @param magazineID
         * @param pageIndex
         */
        function getArticles(magazineID, pageIndex) {
            $window.scrollTo(0, 0);
            $scope.state = 'loading';
            $scope.magazineData = singleMagazine(magazineID, pageIndex);

            apiHelper.get('api/Magazine/GetArticleList', {
                id: magazineID,
                pageIndex: pageIndex,
                pageSize: 9,
                contentLength: 80
            }, function (data) {
                $scope.magazineData = singleMagazine(magazineID, pageIndex, data.value);
                $scope.state = 'loaded';
                $('#index-exploreLoading').hide();
            });
        }

        /**
         * 文章分页
         * @param page
         * @param type
         */
        $scope.pager = function (page, type) {
            switch (type) {
                case 1:
                    page--;
                    break;
                case 2:
                    page++;
                    break;
            }
            getArticles(id, page);
        };

        $scope.displayType = displayType() || 0;

        $scope.$watch('displayType', function () {
            displayType($scope.displayType);
        });

        var myMagas = myMagazines();
        if (myMagas) {
            for (var i = 0; i < myMagas.length; i++) {
                if (myMagas[i].ID == id) {
                    myMagas.splice(i, 1);
                    i--;
                }
            }
        }
        $scope.myMagazines = myMagas;
        /**
         * 分享文章
         * @param  {[type]} type  [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        $scope.shareTo = function (type, index) {
            var tempArticle = $scope.magazineData.List[index];
            shareToSns($window, type, tempArticle);
        };

        /**
         * 移除掉其他的所有popover
         * @return {[type]} [description]
         */
        $scope.removeOtherPopover = function () {
            jQuery('.popover').remove();
        };

        /**
         * 移动
         * @param articleIndex
         * @param magazineIndex
         */
        $scope.move = function (articleIndex, magazineIndex) {
            var articleToMove = $scope.magazineData.List[articleIndex];
            var moveToMagazine = $scope.myMagazines[magazineIndex];
            apiHelper.get('api/Article/Move', {
                ids: articleToMove.ID,
                magazineID: moveToMagazine.ID
            }, function (data) {
                showMessage('移动成功');
                $scope.magazineData.List.splice(articleIndex, 1);
            });
        };

        /**
         * 删除
         * @param articleIndex
         * @constructor
         */
        $scope.Delete = function (articleIndex) {
            var articleToDelete = $scope.magazineData.List[articleIndex];
            apiHelper.get('api/Article/Delete', {
                ids: articleToDelete.ID
            }, function (data) {
                showMessage('删除成功');
                $scope.magazineData.List.splice(articleIndex, 1);
            });
        };

        /**
         * 添加阅读计划
         * @param article
         * @param postil
         * @param plan
         */
        $scope.addReadPlan = function (article, postil, plan) {
            addReadPlan(article.ID, postil, plan, apiHelper);
        };

        /**
         * 返回
         * @return {[type]} [description]
         */
        $scope.goBack = function () {
            $window.history.back();
        };


        /**
         * 分享展示
         * @param copyBtn 点击复制按钮元素
         * @param codeContent 复制内容元素
         * @param index 循环中第几个元素
         * @param className 需要展示元素classname
         */
        $scope.showShareTips = function (index, className, copyBtn, codeContent) {

            var classNameVar = '.' + className + '' + index;
            showShareTip(index, classNameVar);

            /**
             * 复制分享链接
             */
            if(copyBtn && codeContent) {
                var copyBtnId = '#' + copyBtn;
                var codeContentId = '#' + codeContent;
                var length = $scope.magazineData.List.length;

                var timer = setTimeout(function () {
                    copy(length, codeContentId, 'text', copyBtnId);
                    clearTimeout(timer);
                }, 500);
            }


        }
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
        } else {
            getSingleArticle(articleID);
            getComments(1);

            if (localStorage.userData && localStorage.token) {
                //获取未读数量
                //apiHelper.get('api/Article/GetUnreadCount', {}, function (data) {
                //    if (data.code === 0) {
                //        localStorage.articleNum = data.value;
                //        responseToParent("articleNumChange");
                //    }
                //});
            }

        }

        /**
         * 获取单篇文章
         * @param id
         */
        function getSingleArticle(id) {
            apiHelper.get('api/Article/GetArticle', {
                id: id
            }, function (data) {
                if (data.code === 0) {
                    if (data.value.readPlan == 'others' || data.value.readPlan == 'archive') {
                        $scope.readPlan = 'addPlan';
                    } else {
                        $scope.readPlan = 'archive';
                    }
                    $('#index-exploreLoading').hide();
                    $scope.article = data.value;
                    try {
                        $scope.article.content = $sce.getTrustedHtml(data.value.content);//当有代码时报错

                    } catch (err) {
                        $scope.article.content = $sce.trustAsHtml(data.value.content);//报无indexof方法错误
                    }

                    apiHelper.get('api/Magazine/SingleMagazine', {
                        ID: data.value.magazineID
                    }, function (magazineData) {
                        $scope.magazine = magazineData.value;
                    });

                    if (!data.value.content && data.value.fromURL) {
                        $window.open(data.value.fromURL);
                        $scope.article.content = [
                            "<p>由于原网页内容不适合纯净阅读而被保存为书签，已经自动在新页面打开</p>",
                            "<p>如果没有打开，请注意浏览器是否提示拦截了弹出窗口。如果有，请选择允许弹出窗口。</p>",
                            "<p>你也可以<a href='" + data.value.fromURL + "' target='_blank'>点击这里直接打开</a></p>"
                        ].join('');
                    }

                    $scope.article.hostname = getHostNameFromUrl(data.value.fromURL);

                    if (data.value.userID == getCurrentUserID()) {
                        $scope.articleType_my = true;
                        //添加阅读记录
                        apiHelper.get('api/Article/AddVisitRecord', {
                            articleID: articleID,
                            from: 'inote app'
                        });
                    }else {
                        $scope.articleType_my = false;
                    }
                } else {
                    showMessage(data.message);
                }
            });
        }

        /**
         * 保存书签
         */
        $scope.saveUrl = function () {
            apiHelper.get('api/Article/AddBookmark', {
                title: localStorage.articleTitle,
                url: localStorage.localsite
            }, function (data) {
                if (data.code === 0) {
                    showMessage('保存书签成功,即将自动关闭');
                    $timeout(function () {
                        chromePageClose();
                    }, 3000);
                }
            });
        };

        /**
         * 编辑文章
         * @return {[type]} [description]
         */
        $scope.edit = function () {
            var modalInstance = $modal.open({
                templateUrl: 'content/views/modal/edit-article.html',
                controller: AddAndEditArticleCtrl,
                resolve: {
                    $timeout: function () {
                        return $timeout;
                    },
                    article: function () {
                        return $scope.article;
                    },
                    magazines: function () {
                        return myMagazines();
                    },
                    type: function () {
                        return 'edit';
                    }
                },
                backdrop: 'static',
                windowClass: 'writeArticle'
            });
            modalInstance.result.then(function (article) {
                apiHelper.post('api/Article/EditArticle', {
                    articleID: articleID,
                    magazineID: article.magazineID,
                    title: article.title,
                    content: article.content.toString(),
                    imgURL: $scope.article.imgURL
                }, function (data) {
                    if (data.code === 0) {
                        showMessage('编辑成功');
                        getSingleArticle(articleID);
                    } else {
                        showMessage(data.message);
                    }
                });
            }, function (article) {
            });
        };

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

        /**
         * 返回
         * @return {[type]} [description]
         */
        $scope.goBack = function () {
            $window.history.back();
        };

        /**
         * 保存纯净阅读的文章
         * @return {[type]} [description]
         */

        $scope.save = function () {
            if (localStorage.userData && localStorage.token) {
                saveArticle();
            } else {
                $('.mc').show();
                $('.login-iframe').show();
                getIframeInfo(function () {
                    saveArticle();
                    $('.mc').hide();
                    $('.login-iframe').hide();
                });

            }
        };

        function saveArticle() {
            apiHelper.get('api/Article/SpiderAndPush', {
                url: $scope.article.fromURL
            }, function (data) {
                if (data.code === 0) {
                    showMessage('保存成功');
                    $location.path('/user');
                } else {
                    showMessage(data.message);
                }
            });
        }

        /**
         * 分享到社交网络
         */
        $scope.shareTo = function (type) {

            var content = $('.content').html();
            var article = $scope.article;
            article.content = content;
            shareToSns($window, type, article);
        };

        /**
         * 删除文章
         * @return {[type]} [description]
         */
        $scope.Delete = function () {
            var modalInstance = $modal.open({
                templateUrl: 'content/views/modal/article-delete.html',
                controller: DeleteArticleCtrl,
                resolve: {
                    article: function () {
                        return $scope.article;
                    }
                }
            });

            modalInstance.result.then(function () {
                apiHelper.get('api/Article/Delete', {
                    ids: articleID
                }, function (data) {
                    showMessage('删除成功');
                    var userData = JSON.parse(localStorage.userData);
                    $location.path('/user/' + userData.ID);
                });
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 赞+1
         * @return {[type]} [description]
         */
        $scope.commend = function () {
            apiHelper.get('api/Magazine/CommendArticle', {
                userID: getCurrentUserID(),
                articleID: articleID
            }, function () {
                showMessage('赞+1成功');
            });
        };

        /**
         * 添加评论
         * @param {[type]} commentContent [description]
         */
        $scope.addComment = function (commentContent) {
            apiHelper.post('api/Article/AddComment', {
                'userID': getCurrentUserID(),
                'articleID': articleID,
                'content': commentContent
            }, function (data) {
                if (data.code === 0) {
                    getComments(1);
                    $scope.commentContent = '';
                } else {
                    showMessage(data.message);
                }
            });
        };

        function getComments(pageIndex) {
            apiHelper.get('api/Article/GetComments', {
                articleID: articleID,
                pageIndex: pageIndex,
                pageSize: 10
            }, function (data) {
                if (data.code === 0) {
                    $scope.comments = data.value.List;
                    $scope.pager = data.value.Pager;
                } else if (data.code !== 2) {
                    showMessage(data.message);
                }
            });
        }

        /**
         * 添加阅读计划
         * @param article
         * @param comments
         * @param plan
         */
        $scope.addReadPlan = function (article, comments, plan) {
            apiHelper.get('api/Article/SetReadPlan', {
                ID: article.ID,
                plan: plan,
                comment: comments
            }, function (data) {
                if(data.code == 0) {
                    removePopover();
                }
                showMessage(data.message);
                $scope.readPlan = 'addPlan';
            });
        }

        /**
         * 分享展示
         * @param index
         * @param className
         * @param copyBtn
         * @param codeContent
         */
        $scope.showShareTips = function (index, className, copyBtn, codeContent) {

            var classNameVar = '.' + className + '' + index;
            showShareTip(index, classNameVar);

            /**
             * 复制分享链接
             */
            if(copyBtn && codeContent) {
                var copyBtnId = '#' + copyBtn;
                var codeContentId = '#' + codeContent;
                var length = 1;

                var timer = setTimeout(function () {
                    copy(length, codeContentId, 'text', copyBtnId);
                    clearTimeout(timer);
                }, 500);
            }


        }
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
    .controller('SubscribeCtrl', function ($scope, $http, $modal, apiHelper) {
        $scope.magazines = subMagazines();
        apiHelper.get('api/Magazine/GetAllMagazinesByUserID', {
            type: 1
        }, function (data) {
            if (data.code === 0) {
                $scope.magazines = subMagazines(data.value);
            } else {
                showMessage(data.message);
            }
        });

        /**
         * 取消订阅杂志
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        $scope.Delete = function (index) {
            var deletedMagazine = $scope.magazines[index];

            var modalInstance = $modal.open({
                templateUrl: 'content/views/modal/delete-magazine.html',
                controller: DeleteMagazineCtrl,
                resolve: {
                    magazine: function () {
                        return deletedMagazine;
                    },
                    type: function () {
                        return 'sub';
                    }
                }
            });

            modalInstance.result.then(function () {
                apiHelper.get('api/Magazine/CancelSubscribeMagazine', {
                    magazineID: deletedMagazine.ID
                }, function (data) {
                    $scope.magazines.splice(index, 1);
                    subMagazines($scope.magazines);
                    showMessage('取消订阅成功');
                });
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

    })
    .controller('backToTop', function ($scope, $window) {
        $scope.backTotop = function () {
            $window.scrollTo(0, 0);
        }
    })
    .controller('AddSubscribeCtrl', function ($scope, $http, $window, apiHelper) {
        $('#index-exploreLoading').show();
        getSubscribeMagazines(1);

        function getSubscribeMagazines(pageIndex) {
            $scope.state = 'loading';
            apiHelper.get('api/Magazine/GetCanSubscribeMagazine', {
                pageIndex: pageIndex,
                pageSize: 9
            }, function (data) {
                $scope.magazineData = data.value;
                $('#index-exploreLoading').hide();
                $scope.state = 'loaded';
            });
        }

        $scope.subscribe = function (index) {
            var magazineToSubscribe = $scope.magazineData.List[index];
            if (magazineToSubscribe.hasSub) {
                apiHelper.get('api/Magazine/CancelSubscribeMagazine', {
                    magazineID: magazineToSubscribe.ID
                }, function () {
                    showMessage('取消订阅成功');
                    magazineToSubscribe.hasSub = false;
                });
            } else {
                apiHelper.get('api/Magazine/SubscribeMagazine', {
                    magazineID: magazineToSubscribe.ID
                }, function () {
                    magazineToSubscribe.hasSub = true;
                    showMessage('订阅成功');
                });
            }
        };

        $scope.pager = function (page) {
            $window.scrollTo(0, 0);
            getSubscribeMagazines(page);
        };
    })
    .controller("readPlanCtrl", function ($scope, $http, $modal, $routeParams, $window, apiHelper) {
        $scope.displayType = displayType() || 0;
        $scope.$watch('displayType', function () {
            displayType($scope.displayType);
        });
        $('#index-exploreLoading').show();
        $scope.curUserID = getCurrentUserID();
        $scope.saveFile = [];
        $scope.showTodayAll = false;
        $scope.showTomorrowAll = false;
        $scope.showFutureAll = false;
        $scope.planData = readPlan();
        var dragNodeParent, dropNode;//被拖父节点及放入节点

        $scope.showAll = function (type) {
            switch (type) {
                case 1:
                    $scope.showTodayAll = !$scope.showTodayAll;
                    break;
                case 2:
                    $scope.showTomorrowAll = !$scope.showTomorrowAll;
                    break;
                case 3:
                    $scope.showFutureAll = !$scope.showFutureAll;
                    break;
            }
        };

        apiHelper.get('api/Article/GetReadTask', {
            contentLength: 80
        }, function (data) {
            if (data.code == 0) {
                $scope.planData = readPlan(data.value);
                $('#index-exploreLoading').hide();
            } else {
                if (data.message == '没有未读文章') {
                    var arr = [];
                    $scope.planData = readPlan(arr);
                    $scope.state = 'loaded';
                }
                showMessage(data.message);

            }
        });

        $scope.dropSuccessHandler = function ($event, index, array) {
            var targetNode = $event.currentTarget;
            dragNodeParent = targetNode.parentNode;
            if (dropNode != dragNodeParent) {
                array.splice(index, 1);
            }
        };

        $scope.onDrop = function ($event, $data, array, type) {
            dropNode = $event.currentTarget;
            apiHelper.get('api/Article/SetReadPlan', {
                ID: $data.ID,
                plan: type,
                comment: ''
            }, function (data) {
                if (data.code == 0) {
                    if ($event.currentTarget != dragNodeParent) {
                        array.push($data);
                        $scope.planData = readPlan($scope.planData);
                    }
                    ;
                }
            });
        };

        /**
         * 分享文章
         * @param  {[type]} type  [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        $scope.shareTo = function (type, article) {
            shareToSns($window, type, article);
        };

        /**
         * 计划
         * @param fromPlan
         * @param index
         * @param plan
         */
        $scope.plan = function (articleID, index, plan) {
            var originalArr = getArticleArrayByArticleID(articleID, index);
            var destArr = getArticleArrayByPlan(plan);
            apiHelper.get('api/Article/SetReadPlan', {
                ID: articleID,
                plan: plan,
                comment: ''
            }, function (data) {
                if (data.code == 0) {
                    destArr.push(originalArr[index]);
                    originalArr.splice(index, 1);
                    $scope.planData = readPlan($scope.planData);
                }else {
                    showMessage(data.message);
                }
            });
        };

        function getArticleArrayByPlan(plan) {
            switch (plan) {
                case 1:
                    return $scope.planData.today;
                    break;
                case 2:
                    return $scope.planData.tomorrow;
                    break;
                case 3:
                    return  $scope.planData.future;
                    break;
                default:
                    return undefined;
            }
        }

        /**
         * 根据文章ID获取计划数组
         * @param id
         * @returns {undefined}
         */
        function getArticleArrayByArticleID(id, index) {
            if ($scope.planData.today[index].ID == id) {
                return $scope.planData.today;
            }
            else if ($scope.planData.tomorrow[index].ID == id) {
                return $scope.planData.tomorrow;
            }
            else if ($scope.planData.future[index].ID == id) {
                return $scope.planData.future;
            }
            return undefined;
        }

        /**
         * 分享展示
         * @param copyBtn 点击复制按钮元素
         * @param codeContent 复制内容元素
         * @param index 循环中第几个元素
         * @param className 需要展示元素classname
         */
        $scope.showShareTips = function (index, className, copyBtn, codeContent) {

            var classNameVar = '.' + className + '' + index;
            showShareTip(index, classNameVar);

            /**
             * 复制分享链接
             */
                if(copyBtn && codeContent) {
                    var copyBtnId = '#' + copyBtn;
                    var codeContentId = '#' + codeContent;
                    var length = 1;
                    if (className.match('today')) {
                        length = $scope.planData.today.length;
                    } else if (className.match('tomorrow')) {
                        length = $scope.planData.tomorrow.length;
                    } else {
                        length = $scope.planData.future.length;
                    }
                    var timer = setTimeout(function () {
                        copy(length, codeContentId, 'text', copyBtnId);
                        clearTimeout(timer);
                    }, 500);
                }


        }

    })
    .controller('helpCtrl', function ($scope, apiHelper) {
        $scope.feedback = function () {
            if (!$scope.title) {
                showMessage("请填写标题");
                return;
            }

            if (!$scope.content) {
                showMessage("请详细描述你遇到的问题");
                return;
            }

            apiHelper.post('api/User/SendFeedback', {
                title: $scope.title,
                content: $scope.content,
                contract: $scope.contract,
                software: softwareName,
                version: softwareVersion
            }, function (res) {
                showMessage(res.message);
            });
        };
    })
    .controller('userCtrl', function ($scope, apiHelper, $window, $routeParams, $modal, UserService, $http, $location) {

        var noLogin = true;
        $scope.login = false;
        if (localStorage.userData && localStorage.token) {
            noLogin = false;
            $scope.login = true;
        }

        $scope.allMagazine = myMagazines();

        var ownerID = $routeParams.id;
        $scope.curUserID = getCurrentUserID();
        if (ownerID === undefined) {
            if ($scope.curUserID != 1) {
                $location.path('/user/' + $scope.curUserID);
                return;
            }
            else {
                $location.path('/login');
            }
        } else {
            /**
             * 获取用户信息
             */
            apiHelper.get('api/User/GetSingleUser', {
                ID: $routeParams.id
            }, function (data) {
                if (data.code === 0) {
                    $scope.user = data.value;
                }
            });
            getMyMagazines();
        }
        $('#index-exploreLoading').show();


        $scope.currentMagazine = myCurrentMagazines();
        $scope.currentMagazineList = [];
        $scope.ownerID = ownerID;
        $scope.haveLetter = false;


        if(OPERATION_PLATFORM == 'web') {
            $scope.platInfo = true;
        }else {
            $scope.platInfo = false;
        }


        /**
         * 根据用户信息获取杂志信息
         */
        function getMyMagazines() {
            if (ownerID == $scope.curUserID) {
                var userData = JSON.parse(localStorage.userData);
                $scope.user = userData;
                apiHelper.get('api/Magazine/GetAllMagazinesByUserID', {
                    type: 0
                }, function (data) {
                    $scope.allMagazine = myMagazines(data.value);
                    $scope.allMagazine[0].fontWeight = true;
                    $scope.currentMagazine = myCurrentMagazines($scope.allMagazine[0]);

                    for (var i = 0, _i = $scope.allMagazine.length; i < _i; i++) {
                        if ($scope.allMagazine[i].name == '默认') {
                            $scope.allMagazine[0].fontWeight = false;
                            $scope.allMagazine[i].fontWeight = true;
                            $scope.currentMagazine = myCurrentMagazines($scope.allMagazine[i]);
                        }
                    }

                    getCurrentMagazineList($scope.currentMagazine, 1);
                });
            } else {
                apiHelper.get('api/Magazine/GetMagazinesByUserID', {
                    userID: $routeParams.id
                }, function (data) {
                    if (data.code === 0) {
                        $scope.allMagazine = myMagazines(data.value);
                        $scope.allMagazine[0].fontWeight = true;
                        $scope.currentMagazine = myCurrentMagazines($scope.allMagazine[0]);
                        getCurrentMagazineList($scope.allMagazine[0], 1);
                    }
                });
            }
        }


        /**
         * 显示杂志详细信息
         * @param index
         */
        $scope.showMazagineDetail = function (index) {
            $('.show-detail').each(function (i) {
                if (i == index) {
                    if ($(this).css('display') == 'block') {
                        $(this).hide();
                    }
                    else {
                        $(this).show();
                    }
                } else {
                    $(this).hide();
                }
            });
        };

        /**
         * 删除杂志
         * @param index
         * @constructor
         */
        $scope.Delete = function (index) {
            var deletedMagazine = $scope.allMagazine[index];

            var modalInstance = $modal.open({
                templateUrl: 'content/views/modal/delete-magazine.html',
                controller: DeleteMagazineCtrl,
                resolve: {
                    magazine: function () {
                        return deletedMagazine;
                    },
                    type: function () {
                        return 'my';
                    }
                }
            });
            modalInstance.result.then(function (data) {
                apiHelper.get('api/Magazine/DeleteMagazine', {
                    magazineID: deletedMagazine.ID
                }, function (data) {
                    if (data.code === 0) {
                        $scope.allMagazine.splice(index, 1);
                        myMagazines($scope.allMagazine);
                        $scope.allMagazine[0].fontWeight = true;
                        $scope.currentMagazine = $scope.allMagazine[0];
                        getCurrentMagazineList($scope.allMagazine[0], 1);
                    } else {
                        showMessage(data.message);
                    }
                });
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };


        /**
         * 获取当前杂志文章列表函数
         * @param magazine
         * @param pageIndex
         */
        function getCurrentMagazineList(magazine, pageIndex) {
            $('#index-exploreLoading').show();
            apiHelper.get('api/Magazine/GetArticleList', {
                id: magazine.ID,
                pageIndex: pageIndex,
                pageSize: 6,
                contentLength: 200
            }, function (data) {
                if (data.code === 0) {
                    $scope.currentMagazine = magazine;
                    $scope.currentMagazineList = data.value;
                } else {
                    if (data.message == '没有文章信息') {
                        $scope.currentMagazineList = [];
                    }
                    showMessage(data.message);
                }
                $('#index-exploreLoading').hide();
            });
        }

        /**
         * 获取当前杂志操作
         * @param index
         */
        $scope.getCurrentMagazine = function (index) {
            if($('.show-detail')[index].style.display == 'none') {
                for(var i = 0,_i = $scope.allMagazine.length;i < _i;i++){
                    $scope.allMagazine[i].fontWeight = false;
                }
                $scope.currentMagazine = myCurrentMagazines($scope.allMagazine[index]);
                $scope.allMagazine[index].fontWeight = true;
                getCurrentMagazineList($scope.allMagazine[index], 1);
            }
            $scope.showMazagineDetail(index);
        };

        /**
         * 分页
         * @param page
         */
        $scope.pager = function (page) {
            $window.scrollTo(0, 0);
            getCurrentMagazineList($scope.currentMagazine, page);
        };

        /**
         * 添加阅读计划
         * @param id
         * @param comments
         * @param plan
         */
        $scope.addReadPlan = function (id, comments, plan) {
            if (noLogin) {
                $location.path('/login');
            } else {
                addReadPlan(id, comments, plan, apiHelper);
            }
        };

        /**
         * 分享到社交网络
         */
        $scope.shareTo = function (type, article) {
            shareToSns($window, type, article);
        };

        /**
         * 退出方法
         */
        $scope.logout = function () {
            UserService.Logout();
        };

        /**
         * 获取杂志分类
         */
        apiHelper.get('api/Magazine/GetMagazineCategory', {}, function (res) {
            $scope.magazineCategorys = res.value;
            $scope.chooseCategory = res.value[0];
        });

        /**
         * 创建杂志
         */
        $scope.magazinePermission = 0; //默认公开


        /**
         * 添加杂志提交服务器函数
         * @param cover
         */
        function addMagazine(cover) {
            apiHelper.post('api/Magazine/AddMagazineV2', {
                title: $scope.magazineTitle,
                summary: $scope.magazineSummary,
                categoryID: $scope.chooseCategory.ID,
                coverURL: cover,
                secret: $scope.magazinePermission
            }, function (res) {
                showMessage(res.message);
                getMyMagazines();

                $scope.magazineTitle = '';
                $scope.magazineSummary = '';
                $scope.imageSrc = '';
                $scope.createNewMazagine = false;
            });
        }



        /**
         * 分享展示
         * @param index
         */
        $scope.showShareTips = function (index, className) {
            if (className) {
                var classNameVar = '.' + className + '' + index;
                showShareTip(index, classNameVar);
            } else {
                showShareTip(index);
            }

            /**
             * 复制分享链接
             */
            var timer = setTimeout(function () {
                var length = $scope.currentMagazineList.List.length;
                copy(length, '#codecontent', 'text');
                clearTimeout(timer);
            }, 500);
        }

        /**
         * 当登录后，获取用户私信相关信息
         */
        if (!noLogin) {
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

        /**
         * 转移
         * @param articleIndex
         * @param magazineIndex
         */
        $scope.move = function (articleIndex, magazineIndex) {
            console.log(articleIndex + '----' + magazineIndex)
            var articleToMove = $scope.currentMagazineList.List[articleIndex];
            var moveToMagazine = $scope.allMagazine[magazineIndex];
            apiHelper.get('api/Article/Move', {
                ids: articleToMove.ID,
                magazineID: moveToMagazine.ID
            }, function (data) {
                showMessage('移动成功');
                $scope.currentMagazineList.List.splice(articleIndex, 1);
            });
        };

        /**
         * 订阅
         * @param index
         */
        $scope.subscribe = function (index) {
            var magazineToSubscribe = $scope.allMagazine[index];
            if (magazineToSubscribe.hasSub) {
                $scope.cancleSubscript(index);
            } else {
                apiHelper.get('api/Magazine/SubscribeMagazine', {
                    magazineID: magazineToSubscribe.ID
                }, function () {
                    magazineToSubscribe.hasSub = true;
                    showMessage('订阅成功');
                });
            }
        };

        /**
         * 取消订阅杂志
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        $scope.cancleSubscript = function (index) {
            var deletedMagazine = $scope.allMagazine[index];

            var modalInstance = $modal.open({
                templateUrl: 'content/views/modal/delete-magazine.html',
                controller: DeleteMagazineCtrl,
                resolve: {
                    magazine: function () {
                        return deletedMagazine;
                    },
                    type: function () {
                        return 'sub';
                    }
                }
            });

            modalInstance.result.then(function () {
                apiHelper.get('api/Magazine/CancelSubscribeMagazine', {
                    magazineID: deletedMagazine.ID
                }, function (data) {
                    $scope.allMagazine[index].hasSub = false;
                    showMessage('取消订阅成功');
                });
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 获取用户所有订阅杂志
         * 判断杂志是否已经订阅
         */
        if(!noLogin) {
            apiHelper.get('api/Magazine/GetAllMagazinesByUserID', {
                type: 1
            }, function (data) {
                if (data.code === 0) {
                    var magazines = data.value;
                    for(var i= 0,_i = magazines.length;i < _i;i++) {
                        for(var j = 0,_j = $scope.allMagazine.length;j < _j;j++) {
                            if(magazines[i].ID == $scope.allMagazine[j].ID) {
                                $scope.allMagazine[j].hasSub = true;
                            }
                        }
                    }
                }
            });
        }

        /**
         * 文章删除
         * @param articleIndex
         * @constructor
         */
        $scope.DeleteArticle = function (articleIndex) {
            var articleToDelete = $scope.currentMagazineList.List[articleIndex];
            apiHelper.get('api/Article/Delete', {
                ids: articleToDelete.ID
            }, function (data) {
                showMessage('删除成功');
                $scope.currentMagazineList.List.splice(articleIndex, 1);
            });
        };

        /**
         * 根据平台上传图片
         */
        if(OPERATION_PLATFORM == 'web') {
            /**
             * 上传图片
             */
            $scope.uploadImg = function(data) {
                $scope.imageSrc = data.value;
                $('.unloadingImg').attr('src',$scope.imageSrc);
            };


        }

        /**
         * 添加杂志
         */
        $scope.add = function () {
            var title = $scope.magazineTitle;
            if (!title) {
                showMessage("请填写杂志名称");
                return;
            }
            var imgUrl = $scope.imageSrc;
            addMagazine(imgUrl);

        };

    })
    .controller('exploreCtrl', function ($scope, apiHelper, $window) {
        $scope.explorArr1 = [];
        $scope.explorArr2 = [];
        $scope.explorArr3 = [];
        $scope.explorArr = [];
        $scope.readMoreState = false;
        var loading = true,
            pageIndex = 1,
            tempArr = [];
        $('#index-exploreLoading').hide();

        /**
         * ie8下给发现每个框加边框
         */
        if ($.ua().isIe8) {
            $scope.exploreBorder = true;
        }

        /**
         * 第一次获取发现列表
         */
        getExplorArr(18, function(pageSize, data) {
            resSuccess(18, data);
        });

        /**
         * 获取发现列表函数
         * @param pageSize
         */
        function getExplorArr(pageSize, callback) {
            loading = false;
            apiHelper.get('api/Article/Explore', {
                pageIndex: pageIndex,
                pageSize: pageSize
            }, function (data) {
                loading = true;
                if(data.value){
                    tempArr = data;
                    if(callback && typeof callback === 'function') {
                        callback(pageSize, data);
                    }
                } else {
                    loading = false;
                    showMessage(data.message);
                }
            });
        }

        /**
         * 获取发现数据成功后函数
         * 为页面添加数据
         * @param pageSize
         * @param data
         */
        function resSuccess(pageSize, data) {
                $scope.explorArr = data.value.List;
                var allLen = $scope.explorArr.length;

                if (pageIndex == 1) {
                    var len = parseInt(allLen / 3);
                    pushArr(0, len - 1, $scope.explorArr1, $scope.explorArr);
                    pushArr(len, len * 2 - 1, $scope.explorArr2, $scope.explorArr);
                    pushArr(len * 2, len * 3 - 1, $scope.explorArr3, $scope.explorArr);
                } else {
                    var ongHeight = $("#one").height(),
                        twoHeight = $("#two").height(),
                        threeHeight = $("#three").height();
                    for (var i = 0; i < allLen; i++) {
                        if ($scope.explorArr[i]) {
                            if (ongHeight <= twoHeight && ongHeight <= threeHeight) {
                                $scope.explorArr1.push($scope.explorArr[i]);
                                ongHeight += 300;
                            } else if (twoHeight < ongHeight && twoHeight < threeHeight) {
                                $scope.explorArr2.push($scope.explorArr[i]);
                                twoHeight += 300;
                            } else {
                                $scope.explorArr3.push($scope.explorArr[i]);
                                threeHeight += 300;
                            }
                        }
                    }
                }

                $scope.readMoreState = true;
                setFontStyle();

                /**
                 * 提前缓存下一页内容
                 */
                pageIndex++;
                getExplorArr(18);
        }

        /**
         * 设置字体样式
         */
        function setFontStyle() {
            var timer = setTimeout(function () {
                for (var i = 1; i < 4; i++) {
                    var num = i;
                    $('.explore-title' + i).each(function (i) {
                        if (i > 2 && i % 4 == num) {
                            $(this).attr('style', 'font-family:"宋体" !important;font-weight:bold;font-size:20px;line-height:1.2');
                        } else if (i > 2 && i % 4 == num - 1) {
                            $(this).attr('style', 'font-family:"楷体" !important;font-weight:bold;font-size:21px;line-height:1');
                        } else {
                            $(this).attr('style', 'font-family:"微软雅黑";font-size:18px;line-height:1.3');
                        }
                    });
                }
                clearTimeout(timer);
            }, 10);
        }

        /**
         * 添加阅读计划
         * @param id
         * @param comments
         * @param plan
         */
        $scope.addReadPlan = function (id, comments, plan) {
            addReadPlan(id, comments, plan, apiHelper);
        };


        /**
         * 实现滚动加载
         */
        angular.element($window).bind("scroll", function () {
            var height = $(document).height() - (parseFloat($(window).height()) + parseFloat($(window).scrollTop()));
            var $explore = document.getElementById('exploreContent');

            if (height < 600 && loading && $explore) {
                resSuccess(18, tempArr);
                return false;
            } else {
                return false;
            }


        });

        /**
         * 分享展示
         * @param index
         * @param className
         * @param copyBtn
         * @param codeContent
         */
        $scope.showShareTips = function (index, className) {
            var classNameVar = '.' + className + '' + index;
            showShareTip(index, classNameVar);
        }
    })
    .controller('searchCtrl', function ($scope, $routeParams, apiHelper, $window) {
        var keyword = $routeParams.input;
        $scope.otherArr = [];//搜索其他人结果
        $scope.selfArr = null;//搜索自己结果
        $scope.input = keyword;
        $scope.state = 'loading';
        $scope.displayType = 0;
        $scope.my = true;
        $scope.other = false;
        $('#index-exploreLoading').show();

        search(0, 1);
        search(1, 1);

        function search(type, pageIndex) {
            apiHelper.get('api/Article/Search', {
                keyword: keyword,
                type: type,
                pageIndex: pageIndex,
                pageSize: 15,
                contentLength: 50
            }, function (data) {
                if (data.code == 0) {
                    $('#index-exploreLoading').hide();
                    $scope.state = 'loaded';
                    if (type == 0) {
                        $scope.selfArr = data.value;
                    } else if (type == 1) {
                        $scope.otherArr = data.value;
                    }

                } else {
                    showMessage("没有找到我的相关文章，看看大家的");
                    if ($scope.selfArr == null) {
                        $scope.change(1);
                    }
                }

            })
        }

        $scope.change = function (type) {
            $scope.displayType = type;
            if (type == 0) {
                $scope.my = true;
                $scope.other = false;
            } else if (type == 1) {
                $scope.my = false;
                $scope.other = true;
            }
        }

        $scope.pager = function (page, type) {
            $window.scrollTo(0, 0);
            switch (type) {
                case 0:
                    search(0, page);
                    break;
                case 1:
                    search(1, page);
                    break;
            }
        };

        /**
         * 分享文章
         * @param  {[type]} type  [description]
         * @return {[type]}       [description]
         */
        $scope.shareTo = function (type, article) {
            shareToSns($window, type, article);
        };

        /**
         * 添加至阅读计划
         * */
        $scope.addReadPlan = function (article, postil, plan) {
            addReadPlan(article.ID, postil, plan, apiHelper);
        }


        /**
         * 分享展示
         * @param copyBtn 点击复制按钮元素
         * @param codeContent 复制内容元素
         * @param index 循环中第几个元素
         * @param className 需要展示元素classname
         */
        $scope.showShareTips = function (index, className, copyBtn, codeContent) {

            var classNameVar = '.' + className + '' + index;
            showShareTip(index, classNameVar);

            /**
             * 复制分享链接
             */
            if(copyBtn && codeContent) {
                var copyBtnId = '#' + copyBtn;
                var codeContentId = '#' + codeContent;
                var length = 1;
                if (copyBtn.match('self')) {
                    length = $scope.selfArr.List.length;
                } else if (copyBtn.match('other')) {
                    length = $scope.otherArr.List.length;
                }

                var timer = setTimeout(function () {
                    copy(length, codeContentId, 'text', copyBtnId);
                    clearTimeout(timer);
                }, 500);
            }


        }
    })
    .controller('inputSearch', function ($scope, $location) {

        /**
         * @name search#click
         * @desc 点击搜索
         * @event
         * @param {string} searchInput 搜索框输入内容
         */
        $scope.searchFun = function (searchInput) {
            search(searchInput);
        };
        /**
         * @name search#enter
         * @desc 按enter搜索
         * @event
         * @param {string} searchInput
         * @param {object} event
         */
        $scope.keyDownSearch = function (searchInput, event) {
            if (event.keyCode === 13) {
                search(searchInput);
            }
        };
        /**
         * 搜索方法
         * @param {string} searchInput
         */
        function search(searchInput) {
            if (searchInput == undefined || searchInput == '') {
                showMessage('请输入搜索内容');
            } else {
                $('#searchInput').val('').blur();
                $scope.searchInput = '';
                $location.path('/search/' + searchInput);
            }
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
    .controller('bookMarkCtrl', function ($scope) {
        if ($.ua().isChrome) {
            $scope.chromeDefault = true;
            $scope.chromeStore = true;
        } else if ($.ua().is360se) {
            //360安全浏览器;
            $scope.threeSixO = true;
        } else if ($.ua().engine.isWebkit) {
            $scope.webkit = true;
        } else {
            $scope.chromeDefault = true;
            $scope.chromeStore = false;
        }

        $('.chromeInstallstore').click(function() {
            showMessage('请把我拖动到书签栏完成安装');
            return false;
        });
        function installChromeExt() {
            chrome.webstore.install('https://chrome.google.com/webstore/detail/dfopajdkckonolmdafpcenbhjfpcbkhh', function () {
                showMessage('安装成功');
            }, function (err) {
                console.log(err);
                showMessage('安装失败');
            });
        }
    })
    .controller('inoteCtrl', function ($scope, $location, $window) {

        //每次重新进入，清除图片轮播计时器
        if(inoteIndexImgTimer) {
            clearInterval(inoteIndexImgTimer);
        }

        $('#index-exploreLoading').hide();
        $scope.hasLogin = false;
        if (localStorage.userData && localStorage.token) {
            $scope.hasLogin = true;
        }

        /**
         * 看看怎么用
         */
        $scope.howtosave = function () {
            if (softwareName === "windowsApp") {
                var gui = require('nw.gui');
                gui.Shell.openExternal("http://www.ireadhome.com/help/howtosave");
            }
            else {
                $window.open("http://www.ireadhome.com/help/howtosave");
            }
        }

        /**
         * 图片轮播
         * @type {number}
         */
        var num = 1;
        inoteIndexImgTimer = setInterval(function () {
            num++;
            for (var i = 1; i < 4; i++) {
                $("#bigpic" + i).css("opacity", "0");
                $("#bigpic" + i).css("fliter", "alpha(opacity:0)");
                $('#b' + i).css('background-position', '-223px -18px');
            }
            $("#bigpic" + num).css("opacity", "0.5");
            $("#bigpic" + num).css("fliter", "alpha(opacity:50)");
            $('#b' + num).css('background-position', '-171px -18px');
            $("#bigpic" + num).animate({
                opacity: 1,
                fliter: "alpha(opacity:100)"
            }, 500);0
            if (num == 3) {
                num = 0;
            }
        }, 10000);

    })
    .controller('EditInfoCtrl', function ($scope, $http, apiHelper, fileReader, $location) {
        var userData = JSON.parse(localStorage.userData);
        var avatarURL = undefined;
        $scope.user = {};
        $scope.user.id = userData.ID;
        $scope.user.AvatarImgUrl = '';
        $scope.SystemAvatar = {};
        $scope.SystemAvatarShow = false;
        $scope.imageSrc = '';

        if(OPERATION_PLATFORM == 'web') {
            $scope.platInfo = true;
        }else {
            $scope.platInfo = false;
        }

        /**
         * 获取单个用户信息
         */
        apiHelper.get('api/User/GetSingleUser/', {
            ID: $scope.user.id
        }, function (data) {
            $scope.user = data.value;
            $scope.user.userName = data.value.nickName;
            $scope.user.AvatarImgUrl = data.value.avatarURL;
            $scope.imageSrc = data.value.avatarURL;
        });

        /**
         * 获取系统头像
         */
        apiHelper.get('api/User/GetSystemAvatar', {
            pageIndex: 1,
            pageSize: 15
        }, function (data) {
            $scope.SystemAvatar = data.value;
        });

        /**
         * 默认头像点击事件
         */
        $scope.defaultAvatar = function () {
            $scope.SystemAvatarShow = true;
        };

        /**
         * 默认头像下一页
         * @param page
         */
        $scope.pager = function (page) {
            apiHelper.get('api/User/GetSystemAvatar', {
                pageIndex: page,
                pageSize: 15
            }, function (data) {
                $scope.SystemAvatar = data.value;
            });
        };
        /**
         * 选择单个头像
         * @param imgUrl
         * @param index
         */
        $scope.chooseSingleImg = function (imgUrl, index) {
            avatarURL = imgUrl;
            $('#SystemAvatar-content img').each(function (i) {
                $(this).css('border', 'none');
                if (i == index) {
                    $(this).css('border', '1px solid #00f');
                }
            });
        };

        /**
         * 根据不同平台，获取图片
         */
        if(OPERATION_PLATFORM == 'web'){
            /**
             * 上传图片成功后函数
             */
            $scope.uploadImg = function(data) {
                $scope.imageSrc = data.value;
                $('.c_left').attr('src',$scope.imageSrc);
            };
        }

        /**
         * 提交更改
         */
        $scope.submit = function () {
            $scope.user.AvatarImgUrl = $scope.imageSrc;
            reviseUserInfo($scope.user);
        };

        /**
         * 隐藏默认头像展示界面
         * @constructor
         */
        $scope.SystemAvatarHide = function () {
            $scope.SystemAvatarShow = false;
        };

        /**
         * 选择图片后点击确定事件
         */
        $scope.chooseImg = function () {
            if (avatarURL) {
                $scope.user.AvatarImgUrl = avatarURL;
                $scope.imageSrc = avatarURL;
                $scope.SystemAvatarShow = false;
            }
            else {
                showMessage('你没选择图片哦！');
            }

        };

        /**
         * 将更改提交至服务器
         * @param user
         */
        function reviseUserInfo(user) {
            apiHelper.post('api/User/EditUserInfo', {
                nickName: user.userName,
                avatarURL: user.AvatarImgUrl,
                aboutMe: user.aboutMe
            }, function (data) {
                var tempUserData = userData;
                tempUserData.nickName = user.userName;
                tempUserData.avatarURL = user.AvatarImgUrl;
                tempUserData.aboutMe = user.aboutMe;
                if (data.code == 0) {
                    localStorage.userData = JSON.stringify(tempUserData);
                    showMessage('个人信息修改成功');
                    $location.path('/user');

                }
                else {
                    showMessage(data.message);
                }
            });
        }
    })
    .controller('EditPasswordCtrl', function ($scope, apiHelper, $location) {
        $scope.user = {};
        $scope.user.newPwd = '';
        $scope.user.newPwdTwo = '';
        $scope.user.oldPwd = '';

        /**
         * 修改密码提交
         */
        $scope.submit = function () {
            if ($scope.user.oldPwd.length === 0) {
                showMessage('请输入旧密码');
                return;
            }
            if ($scope.user.newPwd == $scope.user.newPwdTwo) {
                if ($scope.user.newPwd.length < 6) {
                    showMessage('密码位数必须大于等于6位');
                }
                else {
                    apiHelper.post('api/User/EditPasswordInfo', {
                        oldPassword: $scope.user.oldPwd,
                        newPassword: $scope.user.newPwd
                    }, function (data) {
                        showMessage('修改成功，请重新登录');
                        $location.path('/login');
                    });
                }
            }
            else {
                showMessage('你两次输入密码不一致');
            }
        }

        $scope.keydown = function (event) {
            if (event.keyCode === 13) {
                $scope.submit();
            }
        }
    })
    .controller('messageInfoCtrl', function ($scope, apiHelper, $sce, $modal, $window) {
        $scope.messageInfos = messageInfo();
        $scope.receive = true;
        $scope.send = false;
        $scope.resopnseAreaShow = false;
        $scope.type = 'recive';

        /**
         * 获取单个用户的所有私信
         */
        function getReciveMessage(page) {
            apiHelper.get('api/User/GetMessage', {
                pageIndex: page,
                pageSize: 15
            }, function (data) {
                for (var i = 0, _i = data.value.List.length; i < _i; i++) {
                    data.value.List[i].content = data.value.List[i].content.replace('点击查看', '');
                    //获取文章ID

                    var articleIdArr = data.value.List[i].content.match(/href='\/Article\/Detail\/\d{1,}'/);
                    if (articleIdArr) {
                        var articleId = articleIdArr[0].split('/')[3].replace("'", "")
                        data.value.List[i].articleID = articleId;
                    }
                }
                $scope.messageInfos = messageInfo(data.value);
                $scope.receive = true;
                $scope.send = false;
            });
        }

        getReciveMessage(1);

        /**
         * 展示收件箱内容
         */
        $scope.receiveFun = function () {
            $scope.type = 'recive';
            getReciveMessage(1);
        };

        /**
         * 展示发件箱内容
         */
        $scope.sendFun = function () {
            $scope.type = 'send';
            getSendMessage(1);
        };

        function getSendMessage(page) {
            apiHelper.get('api/User/GetSentMessage', {
                pageIndex: page,
                pageSize: 15
            }, function (data) {
                $scope.messageInfos = messageInfo(data.value);
                $scope.receive = false;
                $scope.send = true;
            });
        }

        /**
         * 下一页
         * @param page
         */
        $scope.pager = function (page, type) {
            $window.scrollTo(0, 0);
            if (type == 'recive') {
                getReciveMessage(page);
            }
            else {
                getSendMessage(page)
            }
        };

        /**
         * 回复消息
         * @param messageInfo
         */
        $scope.msgResponse = function (messageInfo) {
            msgResponse(messageInfo);
        };

        /**
         * 回复界面展示
         * @param messageInfo
         */
        function msgResponse(messageInfo) {
            $window.scrollTo(0,0);
            $scope.msgResponseObj = messageInfo;
            $scope.msgResponseSender = messageInfo.user.nickName;
            $scope.msgResponseTitle = messageInfo.content.replace('您的文章', '');
            $scope.msgResponseContent = messageInfo.content;
            $scope.msgResponseTime = messageInfo.addTime;
            $scope.articleID = messageInfo.articleID;
            $scope.responseShow = true;
            $scope.resopnseAreaShow = false;
            if (messageInfo.hasRead == false) {
                setHasRead(messageInfo);
            }
        }

        /**
         * 设置为已读
         */
        function setHasRead(messageInfo) {
            apiHelper.get('api/User/SetMessageRead', {
                msgID: $scope.msgResponseObj.ID
            }, function (data) {
                messageInfo.hasRead = true;
            });
        }

        /**
         * 回复且显示输入框
         * @param messageInfo
         */
        $scope.msgResponseMore = function (messageInfo) {
            msgResponse(messageInfo);
            $scope.resopnseAreaShow = true;
        };

        /**
         * 回复框隐藏
         */
        $scope.responseHide = function () {
            $scope.responseShow = false;
        };

        /**
         * 发送回复至服务器
         */
        $scope.responseSubmit = function () {
            var responseId = $scope.msgResponseObj.ID;
            var content = $scope.resopnseTextArea;
            apiHelper.post('api/User/ReplyMessageV2', {
                MessageID: responseId,
                Content: content
            }, function (data) {
                if (data.code == 0) {
                    $scope.sendFun();
                    $scope.responseHide();
                    $('#resopnseTextArea').val('');
                }
                else {
                    showMessage(data.message);
                }

            });
        };

        /**
         * 删除消息
         * @param index
         */
        $scope.msgDelete = function (index) {
            var deletedMsg = $scope.messageInfos.List[index];
            var modalInstance = $modal.open({
                templateUrl: 'content/views/modal/delete-msg.html',
                controller: DeleteMsgCtrl,
                resolve: {
                    msg: function () {
                        return deletedMsg;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                apiHelper.get('api/User/DeleteMessage', {
                    msgID: deletedMsg.ID
                }, function (data) {
                    if (data.code === 0) {
                        $scope.messageInfos.List.splice(index, 1);
                        messageInfo($scope.messageInfos);
                    } else {
                        showMessage(data.message);
                    }
                });
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

    })
    .controller('editMagazineCtrl', function ($scope, apiHelper, $routeParams, fileReader, $http, $location, $window) {
        var magazineId = $routeParams.id;
        var category;
        if(OPERATION_PLATFORM == 'web') {
            $scope.platInfo = true;
        }else {
            $scope.platInfo = false;
        }

        /**
         * 获取单本杂志信息
         */
        apiHelper.get('api/Magazine/SingleMagazine', {
            id: magazineId
        }, function (data) {
            $scope.magazineInfo = data.value;
            $scope.imageSrc = data.value.coverURL;
            category = data.value.category;
            $scope.isPrivate = data.value.isPrivate;
            apiHelper.get('api/Magazine/GetMagazineCategory', {}, function (res) {
                $scope.magazineCategorys = res.value;
                for (var i = 0, _i = res.value.length; i < _i; i++) {
                    if (res.value[i].name == category) {
                        $scope.Categoryed = res.value[i];
                    }
                }
            });
        });

        /**
         * 根据平台上传图片
         */
        if(OPERATION_PLATFORM == 'web') {
            /**
             * 上传图片
             */
            $scope.uploadImg = function(data) {
                $scope.imageSrc = data.value;
                $('.magazine-image').attr('style','background-image:url('+$scope.imageSrc+')');
                showMessage('上传成功');
            };

        }

        /**
         * 提交更改
         * @param magazineInfo
         */
        $scope.submit = function (magazineInfo) {
                coverURL = $scope.imageSrc;
            apiHelper.post('api/Magazine/EditMagazine', {
                ID: magazineInfo.ID,
                name: magazineInfo.name,
                coverURL: coverURL,
                isSecret: $scope.isPrivate,
                categoryID: $scope.Categoryed.ID,
                summary: magazineInfo.summary
            }, function (data) {
                if (data.code == 0) {
                    $location.path('/user');
                } else {
                    showMessage(data.message);
                }

            });
        };


        /**
         * 返回
         * @return {[type]} [description]
         */
        $scope.goBack = function () {
            $window.history.back();
        };

    })
    .controller('iNotePluginCtrl', function ($scope) {
        /**
         * 复制
         */
        var timer = setTimeout(function () {
            for (var i = 1; i < 9; i++) {
                $('#copy-button' + i).zclip({
                    path: './js/ZeroClipboard.swf',
                    copy: $('#codecontent' + i)[0].value
                });
            }
            clearTimeout(timer);
        }, 1000)


    })
    .controller('downloadCtrl', function ($scope, $location) {
        $scope.installBookmark = function () {
            if (softwareName === 'windowsApp') {
                var gui = require('nw.gui');
                gui.Shell.openExternal('http://inoteweb.com/#/download/bookMark');
            }
            else {
                $location.path('/download/bookMark');
            }
        };
    });

//--------------------start custom directive-------------------------
inoteApp
    .directive('fileSelect',function (fileReader,$http) {
        return {
            link: function ($scope, el) {
                el.bind("change", function (e) {
                   var files = (e.srcElement || e.target).files;
                    $('#index-exploreLoading').show();
                    fileReader.readAsDataUrl(files[0], $scope)
                        .then(function (result) {
                            $scope.imageSrc = result;
                        });

                    // files is a FileList of File objects. List some properties.
                    if (files && files.length > 0) {
                        var formData = new FormData();
                        formData.append('file', files[0]);
                        $http.post(BaseApiUrl + 'api/Upload/Image', formData, {
                                withCredentials: true,
                                headers: {'Content-Type': undefined },
                                transformRequest: angular.identity
                            }
                        ).success(function (data) {
                                $('#index-exploreLoading').hide();
                                $scope.imageSrc = data.value;
                                showMessage('上传成功');
                            }).error(function() {
                                $('#index-exploreLoading').hide();
                                showMessage('上传失败');
                            });
                    }
                })
            }
        }
    })
    .directive('displayHostname', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                attrs.$observe('href', function (value) {
                    if (value) {
                        var hostName = getHostNameFromUrl(value);
                        if (hostName) {
                            elem.html(hostName + ' <b class="link_to_icon"></b>');
                        }
                    }
                });
            }
        }
    })
    .directive('articleCard', function () {
        return {
            restrict: 'E',
            templateUrl: 'content/views/templates/plan_article_card.html'
        }
    })
    .directive('articleList', function () {
        return {
            restrict: 'E',
            templateUrl: 'content/views/templates/plan_article_list.html'
        }
    })
    .directive('resizable', function ($window, $document) {
        return function ($scope) {
            $scope.initializeWindowSize = function () {

                $scope.windowHeight =  $(window).height() + "px";

                $scope.publicMagazineListHeight = $(window).height() - 424 + "px"
            };
            $scope.setStyle = function () {

                $(".minheight").attr('style', 'min-height:' + (parseInt($scope.windowHeight) - 110 + 'px'));

                $(".publicMagazineList").attr('style', 'max-height:' + $scope.publicMagazineListHeight);
            };
            angular.element($window).bind("resize", function () {
                $scope.initializeWindowSize();
                $scope.setStyle();
                $scope.$apply();
            });
            $scope.initializeWindowSize();
            $scope.setStyle();
            $(".headerMinheight").attr('style', 'height:' + (parseInt($scope.windowHeight)+ 'px'));
        }
    })
    .directive('backImg', function () {
        return function (scope, element, attrs) {
            var url = attrs.backImg;
            element.css({
                'background-image': 'url(' + url + ')'
            });
        };
    })
    .directive('uploadImg', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var timerImgUpload = setTimeout(function() {
                    $(element).uploadify(
                        {
                            'uploader': 'js/uploadify.swf',
                            'script': 'http://service.ireadhome.com/api/Upload/Image',//接收处理页面
                            'folder': '',
                            'queueID': 'fileQueue',
                            'auto': true,
                            'multi': false,
                            'buttonText': 'img-File',
                            'fileExt': '*.jpg;*.png;*.gif;',
                            'hideButton': true,
                            'onSelect': function (e, queueId, fileObj) {
                                $('#index-exploreLoading').show();
                            },
                            'fileDesc': '请选择jpg文件',
                            'onComplete': function(event, queueId, fileObj, response, data) {
                                $('#index-exploreLoading').hide();
                                var obj = JSON.parse(response);
                                scope.uploadImg(obj);
                            },
                            'onError': function(event, queueId, fileObj, errorObj) {
                                alert(errorObj.type);
                                alert(errorObj.info);
                            }
                    });
                    clearTimeout(timerImgUpload);
                },10);

            }
        };
    })
    .directive('setPermission', function(apiHelper) {
        return {
          link: function(scope, element, attrs) {
              element.bind('click', function() {
                  var magazine = {
                      magazineID: scope.magazine.ID.split('-')[1],
                      isPrivate: 0
                  };
                 if(element.attr('class') == 'litter_icon_public') {
                     magazine.isPrivate = 1;
                     apiHelper.get('api/Magazine/SwitchState', magazine, function (data) {
                         if(data.code == 0) {
                             element.attr('class', 'litter_icon_private');
                             element.attr('title', '私有');
                             return;
                         }
                         showMessage(data.message);
                     });
                 }else {
                     apiHelper.get('api/Magazine/SwitchState', magazine, function (data) {
                         if(data.code == 0) {
                             element.attr('class','litter_icon_public');
                             element.attr('title', '公开');
                             return;
                         }
                         showMessage(data.message);
                     });
                 }
              });
          }
        };
    });

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
     * 获取用户杂志
     */
    this.getMagazines = function (callback) {
        var magazines = myMagazines();
        if (magazines) {
            if (callback !== undefined && typeof callback === 'function') {
                callback(magazines);
            }
        }
        else {
            this.get('api/Magazine/GetAllMagazinesByUserID', {
                type: 0
            }, function (data) {
                myMagazines(data.value);
                if (callback !== undefined && typeof callback === 'function') {
                    callback(data.value);
                }
            });
        }
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

/**
 * 文件预览
 */
inoteApp.factory('fileReader', ['$q', function ($q) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);
//-----------------start other controller-----------------------


/**
 * 删除杂志Controller
 * @param {[type]} $scope         [description]
 * @param {[type]} $modalInstance [description]
 * @param {[type]} magazine       [description]
 */
var DeleteMagazineCtrl = function ($scope, $modalInstance, magazine, type) {
    $scope.magazine = magazine;
    $scope.type = type;
    $scope.ok = function () {
        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

/**
 * 删除私信
 * @param $scope
 * @param $modalInstance
 * @param msg
 * @constructor
 */
var DeleteMsgCtrl = function ($scope, $modalInstance, msg) {
    $scope.msg = msg;
    $scope.ok = function () {
        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

/**
 * 保存文章模态窗口
 * @param {[type]} $scope         [description]
 * @param {[type]} $modalInstance [description]
 * @param {[type]} article        [description]
 * @param {[type]} magazines      [description]
 */
var SaveArticleCtrl = function ($scope, $modalInstance, article, magazines) {
    $scope.article = article;
    $scope.magazines = magazines;
    $scope.chooseMagazine = $scope.magazines[0];

    $scope.change = function (chooseMagazine) {
        $scope.chooseMagazine = chooseMagazine;
    }
    $scope.ok = function () {
        $modalInstance.close($scope.chooseMagazine.ID);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

/**
 * 编辑和编写文章ctrl
 * @param {[type]} $scope         [description]
 * @param {[type]} $modalInstance [description]
 * @param {[type]} magazines      [description]
 */
var AddAndEditArticleCtrl = function ($scope, $modalInstance, $timeout, article, magazines, type) {
    $scope.magazines = magazines;
    $scope.article = article;
    $scope.type = type;
    if (type == 'edit') {
        for (var i = 0; i < magazines.length; i++) {
            if (magazines[i].ID == article.magazineID) {
                $scope.article.magazine = magazines[i];
            }
        }
    } else {
        $scope.article.magazine = magazines[0];
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

    $scope.ok = function () {
        $modalInstance.close({
            title: $scope.article.title,
            content: $scope.article.content,
            magazineID: $scope.article.magazine.ID
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss($scope.article);
    };
};

/**
 * 删除文章
 * @param {[type]} $scope         [description]
 * @param {[type]} $modalInstance [description]
 * @param {[type]} article        [description]
 */
var DeleteArticleCtrl = function ($scope, $modalInstance, article) {
    $scope.article = article;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

//-----------------end other controller-----------------------

