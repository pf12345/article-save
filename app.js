/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
const session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var config = require('./config');
var swig = require('swig');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var morgan = require('morgan');
require("babel-core/register");

//var sessionStore = new MongoStore({
//    db:config.dbInfo.db
//}, function() {
//    console.log('connect mongodb success...');
//});

var app = express();

app.use(session({
    secret: 'foo',
    store: new MongoStore({ url: 'mongodb://localhost/carSchool' }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

//app.use(favicon());
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(serveStatic(path.join(__dirname, 'public')));

require('./router/router').init(app);

http.createServer(app).listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});
