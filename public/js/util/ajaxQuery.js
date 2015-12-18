/**
 * Created by Christ on 2015/12/18.
 */
var ajaxQuery = {
    get: function() {

    },
    post: function(url, params, cb) {
        $.ajax({
            type: "POST",
            url: url,
            data: params,
            success: function(msg){
                console.log(msg);
            }
        });
    }
};