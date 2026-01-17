const express = require('express');
const router = express.Router();
const {
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
} = require('../controllers/contactController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validateContact } = require('../middleware/validationMiddleware');

// All routes require authentication
router.post('/', authMiddleware, validateContact, addEmergencyContact);
router.get('/', authMiddleware, getEmergencyContacts);
router.put('/:contactId', authMiddleware, updateEmergencyContact);
router.delete('/:contactId', authMiddleware, deleteEmergencyContact);

module.exports = router;
