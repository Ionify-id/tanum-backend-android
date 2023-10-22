const express = require('express');
const { isAuthenticated } = require('../../middleware/middleware');
const {
    getMyLand,
    createLand,
    getSingleLand,
    updateLand,
    deleteLand,


} = require('./lands.services')

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
      const { userId } = req;
      const land = await getMyLand(page, take, userId);
      res.status(200).json({
        data: land,
        meta:{
            code:200,
            message: 'All of your land has been retrieved',
        }
      });
    } catch (err) {
      next(err);
    }
});

router.post('/', isAuthenticated, async(req, res, next) => {
    try {
        const requiredFields = ['name', 'address', 'ownership', 'area', 'varietas', 'dateStart'];
        const { name, address, ownership, area, varietas, dateStart, totalCost=0, profit=0 } = req.body;
        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400);
                throw new Error(`You must provide a ${field} to create a land.`);
            }
        }
        const { userId } = req.payload;
        const land = await createLand(
            userId, name, address, ownership, area, varietas, dateStart, totalCost, profit
        );
        res.status(201).json({
            data: land,
            meta:{
                code:201,
                message: 'New Land has been created',
            }
        });
    } catch (err) {
        next(err);
    }
});

router.patch('/:landId',isAuthenticated, async (req, res, next) => {
    try {
        const landId = parseInt(req.params.landId,10);
        const { userId } = req.payload;
        const land = await getSingleLand(landId);
        if (!land || land.userId !== userId) {
            throw new Error('You are not authorized to update this land.');
        }

        let data = { ...req.body };

        const landUpdate = await updateLand(landId, data);
        res.status(201).json({
            data: landUpdate,
            meta:{
                code:201,
                message: `Land with id ${landId} has been updated`,
            }
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:landId', isAuthenticated, async (req, res, next) => {
    try {
        const landId = parseInt(req.params.landId, 10);
        const { userId } = req.payload;
        const land = await getSingleLand(landId, userId);
        if (!land || land.userId !== userId) {
            throw new Error('You are not authorized to delete this land.');
        }

        const landDel = await deleteLand(landId);
        res.status(201).json({
            data: landDel,
            meta:{
                code:201,
                message: `Land with id ${landId} has been deleted`
            }
        });
    } catch (err) {
        next(err);
    }
});
module.exports = router;