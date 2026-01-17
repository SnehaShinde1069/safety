const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'hand-gesture-detection',
        'z-pattern-trigger',
        'manual-alert',
        'panic-button',
      ],
      default: 'manual-alert',
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
    },
    location: {
      address: String,
      latitude: Number,
      longitude: Number,
      mapUrl: String,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    videoClipDuration: {
      type: Number,
      default: 0,
    },
    audioIncluded: {
      type: Boolean,
      default: false,
    },
    geolocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
    },
    attachments: [
      {
        type: String,
      },
    ],
    emergencyContactsNotified: [
      {
        contactId: mongoose.Schema.Types.ObjectId,
        notifiedAt: Date,
        status: String,
      },
    ],
    policeStationsNotified: [
      {
        stationId: mongoose.Schema.Types.ObjectId,
        notifiedAt: Date,
        status: {
          type: String,
          enum: ['pending', 'acknowledged', 'resolved'],
          default: 'pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['reported', 'acknowledged', 'investigating', 'resolved', 'false-alarm'],
      default: 'reported',
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    caseNotes: [
      {
        note: String,
        addedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolutionDetails: {
      resolvedAt: Date,
      resolvedBy: mongoose.Schema.Types.ObjectId,
      outcome: String,
      notes: String,
    },
    witnesses: [
      {
        name: String,
        phone: String,
        email: String,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
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

// Index for geospatial queries
incidentSchema.index({ geolocation: '2dsphere' });
incidentSchema.index({ userId: 1, timestamp: -1 });
incidentSchema.index({ status: 1 });

module.exports = mongoose.model('Incident', incidentSchema);
