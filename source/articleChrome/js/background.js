
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
var reg_chrome = /undefined|chrome\:\/\/|se\:\/\/extensions\-frame|chrome\.google/i , //chrome相关页面地址
    reg_app = /chrome\-extension\:\/\//i;//app运行相关页面地址

/**
* 创建iframe代码注入
* */
function addCreateIframeCode(tab){
    chrome.tabs.executeScript(null, {
        file: "js/jquery-1.11.0.min.js"
    },function(){
        chrome.tabs.executeScript(null, {
            file: "js/common.js"
        },function(){
            chrome.tabs.executeScript(null, {
                code: "clearAllReminder();createIframe()"
            });
        });
    });
}


/**
* 共用点击事件执行函数
* url:特殊页面时需要展示的页面地址 chrome://extensions
* handleFun:正常页面的后续执行函数
* */
function clickCommonUse(url,handleFun){
    chrome.tabs.getSelected(null, function(tab) {
        var tablink = tab.url;
        if(!tablink.match(reg_app)){
            localStorage.localsite = tablink;
        }
        if (tablink.match(reg_chrome)||tablink.match(reg_app)) {
            chrome.tabs.update(null, {
                url: chrome.extension.getURL(url)
            });
        } else {
            handleFun(tablink);
        }
    })
}



/**
 * 关闭iframe及改变收藏数量
 * */

 function receiveMessage(evt) {
    try{
        var data = JSON.parse(evt.data);
    }catch (e){
        var data = evt.data;
    }
        switch (data){
            case 'closeIframe':
                chrome.extension.sendMessage({greeting: "closeIframe"}, function(response) {});
                break;
            case 'articleNumChange':
                chrome.extension.sendMessage({greeting: "articleNumChange"}, function(response) {}); break;
            case 'saveBookLoginSuccess':
             var timer = setTimeout(function(){
                chrome.extension.sendMessage({greeting: "closeIframe",siteVar:'saveBook'}, function(response) {});
                chrome.extension.sendMessage({greeting: "saveBookMarkReminder"}, function(response) {});
                clearTimeout(timer);
             },1000)
                break;
        }
}
window.addEventListener('message', receiveMessage, false);
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({data:"success"});
        switch (request.greeting){
            case 'closeIframe':
                if(request.siteVar){
                    chrome.tabs.executeScript(null, {
                        code: "$('#SaveBookMarkLoginDiv').remove();"
                    });
                }
                chrome.tabs.executeScript(null, {
                    code: "$('#inoteIframe').remove();$('body').attr('style','');$('html').attr('style','');"
                });
                break;
            case 'articleNumChange':
                //setBadgeText();  break;
            case 'saveBookMarkReminder':
                chrome.tabs.getSelected(null, function(tab) {
                    var tablink = tab.url;
                    chrome.tabs.executeScript(null,{
                        code:'inoteAppShowMsg("正在添加至收藏......");'
                    })
                    readLaterSend(tablink);
                });

                break;
            case 'userInfo':
                localStorage.token = request.token;
                localStorage.userData = request.userData;
        }
    });
/*
* 监控页面新标签创建
* */
try {
    chrome.tabs.onCreated.addListener(function() {
        var timer = setTimeout(function(){
            chrome.tabs.getSelected(null, function(tab) {
                var tablink;
                tablink = tab.url;
                if (tablink == "http://www.xxsy.net/books/353218/4029899.html") {
                    chrome.tabs.executeScript(null, {
                        file: "js/plugin1.js"
                    });
                    chrome.tabs.executeScript(null,{
                        code:'gotoNovelsiteSuccessReminder();'
                    })
                }
            });
            clearTimeout(timer);
        },1000)
    });
} catch (err) {}

/*
 * 未读文章数超过99时
 * 显示99+
 * */
//function setBadgeText(){
//    if(localStorage.articleNum>99){
//        chrome.browserAction.setBadgeText({
//            text: "99+"
//        });
//    }else{
//        chrome.browserAction.setBadgeText({
//            text: localStorage.articleNum
//        });
//    }
//}
