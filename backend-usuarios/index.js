const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize, Role } = require('./models');
require('dotenv').config();

// CORS
app.use(cors());

// Middleware con límite aumentado
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api', require('./routes/user.routes'));
app.use('/api/videos', require('./routes/video.routes'));
app.use('/uploads', express.static('uploads'));

// DB Sync y creación de roles
sequelize.sync({ alter: true }).then(async () => {
  console.log('DB conectada');

  const count = await Role.count();
  if (count === 0) {
    await Role.bulkCreate([
      { name: 'Admin' },
      { name: 'Normal' }
    ]);
  }

  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
});
