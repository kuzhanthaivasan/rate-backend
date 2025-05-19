// models/Team.js
const mongoose = require('mongoose');

// Define a schema for team performance data points
const performanceDataSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

// Define the main Team schema
const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Team description is required'],
    trim: true
  },
  lead: {
    type: String,
    required: [true, 'Team lead name is required'],
    trim: true
  },
  members: {
    type: Number,
    required: [true, 'Number of team members is required'],
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'on-hold'],
    default: 'active'
  },
  completedProjects: {
    type: Number,
    required: [true, 'Number of completed projects is required'],
    default: 0,
    min: 0
  },
  ongoingProjects: {
    type: Number,
    required: [true, 'Number of ongoing projects is required'],
    default: 0,
    min: 0
  },
  performance: {
    type: Number,
    required: [true, 'Performance score is required'],
    min: 0,
    max: 100
  },
  teamPerformance: {
    type: [performanceDataSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
TeamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Team', TeamSchema);