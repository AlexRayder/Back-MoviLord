// models/subscription.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subscriberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subscribedToId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['subscriberId', 'subscribedToId']
    }
  ]
});

// Relaciones
User.belongsToMany(User, {
  as: 'SubscribedTo',
  through: Subscription,
  foreignKey: 'subscriberId',
  otherKey: 'subscribedToId'
});

User.belongsToMany(User, {
  as: 'Subscribers',
  through: Subscription,
  foreignKey: 'subscribedToId',
  otherKey: 'subscriberId'
});

module.exports = Subscription;
