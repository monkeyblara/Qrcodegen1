const express = require('express');
const router = express.Router();
const { Branch } = require('../models');

// Create a new branch
router.post('/', async (req, res) => {
  try {
    const { branchName, branchCode, location, manager, contact, email } = req.body;

    if (!branchName || !branchCode || !location || !manager || !contact) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const branch = new Branch({
      branchName,
      branchCode,
      location,
      manager,
      contact,
      email,
      isActive: true
    });

    await branch.save();
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.json(branches || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active branches
router.get('/active/list', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort({ branchName: 1 });
    res.json(branches || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get branch by ID
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update branch
router.put('/:id', async (req, res) => {
  try {
    const { branchName, branchCode, location, manager, contact, email, isActive } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      {
        branchName,
        branchCode,
        location,
        manager,
        contact,
        email,
        isActive,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete branch
router.delete('/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
