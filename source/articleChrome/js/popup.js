// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//小说连载阅读网站

var sites = {
    qidian:/http\:\/\/read\.qidian\.com\/[A-Za-z]+\/[0-9]+\,[0-9]+\.aspx/,
    readnovel: /http\:\/\/www\.readnovel\.com\/novel\/[0-9]+.*\.html/,
    hongxiu: /http\:\/\/novel\.hongxiu\.com\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
    xxsy: /http\:\/\/(www|read)\.xxsy\.net\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
    xs8:  /http\:\/\/www\.xs8\.cn\/book\/[0-9]+\/[0-9]+\.html/,
    jjycw: /http\:\/\/www\.jjwxc\.net\/.*&.*/,
    sinabook:/http\:\/\/vip\.book\.sina\.com\.cn\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
    hjsm:  /http\:\/\/book\.hjsm\.tom\.com\/[0-9]+\/[a-z]?[0-9]+\.html/,
    mmzh: /http\:\/\/(www|book)(\.mmzh|\.zongheng)\.com\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
    zhulang:  /http\:\/\/book\.zhulang\.com\/[0-9]+\/[0-9]+\.html/,
    seventeenK: /http\:\/\/(www|mm)\.17k\.com\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
    lcread:/http\:\/\/www\.lcread\.com\/[a-z]+\/[0-9]+\/[0-9]+[a-z]+\.html/,
    fmx: /http\:\/\/read\.fmx\.cn\/[a-z]+\/[a-z]+\/[a-z]+(\/[0-9]){6,}\/[0-9]+\/[0-9]+\.html/,
    threeGsc:  /http\:\/\/www\.3gsc\.com\.cn\/[a-z]+\/[0-9]+\_[0-9]+\_[0-9]+/,
    qqbook:/http\:\/\/book\.qq\.com\/.*cid\=[0-9]+.*/,
    rongshuxia: /http\:\/\/www\.rongshuxia\.com\/.*chapterid\-[0-9]+.*/,
    chuangshi: /http\:\/\/chuangshi\.qq\.com\/.*m\-[0-9]+.*/,
    qwsy: /http\:\/\/www\.qwsy\.com.*cid\=[0-9]+/,
    qefeng:/http\:\/\/gg\.qefeng\.com\/showchapter\/[0-9]+\/[0-9]+/,
    tiexue: /http\:\/\/www\.junshishu\.com\/Book[0-9]+\/Content[0-9]+\.html/,
    motie: /http\:\/\/www\.motie\.com\/book\/[0-9]+\_[0-9]+/
};

var BaseApiUrl = "http://127.0.0.1:3000";

var reg_chrome = /undefined|chrome\:\/\/|se\:\/\/extensions\-frame|chrome\.google/i ,//chrome相关页面地址
    reg_app = /chrome\-extension\:\/\//i;//app运行相关页面地址

/**
 * 获取网站地址
 */
var tablink;
chrome.tabs.getSelected(null, function(tab) {
    tablink = tab.url;
    if(!tablink.match(reg_app)){
        localStorage.localsite = tablink;
    }
});

/**
 * 根据id获取元素
 * @param obj
 * @returns {HTMLElement}
 */
function $_id(obj) {
    return document.getElementById(obj);
}


/**
 * 创建iframe代码注入
 * @param tab
 */
 function addCreateIframeCode(tab){
    chrome.tabs.executeScript(null, {
        file: "js/jquery-1.11.0.min.js"
    });
    chrome.tabs.executeScript(null, {
        file: "js/common.js"
    });
    chrome.tabs.executeScript(null, {
        code: "clearAllReminder();createIframe()"
    });
}

/**
 * 纯净阅读
 * */
