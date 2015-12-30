/**
 * Created by massimo on 14-2-19.
 */
/**
 * 从url中解析hostname
 * @param url
 */
function getHostNameFromUrl(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
}

/**
 * 消息提示
 * @return {[type]} [description]
 */

function showMessage(message, time, callback) {
    if (!message) {
        return;
    }
    var delay = time || 3;
    jQuery('#inote-message').html(message).show();
    var timer = setTimeout(function () {
        if (typeof callback === 'function') {
            callback();
        }
        jQuery('#inote-message').hide().html('');
        clearTimeout(timer);
    }, delay * 700);

}

/**
 * chrome 相关页面关闭
 */

function chromePageClose(tab) {
    var reg = /chrome\-extension\:\/\/|undefined|chrome\:\/\/|chrome\.google/i;

    if (localStorage.localsite.match(reg)) {
        chrome.tabs.update(null, {
            url: localStorage.localsite
        });
    } else {
        responseToParent("closeIframe");
    }
}

function responseToParent(response) {
    window.parent.postMessage(JSON.stringify(response), '*');
}


//----------------------start 杂志缓存-------------------------

/**
 * 获取或设置我的杂志
 * @param magas
 * @returns {type[]}
 */
function myMagazines(magas) {
    return myStorage('myMagazine', magas);
}


/**
 * 获取或设置我的当前杂志
 * @param magas
 * @returns {type[]}
 */
function myCurrentMagazines(magas) {
    return myStorage('myCurrentMagazine', magas);
}

/**
 * 获取或设置个人订阅的杂志
 * @param  {[type]} magas [description]
 * @return {[type]}       [description]
 */
function subMagazines(magas) {
    var cacheKey = 'subMagazines';
    return myStorage(cacheKey, magas);
}

/**
 * 单本杂志的缓存
 * @param  {[type]} magazineID   [description]
 * @param  {[type]} magazineData [description]
 * @param {[type]} pageIndex [description]
 * @return {[type]}              [description]
 */
function singleMagazine(magazineID, pageIndex, magazineData) {
    var cacheKey = 'single_magazine_' + magazineID + '_' + pageIndex;
    return myStorage(cacheKey, magazineData);
}

/**
 * 阅读计划数据存取
 * @param data
 * @returns {*}
 */
function readPlan(data) {
    var cacheKey = "readplan";
    if (data) {

        var saveData = {
            today: data.today.slice(0, 9),
            tomorrow: data.tomorrow.slice(0, 6),
            future: data.future.slice(0, 6)
        };
        myStorage(cacheKey, saveData); //只保存部分数据

        return data;
    }
    else {
        return myStorage(cacheKey);
    }
}

function messageInfo(data) {
    var cacheKey = 'messageInfo';
    if (data) {
        myStorage(cacheKey, data);
        return data;
    }
    else {
        return myStorage(cacheKey);
    }
}
//-----------------------end 杂志缓存-----------------------------

/**
 * 设置或获取文章显示方式
 * @param type
 * @returns {*}
 */
function displayType(type) {
    var cacheKey = 'articleDisplayType';
    return myStorage(cacheKey, type);
}

/**
 * 主题样式的保存和获取
 * @param value
 * @returns {*}
 */
function themeStyle(value) {
    var cacheKey = 'theme_style';
    return myStorage(cacheKey, value);
}

/**
 * 文章草稿的保存和获取
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */

function articleDraft(value) {
    var cacheKey = 'article_draft';
    return myStorage(cacheKey, value);
}

/**
 * 获取或设置存储
 * @param key
 * @param value
 * @returns {*}
 */
function myStorage(key, value) {
    key = getCurrentUserID() + "_" + key;

    if (value === undefined) {
        if (localStorage[key]) {
            return JSON.parse(localStorage[key]);
        }
        return undefined;
    }
    localStorage[key] = JSON.stringify(value);
    return value;
}

/**
 * 获取当前的用户ID
 * @return {[type]} [description]
 */

function getCurrentUserID() {
    if (localStorage.userData) {
        var user = JSON.parse(localStorage.userData);
        return user.ID;
    }
    return 1;
}

/**
 * 分享到社交网络
 * @param  {[type]} $window    [description]
 * @param  {[type]} type       [description]
 * @param  {Object} article    [description]
 * @return {[type]}            [description]
 */

