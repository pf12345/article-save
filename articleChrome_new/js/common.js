var ArticleSite, timer1 = null, timer2 = null;

/**
 * 提示信息
 * @param msg
 * @param close
 */
function AppShowMsg(msg, close) {
    if(timer1) {
        clearTimeout(timer1);
    }
    if(timer2) {
        clearTimeout(timer2);
    }
    $("#AppShowMsg").remove();
    var dropDownToolTip = document.createElement("div");
    dropDownToolTip.id = 'AppShowMsg';
    dropDownToolTip.className = 'articleAppClass';
    dropDownToolTip.innerHTML = '<div id="requiredTips"><span>' + msg + '</span></div>';
    document.body.appendChild(dropDownToolTip);
    $('#requiredTips').addClass('show');
    if (close) {
        timer1 = setTimeout(function () {
            $('#requiredTips').removeClass('show');
            timer2 = setTimeout(function () {
                $("#AppShowMsg").remove();
            }, 300)
        }, 3000)
    }

}

