const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. Saare products dekhne ke liye API (GET)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Naya product add karne ke liye API (POST - Seller ke liye)
router.post('/add', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Ek click mein Demo Products dalne ke liye API (Testing ke liye)
router.get('/seed', async (req, res) => {
  try {
    const sampleProducts = [
      {
        title: "Wireless Bluetooth Headphones",
        description: "Deep bass, 40 hours battery backup aur noise cancellation ke saath.",
        price: 2999,
        discountPrice: 1299,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        stock: 25,
        sellerName: "KK Technofab Store"
      },
      {
        title: "Men's Casual Cotton Shirt",
        description: "100% pure breathable cotton fabric, daily aur office wear ke liye best.",
        price: 1499,
        discountPrice: 599,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"],
        stock: 50,
        sellerName: "Satkar Fashion Hub"
      },
      {
        title: "Smart Fitness Watch Pro",
        description: "Heart rate monitor, step counter aur waterproof design.",
        price: 3999,
        discountPrice: 1799,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
        stock: 15,
        sellerName: "Satkar Official"
      }
    ];

    await Product.insertMany(sampleProducts);
    res.send("3 Demo Products Satkar Database mein successfully add ho gaye hain!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;