function shareToSns($window, type, article) {
    var title = (article.title + "：" + article.content).replace(/<(?:.|\n)*?>/gm, '').substring(0, 100) + "...";
    var articleURL = 'http://www.inoteweb.com/article/share/' + article.ID.replace('0-', '');
    var pic = article.imgURL;
    switch (type) {
        case 'weibo':
            title += "(分享自 @iNote微收藏)";
            url = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent(articleURL) + "&title=" + encodeURIComponent(title) + "&appkey=4029991350&relateUid=3310679382&count=1&pic=" + pic;
            break;
        case 'qzone':
            url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(articleURL) + '&title=' + encodeURIComponent(title) + '&site="iRead"';
            break;
        case 'renren':
            url = 'http://share.renren.com/share/buttonshare.do?link=' + encodeURIComponent(articleURL) + '&title=' + encodeURIComponent(title);
            break;
        case 'tengxunweibo':
            url = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + encodeURIComponent(articleURL) + '&appkey=100453998&assname=' + '' + '&title=' + encodeURIComponent(title) + '&pic=' + pic;
            break;
        default:
            return;
    }
    $window.open(url);
}

function reconvert(str) {
    str = str.replace(/(\\u)(\w{4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g, "$2"), 16));
    });
    return str;
}
/**
 * @name pushArr
 * @class 将arr2中数据推入arr1
 * @param {number} begin arr2开始位置
 * @param {number} end arr2结束位置
 * @param {Array.<number>} arr1
 * @param {Array.<number>} arr2
 */
function pushArr(begin, end, arr1, arr2) {
    for (var i = begin; i < end; i++) {
        arr1.push(arr2[i]);
    }
};

/**
 * @name addReadPlan
 * @class 添加阅读计划
 * @param {number} id 文章id
 * @param {string} comments 批注内容
 * @param {number} plan 设置计划时间，1今天，2明天，3以后
 * @param {object} apiHelper
 */
var addReadPlan = function (id, comments, plan, apiHelper) {

    if(!comments){
        comments = '';
    }

    apiHelper.get('api/Article/SetReadPlan', {
        ID: id,
        plan: plan,
        comment: comments
    }, function (data) {
        if(data.code == 0) {
            removePopover();
        }
        showMessage(data.message);
    });
}


/**
 * IE9下不支持window.btoa
 * @return {object}
 */

var Base64 = function () {
    var base64hash = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    // btoa method
    function _btoa(s) {
        if (/([^\u0000-\u00ff])/.test(s)) {
            throw new Error('INVALID_CHARACTER_ERR');
        }
        var i = 0,
            prev,
            ascii,
            mod,
            result = [];

        while (i < s.length) {
            ascii = s.charCodeAt(i);
            mod = i % 3;

            switch (mod) {
                // 第一个6位只需要让8位二进制右移两位
                case 0:
                    result.push(base64hash.charAt(ascii >> 2));
                    break;
                //第二个6位 = 第一个8位的后两位 + 第二个8位的前4位
                case 1:
                    result.push(base64hash.charAt((prev & 3) << 4 | (ascii >> 4)));
                    break;
                //第三个6位 = 第二个8位的后4位 + 第三个8位的前2位
                //第4个6位 = 第三个8位的后6位
                case 2:
                    result.push(base64hash.charAt((prev & 0x0f) << 2 | (ascii >> 6)));
                    result.push(base64hash.charAt(ascii & 0x3f));
                    break;
            }

            prev = ascii;
            i++;
        }

        // 循环结束后看mod, 为0 证明需补3个6位，第一个为最后一个8位的最后两位后面补4个0。另外两个6位对应的是异常的“=”；
        // mod为1，证明还需补两个6位，一个是最后一个8位的后4位补两个0，另一个对应异常的“=”
        if (mod == 0) {
            result.push(base64hash.charAt((prev & 3) << 4));
            result.push('==');
        } else if (mod == 1) {
            result.push(base64hash.charAt((prev & 0x0f) << 2));
            result.push('=');
        }

        return result.join('');
    }

    // atob method
    // 逆转encode的思路即可
    function _atob(s) {
        s = s.replace(/\s|=/g, '');
        var cur,
            prev,
            mod,
            i = 0,
            result = [];

        while (i < s.length) {
            cur = base64hash.indexOf(s.charAt(i));
            mod = i % 4;

            switch (mod) {
                case 0:
                    break;
                case 1:
                    result.push(String.fromCharCode(prev << 2 | cur >> 4));
                    break;
                case 2:
                    result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
                    break;
                case 3:
                    result.push(String.fromCharCode((prev & 3) << 6 | cur));
                    break;
            }

            prev = cur;
            i++;
        }

        return result.join('');
    }

    return {
        btoa: _btoa,
        atob: _atob,
        encode: _btoa,
        decode: _atob
    };
}();

