import {View, AsyncStorage} from 'react-native';
import React from 'react';

import Spinner from 'react-native-loading-spinner-overlay';

import Login from './login';
import guidePage from './guidepage';
import List from './list';

import store from './../store/store';
import query from './../fetch';

class start extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        this.setState({
            visible: true
        });
        let _this = this;
        const {navigator} = this.props;
        AsyncStorage.getItem('firstRunApp', function (err, res) {
            _this.setState({
                visible: false
            });
            if (!res) {
                AsyncStorage.setItem('firstRunApp', 'true');
                if (navigator) {
                    navigator.push({
                        name: 'guidePage',
                        component: guidePage,
                    })
                }
            } else {
                query.get('/user/isLogin', function (responseData) {
                    // 注意，这里使用了this关键字，为了保证this在调用时仍然指向当前组件，我们需要对其进行“绑定”操作
                    if (responseData.code === 0) {
                        AsyncStorage.setItem('user', JSON.stringify({
                            name: responseData.user.name,
                            _id: responseData.user.userId
                        }));
                        if (navigator) {
                            navigator.push({
                                name: 'List',
                                component: List,
                            })
                        }
                    } else {
                        if (navigator) {
                            navigator.push({
                                name: 'Login',
                                component: Login,
                            })
                        }
                    }
                });
            }
            store.firstRunApp = true;
        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Spinner overlayColor='#fff' color='#000' size='large' visible={this.state.visible}/>
            </View>
        );
    }
}

export default start;