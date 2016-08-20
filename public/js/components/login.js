import React, {Component} from 'react';
import {Router, Route, hashHistory} from 'react-router';
import ajaxQuery from '../util/ajaxQuery';
import ListActions from '../actions/ListActions';

class LoginBox extends Component {
    constructor(props) {
        super(props);
        this._handleChange = this.handleChange.bind(this);
        this._login = this.login.bind(this);
        this._gotoRegister = this.gotoRegister.bind(this);
        this._inputKeyDown = this.inputKeyDown.bind(this);
        this.state = {
            name: '',
            password: '',
            waringClass: 'lrHide',
            waringText: '',
            show: false,
            remove: false,
            boxClass: 'lrBox show'
        };
    }

    componentDidMount() {
        let _this = this;
        setTimeout(()=> {
            _this.setState({show: true});
        }, 50);
    }

    render() {
        let waringClass = this.state.waringClass + ' lrWaring';
        let boxClass = 'lrBox';
        if (this.state.remove) {
            boxClass = 'lrBox remove';
        } else if (this.state.show) {
            boxClass = 'lrBox show';
        }
        return (
            <div id="loginBox" className={boxClass}>
                <div id="loginCover"></div>
                <form>
                    <p><input type="text" onKeyDown={this._inputKeyDown} onChange={this._handleChange().name}
                              placeholder="账号" value={this.state.name}/>
                    </p>
                    <p><input type="password" onKeyDown={this._inputKeyDown} onChange={this._handleChange().password}
                              placeholder="密码"
                              value={this.state.password}/></p>
                    <p><span className={waringClass}>{this.state.waringText}</span></p>
                    <p><input onClick={this._login} type="button" value="登录"/></p>
                    <p><a href="javascript:;" onClick={this._gotoRegister} className="lrGoLoginOrRe">没有账号？注册→</a></p>
                </form>
            </div>
        )
    }

    inputKeyDown(event) {
        if (event.keyCode === 13) {
            this._login();
        }
    }

    handleChange() {
        let _this = this;
        return {
            name: function (event) {
                _this.setState({name: event.target.value});
            },
            password: function (event) {
                _this.setState({password: event.target.value});
            }
        }
    }

    login() {
        let _this = this;
        if (this.state.name == '') {
            _this.setState({waringClass: 'lrShow', waringText: '账号不能为空'});
            return false;
        }
        if (this.state.password == '') {
            _this.setState({waringClass: 'lrShow', waringText: '密码不能为空'});
            return false;
        }
        ajaxQuery.post('/user/login', {name: this.state.name, password: this.state.password}, function (msg) {
            if (msg.code == 0) {
                ajaxQuery.get('/article/getArticles', function (msg) {
                    _this.setState({waringClass: 'lrHide'});
                    ListActions.createList(msg.article);
                    hashHistory.push('/list');
                })
            } else {
                _this.setState({waringClass: 'lrShow', waringText: msg.message});
            }
        });
    }

    gotoRegister() {
        this.setState({remove: true});
        setTimeout(()=> {
            hashHistory.push('/register');
        }, 500);
    }
}

export default LoginBox;



