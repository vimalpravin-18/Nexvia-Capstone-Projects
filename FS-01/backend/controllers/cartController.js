const cache = require('../config/redis');
const store = require('../config/store');

const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : (req.headers['x-session-id'] || 'guest');
    const cachedCart = await cache.get(`cart:${userId}`);

    if (cachedCart) {
      return res.json(cachedCart);
    }

    const fallbackCart = store.getCart(userId);
    await cache.set(`cart:${userId}`, fallbackCart);
    res.json(fallbackCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : (req.headers['x-session-id'] || 'guest');
    const items = req.body.items || [];

    await cache.set(`cart:${userId}`, items);
    store.saveCart(userId, items);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : (req.headers['x-session-id'] || 'guest');

    await cache.del(`cart:${userId}`);
    store.clearCart(userId);

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  saveCart,
  clearCart
};
