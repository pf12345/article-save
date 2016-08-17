var BaseApiUrl = "http://localhost:8000";

var reg_chrome = /undefined|chrome\:\/\/|se\:\/\/extensions\-frame|chrome\.google/i,//chrome相关页面地址
    reg_app = /chrome\-extension\:\/\//i;//app运行相关页面地址

/**
 * 获取网站地址
 */
var tablink;
chrome.tabs.getSelected(null, function (tab) {
    tablink = tab.url;
    if (!tablink.match(reg_app)) {
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
 * 稍后阅读
 * */
$_id("read_later").onclick = function (tab) {
    chrome.tabs.getSelected(null, function (tab) {
        var tablink = tab.url;
        console.log(tablink)
        if (tablink.match(reg_chrome) || tablink.match(reg_app)) {
            window.close();
        } else {
            if (localStorage.userData && JSON.parse(localStorage.userData).userId) {
                readLaterPost(tablink)
            } else {
                $.ajax({
                    type: "GET",
                    url: BaseApiUrl + '/user/isLogin',
                    dataType: 'json',
                    success: function (msg) {
                        if (msg.code == 0) {
                            localStorage.userData = JSON.stringify(msg.user);
                            readLaterPost(tablink)
                        } else {
                            window.open(BaseApiUrl);
                        }
                    }
                });
            }
        }

    })
}

/**
 * 稍后读，ajax过程
 */
function readLaterPost(tablinkvar) {
    chrome.tabs.executeScript(null, {
        code: 'AppShowMsg("保存中,请稍候!", true);'
    });
    chrome.extension.onRequest.addListener(function (request) {
        if (request.greeting == "hello") {
            localStorage.articleContent = request.content;
            localStorage.articleTitle = request.title;
            // console.log({
            //     content: request.content,
            //     title: request.title,
            //     link: tablinkvar
            // });
            $.ajax({
                type: "POST",
                url: BaseApiUrl + '/article/save',
                dataType: 'json',
                data: {
                    content: request.content,
                    title: request.title,
                    link: tablinkvar
                },
                success: function (res) {
                    if (res.code == 0) {
                        chrome.tabs.executeScript(null, {
                            code: 'AppShowMsg("保存成功!",true);'
                        });
                        window.close();
                    } else {
                        var msg = JSON.stringify(res.message);
                        chrome.tabs.executeScript(null, {
                            code: 'AppShowMsg(' + msg + ',true);'
                        });
                        window.close();
                    }
                    // console.log(msg);
                }
            });
            // console.log(request);
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

