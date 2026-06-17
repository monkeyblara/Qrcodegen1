const express = require('express');
const router = express.Router();
const { ProductSale, BranchInventory } = require('../models');

// Create product sale (via QR/Barcode scan)
router.post('/', async (req, res) => {
  try {
    const { productId, branchId, serialNumber, scanCode, quantitySold, customerName, salePrice, paymentMethod, soldBy, notes, saleDate } = req.body;

    if (!productId || !branchId || !serialNumber || !scanCode || !quantitySold || !soldBy) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check branch inventory
    const inventory = await BranchInventory.findOne({
      branchId,
      productId,
      serialNumber
    });

    if (!inventory || inventory.currentQuantity < quantitySold) {
      return res.status(400).json({ error: 'Insufficient inventory for this sale' });
    }

    const invoiceNumber = 'INV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const totalAmount = salePrice ? (salePrice * quantitySold) : 0;

    const sale = new ProductSale({
      invoiceNumber,
      productId,
      branchId,
      serialNumber,
      scanCode,
      quantitySold,
      customerName,
      salePrice,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      soldBy,
      notes,
      saleDate: saleDate || new Date()
    });

    await sale.save();

    // Update inventory
    inventory.quantitySold += quantitySold;
    inventory.currentQuantity = inventory.quantityReceived - inventory.quantityTransferred - inventory.quantitySold;
    await inventory.save();

    res.status(201).json({ sale, inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await ProductSale.find()
      .populate('productId', 'productName brand')
      .populate('branchId', 'branchName branchCode')
      .sort({ saleDate: -1 });
    res.json(sales || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales by branch
router.get('/branch/:branchId', async (req, res) => {
  try {
    const sales = await ProductSale.find({ branchId: req.params.branchId })
      .populate('productId', 'productName brand')
      .sort({ saleDate: -1 });
    res.json(sales || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales by date range
router.get('/date-range', async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (branchId) {
      query.branchId = branchId;
    }

    const sales = await ProductSale.find(query)
      .populate('productId', 'productName brand')
      .populate('branchId', 'branchName branchCode')
      .sort({ saleDate: -1 });

    res.json(sales || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (branchId) {
      query.branchId = branchId;
    }

    const sales = await ProductSale.find(query);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantitySold, 0);

    const byPaymentMethod = {};
    sales.forEach(sale => {
      const method = sale.paymentMethod;
      byPaymentMethod[method] = (byPaymentMethod[method] || 0) + sale.totalAmount;
    });

    res.json({
      totalSales,
      totalRevenue,
      totalQuantity,
      byPaymentMethod
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sale by ID
router.get('/detail/:id', async (req, res) => {
  try {
    const sale = await ProductSale.findById(req.params.id)
      .populate('productId')
      .populate('branchId');
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
