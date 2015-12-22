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

}).call(this);