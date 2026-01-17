const User = require('../models/User');
const { generateToken } = require('../utils/tokenGenerator');
const { sendAlertEmail, getIncidentConfirmationHTML } = require('../utils/emailService');
const mockData = require('../utils/mockData');

// Always use mock data in development (MongoDB not available)
// Check if Mongoose is connected, otherwise use mock data
const useMockData = () => {
  try {
    const mongoose = require('mongoose');
    // If mongoose connection readyState is not 1, use mock data
    return mongoose.connection.readyState !== 1;
  } catch {
    return true; // Use mock data if mongoose is not available
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, phone, address, city, state, pincode } = req.body;
    console.log('Register using:', useMockData() ? 'MOCK DATA' : 'MongoDB');

    if (useMockData()) {
      // Use mock data
      const existingUser = mockData.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const user = mockData.createUser({
        email,
        password,
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        role: 'user',
        isActive: true,
      });

      const token = generateToken(user.id, user.role);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const mockMode = useMockData();
    console.log('Login attempt:', { email, mockMode });

    if (mockMode) {
      // Use mock data
      const user = mockData.getUserByEmail(email);
      console.log('User found:', user ? 'YES' : 'NO');
      
      if (!user) {
        // Return helpful error with available emails
        const allUsers = mockData.getAllUsers();
        console.log('Available users:', allUsers.map(u => u.email));
        return res.status(401).json({ 
          error: 'Invalid email or password',
          debug: `Available test accounts: ${allUsers.map(u => u.email).join(', ')}`
        });
      }

      // For mock data demo, accept any non-empty password (not secure, demo only!)
      if (!password || password.trim() === '') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.role);

      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'User account is disabled' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('emergencyContacts')
      .populate('policeStation');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, state, pincode, dateOfBirth } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        dateOfBirth,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Disable/Enable User Account
const toggleUserAccount = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { isActive },
      { new: true }
    );

    res.json({
      message: `Account ${isActive ? 'enabled' : 'disabled'} successfully`,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter).select('-password').limit(50);

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  toggleUserAccount,
  getAllUsers,
  deleteUser,
};
