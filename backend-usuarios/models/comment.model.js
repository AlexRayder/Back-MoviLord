// models/comment.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Video = require('./video.model');

const Comment = sequelize.define('Comment', {
  videoId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

Comment.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Video.hasMany(Comment, { foreignKey: 'videoId', as: 'comments' });

module.exports = Comment;
