/**
 * Created by Christ on 2015/12/22.
 */
var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var ajaxQuery = require('../util/ajaxQuery');

var ListItem = React.createClass({
    render: function() {
        return(
            <li class="liBox">
                <div>
                    <div class="titleBox">
                        <a href="javascript:;" target="_blank">
                            {this.props.article.title}
                        </a>
                    </div>
                    <div class="summaryBox">{this.props.article.content}</div>
                    <div class="memoBox">{this.props.article.created} ²É¼¯ÓÚ {this.props.article.link}</div>
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
            todos.push(<TodoItem article={articles[key]} />);
        }
        return (
            <div className="contentBox container">
                <ul>{todos}</ul>
            </div>
        );
    }
});

exports.List = List;