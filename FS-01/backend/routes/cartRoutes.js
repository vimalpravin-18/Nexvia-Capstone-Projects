const express = require('express');
const router = express.Router();
const {
  getCart,
  saveCart,
  clearCart
} = require('../controllers/cartController');

router.get('/', getCart);
router.post('/save', saveCart);
router.delete('/clear', clearCart);

module.exports = router;

