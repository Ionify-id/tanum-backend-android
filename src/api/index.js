const express = require('express');

const auth = require('./auth/auth.routes');
const users = require('./users/users.routes');
const lands =require('./lands/lands.routes');
const activities = require('./activities/activities.router')
const articles = require('./articles/articles.router')
const videos = require('./videos/videos.routes')
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - Connect Succeed',
  });
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/lands',lands);
router.use('/activities', activities);
router.use('/articles', articles);
router.use('/videos',videos);

module.exports = router;
