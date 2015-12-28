/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var articleBll = require('../Bll/articleBll');
    var moment = require('moment');

    exports.router = function(app) {
        /**
         * 文章保存
         */
        app.post('/article/save', function(req, res) {
            var article;
            console.log('article 14');
            console.log(req.session);
            article = {
                title: req.body.title,
                content: req.body.content,
                created: moment().format("YYYY-MM-DD HH:mm:ss"),
                user: {
                    userId: req.session.get('userId'),
                    name: req.session.get('userName'),
                    avatar: req.session.get('userAvatar')
                },
                userId: req.session.get('userId'),
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
            var userId = req.params.userId || req.session.get('userId');
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
            return articleBll.single(id, function(err, result) {
                if(err) {
                    res.send({
                        code: 1,
                        message: err.message
                    });
                }else{
                    console.log(result.created.toString())
                    res.render("home/article", {
                        article: result
                    });
                }
            })
        });

        /**
         * 删除单条文章
         */
        app.post('/article/deleteItem', function(req, res, next) {
            var id = req.body.id;
            articleBll.deleteItem(id, function(err, result) {
                if(err) {
                    res.send({
                        code: 1,
                        message: err.message
                    })
                }else{
                    res.send({
                        code: 0,
                        message: 'success'
                    });
                }
            })
        })
    }

}).call(this);