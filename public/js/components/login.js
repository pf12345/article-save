var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var ajaxQuery = require('../util/ajaxQuery');
var List = require('./list').List;
var RegisterBox = require('./reigster').RegisterBox;
var TodoStore = require('../stores/TodoStore');

var LoginBox = React.createClass({
    getInitialState: function () {
        return {name: '', password: '', waringClass: 'lrHide', waringText: ''}
    },
    render: function() {
        var waringClass = this.state.waringClass + ' lrWaring';
        return (
            <div id="loginBox" className="lrBox">
                <div id="loginCover"></div>
                <form>
                    <p><input type="text" onChange={this.handleChange().name} placeholder="账号" value={this.state.name}/></p>
                    <p><input type="password" onChange={this.handleChange().password} placeholder="密码" value={this.state.password} /></p>
                    <p><span className={waringClass}>{this.state.waringText}</span></p>
                    <p><input onClick={this.login} type="button" value="登录"/></p>
                    <p><a onClick={this.gotoRegister} className="lrGoLoginOrRe">没有账号？注册→</a></p>
                </form>
            </div>
        )
    },
    handleChange: function() {
        var _this = this;
        return {
            name: function (event) {
                _this.setState({name: event.target.value});
            },
            password: function(event) {
                _this.setState({password: event.target.value});
            }
        }
    },
    login: function() {
        var _this = this;
        if(this.state.name == '') {
            _this.setState({waringClass: 'lrShow', waringText: '账号不能为空'});
            return false;
        }
        if(this.state.password == '') {
            _this.setState({waringClass: 'lrShow', waringText: '密码不能为空'});
            return false;
        }
        ajaxQuery.post('/user/login', {name: this.state.name, password: this.state.password}, function(msg) {
            if(msg.code == 0) {
                ajaxQuery.get('/article/getArticles', function(msg) {
                    _this.setState({waringClass: 'lrHide'});
                    TodoStore.getAll(msg.article);
                    ReactDOM.render(
                        <List></List>
                        ,document.getElementById('mainWrap')
                    );
                    console.log(msg);
                })
            }else{
                _this.setState({waringClass: 'lrShow', waringText: msg.message});
            }
        });
    },
    gotoRegister: function() {
        ReactDOM.render(
            <RegisterBox></RegisterBox>
            ,document.getElementById('mainWrap')
        );
    }
});

exports.LoginBox = LoginBox;



