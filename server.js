const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware to let your frontend talk to this backend
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Database Connected Successfully!"))
  .catch((err) => console.log("Database Error: ", err));

// Blueprint for an Order
const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  address: String,
  productName: String,
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// The Route to receive the data
app.post('/api/checkout', async (req, res) => {
  try {
    const { customerName, email, address, productName } = req.body;
    
    const newOrder = new Order({
      customerName,
      email,
      address,
      productName
    });

    await newOrder.save();
    res.status(200).json({ message: "Order saved to database!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
