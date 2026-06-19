const express = require('express');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all hazard reports (with comments)
router.get('/', async (req, res) => {
  try {
    const reports = await prisma.hazardReport.findMany({
      include: {
        comments: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json({ status: 'success', data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch reports' });
  }
});

// Create a new hazard report (Public or authenticated)
router.post('/', async (req, res) => {
  try {
    const { 
      category, 
      title, 
      description, 
      reporterName, 
      reporterPhone, 
      locationName, 
      latitude, 
      longitude, 
      priority 
    } = req.body;

    if (!category || !title || !description || !reporterName || !reporterPhone || !locationName || !latitude || !longitude) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const report = await prisma.hazardReport.create({
      data: {
        category,
        title,
        description,
        reporterName,
        reporterPhone,
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        priority: priority || 'Medium',
        status: 'Pending'
      }
    });

    res.status(201).json({ status: 'success', data: report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit report' });
  }
});

// Update report status, responder, or estimates (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedResponder, affectedFamiliesCount, damageCostEstimated } = req.body;

    const report = await prisma.hazardReport.update({
      where: { id: parseInt(id) },
      data: {
        status,
        priority,
        assignedResponder,
        affectedFamiliesCount: affectedFamiliesCount !== undefined ? parseInt(affectedFamiliesCount) : undefined,
        damageCostEstimated: damageCostEstimated !== undefined ? parseFloat(damageCostEstimated) : undefined
      }
    });

    res.json({ status: 'success', data: report });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update report' });
  }
});

// Add a comment to a report (Protected)
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, role } = req.body;

    if (!text || !role) {
      return res.status(400).json({ status: 'error', message: 'Comment text and role are required' });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        role,
        author: req.user.username,
        hazardReportId: parseInt(id)
      }
    });

    res.status(201).json({ status: 'success', data: comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add comment' });
  }
});

module.exports = router;
