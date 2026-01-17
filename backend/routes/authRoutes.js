const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  toggleUserAccount,
  getAllUsers,
  deleteUser,
} = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/change-password', authMiddleware, changePassword);
router.put('/toggle-account', authMiddleware, toggleUserAccount);

// Admin routes
router.get('/users', authMiddleware, roleMiddleware(['admin']), getAllUsers);
router.delete('/users/:userId', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;
