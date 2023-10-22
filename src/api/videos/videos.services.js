const { db } = require('../../utils/db');

function getVideos(page,take){
    return db.video.findMany({
        skip: take * (page - 1),
        take,
        orderBy:{
            updatedAt: 'desc'
        },
    });
}
module.exports = {
    getVideos
};