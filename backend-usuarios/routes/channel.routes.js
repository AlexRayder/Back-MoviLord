const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const upload = require('../middlewares/uploadBanner');

router.get('/channel/:userId', channelController.getChannelDetails);
router.post('/channel/banner/:userId', upload.single('banner'), channelController.updateBanner);

module.exports = router;
