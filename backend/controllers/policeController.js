const PoliceStation = require('../models/PoliceStation');
const User = require('../models/User');
const Incident = require('../models/Incident');

// Create Police Station (Admin only)
const createPoliceStation = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      jurisdiction,
      officerCount,
      responsibleOfficer,
    } = req.body;

    const station = new PoliceStation({
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      jurisdiction,
      officerCount,
      responsibleOfficer,
    });

    await station.save();

    res.status(201).json({
      message: 'Police station created successfully',
      station,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Police Stations
const getAllPoliceStations = async (req, res) => {
  try {
    const { city, state, isActive } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const stations = await PoliceStation.find(filter)
      .populate('officers', 'fullName phone email')
      .select('-responsibleOfficer');

    res.json({
      count: stations.length,
      stations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Police Station Details
const getPoliceStationDetails = async (req, res) => {
  try {
    const { stationId } = req.params;

    const station = await PoliceStation.findById(stationId)
      .populate('officers', 'fullName phone email');

    if (!station) {
      return res.status(404).json({ error: 'Police station not found' });
    }

    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Police Station
const updatePoliceStation = async (req, res) => {
  try {
    const { stationId } = req.params;
    const updateData = req.body;

    const station = await PoliceStation.findByIdAndUpdate(stationId, updateData, {
      new: true,
    });

    if (!station) {
      return res.status(404).json({ error: 'Police station not found' });
    }

    res.json({
      message: 'Police station updated successfully',
      station,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Station Alerts
const getStationAlerts = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { status, limit = 50, skip = 0 } = req.query;

    const filter = {
      'policeStationsNotified.stationId': stationId,
    };

    if (status) {
      filter.status = status;
    }

    const incidents = await Incident.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'fullName phone email address');

    const total = await Incident.countDocuments(filter);

    res.json({
      stationId,
      total,
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Acknowledge Alert (Police)
const acknowledgeAlert = async (req, res) => {
  try {
    const { incidentId, stationId } = req.params;

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      {
        $set: {
          'policeStationsNotified.$[elem].status': 'acknowledged',
        },
      },
      {
        arrayFilters: [{ 'elem.stationId': stationId }],
        new: true,
      }
    );

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({
      message: 'Alert acknowledged',
      incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Station Statistics
const getStationStatistics = async (req, res) => {
  try {
    const { stationId } = req.params;

    const station = await PoliceStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Police station not found' });
    }

    const totalAlerts = await Incident.countDocuments({
      'policeStationsNotified.stationId': stationId,
    });

    const resolvedIncidents = await Incident.countDocuments({
      'policeStationsNotified.stationId': stationId,
      status: 'resolved',
    });

    const pendingIncidents = await Incident.countDocuments({
      'policeStationsNotified.stationId': stationId,
      status: { $in: ['reported', 'investigating'] },
    });

    const byType = await Incident.aggregate([
      {
        $match: {
          'policeStationsNotified.stationId': require('mongoose').Types.ObjectId(stationId),
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      stationId,
      statistics: {
        totalAlerts,
        resolvedIncidents,
        pendingIncidents,
        resolutionRate: ((resolvedIncidents / totalAlerts) * 100).toFixed(2) + '%',
        byType,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPoliceStation,
  getAllPoliceStations,
  getPoliceStationDetails,
  updatePoliceStation,
  getStationAlerts,
  acknowledgeAlert,
  getStationStatistics,
};
