//初始化
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import LoginBox from './components/login';
import RegisterBox from './components/reigster';
import List from './components/list';
import ajaxQuery from './util/ajaxQuery';
import ListActions from './actions/ListActions';

ajaxQuery.get('/article/getArticles', function (msg) {
    ListActions.createList(msg.article)
    hashHistory.push('/list');
});

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            ＜IndexRedirect to="/list" />
            <Route path="list" component={List}/>
        </Route>
        <Route path="/login" component={LoginBox}/>
        <Route path="/register" component={RegisterBox}/>
        <Route path="/list" component={List}/>
    </Router>
    , document.getElementById('mainWrap')
);


