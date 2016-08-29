import React, {
    Component,
} from 'react';

import {
    AppRegistry,
    Image,
    StyleSheet,
    View,
    Dimensions,
    Text,
    AsyncStorage
} from 'react-native';

import Carousel from 'react-native-carousel';
import Login from './login';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class guidePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                name: '',
                password: ''
            }
        };

    }

    render() {
        return (
            <Carousel animate={false} loop={false} indicatorAtBottom={true} indicatorOffset={40}
                      indicatorColor="#00B7FF">
                <View style={styles.container}>
                    <Image
                        source={{uri: 'http://192.168.199.103:8000/images/mobile/guide/g1.jpg'}}
                        style={styles.thumbnail}
                    />
                    {/*<Text style={styles.text}>*/}
                    {/*只需一键,自动收藏*/}
                    {/*</Text>*/}
                </View>
                <View style={styles.container}>
                    <Image
                        source={{uri: 'http://192.168.199.103:8000/images/mobile/guide/g2.jpg'}}
                        style={styles.thumbnail}
                    />
                    {/*<Text style={styles.text}>自动提取,纯净内容</Text>*/}
                </View>
                <View style={styles.container}>
                    <Image
                        source={{uri: 'http://192.168.199.103:8000/images/mobile/guide/g3.jpg'}}
                        style={styles.thumbnail}
                    />
                    <Text style={styles.logintext} onPress={this.login.bind(this)}>登录</Text>
                    {/*<Login name={this.state.login.name} password={this.state.login.password}></Login>*/}
                </View>
            </Carousel>
        );
    }

    login() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'Login',
                component: Login,
            })
        }
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        position: 'relative'
    },
    thumbnail: {
        width: width,
        height: height,
    },
    text: {
        position: 'absolute',
        top: height / 2 - 100,
        left: 100,
        fontSize: 26,
        color: '#00B7FF',
        flexWrap: 'wrap',
    },
    logintext: {
        position: 'absolute',
        fontSize: 20,
        left: width / 2 - 10,
        top: height / 2,
        color: '#00B7FF',
        flexWrap: 'wrap',
    }
});

export default guidePage;