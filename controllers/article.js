/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var articleBll = require('../Bll/articleBll');

    exports.router = function(app) {
        /**
         * 文章保存
         */
        app.post('/article/save', function(req, res) {
            var article;
            article = {
                title: req.body.title,
                content: req.body.content,
                created: new Date(),
                user: {
                    userId: req.session.userId,
                    name: req.session.userName,
                    avatar: req.session.userAvatar
                },
                userId: req.session.userId,
                link: req.body.link,
                resNum: 0,
                ansNum: 0,
                score: 0
            };
            return articleBll.save(article, function(err, result) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: err.message
                    });
                } else {
                    return res.send({
                        code: 0,
                        message: 'true',
                        article: result[0]
                    })
                }
            });
        });

        /**
         * 获取文章列表
         */
        app.get('/article/getArticles', function(req, res, next) {
            var userId = req.params.userId || req.session.userId;
            return articleBll.getArticles(userId, function(err, result) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: err.message
                    });
                } else {
                    return res.send({
                        code: 0,
                        message: 'true',
                        article: result
                    })
                }
            });
        });

        /**
         * 获取单个文章
         * @param req
         * @param res
         */
        app.get('/article/single/:id', function(req, res, next) {
            var id = req.params.id;
            console.log(id);
            return articleBll.single(id, function(err, result) {
                console.log(result);
                if(err) {
                    res.send({
                        code: 1,
                        message: err.message
                    });
                }else{
                    res.render("home/article", {
                        article: result
                    });
                }
            })
        });
    }

}).call(this);