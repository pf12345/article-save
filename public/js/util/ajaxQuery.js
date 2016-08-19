/**
 * Created by Christ on 2015/12/18.
 */
import $ from 'jquery';

const get = (url, cb)=> {
    $.ajax({
        type: "GET",
        url: url,
        success(msg){
            if (cb && typeof cb == 'function') {
                cb(msg);
            }
        }
    });
};

const post = (url, params, cb) => {
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success(msg){
            if (cb && typeof cb == 'function') {
                cb(msg);
            }
        }
    });
};

const ajaxQuery = {
    get,
    post
};

export default ajaxQuery;