if (!window.Base64) {
    window.Base64 = Base64
}
if (!window.btoa) {
    window.btoa = Base64.btoa
}
if (!window.atob) {
    window.atob = Base64.atob
}


/**
 * tips展示与隐藏
 * @param i
 */
function showShareTip(i, classname) {

    if (classname) {
        if ($(classname).css('display') &&
            $(classname).css('display') == 'block') {
            $(classname).hide();
        } else {
            $('.popover').hide();
            $(classname).show();
        }

    } else {

        if ($('.popover' + i).css('display')
            && $('.popover' + i).css('display') == 'block') {

            $('.popover' + i).hide();
        } else {
            $('.popover').hide();
            $('.popover' + i).show();
        }

    }

    $(document).click(function (e) {
        if (e.target.className.match(/share|move|readplan/)) {
            return
        } else {
            $('.share-popover').hide();
            $('.move-popover').hide();
            $('.readplan-popover').hide();
        }
    });

    $(window).scroll(function () {
        $('.share-popover').hide();
        $('.move-popover').hide();
        $('.readplan-popover').hide();
    });
}


/**
 * 复制操作
 * @param length 需要点击复制的元素个数
 * @param copyElement 需要复制的内容元素id
 * @param type 复制元素内容类型
 * @param btnElement 点击复制元素id
 */
function copy(length, copyElement, type, btnElement) {
    var copyInfo;
    for (var i = 0, _i = length; i < _i; i++) {
        if (type == 'text') {
            copyInfo = $(copyElement + i).text();
        } else if (type == 'value') {
            copyInfo = $(copyElement + i).val();
        }
        if (btnElement) {
            $(btnElement + i).zclip({
                path: './js/ZeroClipboard.swf',
                copy: copyInfo
            });
        } else {
            $('#copy-button' + i).zclip({
                path: './js/ZeroClipboard.swf',
                copy: copyInfo
            });
        }

    }
}

/**
 * 获取登录iframe返回的数据
 * @param callback
 */
function getIframeInfo(callback) {
    if (window.addEventListener) {
        window.addEventListener('message', receiveMessage, false);
    }
    else { // IE8 or earlier
        window.attachEvent('onmessage', receiveMessage, false);
    }


    function receiveMessage(evt) {
        try {
            var data = JSON.parse(evt.data);
        } catch (e) {
            var data = {};
        }
        if (data.code === 0) {
            localStorage.token = data.value.token; //保存登录后的token
            localStorage.userData = JSON.stringify(data.value.user);
            callback(data);
        } else {
            showMessage(data.message);
        }
    }
}

/**
 * 点击header上不同项时，背景变化
 * @param id
 */
function headerHover(id) {
    $('.nav-li').attr('class', 'nav-li');

    if(id) {
        $(id).attr('class', 'current-Nav nav-li');
    }
}


function smallHeaderHover(id) {
    $('.small-nav-li').attr('class', 'small-nav-li');

    if(id) {
        $(id).attr('class', 'current-small-nav small-nav-li');
    }
}

/**
 * 移除popover
 */
function removePopover() {
    $('.popover').hide();
}


/**
 * 手机端header右移动效果
 */
function smallHeaderMoveToRight() {
    var $main = $('.main'),
        $mainDiv = $('.main-div'),
        $smallHeaderList = $('.small-header-list'),
        $smallHeaderListDiv = $('.small-header-list-div'),
         $body = $('body');

    $main.attr('style', 'overflow:hidden;');
    $smallHeaderListDiv.show();
    $mainDiv.css('position','absolute');
    $mainDiv.animate({
            'left': '80%'
        },200,function(){
        $mainDiv.css({
            'height': $smallHeaderList.height()+'px',
            'overflow': 'hidden',
            'width': '20%',
            'position': 'absolute'
        });

        $body.css({
            'overflow': 'hidden'
        });
    });

};

/**
 * 手机端header左移动效果
 */
function smallHeaderMoveToLeft() {
    var $main = $('.main'),
        $mainDiv = $('.main-div'),
        $smallHeaderListDiv = $('.small-header-list-div'),
        $body = $('body');

    $main.attr('style', '');
    $mainDiv.css('width', '100%')
    $mainDiv.animate({
        'left': '0'
    },200,function(){
        $mainDiv.attr('style','');
        $body.attr('style', '');
        $smallHeaderListDiv.hide();
    });
};





