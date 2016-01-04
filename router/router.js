/**
 * Created by pengfeng on 15/12/24.
 */
var user = require('../controllers/user');
var article = require('../controllers/article');
exports.init = function(app) {
    app.get('/',function(req, res, next) {
        res.setHeader("Content-Type", "text/html");
        res.render('home/index', {});
    });
    user.router(app);
    article.router(app);
};