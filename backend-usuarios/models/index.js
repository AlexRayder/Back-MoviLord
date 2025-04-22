const sequelize = require('../config/db');
const Role = require('./role.model');
const User = require('./user.model');

module.exports = { sequelize, Role, User };
