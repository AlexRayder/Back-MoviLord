const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Video = sequelize.define('Video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING
  }
});

// Relación: un usuario puede tener muchos videos
Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });

module.exports = Video;
