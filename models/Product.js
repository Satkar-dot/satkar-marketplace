const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },         // प्रोडक्ट का नाम
  description: { type: String, required: true },   // पूरी जानकारी
  price: { type: Number, required: true },         // असली कीमत (MRP)
  discountPrice: { type: Number, required: true }, // ऑफर कीमत
  category: { type: String, required: true },      // कैटेगरी (जैसे Electronics, Fashion)
  images: [{ type: String }],                      // फोटो के लिंक
  stock: { type: Number, default: 1 },             // कितना स्टॉक बचा है
  sellerName: { type: String, default: "Satkar Official" }, // किस दुकानदार का सामान है
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);