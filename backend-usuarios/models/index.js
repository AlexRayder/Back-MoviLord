const sequelize = require('../config/db');
const Role = require('./role.model');
const User = require('./user.model');
const Video = require('./video.model');
const Subcription = require('./subscription.model')
const Channel = require('./channel.model')

module.exports = { sequelize, Role, User, Video, Subcription, Channel };
