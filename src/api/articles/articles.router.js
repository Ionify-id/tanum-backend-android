const express = require('express');
const { isAuthenticated } = require('../../middleware/middleware');
const {
    getArticles,
    getSingleArticle,
} = require('./articles.services')

const router = express.Router();

router.get('/',isAuthenticated, async (req, res, next) => {
    try {
        let { page, take } = req.query;
        if (!page) {
            page = 1;
        } else {
            page = parseInt(page, 10);
        }
        if (!take) {
            take = 5;
        } else {
            take = parseInt(take, 10);
        }

        const articles = await getArticles(page, take);
        res.status(200).json({
            data: articles,
            meta:{
                code:200,
                message: 'Semua artikel Anda telah diambil',
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:articleId', isAuthenticated, async (req, res, next) => {
    try {
        const articleId = parseInt(req.params.articleId, 10);

        const article = await getSingleArticle(articleId);
        res.status(200).json({
            data:article,
            meta:{
                code:200,
                message: 'Semua artikel Anda telah diambil'
            }
        });
    } catch (err) {
        next(err);
    }
});
module.exports = router;