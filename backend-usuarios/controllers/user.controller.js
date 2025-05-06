const { User, Role } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de sal que se van a utilizar para encriptar


const createUser = async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    profileImage
  } = req.body;

  try {
    // Verificar si el username o email ya existen en la base de datos
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      const errors = [];
      if (existingUser.username === username) errors.push('El username ya está registrado.');
      if (existingUser.email === email) errors.push('El correo electrónico ya está registrado.');

      return res.status(400).json({ errors });
    }

    const normalRole = await Role.findOne({ where: { name: 'Normal' } });

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario
    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      profileImage,
      roleId: normalRole.id
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['name'] }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Role, attributes: ['name'] }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    phone,
    profileImage
  } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.profileImage = profileImage;

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





module.exports = { createUser, getUsers, getUserById, deleteUserById, updateUserById };
