require('dotenv').config(); // <-- Asegúrate de tener esto al inicio si no lo tienes

const { User, Role } = require('../models'); // Asegúrate de incluir Role
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY; // <-- Leer del .env

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y password son requeridos' });  // Validar que no falten datos
  }

  try {
    // Buscar al usuario e incluir el rol
    const user = await User.findOne({
      where: { username },
      include: {
        model: Role, // Incluir el modelo Role para obtener el nombre del rol
        attributes: ['name'] // Solo queremos el nombre del rol
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar las contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    // Responder con el token y los datos del usuario
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.Role.name
      }
    });
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };
