//初始化
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import LoginBox from './components/login';
import RegisterBox from './components/reigster';
import {List} from './components/list';
import ajaxQuery from './util/ajaxQuery';
import TodoStore from './stores/TodoStore';


ajaxQuery.get('/user/isLogin', function (msg) {
    if (msg.code == 1) {
        ReactDOM.render(
            <Router history={hashHistory}>
                <Route path="/login" component={LoginBox}/>
                <Route path="/register" component={RegisterBox}/>
            </Router>
            , document.getElementById('mainWrap')
        );
    } else {
        ajaxQuery.get('/article/getArticles', function (msg) {
            TodoStore.getAll(msg.article);
            ReactDOM.render(
                <Router history={hashHistory}>
                    <Route path="/list" component={List}/>
                </Router>
                , document.getElementById('mainWrap')
            );
        })
    }
});


