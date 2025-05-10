const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const VideoVisibility = require('./videoVisibility.model');

const Video = sequelize.define('Video', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  videoUrl: { type: DataTypes.STRING, allowNull: false },
  thumbnailUrl: { type: DataTypes.STRING },
  scheduledAt: { // solo si es 'Programado'
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Relaciones
Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });

Video.belongsTo(VideoVisibility, { foreignKey: 'visibilityId', as: 'visibility' });
VideoVisibility.hasMany(Video, { foreignKey: 'visibilityId', as: 'videos' });

module.exports = Video;
