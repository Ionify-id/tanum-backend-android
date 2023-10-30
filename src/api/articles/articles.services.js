const { db } = require('../../utils/db');

async function getArticles(page, take) {
    const skip = take * (page - 1);
    const articles = await db.article.findMany({
        skip,
        take,
        orderBy: {
            updatedAt: 'desc'
        },
        select: {
            title: true,
            thumbnail: true,
        }
    });
    const baseUrl = 'http://103.82.92.104/static/image/uploads/';
    const articlesWithFullThumbnailUrls = articles.map(article => {
        if (article.thumbnail) {
            article.thumbnail = baseUrl + article.thumbnail;
        }
        return article;
    });
    return articlesWithFullThumbnailUrls;
}




async function getSingleArticle(articleId) {
    const article = await db.article.findUnique({
        where: {
            id: articleId,
        },
    });
    const baseUrl = 'http://103.82.92.104/static/image/uploads/';
    if (article && article.thumbnail) {
        article.thumbnail = baseUrl + article.thumbnail;
    }

    return article;
}

module.exports = {
    getArticles,
    getSingleArticle,
};