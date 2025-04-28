const express = require('express');
const cors = require('cors'); // Asegúrate de importar cors
const app = express();
const { sequelize, Role } = require('./models');
require('dotenv').config();

// Habilitar CORS para todas las solicitudes
app.use(cors()); // Esto permite todas las solicitudes desde cualquier origen

// Si solo deseas permitir solicitudes de un dominio específico (como el frontend en `http://localhost:4200`):
/* 
app.use(cors({
  origin: 'http://localhost:4200', // Cambia esta URL según tu frontend
  methods: 'GET,POST,PUT,DELETE',
}));
*/

// Middlewares
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
