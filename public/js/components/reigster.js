/**
 * Created by Christ on 2015/12/28.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var ajaxQuery = require('../util/ajaxQuery');
var List = require('./list').List;
var LoginBox1 = require('./login').LoginBox;
var TodoStore = require('../stores/TodoStore');

var RegisterBox = React.createClass({
    getInitialState: function () {
        return {name: '', password: '', repassword: '',waringClass: 'lrHide', waringText: ''}
    },
    render: function() {
        var waringClass = this.state.waringClass + ' lrWaring';
        return (
            <div id="registerBox" className="lrBox">
                <div id="registerCover"></div>
                <form>
                    <p><input type="text" onChange={this.handleChange().name} placeholder="账号" value={this.state.name}/></p>
                    <p><input type="password" onChange={this.handleChange().password} placeholder="密码" value={this.state.password} /></p>
                    <p><input type="password" onChange={this.handleChange().repassword} placeholder="再次输入" value={this.state.repassword} /></p>
                    <p><span className={waringClass}>{this.state.waringText}</span></p>
                    <p><input onClick={this.register} type="button" value="注册"/></p>
                    <p><a href="/" className="lrGoLoginOrRe">已有账号？登录→</a></p>
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
            },
            repassword: function(event) {
                _this.setState({repassword: event.target.value});
            }
        }
    },
    register: function() {
        var _this = this;
        console.log(this.state.name, this.state.password, this.state.repassword);
        if(this.state.name == '') {
            _this.setState({waringClass: 'lrShow', waringText: '账号不能为空'});
            return false;
        }
        if(this.state.password == '' || this.state.repassword == '') {
            _this.setState({waringClass: 'lrShow', waringText: '密码不能为空'});
            return false;
        }
        if(this.state.password != this.state.repassword) {
            _this.setState({waringClass: 'lrShow', waringText: '两次密码不一致'});
            return false;
        }
        var name = this.state.name;
        var password = this.state.password;

        ajaxQuery.post('/user/register', {name: name, password: password}, function(msg) {
            if(msg.code == 0) {
                ajaxQuery.get('/article/getArticles', function(msg) {
                    _this.setState({waringClass: 'lrHide'});
                    TodoStore.getAll(msg.article);
                    ReactDOM.render(
                        <List></List>
                        ,document.getElementById('mainWrap')
                    );
                })
            }else{
                _this.setState({waringClass: 'lrShow', waringText: msg.message});
            }
            console.log(msg);
        });
    }
});
exports.RegisterBox = RegisterBox;