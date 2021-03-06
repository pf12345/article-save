// Generated by CoffeeScript 1.8.0
(function() {
  var ObjectId, dbHelper, mongodb, mongojs;

  dbHelper = require('../helper/dbHelper');

  mongodb = dbHelper.newDb();

  mongojs = require('mongojs');

  ObjectId = mongojs.ObjectId;


  /*
      注册
   */

  exports.register = function(user, cb) {
    return dbHelper.connectDB("userInfo", cb, function(collection) {
      return collection.findOne(user, function(err, doc) {
        if (doc) {
          cb(new Error("已经存在该用户"));
          return mongodb.close();
        } else {
          return collection.insert(user, {
            safe: true
          }, function(err, u) {
            if (err) {
              console.log(err);
              cb(new Error("注册失败"));
            } else {
              cb(null, u);
            }
            return mongodb.close();
          });
        }
      });
    });
  };


  /*
      登录
   */

  exports.login = function(user, cb) {
    return dbHelper.connectDB("userInfo", cb, function(collection) {
      return collection.findOne(user, function(err, doc) {
        mongodb.close();
        if (err) {
          return cb(new Error("登录失败"));
        } else {
          return cb(null, doc);
        }
      });
    });
  };


  /*
  	获取用户信息
   */

  exports.getUserInfo = function(id, cb) {
    return dbHelper.connectDB("userInfo", cb, function(collection) {
      return collection.findOne({
        _id: ObjectId(id)
      }, function(err, user) {
        mongodb.close();
        if (err) {
          return cb(new Error(err));
        } else {
          return cb(null, user);
        }
      });
    });
  };


  /*
      获取所有用户
   */

  exports.getAllUser = function(cb) {
    return dbHelper.connectDB("userInfo", cb, function(collection) {
      return collection.find().limit(10).toArray(function(err, items) {
        mongodb.close();
        if (err) {
          return cb(new Error(err));
        } else {
          return cb(null, items);
        }
      });
    });
  };


  /*
      修改回答问题数量
   */

  exports.changeResNum = function(userId, cb) {
    return dbHelper.connectDB("userInfo", cb, function(collection) {
      return collection.findOne({
        _id: ObjectId(userId)
      }, function(err, user) {
        var resNum;
        if (err) {
          return cb(new Error(err));
        } else {
          resNum = user.resNum;
          resNum++;
          return collection.update({
            _id: ObjectId(userId)
          }, {
            $set: {
              resNum: resNum
            }
          }, function(err) {
            mongodb.close();
            if (err) {
              return cb(new Error(err));
            } else {
              return cb(null, 'ok');
            }
          });
        }
      });
    });
  };


  /*
      修改提出问题数量
   */

  exports.changeAnsNum = function(userId, cb) {
    return dbHelper.connectDB("userInfo", cb, function(collection) {
      return collection.findOne({
        _id: ObjectId(userId)
      }, function(err, user) {
        var ansNum;
        if (err) {
          return cb(new Error(err));
        } else {
          ansNum = user.ansNum;
          ansNum++;
          return collection.update({
            _id: ObjectId(userId)
          }, {
            $set: {
              ansNum: ansNum
            }
          }, function(err) {
            mongodb.close();
            if (err) {
              return cb(new Error(err));
            } else {
              return cb(null, 'ok');
            }
          });
        }
      });
    });
  };

}).call(this);

//# sourceMappingURL=dbUser.js.map
