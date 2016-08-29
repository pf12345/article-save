/**
 * Created by pengfeng on 15/12/23.
 */
import {
    BackAndroid
} from 'react-native';

const replaceHtmlTag = (html)=> {
    html = html.replace(/<br\/>/ig, "").replace(/\s/ig, '').replace(/\n/ig, '').replace(/\r/ig, '');
    html = html.replace(/<div><br><\/div>/ig, "");
    html = html.replace(/<br>/ig, "").replace(/<div>/ig, "").replace(/<p(.*?)>/ig, "");
    html = html.replace(/<[^>]*>/ig, '').replace(/&nbsp;/g, " ");
    html = html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x60;/g, "`");
    return html;
};
let HAVE_BIND_BACK_ANDROID = false;
const backAndroid = (navigator) => {
    let handler = () => {
        if (navigator && navigator.getCurrentRoutes().length > 2) {
            navigator.pop();
            return true;
        }
        return false;
    };
    if(!HAVE_BIND_BACK_ANDROID){
        BackAndroid.removeEventListener('hardwareBackPress', handler);
        BackAndroid.addEventListener('hardwareBackPress', handler);
        HAVE_BIND_BACK_ANDROID = true;
    }

};

const common = {
    replaceHtmlTag,
    backAndroid
};

export default common;
