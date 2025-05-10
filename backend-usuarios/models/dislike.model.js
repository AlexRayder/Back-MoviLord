// models/dislike.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Video = require('./video.model');

const Dislike = sequelize.define('Dislike', {
  videoId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

Dislike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Dislike, { foreignKey: 'userId', as: 'dislikes' });

Dislike.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Video.hasMany(Dislike, { foreignKey: 'videoId', as: 'dislikes' });

module.exports = Dislike;
