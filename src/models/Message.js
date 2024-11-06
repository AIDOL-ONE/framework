// src/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['system', 'user', 'assistant', 'idol', 'manager'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    source: String,
    context: mongoose.Schema.Types.Mixed,
    mood: {
      type: String,
      enum: ['happy', 'neutral', 'sad', 'excited', 'thoughtful']
    },
    sentiment: {
      score: Number,
      magnitude: Number
    }
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

messageSchema.index({ 'metadata.timestamp': -1 });
messageSchema.index({ role: 1, 'metadata.timestamp': -1 });

module.exports = mongoose.model('Message', messageSchema);