const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    jurisdiction: {
      type: String,
      default: '',
    },
    officerCount: {
      type: Number,
      default: 0,
    },
    responsibleOfficer: {
      name: String,
      phone: String,
      email: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    alertsReceived: {
      type: Number,
      default: 0,
    },
    emergencyHandled: {
      type: Number,
      default: 0,
    },
    officers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PoliceStation', policeStationSchema);
