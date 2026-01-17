const Incident = require('../models/Incident');
const User = require('../models/User');
const EmergencyContact = require('../models/EmergencyContact');
const PoliceStation = require('../models/PoliceStation');
const AlertLog = require('../models/AlertLog');
const { sendAlertEmail, getEmergencyAlertHTML, getIncidentConfirmationHTML } = require('../utils/emailService');
const axios = require('axios');

// Create Incident (from Z-pattern or manual trigger)
const createIncident = async (req, res) => {
  try {
    const { type, description, location, severity, videoUrl, attachments } = req.body;

    // Get user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create incident
    const incident = new Incident({
      userId: req.userId,
      type: type || 'manual-alert',
      description,
      location: {
        address: location.address || '',
        latitude: location.latitude,
        longitude: location.longitude,
      },
      severity: severity || 'high',
      videoUrl,
      attachments,
      geolocation: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    });

    await incident.save();

    // Find nearest police stations (within 5km)
    const nearestPoliceStations = await PoliceStation.find({
      geolocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          $maxDistance: 5000, // 5km
        },
      },
    });

    // Send alerts to emergency contacts
    const emergencyContacts = await EmergencyContact.find({
      userId: req.userId,
      isNotifyEnabled: true,
    }).sort({ priority: 1 });

    for (const contact of emergencyContacts) {
      if (contact.email) {
        const htmlContent = getEmergencyAlertHTML(user, incident, videoUrl);
        const emailResult = await sendAlertEmail(
          contact.email,
          '🚨 Emergency Alert - Girl Safety System',
          htmlContent
        );

        // Log alert
        await AlertLog.create({
          incidentId: incident._id,
          userId: req.userId,
          alertType: 'email',
          recipient: contact.email,
          recipientType: 'emergency-contact',
          subject: '🚨 Emergency Alert - Girl Safety System',
          status: emailResult.success ? 'sent' : 'failed',
          sentAt: new Date(),
          errorMessage: emailResult.error || null,
        });
      }

      if (contact.phone) {
        // SMS alert can be sent via Twilio (optional)
        await AlertLog.create({
          incidentId: incident._id,
          userId: req.userId,
          alertType: 'sms',
          recipient: contact.phone,
          recipientType: 'emergency-contact',
          status: 'pending',
        });
      }
    }

    // Send alerts to nearest police stations
    for (const station of nearestPoliceStations) {
      const htmlContent = getEmergencyAlertHTML(user, incident, videoUrl);
      const emailResult = await sendAlertEmail(
        station.email,
        '🚨 Emergency Alert - Girl Safety System',
        htmlContent
      );

      // Update incident with police station notification
      incident.policeStationsNotified.push({
        stationId: station._id,
        notifiedAt: new Date(),
        status: 'pending',
      });

      // Log alert
      await AlertLog.create({
        incidentId: incident._id,
        userId: req.userId,
        alertType: 'email',
        recipient: station.email,
        recipientType: 'police-station',
        subject: '🚨 Emergency Alert - Girl Safety System',
        status: emailResult.success ? 'sent' : 'failed',
        sentAt: new Date(),
        errorMessage: emailResult.error || null,
      });

      // Update police station alert count
      await PoliceStation.findByIdAndUpdate(station._id, {
        $inc: { alertsReceived: 1 },
      });
    }

    // Notify via WebSocket if available
    if (req.app.io) {
      req.app.io.to(`alerts_${req.userId}`).emit('incident-created', {
        incidentId: incident._id,
        message: 'Your emergency alert has been sent',
      });

      // Notify all connected police stations
      nearestPoliceStations.forEach((station) => {
        req.app.io.to(`police_alerts_${station._id}`).emit('new-incident', incident);
      });
    }

    await incident.save();

    res.status(201).json({
      message: 'Incident reported successfully',
      incident,
      notifiedContacts: emergencyContacts.length,
      notifiedPoliceStations: nearestPoliceStations.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Incident Details
const getIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;

    const incident = await Incident.findById(incidentId)
      .populate('userId', 'fullName phone email address')
      .populate('policeStationsNotified.stationId', 'name email')
      .populate('assignedOfficer', 'fullName phone email')
      .populate('caseNotes.addedBy', 'fullName');

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Check authorization
    if (incident.userId._id.toString() !== req.userId && req.userRole !== 'police' && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User's Incidents
const getUserIncidents = async (req, res) => {
  try {
    const { status, limit = 20, skip = 0 } = req.query;

    const filter = { userId: req.userId };
    if (status) filter.status = status;

    const incidents = await Incident.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-caseNotes');

    const total = await Incident.countDocuments(filter);

    res.json({
      total,
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Incident Status (Police only)
const updateIncidentStatus = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { status, caseNotes, outcome, resolvedNotes } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      {
        status,
        updatedAt: new Date(),
        ...(status === 'resolved' && {
          resolutionDetails: {
            resolvedAt: new Date(),
            resolvedBy: req.userId,
            outcome,
            notes: resolvedNotes,
          },
        }),
      },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Add case notes if provided
    if (caseNotes) {
      incident.caseNotes.push({
        note: caseNotes,
        addedBy: req.userId,
        timestamp: new Date(),
      });
      await incident.save();
    }

    res.json({
      message: 'Incident updated successfully',
      incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Case Notes
const addCaseNotes = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { note } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      {
        $push: {
          caseNotes: {
            note,
            addedBy: req.userId,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({
      message: 'Case note added successfully',
      incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Incidents (Admin/Police)
const getAllIncidents = async (req, res) => {
  try {
    const { status, severity, startDate, endDate, limit = 50, skip = 0 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const incidents = await Incident.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'fullName phone email')
      .select('-caseNotes');

    const total = await Incident.countDocuments(filter);

    res.json({
      total,
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createIncident,
  getIncident,
  getUserIncidents,
  updateIncidentStatus,
  addCaseNotes,
  getAllIncidents,
};
