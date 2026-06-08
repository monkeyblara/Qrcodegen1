const express = require('express');
const router = express.Router();
const { SavedPaint } = require('../models');

// Get all saved paints
router.get('/', async (req, res) => {
  try {
    const paints = await SavedPaint.find().sort({ isFavorite: -1, createdAt: -1 });
    res.json(paints || []);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saved paints' });
  }
});

// Add a saved paint
router.post('/', async (req, res) => {
  try {
    const { name, brand, paintType, quantity, color } = req.body;

    if (!name || !brand || !paintType || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paint = new SavedPaint({
      name,
      brand,
      paintType,
      quantity,
      color: color || '#ffffff',
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await paint.save();
    res.status(201).json(paint);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add saved paint' });
  }
});

// Toggle favorite status
router.put('/:id/favorite', async (req, res) => {
  try {
    const paint = await SavedPaint.findById(req.params.id);
    if (!paint) {
      return res.status(404).json({ error: 'Paint not found' });
    }
    
    paint.isFavorite = !paint.isFavorite;
    await paint.save();
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// Update a saved paint
router.put('/:id', async (req, res) => {
  try {
    const { name, brand, paintType, quantity, color } = req.body;

    if (!name || !brand || !paintType || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paint = await SavedPaint.findByIdAndUpdate(
      req.params.id,
      {
        name,
        brand,
        paintType,
        quantity,
        color: color || '#ffffff',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!paint) {
      return res.status(404).json({ error: 'Paint not found' });
    }

    res.json(paint);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update saved paint' });
  }
});

// Delete a saved paint
router.delete('/:id', async (req, res) => {
  try {
    const paint = await SavedPaint.findByIdAndDelete(req.params.id);
    if (!paint) {
      return res.status(404).json({ error: 'Paint not found' });
    }
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete saved paint' });
  }
});

module.exports = router;
