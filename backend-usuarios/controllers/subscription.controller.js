// controllers/subscription.controller.js
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');


const toggleSubscription = async (req, res) => {
  try {
    const { subscriberId, subscribedToId } = req.body;

    if (subscriberId === subscribedToId) {
      return res.status(400).json({ error: 'No puedes suscribirte a ti mismo.' });
    }

    // Buscar si ya existe la suscripción
    const existing = await Subscription.findOne({
      where: { subscriberId, subscribedToId }
    });

    if (existing) {
      await existing.destroy();
      return res.json({ message: 'Suscripción eliminada.', subscribed: false });
    }

    const subscription = await Subscription.create({ subscriberId, subscribedToId });
    return res.status(201).json({ message: 'Suscripción exitosa.', subscribed: true, subscription });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'Subscribers', attributes: ['id', 'username', 'profileImage'] }]
    });

    res.json(user.Subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'SubscribedTo', attributes: ['id', 'username', 'profileImage'] }]
    });

    res.json(user.SubscribedTo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  toggleSubscription,
  getSubscribers,
  getSubscriptions
};
