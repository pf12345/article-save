var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');

var LoginBox = React.createClass({
    render: function() {
        return (
            <div id="loginBox">
                <div id="loginCover"></div>
                <form>
                    <p><input type="text" placeholder="账号"/></p>
                    <p><input type="text" placeholder="密码"/></p>
                    <p><input type="button" value="登录"/></p>
                </form>
            </div>
        )
    }
});

ReactDOM.render(
    <LoginBox></LoginBox>
    ,document.getElementById('mainWrap')
);



