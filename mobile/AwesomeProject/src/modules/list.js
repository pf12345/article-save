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
    TouchableHighlight,
    Dimensions,
    RefreshControl
} from 'react-native';

import query from './../fetch';

import common from './../common';

import store from './../store/store';

import article from './article';

const height = Dimensions.get('window').height; //full height
const width = Dimensions.get('window').width; //full width

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
            isRefreshing: false
        };
        // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
        // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
        this.fetchData = this.fetchData.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
        this._onPressButton = this.onPressButton.bind(this);
        this._onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        let _this = this;
        query.get('/article/getArticles', function (responseData) {
            // 注意，这里使用了this关键字，为了保证this在调用时仍然指向当前组件，我们需要对其进行“绑定”操作
            console.log(responseData)
            store.list = responseData.article;
            _this.setState({
                dataSource: _this.state.dataSource.cloneWithRows(responseData.article.reverse()),
                loaded: true,
                isRefreshing: false
            });
        })
    }

    onPressButton(art) {
        store.curArticle = art;
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'Article',
                component: article,
            });
        }
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderMovie}
                    style={styles.listView}
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                />
            </View>

        );
    }

    onRefresh(){
        this.setState({
            isRefreshing: true
        });
        this.fetchData()
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    }

    renderMovie(article) {
        let content = common.replaceHtmlTag(article.content).substring(0, 100);
        let _this = this;
        return (
            <TouchableHighlight onPress={
                ()=> {
                    _this._onPressButton(article)
                }
            }>
                <View style={styles.container}>
                    <View style={styles.rightContainer}>
                        <Text style={styles.title}>{article.title}</Text>
                        <Text style={styles.year}>{content}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#dadada',
        padding: 10,
        borderStyle: 'solid'
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
    },
    year: {
        textAlign: 'left',
        marginBottom: 10,
        color: '#999',
        fontSize: 16
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
    listView: {
        backgroundColor: '#fff',
        minHeight: height,
        minWidth: width
    },
});

export default List;
