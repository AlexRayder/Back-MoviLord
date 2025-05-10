const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VideoVisibility = sequelize.define('VideoVisibility', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ej: "Público", "Privado", "No listado", "Programado"
  }
});

module.exports = VideoVisibility;
