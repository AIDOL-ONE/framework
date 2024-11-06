// src/models/Action.js
const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    index: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    initiator: {
      type: String,
      required: true
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    executionTime: Number,
    retryCount: {
      type: Number,
      default: 0
    }
  },
  result: mongoose.Schema.Types.Mixed,
  error: String
}, {
  timestamps: true
});

actionSchema.index({ 'metadata.status': 1, 'metadata.timestamp': -1 });
actionSchema.index({ type: 1, 'metadata.status': 1 });

module.exports = mongoose.model('Action', actionSchema);