const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize, Role } = require('./models');
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', require('./routes/user.routes'));

// Sincronizar DB y crear roles iniciales sin borrar los datos existentes
sequelize.sync({ alter: true }).then(async () => {
  console.log('DB conectada');

  // Solo crear roles si no existen
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
