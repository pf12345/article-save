import React, {
    Component,
} from 'react';

import {
    AppRegistry,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    RefreshControl,
    WebView
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import store from './../store/store';

import config from './../config';

const height = Dimensions.get('window').height; //full height
const width = Dimensions.get('window').width; //full width

class article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: {
                title: store.curArticle.title,
                created: store.curArticle.created,
                content: '<p><a href="http://jsdf.co">&hearts; nice job!</a></p>',
                user: store.curArticle.user,
                url: config.domain + '/article/single/' + store.curArticle._id
            },
            visible: true,
            isRefreshing: false
        };
        this._onRefresh = this.onRefresh.bind(this);
    }

    render() {
        let article = this.state.article;
        return (

            <View style={styles.container}>
                <WebView
                    ref='webview'
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: article.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    startInLoadingState={true}
                />
                <Spinner overlayColor='#fff' color='#000' size='large' visible={this.state.visible}/>
            </View>
        )
    }

    componentDidMount() {
        this.setState({
            visible: false
        });
    }

    onRefresh() {

    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        minHeight: height,
        minWidth: width
    },
    webView: {
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
});

export default article;