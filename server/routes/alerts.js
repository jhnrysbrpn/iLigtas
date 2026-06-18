const express = require('express');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json({ status: 'success', data: alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch alerts' });
  }
});

// Create a new alert (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, severity, message, affectedArea, broadcastSMS } = req.body;

    if (!title || !severity || !message || !affectedArea) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    const alert = await prisma.alert.create({
      data: {
        title,
        severity,
        message,
        affectedArea,
        broadcastSMS: !!broadcastSMS,
        createdBy: req.user.username // Set by authMiddleware
      }
    });

    res.status(201).json({ status: 'success', data: alert });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create alert' });
  }
});

// Toggle alert active status (Protected)
router.put('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const alert = await prisma.alert.update({
      where: { id: parseInt(id) },
      data: { isActive: !!isActive }
    });

    res.json({ status: 'success', data: alert });
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update alert' });
  }
});

module.exports = router;
