/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var dbArticle;

    dbArticle = require("../Dal/dbArticle");


    /*
     ��������
     */

    exports.save = function(article, cb) {
        return dbArticle.save(article, cb);
    };

    /**
     * ��ȡ�����б�
     * @param userId
     * @param cb
     */
    exports.getArticles = function(userId, cb) {
        return dbArticle.getArticles(userId, cb);
    }

}).call(this);