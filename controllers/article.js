/**
 * Created by Christ on 2015/12/22.
 */
(function() {
    var articleBll = require('../Bll/articleBll');
    /*
     ÎÄÕÂ±£´æ
     @param title
     @param content
     */
    exports.save_POST = function(req, res) {
        console.log(req.body)
        var article;
        article = {
            title: req.body.title,
            content: req.body.content,
            created: new Date(),
            user: {
                userId: req.session.userId,
                name: req.session.name,
                avatar: req.session.avatar
            },
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
}).call(this);