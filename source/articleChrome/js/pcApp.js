/**
 * Created by massimo on 14-2-27.
 */
/*---------------start pc app------------------------*/
var gui = require('nw.gui');
var startParameters = gui.App.argv;

if (!startParameters) {
    closeWindow();
} else {
    handleParamArray(startParameters);
}

gui.App.on('open', function (cmdline) {
    var paramArray = cmdline.split(' ').slice(2); //只取后面的参数 去除前面没用的
    handleParamArray(paramArray);
});

function handleParamArray(paramArray) {
    gui.Window.get().show();
    if (paramArray.length >= 4) {
        var key = paramArray[0];
        verifyKey(key);
        var userName = paramArray[1];
        var userID = paramArray[2];
        var token = paramArray[3];
        login(userName, userID, token);
        var word = paramArray[4] || '';
        var type = paramArray[5] || 0;
        if (word) {
            search(word, type);
        }
    }
    else {
        closeWindow();
    }
}

/**
 * 关闭程序
 */
function closeWindow() {
    gui.Window.get().close();
}

/**
 * 登录
 * @param key
 * @param userName
 * @param userID
 * @param token
 */
function login(userName, userID, token) {
    if (localStorage.token && localStorage.userData) {
        var oldToken = localStorage.token;
        var oldID = JSON.parse(localStorage.userData).ID;
        if (userID == oldID && token == oldToken) {
            return;
        }
    }
    localStorage.token = token; //保存登录后的token
    var userData = {
        ID: userID,
        nickName: userName
    };
    localStorage.userData = JSON.stringify(userData);
}

/**
 * 搜索
 * @param key
 * @param searchKeyword
 * @param searchType
 */
function search(searchKeyword, searchType) {
    var word = searchKeyword || '';
    window.location.href = "index.html#/search/" + word;
}

function verifyKey(key) {
    if (key != 'F1EB54E82E2324412FE759A804C99651') {
        closeWindow();
    }
}

/*---------------end pc app------------------------*/