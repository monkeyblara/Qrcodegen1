const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-paint-system';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Product Schema
const productSchema = new mongoose.Schema({
  serialNumber: { type: String, unique: true, required: true },
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  paintType: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryDate: { type: String, required: true },
  qrCode: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Saved Paints Schema
const savedPaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  paintType: { type: String, required: true },
  quantity: { type: String, required: true },
  color: { type: String, default: '#ffffff' },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Paint Types Schema
const paintTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Product = mongoose.model('Product', productSchema);
const SavedPaint = mongoose.model('SavedPaint', savedPaintSchema);
const PaintType = mongoose.model('PaintType', paintTypeSchema);

module.exports = {
  connectDB,
  Product,
  SavedPaint,
  PaintType
};
