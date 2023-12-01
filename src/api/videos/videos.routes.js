const express = require('express');
const { isAuthenticated } = require('../../middleware/middleware');
const {
    getVideos,
} = require('./videos.services');
const router = express.Router();

router.get('/', isAuthenticated, async (req, res, next) => {
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

        const videos = await getVideos(page, take);
        res.status(200).json({
            data: videos,
            meta:{
                code:200,
                message: 'Semua video Anda telah diambil'
            }
        });
    } catch (err) {
        next(err);
    }
})
module.exports = router;