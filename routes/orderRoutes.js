const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. Naya order place karne ke liye API (POST)
router.post('/create', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order successfully place ho gaya!", order: savedOrder });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Saare orders dekhne ke liye API (GET - Seller/Admin panel ke liye)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;