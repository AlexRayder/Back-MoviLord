// models/like.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Video = require('./video.model');

const Like = sequelize.define('Like', {
  videoId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });

Like.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Video.hasMany(Like, { foreignKey: 'videoId', as: 'likes' });

module.exports = Like;
