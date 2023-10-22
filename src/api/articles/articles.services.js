const { db } = require('../../utils/db');

function getArticles(page, take) {
    const skip = take * (page - 1);
    return db.article.findMany({
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
}


function getSingleArticle(articleId){
    return db.article.findUnique({
        where:{
            id: articleId,
        },
    });
}
module.exports = {
    getArticles,
    getSingleArticle,
};