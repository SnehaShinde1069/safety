const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const mockData = require('../utils/mockData');
const mongoose = require('mongoose');

const router = express.Router();

// Helper function to check if using mock data
const useMockData = () => {
  return mongoose.connection.readyState !== 1;
};

// Get admin statistics
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;

    if (useMockData()) {
      const stats = mockData.getAdminStats();
      return res.json(stats);
    }

    // MongoDB version would be here
    res.json({
      totalUsers: 0,
      totalPoliceOfficers: 0,
      totalIncidents: 0,
      resolvedIncidents: 0,
      pendingIncidents: 0,
      totalAlerts: 0,
      policeStations: 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Error fetching admin statistics', error: error.message });
  }
});

// Get all police officers with their stations and login info
router.get('/police-officers', authMiddleware, (req, res) => {
  try {
    if (useMockData()) {
      const officers = mockData.getPoliceOfficersWithStations();
      return res.json({ data: officers });
    }

    // MongoDB version would be here
    res.json({ data: [] });
  } catch (error) {
    console.error('Police officers error:', error);
    res.status(500).json({ message: 'Error fetching police officers', error: error.message });
  }
});

// Get all incidents with user details for admin view
router.get('/incidents', authMiddleware, (req, res) => {
  try {
    if (useMockData()) {
      const incidents = mockData.getAllIncidentsAdmin();
      return res.json({ data: incidents });
    }

    // MongoDB version would be here
    res.json({ data: [] });
  } catch (error) {
    console.error('Incidents error:', error);
    res.status(500).json({ message: 'Error fetching incidents', error: error.message });
  }
});

// Get online police officers (logged in within last hour)
router.get('/online-officers', authMiddleware, (req, res) => {
  try {
    if (useMockData()) {
      const officers = mockData.getPoliceOfficersWithStations();
      const onlineOfficers = officers.filter(officer => {
        const lastLogin = new Date(officer.lastLogin);
        const isOnline = (Date.now() - lastLogin.getTime()) < 3600000; // 1 hour
        return isOnline;
      });
      return res.json({ data: onlineOfficers, count: onlineOfficers.length });
    }

    res.json({ data: [], count: 0 });
  } catch (error) {
    console.error('Online officers error:', error);
    res.status(500).json({ message: 'Error fetching online officers', error: error.message });
  }
});

// Get system health status
router.get('/system-health', authMiddleware, (req, res) => {
  try {
    const health = {
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      api: 'Running',
      mockDataEnabled: useMockData(),
      timestamp: new Date(),
      uptime: process.uptime(),
    };

    res.json(health);
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ message: 'Error fetching system health', error: error.message });
  }
});

module.exports = router;
