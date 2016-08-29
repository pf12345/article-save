/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import {
    AppRegistry,
    Navigator,
    View
} from 'react-native';

import React, {
    Component,
} from 'react';


import start from './src/modules/start';
import common from './src/common';

class initComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let defaultName = 'WelcomeScreen';
        let defaultComponent = start;

        return (
            <Navigator
                initialRoute={{name: defaultName, component: defaultComponent}}
                configureScene={(route) => {
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    common.backAndroid(navigator);
                    return <Component {...route.params} navigator={navigator}/>
                }}/>

        );
    }
}


AppRegistry.registerComponent('AwesomeProject', () => initComponent);




