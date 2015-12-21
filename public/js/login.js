var React = window.React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var ajaxQuery = require('./util/ajaxQuery');

var LoginBox = React.createClass({
    getInitialState: function () {
        return {name: '', password: ''}
    },
    render: function() {
        return (
            <div id="loginBox">
                <div id="loginCover"></div>
                <form>
                    <p><input type="text" onChange={this.handleChange().name} placeholder="账号" value={this.state.name}/></p>
                    <p><input type="text" onChange={this.handleChange().password} placeholder="密码" value={this.props.password} /></p>
                    <p><input onClick={this.login} type="button" value="登录"/></p>
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
        console.log(this.state.name, this.state.password);
        ajaxQuery.post('/user/login', {name: this.state.name, password: this.state.password}, function(msg) {
            console.log(msg);
        });

    },
    register: function() {
        var name = 'pengfeng';
        var password = '123456';
        ajaxQuery.post('/user/register', {name: name, password: password}, function(msg) {
            console.log(msg);
        });
    }
});

ReactDOM.render(
    <LoginBox></LoginBox>
    ,document.getElementById('mainWrap')
);



