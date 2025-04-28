const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserByUsername, deleteUserById } = require('../controllers/user.controller');
const { login } = require('../controllers/login.controller');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:username', getUserByUsername);
router.delete('/users/:id', deleteUserById);
router.post('/login', login);


module.exports = router;
