const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Video = require('./video.model');

const Channel = sequelize.define('Channel', {
  bannerUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Relaciones
Channel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Channel, { foreignKey: 'userId', as: 'channel' });

Channel.belongsTo(Video, { foreignKey: 'channelId', as: 'videos' });  // Canal tiene muchos videos
Video.hasMany(Channel, { foreignKey: 'channelId', as: 'channel' }); // Video pertenece a Canal


module.exports = Channel;
