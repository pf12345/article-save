/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var dbArticle;

    dbArticle = require("../Dal/dbArticle");


    /*
     保存文章
     */

    exports.save = function(article, cb) {
        return dbArticle.save(article, cb);
    };

    /**
     * 获取文章列表
     * @param userId
     * @param cb
     */
    exports.getArticles = function(userId, cb) {
        return dbArticle.getArticles(userId, cb);
    }

}).call(this);