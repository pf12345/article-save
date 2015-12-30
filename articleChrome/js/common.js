/**
 * Created by lovely on 14-1-16.
 */

    var ArticleSite;

    /**
     * 提示信息
     * @param msg
     * @param close
     */
    function AppShowMsg(msg,close){
        var imgURL = chrome.extension.getURL("image/icons/twoFontBtn.png");
        $("#dropDownToolTip").remove();//清除已经有的提示
        $("#AppShowMsg").remove();
        var dropDownToolTip = document.createElement("div");
        dropDownToolTip.id = 'AppShowMsg';
        dropDownToolTip.className = 'articleAppClass';
        dropDownToolTip.innerHTML="<div class='dropDownToolTipcontent'>" +
            "<h3>" +msg +
            "</h3>"+
            "</div>";
        document.body.appendChild(dropDownToolTip);
        $("#closeSaveBookMarkReminder").attr("style","background:url("+imgURL+") no-repeat");

        if(close){
            setTimeout(function(){
                $("#AppShowMsg").remove();
            },3000)
        }

    }



    /**
     * 创建iframe
     */
    function createIframe(){
        document.getElementsByTagName("html")[0].setAttribute("style","overflow:hidden");

        if(document.getElementById("inoteIframe")){
            var tempIframe = document.getElementById("inoteIframe");
            tempIframe.setAttribute("style",'');
            var iframeSite = $("#inoteIframe").attr('data-inote-site');
            if(iframeSite == ArticleSite) {
                inoteShowMessage("您正在使用此功能哦");
            }else if(ArticleSite == 'cleanRead') {
                inoteShowMessage("请关闭应用后再试");
            }else{
                intoeSiteSwitch(tempIframe);
            }
        }else{
            var tempIframe = document.createElement("iframe");
            tempIframe.id = "inoteIframe";
            tempIframe.scrolling="auto";
            document.body.style.overflow = "hidden";
            document.body.appendChild(tempIframe);
            intoeSiteSwitch(tempIframe);
        }
    }


    /**
     * iframe地址变化
     * @param tempIframe
     */
    function intoeSiteSwitch(tempIframe){
        switch (ArticleSite){
            case "login":
                tempIframe.src = chrome.extension.getURL ("index.html#/login");
                $(tempIframe).attr("data-inote-site","login");break;
            case "cleanRead":
                tempIframe.src = chrome.extension.getURL ("index.html#/article/0");
                $(tempIframe).attr("data-inote-site","cleanRead");break;
            case "mymagazine":
                tempIframe.src = chrome.extension.getURL ("index.html#/user");
                $(tempIframe).attr("data-inote-site","mymagazine");break;
            case "readLater":
                tempIframe.src = chrome.extension.getURL ("index.html#/plan");
                $(tempIframe).attr("data-inote-site","readLater");break;
            case "subscript":
                tempIframe.src = chrome.extension.getURL ("index.html#/subscribe");
                $(tempIframe).attr("data-inote-site","subscript");break;
            case 'contentNull':
                tempIframe.src = chrome.extension.getURL ("index.html#/contentNull");
                $(tempIframe).attr("data-inote-site","contentNull");break;
            case 'saveBookLogin':
                reSaveBookMarkLogin();
                tempIframe.src = 'http://www.ireadhome.com/user/applogin?saveBook';
                $(tempIframe).attr("data-inote-site","saveBookLogin");break;
        }

    }

    function responseToParent(response) {
        window.parent.postMessage(JSON.stringify(response), '*');
    }


    /**
     * 提示框
     * @param string
     */
    function inoteShowMessage(string){
        var tempDiv = document.createElement("div");
        tempDiv.id = 'inoteShowMessage';
        tempDiv.innerHTML='<p>'+string+'</p>';
        document.body.appendChild(tempDiv);
        var timer = setTimeout(function(){
            document.body.removeChild(tempDiv);
            clearTimeout(timer);
        },3000)
    }


    /**
     * 清除所有已有的提示框
     */
    function clearAllReminder(){
        var closeArr = document.getElementsByClassName("articleAppClass");
        for(var i= 0,_i=closeArr.length;i<_i;i++){
            var node = closeArr[i];
            node.parentNode.removeChild(node);
        }
    }




