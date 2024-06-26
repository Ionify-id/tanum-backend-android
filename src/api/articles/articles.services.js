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
            id: true,
            title: true,
            thumbnail: true,
        }
    });
    const baseUrl = 'https://tanum-dashboard.duckdns.org/static/image/uploads/';
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
    const baseUrl = 'https://tanum-dashboard.duckdns.org/static/image/uploads/';
    if (article && article.thumbnail) {
        article.thumbnail = baseUrl + article.thumbnail;
    }

    return article;
}

module.exports = {
    getArticles,
    getSingleArticle,
};