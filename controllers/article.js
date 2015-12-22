/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var articleBll = require('../Bll/articleBll');
    /*
     文章保存
     @param title
     @param content
     */
    exports.save_POST = function(req, res) {
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
    };

    /**
     * 获取文章列表
     * @param req
     * @param res
     */
    exports.getArticles_GET = function(req, res) {
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
    }
}).call(this);