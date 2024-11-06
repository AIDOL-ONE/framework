// src/models/Performance.js
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  agentId: {
    type: String,
    required: true,
    index: true
  },
  metrics: {
    responseTime: Number,
    successRate: Number,
    qualityScore: Number,
    engagementLevel: Number,
    resourceUsage: {
      cpu: Number,
      memory: Number,
      api: {
        calls: Number,
        costs: Number
      }
    }
  },
  interactions: {
    total: Number,
    successful: Number,
    failed: Number
  },
  content: {
    generated: Number,
    published: Number,
    engagement: {
      likes: Number,
      shares: Number,
      comments: Number
    }
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  }
}, {
  timestamps: true
});

performanceSchema.index({ agentId: 1, 'period.start': 1, 'period.end': 1 });
performanceSchema.index({ 'period.start': 1, 'period.end': 1 });

module.exports = mongoose.model('Performance', performanceSchema);