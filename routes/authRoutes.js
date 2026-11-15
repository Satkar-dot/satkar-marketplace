const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. नया अकाउंट बनाने के लिए API (Signup - Customer या Seller दोनों के लिए)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role, shopName } = req.body;

    // चेक करें कि ईमेल पहले से रजिस्टर तो नहीं है
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Yeh email pehle se registered hai!" });
    }

    // पासवर्ड को सुरक्षित (Hash) करें
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'customer',
      shopName: role === 'seller' ? shopName : ""
    });

    await newUser.save();
    res.status(201).json({ message: "Account successfully ban gaya hai!", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. लॉगिन करने के लिए API (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ya Password galat hai!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ya Password galat hai!" });
    }

    // लॉगिन टोकन बनाएं
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "satkar_secret_key_2026", 
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login Successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;