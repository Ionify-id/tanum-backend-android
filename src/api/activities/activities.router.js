const express = require('express');
const { isAuthenticated } = require('../../middleware/middleware');
const {
    getLandActivities,
    createActivity,
    getSingleActivity,
    updateActivity,
    deleteActivity,

} = require('./activities.services');
const { getSingleLand, updateLand } = require('../lands/lands.services');

const router = express.Router();

router.get('/:landId', isAuthenticated, async (req, res, next) => {
    try {
        let { page, take } = req.query;
        const landId = parseInt(req.params.landId, 10);
        const { userId } = req;

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

        const activities = await getLandActivities(page, take, landId, userId);
        res.status(200).json({
            data:{
                activities
            },
            meta:{
                code:200,
                message: 'Semua aktivitas Anda telah diambil',
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/detail/:activityId', isAuthenticated, async (req, res, next) => {
    try {
        const activityId = parseInt(req.params.activityId, 10);

        const activity = await getSingleActivity(activityId);
        res.status(200).json({
            data:{
                activity
            },
            meta:{
                code:200,
                message: 'Detail aktivitas telah diambil',
            }
        });
    } catch (err) {
        next(err);
    }
});
router.post('/:landId',isAuthenticated, async (req, res, next) => {
    try {
        const { category, action, cost, dateAction } = req.body;
        const landId = parseInt(req.params.landId, 10); 

        const requiredFields = ['category', 'action', 'cost',  'dateAction'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400);
                throw new Error(`Anda harus memberi ${field} untuk membuat lahan.`);
            }
        }

        const activity = await createActivity(category, action, cost, dateAction, landId);
        res.status(201).json({
            data:activity,
            meta:{
                code:201,
                message: 'Aktivitas Baru telah dibuat',
            }
        })
    } catch (err) {
        next(err);
    }
});

router.patch('/:activityId',isAuthenticated, async(req, res, next) => {
    try {
        const activityId = parseInt(req.params.activityId, 10);
        const { userId } = req.payload;
        const activity = await getSingleActivity(activityId);
        const land = await getSingleLand(activity.landId)
        if (!activity || land.userId !== userId) {
            throw new Error('Anda tidak memiliki ijin memperbarui aktivitas ini.');
        }

        let data = { ...req.body };
        const activityUpdate = await updateActivity(activityId, data);
        res.status(201).json({
            data: activityUpdate,
            meta:{
                code:201,
                message: `Aktivitas dengan id ${activityId} telah diperbarui`,
            }
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:activityId',isAuthenticated, async (req, res, next) => {
    try {
        const activityId = parseInt(req.params.activityId, 10);
        const { userId } = req.payload;
        
        const activityDel = await deleteActivity(activityId, userId);
        res.status(201).json({
            data: activityDel,
            meta:{
                code:201,
                message: `Aktivitas dengan id ${activityId} telah dihapus`,
            }
        })
    } catch (err) {
        next(err);
    }
});
module.exports = router;