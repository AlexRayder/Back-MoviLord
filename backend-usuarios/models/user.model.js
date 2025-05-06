const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./role.model');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  profileImage: { 
    type: DataTypes.TEXT('long'),
    allowNull: true, 
    validate: {
      isImage(value) {
        if (
          value &&
          !(
            /\.(jpg|jpeg|png|gif)$/i.test(value) ||
            /^data:image\/(png|jpeg|jpg|gif);base64,/.test(value)
          )
        ) {
          throw new Error('Profile image must be a valid image file or base64 image (jpg, jpeg, png, gif)');
        }
      }
    }
  }
  
}, {
  indexes: [
    {
      unique: true,
      fields: ['username', 'email'],
    }
  ]
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = User;
