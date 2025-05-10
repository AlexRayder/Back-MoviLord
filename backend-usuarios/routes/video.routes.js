const express = require('express');
const router = express.Router();
const { uploadVideo, getAllVideos, getVideoById, getVideosByUser, addLike, addDislike, addComment, addView } = require('../controllers/video.controller');
const upload = require('../middlewares/multer.config');

router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), uploadVideo);
router.get('/', getAllVideos);
router.get('/user/:userId', getVideosByUser);
router.get('/:id', getVideoById);

router.post('/like', addLike);
router.post('/dislike', addDislike);
router.post('/comment', addComment);
router.post('/view', addView);

module.exports = router;
