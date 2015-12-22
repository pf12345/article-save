//初始化
var $ = window.jQuery = require('jQuery');
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var login = require('./components/login');
var LoginBox = login.LoginBox;
ReactDOM.render(
    <LoginBox></LoginBox>
    ,document.getElementById('mainWrap')
);