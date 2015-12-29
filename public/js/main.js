//初始化
var $ = window.jQuery = require('jQuery');
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var LoginBox = require('./components/login').LoginBox;
var ajaxQuery = require('./util/ajaxQuery');
var List = require('./components/list').List;
var TodoStore = require('./stores/TodoStore');

ajaxQuery.get('/user/isLogin', function(msg) {
    if(msg.code == 1) {
        ReactDOM.render(
            <LoginBox></LoginBox>
            ,document.getElementById('mainWrap')
        );
    }else{
        ajaxQuery.get('/article/getArticles', function(msg) {
            TodoStore.getAll(msg.article);
            ReactDOM.render(
                <List></List>
                ,document.getElementById('mainWrap')
            );
        })
    }
});


