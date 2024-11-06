// src/models/Critique.js
const mongoose = require('mongoose');

const critiqueSchema = new mongoose.Schema({
  target: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  suggestions: [{
    type: String
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    critic: {
      type: String,
      required: true
    },
    context: mongoose.Schema.Types.Mixed,
    category: {
      type: String,
      enum: ['performance', 'interaction', 'content', 'technical']
    }
  },
  impact: {
    measured: Boolean,
    metrics: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

critiqueSchema.index({ target: 1, 'metadata.timestamp': -1 });
critiqueSchema.index({ 'metadata.critic': 1, 'metadata.timestamp': -1 });

module.exports = mongoose.model('Critique', critiqueSchema);