//初始化
var $ = window.jQuery = require('jQuery');
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
import {LoginBox} from './login.js';
ReactDOM.render(
    <LoginBox></LoginBox>
    ,document.getElementById('mainWrap')
);