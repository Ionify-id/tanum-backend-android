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
            message: 'Semua Lahan Anda telah diambil',
        }
      });
    } catch (err) {
      next(err);
    }
});

router.get('/:landId', isAuthenticated, async (req, res, next) => {
    try {
      const landId = parseInt(req.params.landId, 10);
      const { userId } = req;
      const land = await getSingleLand(landId);
      if (!land || land.userId !== userId) {
        throw new Error('Anda tidak memiliki ijin untuk mengakses tanah ini.');
      }
      res.status(200).json({
        data: land,
        meta:{
            code:200,
            message: 'Detail tanah telah diambil',
        }
      });
    } catch (err) {
      next(err);
    }
});

router.post('/', isAuthenticated, async(req, res, next) => {
    try {
        const requiredFields = ['name', 'address', 'ownership', 'area', 'varietas', 'dateStart', 'image', 'plant'];
        const { name, address, ownership, area, image, varietas, dateStart, totalCost=0, profit=0, plant } = req.body;
        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400);
                throw new Error(`Anda harus menyediakan ${field} untuk membuat lahan.`);
            }
        }
        const { userId } = req.payload;
        const land = await createLand(
            userId, name, address, ownership, area, varietas, dateStart, totalCost, profit, image, plant
        );
        res.status(201).json({
            data: land,
            meta:{
                code:201,
                message: 'Lahan Baru telah dibuat',
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
            throw new Error('Anda tidak memiliki ijin memperbarui lahan ini.');
        }

        let data = { ...req.body };

        const landUpdate = await updateLand(landId, data);
        res.status(201).json({
            data: landUpdate,
            meta:{
                code:201,
                message: `Lahan dengan id ${landId} telah diperbarui`,
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
            throw new Error('Anda tidak memiliki ijin menghapus tanah ini.');
        }

        const landDel = await deleteLand(landId);
        res.status(201).json({
            data: landDel,
            meta:{
                code:201,
                message: `Lahan dengan id ${landId} telah dihapus`
            }
        });
    } catch (err) {
        next(err);
    }
});
module.exports = router;