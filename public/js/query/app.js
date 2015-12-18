import {viewUtil} from './../util/viewUtil.js';
var ajaxQuery = viewUtil.ajaxQuery;
var pageNum = 30, cur_page = 0;
var appQuery = {
    list: function(param, cb) {
        var params = {};
        params.serviceName = 'iflow';
        params.functionName = 'getDatas';
        params.user_id = '548d97f5e58a3ad4128b4575';
        params.token = 'd6e9162eb4';
        params.app_id = param.app_id;
        params.type = param.type || 'need2sign';
        params.limit = param.limit || pageNum;
        params.page = param.page || 1;
        params.httpType = 'post';
        ajaxQuery(false, params, function(res) {
            if(cb &&typeof cb == 'function') {
                cb(res);
            }
        })
    }
};
export {appQuery};