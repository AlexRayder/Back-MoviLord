const express = require('express');
const router = express.Router();
const { uploadVideo, getAllVideos, getVideoById } = require('../controllers/video.controller');
const upload = require('../middlewares/multer.config');

router.post('/upload', upload.single('video'), uploadVideo);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);

module.exports = router;
