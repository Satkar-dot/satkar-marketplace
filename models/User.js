const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { 
    type: String, 
    enum: ['customer', 'seller', 'admin'], 
    default: 'customer' 
  },
  shopName: { type: String, default: "" }, // सिर्फ Seller के लिए
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);