/**
 * Created by Christ on 2015/12/22.
 */
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var ajaxQuery = require('../util/ajaxQuery');
var common = require('../util/common').common;

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
                    <div className="memoBox">{this.props.article.user ? this.props.article.user.name : ' '} 采集于 {this.props.article.link}</div>
                </div>
            </li>
        )
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
            todos.push(<ListItem article={articles[key]} />);
        }
        return (
            <div className="contentBox container">
                <ul>{todos}</ul>
            </div>
        );
    }
});

exports.List = List;