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

        const land = await getSingleLand(landId);
        const activities = await getLandActivities(page, take, landId, userId);
        res.status(200).json({
            data:{
                totalCost: land.totalCost,
                profit: land.profit,
                activities
            },
            meta:{
                code:200,
                message: 'All of your activities has been retrieved',
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
                throw new Error(`You must provide a ${field} to create a land.`);
            }
        }

        const activity = await createActivity(category, action, cost, dateAction, landId);
        res.status(201).json({
            data:activity,
            meta:{
                code:201,
                message: 'New Activity has been created',
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
            throw new Error('You are not authorized to update this activity.');
        }

        let data = { ...req.body };
        const activityUpdate = await updateActivity(activityId, data);
        res.status(201).json({
            data: activityUpdate,
            meta:{
                code:201,
                message: `Activity with id ${activityId} has been updated`,
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
                message: `Activity with id ${activityId} has been deleted`,
            }
        })
    } catch (err) {
        next(err);
    }
});
module.exports = router;