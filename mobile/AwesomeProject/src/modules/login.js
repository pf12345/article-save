import React, {Component} from 'react';

import {
    Animated,
    View,
    StyleSheet,
    Dimensions,
    TouchableNativeFeedback,
    TextInput,
    Text,
    AsyncStorage
} from 'react-native';

import query from './../fetch';
import List from './list';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: ''
        };
        this._onPressButton = this.onPressButton.bind(this);
    }

    render() {
        return (
            <View style={styles.login}>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({name: text})}
                    value={this.state.name}
                    placeholder="用户名"
                />
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    placeholder="密码"
                    autoCorrect={true}
                />
                <TouchableNativeFeedback
                    onPress={this._onPressButton}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.button}>
                        <Text style={{marginTop: 10, color: '#fff', textAlign: 'center'}}>登录</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }

    onPressButton() {
        let _this = this;
        const {navigator} = this.props;
        query.post('/user/login', {
            name: _this.state.name,
            password: _this.state.password
        }, function (res) {
            if (res.code === 0) {
                AsyncStorage.setItem('user', JSON.stringify({
                    name: res.user.name,
                    _id: res.user.userId
                }));
                if (navigator) {
                    navigator.push({
                        name: 'List',
                        component: List,
                    })
                }
            }
            console.log(res);
        });
    }
}

var styles = StyleSheet.create({
    login: {
        position: 'absolute',
        top: 150,
        left: 30,
        width: 300,
    },
    button: {
        height: 40,
        backgroundColor: '#00B7FF',
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 20,
    }
});
export default Login;