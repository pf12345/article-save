//初始化
var $ = window.jQuery = require('jQuery');
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
import {UserInfo} from './components/login.js';
ReactDOM.render(
    <UserInfo></UserInfo>
    ,document.getElementById('mainWrap')
);