//初始化
import React from 'react';
import ReactDOM from 'react-dom';
import { LoginBox } from './components/login';
import { List } from './components/list';
import ajaxQuery from './util/ajaxQuery';
import TodoStore from './stores/TodoStore';

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


