const express = require('express');

const request = require('request');
const axios = require('axios');
const auth = require('./auth/auth.routes');
const users = require('./users/users.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - Connect Succeed',
  });
});

router.use('/auth', auth);
router.use('/users', users);

module.exports = router;
