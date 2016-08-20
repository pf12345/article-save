/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
const session = require('express-session');
//var MongoStore = require('connect-mongo/es5')(session);
var RedisStore = require('connect-redis')(session);
var config = require('./config');
var swig = require('swig');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var mps = require("multi-process-session");
var compression = require('compression');

var app = express();
//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    next();
});
app.use(cookieParser());
app.use(mps());
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({cache: false});
app.use(compression());

//app.use(favicon());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(serveStatic(path.join(__dirname, 'public')));

//post不需要验证是否登录白名单
var postWhiteList = ['/user/login', '/user/register'];

//用户是否登录验证
var auth = function (req, res, next) {
    if (!req.xhr || postWhiteList.indexOf(req.url) != -1 || req.session.get('userId')) {
        return next();
    } else {
        res.send({
            code: 1,
            message: 'not login'
        })
    }
};

//任何POST访问都经过此 检查登录状态
app.post('*', auth, function (req, resp, next) {
    next()
});

//任何GET访问都经过此 检查登录状态
app.get('*', auth, function (req, resp, next) {
    next()
});

require('./router/router').init(app);

http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});
