const express = require('express');
const router = express.Router();
const { BranchInventory } = require('../models');

// Get inventory by branch
router.get('/branch/:branchId', async (req, res) => {
  try {
    const inventory = await BranchInventory.find({ branchId: req.params.branchId })
      .populate('productId', 'productName brand quantity')
      .sort({ updatedAt: -1 });
    res.json(inventory || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await BranchInventory.find()
      .populate('branchId', 'branchName branchCode')
      .populate('productId', 'productName brand')
      .sort({ updatedAt: -1 });
    res.json(inventory || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory by product
router.get('/product/:productId', async (req, res) => {
  try {
    const inventory = await BranchInventory.find({ productId: req.params.productId })
      .populate('branchId', 'branchName branchCode location')
      .sort({ branchId: 1 });
    res.json(inventory || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory for specific product in branch
router.get('/branch/:branchId/product/:productId', async (req, res) => {
  try {
    const inventory = await BranchInventory.findOne({
      branchId: req.params.branchId,
      productId: req.params.productId
    })
      .populate('productId')
      .populate('branchId');

    if (!inventory) {
      return res.status(404).json({ error: 'No inventory found' });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get low stock items
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const { branchId, threshold } = req.query;
    const stockThreshold = threshold ? parseInt(threshold) : 10;

    let query = {
      currentQuantity: { $lte: stockThreshold }
    };

    if (branchId) {
      query.branchId = branchId;
    }

    const lowStock = await BranchInventory.find(query)
      .populate('branchId', 'branchName branchCode')
      .populate('productId', 'productName brand')
      .sort({ currentQuantity: 1 });

    res.json(lowStock || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