$_id("inote_read_clear").onclick = function(tab) {
    chrome.tabs.executeScript(null, {
        file: "js/jquery-2.0.3.min.js"
    });
    if (tablink.match(reg_chrome) || tablink.match(reg_app)){
       return false;
    } else {
        /*获取提取内容及标题*/
        chrome.extension.onRequest.addListener(
            function(request) {
                if (request.greeting == "hello") {
                    localStorage.articleContent = request.content;
                    localStorage.articleTitle = request.title;
                    window.close();
                }
            });
        localStorage.site = "cleanRead";
        chrome.tabs.executeScript(null, {
            code: 'var inoteSite = "cleanRead";'
        });
        chrome.tabs.executeScript(null, {
            file: "js/inote_clear_read.js"
        });
        addCreateIframeCode(tab);
    }
};

if (localStorage.articleNum) {
    if (localStorage.articleNum > 99) {
        document.getElementById("inote_article_num").innerHTML = "99+";
        chrome.browserAction.setBadgeText({
            text: "99+"
        });
    } else {
        document.getElementById("inote_article_num").innerHTML = parseInt(localStorage.articleNum);
        chrome.browserAction.setBadgeText({
            text: localStorage.articleNum
        });
    }
}


/**
 * 稍后阅读
 * */
$_id("inote_read_later").onclick = function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        var tablink = tab.url;
        console.log(tablink)
        if (tablink.match(reg_chrome)||tablink.match(reg_app)) {
            chrome.tabs.update(null, {
                url: chrome.extension.getURL("index.html#/contentNull")
            });
            window.close();
        } else {
            if (localStorage.userData && localStorage.token && localStorage.articleNum) {
                console.log('111');
                chrome.tabs.executeScript(null,{
                   code:'inoteAppShowMsg("正在添加至收藏......");'
                });
                readLaterPost(tablink);
            } else {
                $.ajax({
                    type: "GET",
                    url: BaseApiUrl+'/user/isLogin',
                    dataType: 'json',
                    success: function(msg){
                        if(msg.code == 0) {
                            localStorage.userData = JSON.stringify({
                                userId: msg.userId
                            });
                            chrome.tabs.executeScript(null,{
                                code:'inoteAppShowMsg("正在添加至收藏......");'
                            });
                            readLaterPost(tablink);
                        }else{
                            window.open(BaseApiUrl);
                        }
                        console.log(msg);
                    }
                });
            }
        }

    })
}

/**
* 稍后读，ajax过程
*/
function readLaterPost(tablinkvar){
    var scope_user = JSON.parse(localStorage.userData);
    var headers_Authorization = getAuthHeader();
    var token = JSON.stringify(localStorage.token);
    var url = encodeURIComponent(tablinkvar);
    $.ajax({
        type: 'GET',
        url: BaseApiUrl + 'api/Article/SpiderAndPush?url=' + url,
        dataType: 'json',
        headers: {
            Accept: 'application/json'
        },
        beforeSend: function(req) {
            req.setRequestHeader("Authorization", headers_Authorization);
        }
    }).done(function(res) {
            if(res.code == 0){
               chrome.tabs.executeScript(null,{
                   code:'saveBookMarkReminder('+res.value+','+scope_user.ID+','+token+');'
               },function(){
                   window.close()
               })
                localStorage.articleNum = parseInt(localStorage.articleNum) + 1;
                if(localStorage.articleNum>99){
                    chrome.browserAction.setBadgeText({
                        text: "99+"
                    });
                }else{
                    chrome.browserAction.setBadgeText({
                        text: localStorage.articleNum
                    });
                }
            }else{
                var msg = JSON.stringify(res.message);
                chrome.tabs.executeScript(null,{
                    code:'inoteAppShowMsg('+msg+',true);'
                })
                window.close();
            }
        });

    function getAuthHeader() {
        var id = scope_user.ID;
        var token = localStorage.token;
        var encodeData = window.btoa(id + ':' + token);
        return 'Basic ' + encodeData;
    }
}

 var usertoken = localStorage.token;

/**
 * 最近收藏数目点击
 **/
$("#inote_article_num").click(function(event) {
    event.stopPropagation();
    chrome.tabs.create({
        url: chrome.extension.getURL("index.html#/plan")
    });
    window.close();
});



function getSiteState() {
    for (var key in sites) {
        if (sites[key] && tablink.search(sites[key]) != -1) {
            return true;
        }
    }
    return false;
}