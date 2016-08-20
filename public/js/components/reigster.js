/**
 * Created by Christ on 2015/12/28.
 */
import React, {Component} from 'react';
import {Router, Route, hashHistory} from 'react-router';
import ajaxQuery from '../util/ajaxQuery';
import ListActions from '../actions/ListActions';


class RegisterBox extends Component {
    constructor(props) {
        super(props);
        this._handleChange = this.handleChange.bind(this);
        this._register = this.register.bind(this);
        this._gotoLogin = this.gotoLogin.bind(this);
        this.state = {
            name: '',
            password: '',
            repassword: '',
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
            <div id="registerBox" className={boxClass}>
                <div id="registerCover"></div>
                <form>
                    <p><input type="text" onChange={this._handleChange().name} placeholder="账号"
                              value={this.state.name}/>
                    </p>
                    <p><input type="password" onChange={this._handleChange().password} placeholder="密码"
                              value={this.state.password}/></p>
                    <p><input type="password" onChange={this._handleChange().repassword} placeholder="再次输入"
                              value={this.state.repassword}/></p>
                    <p><span className={waringClass}>{this.state.waringText}</span></p>
                    <p><input onClick={this._register} type="button" value="注册"/></p>
                    <p><a href="javascript:;" onClick={this._gotoLogin} className="lrGoLoginOrRe">已有账号？登录→</a></p>
                </form>
            </div>
        )
    }

    handleChange() {
        let _this = this;
        return {
            name: function (event) {
                _this.setState({name: event.target.value});
            },
            password: function (event) {
                _this.setState({password: event.target.value});
            },
            repassword: function (event) {
                _this.setState({repassword: event.target.value});
            }
        }
    }

    register() {
        let _this = this;
        if (this.state.name == '') {
            _this.setState({waringClass: 'lrShow', waringText: '账号不能为空'});
            return false;
        }
        if (this.state.password == '' || this.state.repassword == '') {
            _this.setState({waringClass: 'lrShow', waringText: '密码不能为空'});
            return false;
        }
        if (this.state.password != this.state.repassword) {
            _this.setState({waringClass: 'lrShow', waringText: '两次密码不一致'});
            return false;
        }
        var name = this.state.name;
        var password = this.state.password;

        ajaxQuery.post('/user/register', {name: name, password: password}, function (msg) {
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

    gotoLogin() {
        this.setState({remove: true});
        setTimeout(()=> {
            hashHistory.push('/login');
        }, 500);
    }
}

export default RegisterBox
