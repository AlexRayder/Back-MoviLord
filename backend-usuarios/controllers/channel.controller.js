// controllers/channel.controller.js
const Channel = require('../models/channel.model');
const Video = require('../models/video.model');
const Like = require('../models/like.model');
const Dislike = require('../models/dislike.model');
const View = require('../models/view.model');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');

const getChannelDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const channel = await Channel.findOne({
            where: { userId },
            include: [{ model: User, as: 'user', attributes: ['username', 'profileImage'] }]
        });

        if (!channel) {
            return res.status(404).json({ error: 'Canal no encontrado' });
        }

        const videos = await Video.findAll({ where: { userId } });
        const videoIds = videos.map(v => v.id);

        const [likes, dislikes, views, subscribers] = await Promise.all([
            Like.count({ where: { videoId: videoIds } }),
            Dislike.count({ where: { videoId: videoIds } }),
            View.count({ where: { videoId: videoIds } }),
            Subscription.count({ where: { subscribedToId: userId } }),
        ]);

        res.status(200).json({
            channel,
            stats: {
                totalVideos: videos.length,
                totalLikes: likes,
                totalDislikes: dislikes,
                totalViews: views,
                totalSubscribers: subscribers,
            },
            videos
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateBanner = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }

    const bannerUrl = `/imgs/${userId}/${req.file.filename}`;

    let channel = await Channel.findOne({ where: { userId } });

    if (!channel) {
      channel = await Channel.create({ userId, bannerUrl });
    } else {
      channel.bannerUrl = bannerUrl;
      await channel.save();
    }

    res.status(200).json({ message: 'Banner actualizado correctamente.', bannerUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { getChannelDetails, updateBanner };

