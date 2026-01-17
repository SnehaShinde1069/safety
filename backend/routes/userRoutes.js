const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  toggleUserAccount,
  getAllUsers,
} = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateContact } = require('../middleware/validationMiddleware');

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/change-password', authMiddleware, changePassword);
router.put('/toggle-account', authMiddleware, toggleUserAccount);

// Admin routes
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

module.exports = router;
