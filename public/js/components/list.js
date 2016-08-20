/**
 * Created by Christ on 2015/12/22.
 */
import React, {Component} from 'react';
import ajaxQuery from '../util/ajaxQuery';
import common from '../util/common';
import ListStore from '../stores/ListStore';
import ListActions from '../actions/ListActions';

class ListItem extends Component {
    constructor(props) {
        super(props);
        this._deleteItem = this.deleteItem.bind(this);
    }

    render() {
        let content = common.replaceHtmlTag(this.props.article.content).substring(0, 150);
        let link = '/article/single/' + this.props.article._id;
        return (
            <li className="liBox" data-id={this.props.article._id}>
                <div>
                    <div className="titleBox">
                        <a href={link} target="_blank">
                            {this.props.article.title}
                        </a>
                    </div>
                    <div className="summaryBox">{content}</div>
                    <div className="memoBox">{this.props.article.user ? this.props.article.user.name : ' '}
                        采集于 {this.props.article.link}
                        <a href="javascript:;" onClick={this._deleteItem}>删除</a></div>
                </div>
            </li>
        )
    }

    deleteItem() {
        let id = this.props.article._id;
        ajaxQuery.post('/article/deleteItem', {id: id}, function (msg) {
            if (msg.code == 0) {
                common.showMsg('删除成功');
                ListActions.destroyItem(id);
            } else {
                common.showMsg('删除失败');
            }
        });
    }
}

function getTodoState() {
    return {
        articles: ListStore.getList()
    };
}

class List extends Component {
    constructor(props) {
        super(props);
        this.state = getTodoState();
        this._onChange = this._onChange.bind(this);
    }

    //在初始化渲染执行之后立刻调用一次
    componentDidMount() {
        ListStore.addChangeListener(this._onChange);
    }

    //在组件从 DOM 中移除的时候立刻被调用
    componentWillUnmount() {
        ListStore.removeChangeListener(this._onChange);
    }

    render() {
        if (Object.keys(this.state.articles).length < 1) {
            return null;
        }

        let articles = this.state.articles;
        let todos = [];
        for (var key in articles) {
            todos.push(<ListItem key={articles[key]._id} article={articles[key]}/>);
        }
        return (
            <div className="contentBox container">
                <ul>{todos}</ul>
            </div>
        );
    }

    _onChange() {
        this.setState(getTodoState());
    }
}

export default List;
