const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Database Connected Successfully!"))
  .catch((err) => console.log("Database Connection Error:", err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send("Satkar Multi-Vendor Marketplace Server & Database Live Hai!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server port " + PORT + " par start ho gaya hai");
});