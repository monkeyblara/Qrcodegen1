const express = require('express');
const router = express.Router();
const { ProductTransfer, BranchInventory } = require('../models');

// Create product transfer
router.post('/', async (req, res) => {
  try {
    const { productId, fromBranchId, toBranchId, serialNumber, quantityTransferred, transferredBy, notes, transferDate } = req.body;

    if (!productId || !fromBranchId || !toBranchId || !serialNumber || !quantityTransferred || !transferredBy) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (fromBranchId === toBranchId) {
      return res.status(400).json({ error: 'Cannot transfer to the same branch' });
    }

    // Check if source branch has enough inventory
    const sourceInventory = await BranchInventory.findOne({
      branchId: fromBranchId,
      productId,
      serialNumber
    });

    if (!sourceInventory || sourceInventory.currentQuantity < quantityTransferred) {
      return res.status(400).json({ error: 'Insufficient inventory in source branch' });
    }

    const transferNumber = 'TRANS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const transfer = new ProductTransfer({
      transferNumber,
      productId,
      fromBranchId,
      toBranchId,
      serialNumber,
      quantityTransferred,
      transferredBy,
      notes,
      transferDate: transferDate || new Date(),
      status: 'pending'
    });

    await transfer.save();

    // Update source branch inventory
    sourceInventory.quantityTransferred += quantityTransferred;
    sourceInventory.currentQuantity = sourceInventory.quantityReceived - sourceInventory.quantityTransferred - sourceInventory.quantitySold;
    await sourceInventory.save();

    res.status(201).json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all transfers
router.get('/', async (req, res) => {
  try {
    const transfers = await ProductTransfer.find()
      .populate('productId', 'productName brand')
      .populate('fromBranchId', 'branchName branchCode')
      .populate('toBranchId', 'branchName branchCode')
      .sort({ transferDate: -1 });
    res.json(transfers || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transfers by branch (either from or to)
router.get('/branch/:branchId', async (req, res) => {
  try {
    const transfers = await ProductTransfer.find({
      $or: [
        { fromBranchId: req.params.branchId },
        { toBranchId: req.params.branchId }
      ]
    })
      .populate('productId', 'productName brand')
      .populate('fromBranchId', 'branchName branchCode')
      .populate('toBranchId', 'branchName branchCode')
      .sort({ transferDate: -1 });
    res.json(transfers || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transfer status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, receivedDate } = req.body;
    const validStatuses = ['pending', 'in-transit', 'received', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const transfer = await ProductTransfer.findByIdAndUpdate(
      req.params.id,
      {
        status,
        receivedDate: status === 'received' ? (receivedDate || new Date()) : null,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    // If received, update destination inventory
    if (status === 'received') {
      let destInventory = await BranchInventory.findOne({
        branchId: transfer.toBranchId,
        productId: transfer.productId,
        serialNumber: transfer.serialNumber
      });

      if (destInventory) {
        destInventory.quantityReceived += transfer.quantityTransferred;
        destInventory.currentQuantity = destInventory.quantityReceived - destInventory.quantityTransferred - destInventory.quantitySold;
      } else {
        destInventory = new BranchInventory({
          branchId: transfer.toBranchId,
          productId: transfer.productId,
          serialNumber: transfer.serialNumber,
          quantityReceived: transfer.quantityTransferred,
          currentQuantity: transfer.quantityTransferred,
          lastRestockDate: new Date()
        });
      }

      await destInventory.save();
    }

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transfer details
router.get('/detail/:id', async (req, res) => {
  try {
    const transfer = await ProductTransfer.findById(req.params.id)
      .populate('productId')
      .populate('fromBranchId')
      .populate('toBranchId');
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
