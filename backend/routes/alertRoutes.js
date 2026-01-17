const express = require('express');
const router = express.Router();
const AlertLog = require('../models/AlertLog');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get user's alert history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const logs = await AlertLog.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('incidentId');

    const total = await AlertLog.countDocuments({ userId: req.userId });

    res.json({
      total,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark alert as read
router.put('/:alertId/read', authMiddleware, async (req, res) => {
  try {
    const alert = await AlertLog.findByIdAndUpdate(
      req.params.alertId,
      { readAt: new Date() },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      message: 'Alert marked as read',
      alert,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
