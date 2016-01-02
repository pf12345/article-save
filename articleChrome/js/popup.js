// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var BaseApiUrl = "http://127.0.0.1:8000";

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
$_id("read_clear").onclick = function(tab) {
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
            code: 'var ArticleSite = "cleanRead";'
        });
        chrome.tabs.executeScript(null, {
            file: "js/clear_read.js"
        });
        addCreateIframeCode(tab);
    }
};

//if (localStorage.articleNum) {
//    if (localStorage.articleNum > 99) {
//        document.getElementById("inote_article_num").innerHTML = "99+";
//        chrome.browserAction.setBadgeText({
//            text: "99+"
//        });
//    } else {
//        document.getElementById("inote_article_num").innerHTML = parseInt(localStorage.articleNum);
//        chrome.browserAction.setBadgeText({
//            text: localStorage.articleNum
//        });
//    }
//}


/**
 * 稍后阅读
 * */
$_id("read_later").onclick = function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        var tablink = tab.url;
        console.log(tablink)
        if (tablink.match(reg_chrome)||tablink.match(reg_app)) {
            chrome.tabs.update(null, {
                url: chrome.extension.getURL("index.html#/contentNull")
            });
            window.close();
        } else {
            if (localStorage.userData && JSON.parse(localStorage.userData).userId) {
                readLaterPost(tablink)
            } else {
                $.ajax({
                    type: "GET",
                    url: BaseApiUrl+'/user/isLogin',
                    dataType: 'json',
                    success: function(msg){
                        if(msg.code == 0) {
                            localStorage.userData = JSON.stringify(msg.user);
                            readLaterPost(tablink)
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
    chrome.tabs.executeScript(null,{
        code:'AppShowMsg("正在添加至收藏......", true);'
    });
    chrome.extension.onRequest.addListener(
        function(request) {
            if (request.greeting == "hello") {
                localStorage.articleContent = request.content;
                localStorage.articleTitle = request.title;
                console.log({
                    content: request.content,
                    title: request.title,
                    link: tablinkvar
                });
                $.ajax({
                    type: "POST",
                    url: BaseApiUrl+'/article/save',
                    dataType: 'json',
                    data: {
                        content: request.content,
                        title: request.title,
                        link: tablinkvar
                    },
                    success: function(res){
                        if(res.code == 0){
                            window.close()
                        }else{
                            var msg = JSON.stringify(res.message);
                            chrome.tabs.executeScript(null,{
                                code:'AppShowMsg('+msg+',true);'
                            })
                            window.close();
                        }
                        console.log(msg);
                    }
                });
                console.log(request);
                //window.close();
            }
        });
    localStorage.site = "cleanRead";
    chrome.tabs.executeScript(null, {
        code: 'var ArticleSite = "cleanRead";'
    });
    chrome.tabs.executeScript(null, {
        file: "js/clear_read.js"
    });
}

