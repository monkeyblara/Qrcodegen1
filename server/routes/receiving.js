const express = require('express');
const router = express.Router();
const { ProductReceiving, BranchInventory, Product } = require('../models');

// Create product receiving record
router.post('/', async (req, res) => {
  try {
    const { productId, branchId, serialNumber, quantityReceived, supplierName, receivedBy, notes, receiveDate } = req.body;

    if (!productId || !branchId || !serialNumber || !quantityReceived || !supplierName || !receivedBy) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const receiptNumber = 'REC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const receiving = new ProductReceiving({
      receiptNumber,
      productId,
      branchId,
      serialNumber,
      quantityReceived,
      supplierName,
      receivedBy,
      notes,
      receiveDate: receiveDate || new Date()
    });

    await receiving.save();

    // Update branch inventory
    let inventory = await BranchInventory.findOne({
      branchId,
      productId,
      serialNumber
    });

    if (inventory) {
      inventory.quantityReceived += quantityReceived;
      inventory.currentQuantity = inventory.quantityReceived - inventory.quantityTransferred - inventory.quantitySold;
      inventory.lastRestockDate = new Date();
    } else {
      inventory = new BranchInventory({
        branchId,
        productId,
        serialNumber,
        quantityReceived,
        currentQuantity: quantityReceived,
        lastRestockDate: new Date()
      });
    }

    await inventory.save();

    res.status(201).json({ receiving, inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all receiving records
router.get('/', async (req, res) => {
  try {
    const receiving = await ProductReceiving.find()
      .populate('productId', 'productName brand')
      .populate('branchId', 'branchName branchCode')
      .sort({ receiveDate: -1 });
    res.json(receiving || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get receiving records by branch
router.get('/branch/:branchId', async (req, res) => {
  try {
    const receiving = await ProductReceiving.find({ branchId: req.params.branchId })
      .populate('productId', 'productName brand')
      .sort({ receiveDate: -1 });
    res.json(receiving || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get receiving record by ID
router.get('/detail/:id', async (req, res) => {
  try {
    const receiving = await ProductReceiving.findById(req.params.id)
      .populate('productId')
      .populate('branchId');
    if (!receiving) {
      return res.status(404).json({ error: 'Receiving record not found' });
    }
    res.json(receiving);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
