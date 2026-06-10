const express = require('express');
const router = express.Router();
const { Chemical } = require('../models');

// Create a new chemical
router.post('/', async (req, res) => {
  try {
    const { chemicalName, manufacturer, chemicalType, quantity, unit, hazardLevel, storageLocation, expiryDate } = req.body;

    if (!chemicalName || !manufacturer || !chemicalType || !quantity || !unit || !storageLocation || !expiryDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const serialNumber = 'CHEM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const chemical = new Chemical({
      serialNumber,
      chemicalName,
      manufacturer,
      chemicalType,
      quantity,
      unit,
      hazardLevel: hazardLevel || 'Medium',
      storageLocation,
      expiryDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await chemical.save();
    res.status(201).json(chemical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all chemicals
router.get('/', async (req, res) => {
  try {
    const chemicals = await Chemical.find().sort({ createdAt: -1 });
    res.json(chemicals || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chemical by ID
router.get('/:id', async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: 'Chemical not found' });
    }
    res.json(chemical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update chemical
router.put('/:id', async (req, res) => {
  try {
    const { chemicalName, manufacturer, chemicalType, quantity, unit, hazardLevel, storageLocation, expiryDate } = req.body;

    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: 'Chemical not found' });
    }

    if (chemicalName) chemical.chemicalName = chemicalName;
    if (manufacturer) chemical.manufacturer = manufacturer;
    if (chemicalType) chemical.chemicalType = chemicalType;
    if (quantity) chemical.quantity = quantity;
    if (unit) chemical.unit = unit;
    if (hazardLevel) chemical.hazardLevel = hazardLevel;
    if (storageLocation) chemical.storageLocation = storageLocation;
    if (expiryDate) chemical.expiryDate = expiryDate;
    chemical.updatedAt = new Date();

    await chemical.save();
    res.json(chemical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle favorite
router.put('/:id/favorite', async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: 'Chemical not found' });
    }

    chemical.isFavorite = !chemical.isFavorite;
    chemical.updatedAt = new Date();
    await chemical.save();

    res.json(chemical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate QR code
router.post('/:id/qr', async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: 'Chemical not found' });
    }

    const qrData = JSON.stringify({
      type: 'Chemical',
      serialNumber: chemical.serialNumber,
      chemicalName: chemical.chemicalName,
      manufacturer: chemical.manufacturer,
      chemicalType: chemical.chemicalType,
      quantity: chemical.quantity,
      unit: chemical.unit,
      hazardLevel: chemical.hazardLevel,
      storageLocation: chemical.storageLocation,
      expiryDate: chemical.expiryDate
    });

    chemical.qrCode = qrData;
    await chemical.save();

    res.json({ success: true, qrCode: chemical.qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete chemical
router.delete('/:id', async (req, res) => {
  try {
    const chemical = await Chemical.findByIdAndDelete(req.params.id);
    if (!chemical) {
      return res.status(404).json({ error: 'Chemical not found' });
    }

    res.json({ success: true, message: 'Chemical deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
