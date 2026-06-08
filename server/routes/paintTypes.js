const express = require('express');
const router = express.Router();
const { PaintType } = require('../models');

// Get all paint types
router.get('/', async (req, res) => {
  try {
    const types = await PaintType.find().sort({ name: 1 });
    res.json(types || []);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch paint types' });
  }
});

// Add a new paint type
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Paint type name is required' });
    }

    // Check if type already exists
    const existing = await PaintType.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'This paint type already exists' });
    }

    const type = new PaintType({
      name: name.trim(),
      createdAt: new Date()
    });

    await type.save();
    res.status(201).json(type);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add paint type' });
  }
});

// Delete a paint type
router.delete('/:id', async (req, res) => {
  try {
    const type = await PaintType.findByIdAndDelete(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Paint type not found' });
    }
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete paint type' });
  }
});

module.exports = router;
