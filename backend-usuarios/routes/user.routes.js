const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, deleteUserById,updateUserById } = require('../controllers/user.controller');
const { login } = require('../controllers/login.controller');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUserById);
router.post('/login', login);
router.put('/users/:id', updateUserById);


module.exports = router;
