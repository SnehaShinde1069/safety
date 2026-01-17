const EmergencyContact = require('../models/EmergencyContact');
const User = require('../models/User');
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

// Add Emergency Contact
const addEmergencyContact = async (req, res) => {
  try {
    const { name, phone, email, relationship, priority } = req.body;

    if (useMockData()) {
      const contact = mockData.addContact({
        userId: req.userId,
        name,
        phone,
        email,
        relationship,
        priority: priority || 1,
      });

      return res.status(201).json({
        message: 'Emergency contact added successfully',
        contact,
      });
    }

    const contact = new EmergencyContact({
      userId: req.userId,
      name,
      phone,
      email,
      relationship,
      priority: priority || 1,
    });

    await contact.save();

    // Add contact to user's emergency contacts
    await User.findByIdAndUpdate(req.userId, {
      $push: { emergencyContacts: contact._id },
    });

    res.status(201).json({
      message: 'Emergency contact added successfully',
      contact,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User's Emergency Contacts
const getEmergencyContacts = async (req, res) => {
  try {
    if (useMockData()) {
      const contacts = mockData.getContacts(req.userId);
      return res.json({
        message: 'Emergency contacts retrieved',
        contacts,
      });
    }

    const contacts = await EmergencyContact.find({ userId: req.userId }).sort({
      priority: 1,
    });

    res.json({
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Emergency Contact
const updateEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { name, phone, email, relationship, priority, isNotifyEnabled } = req.body;

    const contact = await EmergencyContact.findByIdAndUpdate(
      contactId,
      {
        name,
        phone,
        email,
        relationship,
        priority,
        isNotifyEnabled,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({
      message: 'Contact updated successfully',
      contact,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Emergency Contact
const deleteEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await EmergencyContact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Remove from user's emergency contacts array
    await User.findByIdAndUpdate(req.userId, {
      $pull: { emergencyContacts: contactId },
    });

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
};
