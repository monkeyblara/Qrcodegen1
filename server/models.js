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

// Chemicals Schema
const chemicalSchema = new mongoose.Schema({
  serialNumber: { type: String, unique: true, required: true },
  chemicalName: { type: String, required: true },
  manufacturer: { type: String, required: true },
  chemicalType: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, required: true },
  hazardLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  storageLocation: { type: String, required: true },
  expiryDate: { type: String, required: true },
  qrCode: String,
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Schema (Admin only)
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Branch Schema
const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true, unique: true },
  branchCode: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  manager: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Branch Inventory Schema - Track products per branch
const branchInventorySchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  serialNumber: { type: String, required: true },
  quantityReceived: { type: Number, required: true, default: 0 },
  quantityTransferred: { type: Number, required: true, default: 0 },
  quantitySold: { type: Number, required: true, default: 0 },
  currentQuantity: { type: Number, required: true, default: 0 },
  lastRestockDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Receiving Schema
const productReceivingSchema = new mongoose.Schema({
  receiptNumber: { type: String, unique: true, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  serialNumber: { type: String, required: true },
  quantityReceived: { type: Number, required: true },
  supplierName: { type: String, required: true },
  receivedBy: { type: String, required: true },
  notes: { type: String },
  receiveDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Transfer Schema
const productTransferSchema = new mongoose.Schema({
  transferNumber: { type: String, unique: true, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  fromBranchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  toBranchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  serialNumber: { type: String, required: true },
  quantityTransferred: { type: Number, required: true },
  transferredBy: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-transit', 'received', 'cancelled'], default: 'pending' },
  notes: { type: String },
  transferDate: { type: Date, required: true },
  receivedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Sale Schema
const productSaleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  serialNumber: { type: String, required: true },
  scanCode: { type: String, required: true }, // QR or Barcode
  quantitySold: { type: Number, required: true },
  customerName: { type: String },
  salePrice: { type: Number },
  totalAmount: { type: Number },
  paymentMethod: { type: String, enum: ['cash', 'card', 'transfer', 'cheque'], default: 'cash' },
  soldBy: { type: String, required: true },
  notes: { type: String },
  saleDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const Product = mongoose.model('Product', productSchema);
const SavedPaint = mongoose.model('SavedPaint', savedPaintSchema);
const PaintType = mongoose.model('PaintType', paintTypeSchema);
const Chemical = mongoose.model('Chemical', chemicalSchema);
const User = mongoose.model('User', userSchema);
const Branch = mongoose.model('Branch', branchSchema);
const BranchInventory = mongoose.model('BranchInventory', branchInventorySchema);
const ProductReceiving = mongoose.model('ProductReceiving', productReceivingSchema);
const ProductTransfer = mongoose.model('ProductTransfer', productTransferSchema);
const ProductSale = mongoose.model('ProductSale', productSaleSchema);

module.exports = {
  connectDB,
  Product,
  SavedPaint,
  PaintType,
  Chemical,
  User,
  Branch,
  BranchInventory,
  ProductReceiving,
  ProductTransfer,
  ProductSale
};
