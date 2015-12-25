/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var ObjectId, dbHelper, mongodb, mongojs;

    dbHelper = require('../helper/dbHelper');

    mongodb = dbHelper.newDb();

    mongojs = require('mongojs');

    ObjectId = mongojs.ObjectId;


    /*
     ��������
     */

    exports.save = function(article, cb) {
        return dbHelper.connectDB("article", cb, function(collection) {
            return collection.findOne(article, function(err, doc) {
                if (doc) {
                    cb(new Error("�Ѿ����ڸ�����"));
                    return mongodb.close();
                } else {
                    return collection.insert(article, {
                        safe: true
                    }, function(err, u) {
                        if (err) {
                            cb(new Error("���±���ʧ��"));
                        } else {
                            cb(null, u);
                        }
                        return mongodb.close();
                    });
                }
            });
        });
    };

    /**
     * ��ȡ�����б�
     * @param userId
     * @param cb
     */
    exports.getArticles = function(userId, cb) {
        return dbHelper.connectDB("article", cb, function(collection) {
            return collection.find({
                "user.userId": userId
            }).toArray(function(err, items) {
                mongodb.close();
                if (err) {
                    return cb(new Error(err));
                } else {
                    return cb(null, items);
                }
            });
        });
    };

    /**
     * 获取单个文章
      * @param Id
     * @param cb
     */
    exports.single = function(Id, cb) {
        return dbHelper.connectDB("article", cb, function(collection) {
            return collection.findOne({
                _id: ObjectId(Id)
            }, function(err, item) {
                mongodb.close();
                if (err) {
                    return cb(new Error(err));
                } else {
                    return cb(null, item);
                }
            });
        });
    }

}).call(this);