const express = require('express');
const router = express.Router();
const { Product } = require('../models');

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { productName, brand, paintType, quantity, expiryDate } = req.body;

    if (!productName || !brand || !paintType || !quantity || !expiryDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const serialNumber = 'SN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const product = new Product({
      serialNumber,
      productName,
      brand,
      paintType,
      quantity,
      expiryDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { productName, brand, paintType, quantity, expiryDate } = req.body;

    if (!productName || !brand || !paintType || !quantity || !expiryDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        brand,
        paintType,
        quantity,
        expiryDate,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save QR Code
router.post('/:id/qr', async (req, res) => {
  try {
    const { qrCodeData } = req.body;

    if (!qrCodeData) {
      return res.status(400).json({ error: 'QR code data is required' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { qrCode: qrCodeData },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'QR code saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
