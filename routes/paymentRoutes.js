const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Razorpay Order ID banane ke liye API
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Rupees mein
    const options = {
      amount: Math.round(amount * 100), // Paise mein convert (₹1 = 100 paise)
      currency: 'INR',
      receipt: 'satkar_rcpt_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: 'Razorpay order error: ' + err.message });
  }
});

// 2. Payment Verify karke Database mein Order save karne ke liye API
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const newOrder = new Order({
        ...orderDetails,
        paymentMethod: 'ONLINE',
        paymentStatus: 'Paid',
        razorpayOrderId: razorpay_order_id,
        status: 'Confirmed',
      });
      await newOrder.save();
      return res.status(201).json({ message: 'Payment Verified & Order Confirmed!', order: newOrder });
    } else {
      return res.status(400).json({ message: 'Invalid Payment Signature!' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;