var  User = require('../node_modules/user');
var  QUESTION = require('../node_modules/questionapi');

/**
 * index page
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    res.render('index', {
        loopIndex : true
    });
};

/**
 * home page
 * @param req
 * @param res
 */
//exports.home = function (req, res) {
//    var qestions = [];
//  QUESTION.getAllRequst(function(err, resInfo) {
//      if(resInfo !== null){
//          qestions = resInfo.value;
//      }
//
//      for(var i= 0,_i=qestions.length;i<_i;i++){
//          qestions[i]._id = JSON.stringify(qestions[i]._id);
//      }
//
//      res.render('home',{
//          loopIndex : true,
//          qestions : qestions
//      });
//  });
//};

/**
 * userInfo page
 * @param req
 * @param res
 */
//exports.userInfo = function(req, res){
//    res.render('userInfo',{
//        loopUsInfo : true
//    });
//};

/**
 * 注册API
 * @param req
 * @param res
 */
//exports.registerApi = function(req, res) {
//    var user = {
//      email : req.body.userName,
//      password : req.body.pwd
//    };
//    User.register(user,res);
//};

/**
 * 登录API
 * @param req
 * @param res
 */
//exports.loginApi = function(req, res) {
//    var user = {
//        email : req.body.userName,
//        password : req.body.pwd
//    };
//    User.login(user,res);
//};
