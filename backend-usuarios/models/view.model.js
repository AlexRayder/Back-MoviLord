// models/view.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Video = require('./video.model');

const View = sequelize.define('View', {
  videoId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

View.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(View, { foreignKey: 'userId', as: 'views' });

View.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Video.hasMany(View, { foreignKey: 'videoId', as: 'views' });

module.exports = View;
