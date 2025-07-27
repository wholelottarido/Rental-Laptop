const express = require('express');
const { addToCart, getCartItems, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getCartItems)
    .post(protect, addToCart);

router.route('/:laptopId')
    .delete(protect, removeFromCart);

module.exports = router;
