const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config(); // Cargar variables de entorno

const { sequelize, Role } = require('./models');
const VideoVisibility = require('./models/videoVisibility.model');

// Leer variable de entorno para alterDB
const alterDB = process.env.ALTER_DB === 'true';

// CORS
app.use(cors());

// Middleware para aceptar JSON grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api', require('./routes/user.routes'));
app.use('/api/videos', require('./routes/video.routes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/subscriptions', require('./routes/subscription.routes'));
app.use('/api/channel', require('./routes/channel.routes'));
app.use('/imgs', express.static(path.join(__dirname, 'imgs')));

// Sincronización de base de datos y datos iniciales
sequelize.sync({ alter: alterDB }).then(async () => {
  console.log('DB conectada');

  // Crear roles si no existen
  const roleCount = await Role.count();
  if (roleCount === 0) {
    await Role.bulkCreate([
      { name: 'Admin' },
      { name: 'Normal' }
    ]);
  }

  // Crear visibilidades si no existen
  const visibilityCount = await VideoVisibility.count();
  if (visibilityCount === 0) {
    await VideoVisibility.bulkCreate([
      { name: 'Público' },
      { name: 'Privado' },
      { name: 'No listado' },
      { name: 'Programado' }
    ]);
  }

  // Iniciar servidor
  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
}).catch(err => {
  console.error('Error al conectar la base de datos:', err);
});
