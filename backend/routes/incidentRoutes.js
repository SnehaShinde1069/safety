const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncident,
  getUserIncidents,
  updateIncidentStatus,
  addCaseNotes,
  getAllIncidents,
} = require('../controllers/incidentController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateIncident } = require('../middleware/validationMiddleware');

// Create incident (users can trigger emergency)
router.post('/', authMiddleware, validateIncident, createIncident);

// Get user's incidents
router.get('/user/list', authMiddleware, getUserIncidents);

// Get incident details
router.get('/:incidentId', authMiddleware, getIncident);

// Update incident status (police/admin only)
router.put('/:incidentId/status', authMiddleware, roleMiddleware(['police', 'admin']), updateIncidentStatus);

// Add case notes
router.post('/:incidentId/notes', authMiddleware, roleMiddleware(['police', 'admin']), addCaseNotes);

// Get all incidents (admin/police)
router.get('/', authMiddleware, roleMiddleware(['police', 'admin']), getAllIncidents);

module.exports = router;
