const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const User = require('../models/User');
const PoliceStation = require('../models/PoliceStation');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const mockData = require('../utils/mockData');

// Check if using mock data
const useMockData = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState !== 1;
  } catch {
    return true;
  }
};

// Get user dashboard (user role)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Dashboard request for user:', userId);

    if (useMockData()) {
      // Use mock data
      console.log('Using mock data for dashboard');
      const stats = mockData.getDashboardStats(userId);
      const userContacts = mockData.getContacts(userId);
      const userIncidents = mockData.getUserIncidents(userId);

      return res.json({
        message: 'Dashboard data retrieved',
        statistics: {
          totalIncidents: stats.totalIncidents,
          resolvedIncidents: stats.resolvedIncidents,
          pendingIncidents: stats.pendingIncidents,
          resolutionRate: stats.totalIncidents > 0 ? ((stats.resolvedIncidents / stats.totalIncidents) * 100).toFixed(2) + '%' : '0%',
        },
        recentIncidents: userIncidents.slice(0, 5),
        emergencyContactsCount: userContacts.length,
        emergencyContacts: userContacts,
      });
    }

    // Get recent incidents
    const recentIncidents = await Incident.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Get incident statistics
    const totalIncidents = await Incident.countDocuments({ userId });
    const resolvedIncidents = await Incident.countDocuments({
      userId,
      status: 'resolved',
    });
    const pendingIncidents = await Incident.countDocuments({
      userId,
      status: { $in: ['reported', 'investigating'] },
    });

    // Get user profile
    const user = await User.findById(userId)
      .populate('emergencyContacts');

    // Get incident breakdown by type
    const incidentsByType = await Incident.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.json({
      user: user.toJSON(),
      statistics: {
        totalIncidents,
        resolvedIncidents,
        pendingIncidents,
        resolutionRate: totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(2) + '%' : '0%',
      },
      recentIncidents: recentIncidents.slice(0, 5),
      incidentsByType,
      emergencyContactsCount: user.emergencyContacts.length,
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching dashboard' });
  }
});

// Get police dashboard
router.get('/police/:stationId', authMiddleware, roleMiddleware(['police', 'admin']), async (req, res) => {
  try {
    const { stationId } = req.params;

    // Get station details
    const station = await PoliceStation.findById(stationId)
      .populate('officers', 'fullName phone email');

    if (!station) {
      return res.status(404).json({ error: 'Police station not found' });
    }

    // Get recent alerts for this station
    const recentAlerts = await Incident.find({
      'policeStationsNotified.stationId': stationId,
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'fullName phone email address');

    // Get alert statistics
    const totalAlerts = await Incident.countDocuments({
      'policeStationsNotified.stationId': stationId,
    });

    const resolvedAlerts = await Incident.countDocuments({
      'policeStationsNotified.stationId': stationId,
      status: 'resolved',
    });

    const acknowledgedAlerts = await Incident.countDocuments({
      'policeStationsNotified.stationId': stationId,
      'policeStationsNotified.status': 'acknowledged',
    });

    const pendingAlerts = totalAlerts - acknowledgedAlerts;

    // Get alerts by severity
    const alertsBySeverity = await Incident.aggregate([
      {
        $match: {
          'policeStationsNotified.stationId': require('mongoose').Types.ObjectId(stationId),
        },
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      station,
      statistics: {
        totalAlerts,
        resolvedAlerts,
        pendingAlerts,
        acknowledgedAlerts,
        resolutionRate: totalAlerts > 0 ? ((resolvedAlerts / totalAlerts) * 100).toFixed(2) + '%' : '0%',
      },
      recentAlerts: recentAlerts.slice(0, 5),
      alertsBySeverity,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin dashboard
router.get('/admin', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    // Get total statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPoliceStations = await PoliceStation.countDocuments();
    const totalIncidents = await Incident.countDocuments();
    const totalResolved = await Incident.countDocuments({ status: 'resolved' });

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get incidents by status
    const incidentsByStatus = await Incident.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get incidents by severity
    const incidentsBySeverity = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top police stations
    const topStations = await PoliceStation.find()
      .sort({ alertsReceived: -1 })
      .limit(5)
      .select('name alertsReceived emergencyHandled');

    // Get recent incidents
    const recentIncidents = await Incident.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'fullName phone')
      .select('userId type severity status timestamp');

    res.json({
      statistics: {
        totalUsers,
        totalPoliceStations,
        totalIncidents,
        totalResolved,
        resolutionRate: totalIncidents > 0 ? ((totalResolved / totalIncidents) * 100).toFixed(2) + '%' : '0%',
      },
      usersByRole,
      incidentsByStatus,
      incidentsBySeverity,
      topStations,
      recentIncidents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
