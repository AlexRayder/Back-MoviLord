const Video = require('../models/video.model');
const User = require('../models/user.model');
const VideoVisibility = require('../models/videoVisibility.model');
const Like = require('../models/like.model');
const Dislike = require('../models/dislike.model');
const Comment = require('../models/comment.model');
const View = require('../models/view.model');
const Subscription = require('../models/subscription.model');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Subir video
const uploadVideo = async (req, res) => {
  try {
    const { title, userId, visibility } = req.body;

    if (!req.files || !req.files.video) {
      return res.status(400).json({ error: 'No se subió ningún archivo de video.' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    const videoUrl = `/uploads/videos/${videoFile.filename}`;
    let thumbnailUrl;

    if (thumbnailFile) {
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFile.filename}`;
    } else {
      const videoPath = path.join(__dirname, '..', 'uploads', 'videos', videoFile.filename);
      const generatedThumbnail = path.join(__dirname, '..', 'uploads', 'thumbnails', `${videoFile.filename}.png`);

      fs.mkdirSync(path.dirname(generatedThumbnail), { recursive: true });

      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .on('end', resolve)
          .on('error', reject)
          .screenshots({
            count: 1,
            folder: path.dirname(generatedThumbnail),
            filename: path.basename(generatedThumbnail),
          });
      });

      thumbnailUrl = `/uploads/thumbnails/${videoFile.filename}.png`;
    }

    const visibilityRecord = await VideoVisibility.findOne({ where: { name: visibility } });
    if (!visibilityRecord) {
      return res.status(400).json({ error: 'La visibilidad proporcionada no es válida.' });
    }

    const video = await Video.create({
      title,
      videoUrl,
      thumbnailUrl,
      userId,
      visibilityId: visibilityRecord.id
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Error al subir video:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los videos
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'profileImage'] },
        { model: VideoVisibility, as: 'visibility', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const video = await Video.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'profileImage'] },
        { model: VideoVisibility, as: 'visibility', attributes: ['name'] },
        {
          model: Comment,
          as: 'comments',
          include: [
            { model: User, as: 'user', attributes: ['username', 'profileImage'] }
          ]
        },
        { model: View, as: 'views', attributes: ['id'] }
      ]
    });


    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    // Contar la vista solo si el usuario no la ha registrado antes
    const alreadyViewed = await View.findOne({ where: { videoId: id, userId } });

    if (!alreadyViewed) {
      await View.create({ videoId: id, userId });

      // Si estás usando un campo de contador en el modelo (opcional)
      if (typeof video.views === 'number') {
        video.views += 1;
        await video.save();
      }
    }

    // Contar total de vistas
    const totalViews = await View.count({ where: { videoId: id } });


    // Likes y dislikes
    const likeCount = await Like.count({ where: { videoId: video.id } });
    const dislikeCount = await Dislike.count({ where: { videoId: video.id } });

    const userLiked = await Like.findOne({ where: { videoId: video.id, userId } });
    const userDisliked = await Dislike.findOne({ where: { videoId: video.id, userId } });

    const totalSubscribers = await Subscription.count({ where: { subscribedToId: video.user.id } });


    video.dataValues.likes = likeCount;
    video.dataValues.dislikes = dislikeCount;
    video.dataValues.userLiked = !!userLiked;
    video.dataValues.userDisliked = !!userDisliked;
    video.dataValues.totalSubscribers = totalSubscribers;
    video.dataValues.totalViews = totalViews;

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const getVideosByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscar todos los videos de un usuario
    const videos = await Video.findAll({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'profileImage'] },
        { model: VideoVisibility, as: 'visibility', attributes: ['name'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['username'] }]
        }
      ]
    });

    // Agregar likes, dislikes y total de suscriptores a cada video
    const videosWithCounts = await Promise.all(
      videos.map(async (video) => {
        const likes = await Like.count({ where: { videoId: video.id } });
        const dislikes = await Dislike.count({ where: { videoId: video.id } });
        const totalSubscribers = await Subscription.count({ where: { subscribedToId: video.user.id } });
        const totalViews = await View.count({ where: { videoId: video.id } }); // Aquí corregido

        // Agregar los contadores a los datos del video
        video.dataValues.likes = likes;
        video.dataValues.dislikes = dislikes;
        video.dataValues.totalSubscribers = totalSubscribers;
        video.dataValues.totalViews = totalViews;

        // Devolver el video con sus contadores
        return video.toJSON();
      })
    );

    res.status(200).json(videosWithCounts);
  } catch (err) {
    console.error('Error en getVideosByUser:', err);
    res.status(500).json({ error: err.message });
  }
};



// Agregar like
const addLike = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const existingLike = await Like.findOne({ where: { userId, videoId } });
    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ liked: false, message: 'Like eliminado' });
    }

    // Si tenía dislike, lo eliminamos
    await Dislike.destroy({ where: { userId, videoId } });

    const like = await Like.create({ userId, videoId });
    res.status(201).json({ liked: true, like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar dislike
const addDislike = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const existingDislike = await Dislike.findOne({ where: { userId, videoId } });

    if (existingDislike) {
      await existingDislike.destroy();
      return res.status(200).json({ disliked: false, message: 'Dislike eliminado' });
    }

    // Si tenía like, lo eliminamos
    await Like.destroy({ where: { userId, videoId } });

    const dislike = await Dislike.create({ userId, videoId });
    return res.status(201).json({ disliked: true, dislike });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Agregar comentario
const addComment = async (req, res) => {
  try {
    const { userId, videoId, content } = req.body;

    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const comment = await Comment.create({ userId, videoId, content });

    // Asignamos manualmente los datos del usuario al comentario (como haría un include)
    const commentWithUser = {
      ...comment.toJSON(),
      user: {
        username: user.username,
        profileImage: user.profileImage,
      }
    };

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar vista
const addView = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const existingView = await View.findOne({ where: { userId, videoId } });
    if (existingView) {
      return res.status(400).json({ error: 'Ya has visto este video' });
    }

    const view = await View.create({ userId, videoId });
    res.status(201).json(view);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadVideo, getAllVideos, getVideoById, getVideosByUser, addLike, addDislike, addComment, addView };
