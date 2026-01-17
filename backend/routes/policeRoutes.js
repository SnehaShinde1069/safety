const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const mockData = require('../utils/mockData');
const mongoose = require('mongoose');

// Helper function
const useMockData = () => {
  return mongoose.connection.readyState !== 1;
};

// Get police officer dashboard stats
router.get('/stats', authMiddleware, (req, res) => {
  try {
    if (useMockData()) {
      const allIncidents = mockData.getAllIncidentsAdmin();
      const stats = {
        totalIncidents: allIncidents.length,
        resolvedIncidents: allIncidents.filter(i => i.status === 'resolved').length,
        pendingIncidents: allIncidents.filter(i => i.status === 'reported' || i.status === 'investigating').length,
        alertsReceived: 25,
      };
      return res.json(stats);
    }

    res.json({
      totalIncidents: 0,
      resolvedIncidents: 0,
      pendingIncidents: 0,
      alertsReceived: 0,
    });
  } catch (error) {
    console.error('Police stats error:', error);
    res.status(500).json({ message: 'Error fetching police statistics', error: error.message });
  }
});

// Get all incidents (for police view)
router.get('/incidents', authMiddleware, (req, res) => {
  try {
    if (useMockData()) {
      const incidents = mockData.getAllIncidentsAdmin();
      return res.json({ data: incidents });
    }

    res.json({ data: [] });
  } catch (error) {
    console.error('Police incidents error:', error);
    res.status(500).json({ message: 'Error fetching incidents', error: error.message });
  }
});

// Update officer status
router.put('/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;

    if (useMockData()) {
      const officer = mockData.updatePoliceOfficerLogin(userId);
      if (officer) {
        return res.json({ message: 'Status updated', officer });
      }
    }

    res.status(404).json({ message: 'Officer not found' });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// Get officer location
router.get('/location', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;

    if (useMockData()) {
      const officer = mockData.getPoliceOfficerById(userId);
      if (officer) {
        return res.json({
          officer: officer.fullName,
          latitude: 40.7128 + Math.random() * 0.1,
          longitude: -74.0060 + Math.random() * 0.1,
          accuracy: Math.round(Math.random() * 10),
          timestamp: new Date(),
        });
      }
    }

    res.status(404).json({ message: 'Officer not found' });
  } catch (error) {
    console.error('Location error:', error);
    res.status(500).json({ message: 'Error fetching location', error: error.message });
  }
});
module.exports = router;