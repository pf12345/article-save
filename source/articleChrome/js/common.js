/**
 * Created by lovely on 14-1-16.
 */

    var BaseApiUrl = "http://service.ireadhome.com/";  //服务地址
    var inoteSite;


    /**
     * 跳转小说demo页面成功后弹出提示框函数
     */
    function gotoNovelsiteSuccessReminder(){
        var temp_div = document.createElement("div");
        var imgURL = chrome.extension.getURL("image/icons/icon1.png");
        temp_div.id="inote_cj_mc_div";
        temp_div.className = 'iNoteAppClass'
        temp_div.setAttribute("style","height:100%;width:100%;background:#000;position:fixed;top:0;left:0;z-index:100001;opacity:0.8");

        var content_div2 = document.createElement("div");
        content_div2.id="inote_cj_content_div2";
        content_div2.className="inote_cj_content_div iNoteAppClass";
        content_div2.innerHTML='<div id="inote_cj_header" class="inote_cj_header">' +
            '<h2>提示</h2>' +
            '</div>'+
            '<div class="inote_cj_content2">' +
            '<p style="margin-top: 40px"><span for="">你现在已经来到小说中文网的页面。</span></p>'+
            '<p><span for="">点击下面的“开始”按钮即可开始阅读。</span></p>'+
            '<p><span>以后，当你阅读小说时，直接点击iNote菜单中的“小说连载阅读”即可。</span></p>'+
            '<p style="text-align: center"><input id="inote_cj_close" type="button" value="开始"/></p>';

        document.body.appendChild(temp_div);
        document.body.appendChild(content_div2);

        $("#inote_cj_close").attr('style','background:url('+imgURL+') no-repeat');

        $("#inote_cj_content_div2").animate({
            opacity:1
        });

        /**
         * 示例小说页面弹出框关闭
         */
        $("#inote_cj_close").click(function(){
            $("#inote_cj_content_div2").animate({
                opacity:0
            },function(){
                document.body.removeChild($("#inote_cj_mc_div")[0]);
                document.body.removeChild($("#inote_cj_content_div2")[0]);
            });
        });
    }


    /**
     * 稍后读书签保存提示框
     * @param ID 文章ID
     * @param scope_user 用户ID
     * @param token 用户token
     */
    function saveBookMarkReminder(ID,scope_user,token){
        if($("#dropDownToolTip")){
            $("#dropDownToolTip").remove();
        }
        if($("#inoteAppShowMsg")){
            $("#inoteAppShowMsg").remove();
        }


        var dropDownToolTip = document.createElement("div");
        var imgURL = chrome.extension.getURL("image/icons/icon1.png");
        var imgURL1 = chrome.extension.getURL("image/icons/icon_3.png");
        dropDownToolTip.id = 'dropDownToolTip';
        dropDownToolTip.className = 'iNoteAppClass';
        dropDownToolTip.innerHTML="<div class='dropDownToolTipcontent'>" +
            "<div class='dropDownToolTipLogo'>" +
            "<img src='http://www.ireadhome.com/Content/Images/Home/iNote_collect.png'>" +
            "</div>" +
            "<div style='float: right;width: 700px;position: relative;min-height: 60px;'>" +
            "<h3 style='position: absolute;top: 14px;left: 120px;' id='saveSuccess'>" +
            ""+
            "保存成功！" +
            "</h3>"+
            "<div id='planChose' style='position: relative;top: 10px;left: 120px;display: none;height: 85px'>" +
            "<input type='text' id='saveBookMarkPostil' placeholder='一句话批注'/>"+
            "<p>"+
            "<label>设置阅读计划</label>" +
            "<label><input type='radio' name='planTime' checked class='saveBookMark_btn_today' value='今天'>今天</label>" +
            "<label><input type='radio' name='planTime' class='saveBookMark_btn_tomorrow' value='明天'>明天</label>" +
            "<label><input class='saveBookMark_btn_later' name='planTime' type='radio' value='以后'>以后</label>"+
            "</p>"+
            "</div>" +
            "<p style='position: absolute;top: 10px;right: 45px;' class='btnGroup'>" +
            "<input type='button' id='setPlan' class='fourFontIcon' style='background-position: -100px -100px !important' value='设置计划'>" +
            "<input type='button' id='savePlan' class='fourFontIcon' style='background-position: -10px -10px;' value='保存计划'>" +
            "<input type='button' id='lookPlan' class='fourFontIcon' value='查看计划'>" +
            "</p>"+
            "</div>" +
            "<p style='clear: both'></p>"+
            "</div>";
        document.body.appendChild(dropDownToolTip);

        $(".fourFontIcon").attr("style","background:url("+imgURL+") no-repeat");
        $("#savePlan").attr("style","background:url("+imgURL1+") no-repeat;display:none");
        $("#lookPlan").attr("style","background:url("+imgURL1+") no-repeat;");

        var articleID = '0'+ID;

        /**
         * 点击设置计划按钮
         */
        $("#setPlan").click(function(){
            $('#saveSuccess').hide();
            $('#planChose').show();
            $("#setPlan").hide();
            $('#savePlan').show();
        });

        /**
         * 点击保存计划按钮
         */
        $("#savePlan").click(function(){
            $("input[name='planTime']").each(function(i){
                if(this.checked){
                    var plan = i+1;
                    send(plan);
                };
            });
        });

        /**
         * 3秒自动关闭阅读计划框
         * @type {number}
         */
        var timer1 = setTimeout(function (){
            $("#dropDownToolTip").hide();
            clearTimeout(timer1);
        },3000);


        $("#dropDownToolTip").mouseenter(function (){
            clearTimeout(timer1);
            clearTimeout(timer);
        });

        var timer;
        $("#dropDownToolTip").mouseleave(function (){
            timer = setTimeout(function (){
                $("#dropDownToolTip").hide();
                clearTimeout(timer);
            },3000);
        });

        /**
         * 查看计划
         */
        $("#lookPlan").click(function (){
            inoteSite = 'readLater';
            clearAllReminder();
            window.open(chrome.extension.getURL("index.html#/plan"));
        });

        /**
         * 保存阅读计划
         * @param value
         */
        function send(value){
            var saveBookMarkPostilValue = encodeURIComponent($("#saveBookMarkPostil").val());
            saveBookMarkPost(articleID,value,saveBookMarkPostilValue,scope_user,token);
        }
    }


    /**
     * 标签发送批注及计划时间
     * @param ID  文章ID
     * @param plan  计划(今天、明天、将来)
     * @param comment (计划信息)
     * @param scope_user (用户ID)
     * @param tokenvar (用户token)
     */
    function saveBookMarkPost(ID,plan,comment,scope_user,tokenvar){
        var headers_Authorization = getAuthHeader();
        var imgURL = chrome.extension.getURL("image/icons/icon1.png");
        $.ajax({
            type: 'GET',
            url: BaseApiUrl + 'api/Article/SetReadPlan/' + ID+'?plan='+plan+'&comment='+comment,
            dataType: 'json',
            headers: {
                Accept: 'application/json'
            },
            beforeSend: function(req) {
                req.setRequestHeader("Authorization", headers_Authorization);
            }
        }).done(function(res){
                if(res.code == 0){
                    $('#saveSuccess').show();
                    $('#planChose').hide();
                    $("#setPlan").hide();
                    $('#savePlan').hide();
                    $("#dropDownToolTip").mouseleave(function (){
                        var timer = setTimeout(function (){
                            $("#dropDownToolTip").hide();
                        },3000)
                    })
                }
                $("#readPlanLook").click(function(){
                    inoteSite = 'readLater';
                    clearAllReminder();
                    window.open(chrome.extension.getURL("index.html#/plan"));
                })
            });


        function getAuthHeader() {
            var id = scope_user;
            var token = tokenvar;
            var encodeData = window.btoa(id + ':' + token);
            return 'Basic ' + encodeData;
        }

    }


    /**
     * 书签保存未登录时，登录界面弹出
     */
    function saveBookMarkReminderLogin(){
        var loginIframe = document.createElement("iframe");
        loginIframe.id = 'loginIframe';
        loginIframe.className = 'iNoteAppClass';
        loginIframe.src = "http://www.ireadhome.com/user/applogin?saveBook";
        document.body.appendChild(loginIframe);
        document.body.setAttribute("style","overflow:hidden");
    }



    /**
     * 提示信息
     * @param msg
     * @param close
     */
    function inoteAppShowMsg(msg,close){
        var imgURL = chrome.extension.getURL("image/icons/twoFontBtn.png");
        $("#dropDownToolTip").remove();//清除已经有的提示
        $("#inoteAppShowMsg").remove();
        var dropDownToolTip = document.createElement("div");
        dropDownToolTip.id = 'inoteAppShowMsg';
        dropDownToolTip.className = 'iNoteAppClass';
        dropDownToolTip.innerHTML="<div class='dropDownToolTipcontent'>" +
            "<h3>" +msg +
            "</h3>"+
            "</div>";
        document.body.appendChild(dropDownToolTip);
        $("#closeSaveBookMarkReminder").attr("style","background:url("+imgURL+") no-repeat");

        if(close){
            setTimeout(function(){
                $("#inoteAppShowMsg").remove();
            },3000)
        }

    }


    /**
     * 非小说网站小说连载提示框
     */
    function isNotReadNovelReminder(){
        var temp_div = document.createElement("div");
        temp_div.id="inote_cj_mc_div";
        temp_div.className = 'iNoteAppClass';

        var content_div = document.createElement("div");
        var imgURL = chrome.extension.getURL("image/icons/icon1.png");
        content_div.id="inote_cj_content_div";
        content_div.className="inote_cj_content_div iNoteAppClass";
        content_div.innerHTML='<div id="inote_cj_header" class="inote_cj_header">' +
            '<h2>提示</h2>' +
            '</div>' +
            '<div class="inote_cj_content">' +
            '<img style="margin: 20px 30px" src="http://file.ireadhome.com/static/inote/readnovel.png">'+
            '<p><label>小说连载阅读，可以自动续章，并且像真书一样翻阅。</label></p>' +
            '<p><label>当前页面不是iNote支持的小说网站页面。</label></p>'+
            '<a id="inote_enter_demo" style="cursor: pointer;background-color: #fff !important">' +
            '<input type="button" class="longBtn" value="去看看演示网页，学会怎么使用">' +
            '</a>' +
            '<a target="_blank" id="inote_cj_supportsite" style="background-color: #fff !important" href="http://www.ireadhome.com/iNote/SupportedSites">' +
            '<input type="button" class="longBtn" value="了解iNote支持的所有小说阅读网站">' +
            '</a>' +
            '<p style="text-align: center;margin-bottom: 40px">' +
            '</p>'
        document.body.appendChild(temp_div);
        document.body.appendChild(content_div);

        $('#inote_cj_mc_div').click(function() {
            isNotReadNovelReminderClose();
        });

        $(".longBtn").attr('style','background:url('+imgURL+') no-repeat;')

        $("#inote_cj_content_div").animate({
            opacity:1
        });

        $("#inote_enter_demo").click(function(){
            isNotReadNovelReminderClose();
            window.open("http://www.xxsy.net/books/353218/4029899.html");
        });

        /**
         * 关闭弹出框
         */
        function isNotReadNovelReminderClose(){
            $("#inote_cj_mc_div").remove();
            $("#inote_cj_content_div").remove();
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
            if(iframeSite == inoteSite) {
                inoteShowMessage("您正在使用此功能哦");
            }else if(inoteSite == 'cleanRead') {
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
        switch (inoteSite){
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

        /**
         * 接收登录消息
         */
        window.addEventListener('message', receiveMessage, false);
        function receiveMessage(evt) {
            var data = JSON.parse(evt.data);
            if (data.code === 0) {
                var token = data.value.token; //保存登录后的token
                var userData = JSON.stringify(data.value.user);
                chrome.extension.sendMessage({greeting: "userInfo",token:token,userData:userData}, function(response) {});
                responseToParent("saveBookLoginSuccess");
            }
        }
    }

    function responseToParent(response) {
        window.parent.postMessage(JSON.stringify(response), '*');
    }

    /**
     * 重新创建登录框
     */
    function reSaveBookMarkLogin(){
        var saveBookMarkLoginDiv = document.createElement("div");
        var oIframe = document.getElementById('inoteIframe');
        saveBookMarkLoginDiv.id = 'SaveBookMarkLoginDiv';
        saveBookMarkLoginDiv.className = 'iNoteAppClass';
        document.body.appendChild(saveBookMarkLoginDiv);
        oIframe.setAttribute("style","min-height:380px !important;min-width:400px !important;top:50% !important;" +
            "left:50% !important;margin-top:-190px;margin-left:-200px;z-index:9999999 !important");
        oIframe.src = 'http://www.ireadhome.com/user/applogin?saveBook';
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
        var closeArr = document.getElementsByClassName("iNoteAppClass");
        for(var i= 0,_i=closeArr.length;i<_i;i++){
            var node = closeArr[i];
            node.parentNode.removeChild(node);
        }
    }




