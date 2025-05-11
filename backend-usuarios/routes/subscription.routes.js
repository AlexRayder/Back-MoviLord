const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

// Nueva ruta combinada para suscribirse/desuscribirse
router.post('/toggle', subscriptionController.toggleSubscription);

// Rutas existentes para obtener suscriptores y suscripciones
router.get('/subscribers/:userId', subscriptionController.getSubscribers);
router.get('/subscriptions/:userId', subscriptionController.getSubscriptions);

module.exports = router;
