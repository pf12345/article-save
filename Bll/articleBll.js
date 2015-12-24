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

    /**
     * 获取单个文章
     * @param Id
     * @param cb
     */
    exports.single = function(Id, cb) {
        return dbArticle.single(Id, cb);
    }

}).call(this);