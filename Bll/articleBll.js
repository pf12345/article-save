/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var dbArticle;

    dbArticle = require("../Dal/dbArticle");


    /*
     ±£´æÎÄÕÂ
     */

    exports.save = function(article, cb) {
        return dbArticle.save(article, cb);
    };

}).call(this);