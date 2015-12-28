/**
 * Created by Christ on 2015/12/22.
 */
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var ajaxQuery = require('../util/ajaxQuery');
var common = require('../util/common').common;
var showMsg = require('../util/common').showMsg;

var ListItem = React.createClass({
    render: function() {
        var content = common.replaceHtmlTag(this.props.article.content).substring(0, 150);
        var link = '/article/single/' + this.props.article._id;
        return(
            <li className="liBox" data-id={this.props.article._id}>
                <div>
                    <div className="titleBox">
                        <a href={link} target="_blank">
                            {this.props.article.title}
                        </a>
                    </div>
                    <div className="summaryBox">{content}</div>
                    <div className="memoBox">{this.props.article.user ? this.props.article.user.name : ' '} 采集于 {this.props.article.link}
                        <a href="javascript:;" onClick={this.deleteItem}>删除</a></div>
                </div>
            </li>
        )
    },
    deleteItem: function() {
        var id = this.props.article._id;
        var _this = this;
        ajaxQuery.post('/article/deleteItem', {id: id}, function(msg) {
            if(msg.code == 0) {
                common.showMsg('删除成功');
                ajaxQuery.get('/article/getArticles', function(msg) {
                    _this.setState({waringClass: 'lrHide'});
                    ReactDOM.render(
                        <List articles={msg.article}></List>
                        ,document.getElementById('mainWrap')
                    );
                    console.log(msg);
                })
            }else{
                common.showMsg('删除失败');
            }
        });

    }
});

var List = React.createClass({
    render: function() {
        if (Object.keys(this.props.articles).length < 1) {
            return null;
        }

        var articles = this.props.articles;
        var todos = [];

        for (var key in articles) {
            todos.push(<ListItem key={articles[key]._id}  article={articles[key]} />);
        }
        return (
            <div className="contentBox container">
                <ul>{todos}</ul>
            </div>
        );
    }
});

exports.List = List;