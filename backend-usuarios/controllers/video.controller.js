const Video = require('../models/video.model');
const User = require('../models/user.model');

const uploadVideo = async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo de video.' });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const video = await Video.create({
      title,
      description,
      videoUrl,
      userId // Asocia el video al usuario
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [{ model: User, as: 'user', attributes: ['username', 'profileImage'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['username'] }]
    });

    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadVideo, getAllVideos, getVideoById };
