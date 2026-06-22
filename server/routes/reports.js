const express = require('express');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createReportSchema, updateReportSchema, createCommentSchema } = require('../schemas/report');
const { isNearDuplicate } = require('../utils/validation');
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
router.post('/', validate(createReportSchema), async (req, res) => {
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
    } = req.validatedBody;

    const duplicateWindowStart = new Date(Date.now() - 5 * 60 * 1000);
    const recentReports = await prisma.hazardReport.findMany({
      where: {
        reporterPhone,
        timestamp: { gte: duplicateWindowStart }
      },
      select: {
        title: true,
        description: true,
        locationName: true
      }
    });

    const hasNearDuplicate = recentReports.some((report) =>
      isNearDuplicate(report.title, title) &&
      isNearDuplicate(report.description, description) &&
      isNearDuplicate(report.locationName, locationName)
    );

    if (hasNearDuplicate) {
      return res.status(409).json({
        status: 'error',
        message: 'Near-identical report already submitted within the last 5 minutes.'
      });
    }

    const report = await prisma.hazardReport.create({
      data: {
        category,
        title,
        description,
        reporterName,
        reporterPhone,
        locationName,
        latitude,
        longitude,
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
router.put('/:id', authMiddleware, validate(updateReportSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedResponder, affectedFamiliesCount, damageCostEstimated } = req.validatedBody;

    const report = await prisma.hazardReport.update({
      where: { id: parseInt(id) },
      data: {
        status,
        priority,
        assignedResponder,
        affectedFamiliesCount,
        damageCostEstimated
      }
    });

    res.json({ status: 'success', data: report });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update report' });
  }
});

// Add a comment to a report (Protected)
router.post('/:id/comments', authMiddleware, validate(createCommentSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { text, role } = req.validatedBody;

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
