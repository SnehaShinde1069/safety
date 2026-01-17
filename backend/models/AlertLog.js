const mongoose = require('mongoose');

const alertLogSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alertType: {
      type: String,
      enum: ['email', 'sms', 'push-notification', 'in-app'],
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    recipientType: {
      type: String,
      enum: ['emergency-contact', 'police-station', 'admin'],
      required: true,
    },
    subject: String,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'delivery-failed'],
      default: 'pending',
    },
    sentAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    errorMessage: String,
    metadata: {
      ipAddress: String,
      userAgent: String,
      deviceInfo: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for queries
alertLogSchema.index({ incidentId: 1, createdAt: -1 });
alertLogSchema.index({ userId: 1, createdAt: -1 });
alertLogSchema.index({ status: 1 });

module.exports = mongoose.model('AlertLog', alertLogSchema);
