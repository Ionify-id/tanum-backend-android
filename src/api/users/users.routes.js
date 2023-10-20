const express = require('express');
const { isAuthenticated } = require('../../middleware/middleware');
const { findUserById } = require('./users.services');

const router = express.Router();
// const { upload, uploadToStorage } = require('../../middleware/multer');

router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.status(200).json({
      data: user,
      message: 'Success retrieve your profile',
      status: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
