// models/Employee.js
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  yearsExperience: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  skills: {
    type: [String]
  },
 
   projects: {
    type: [String]
  },
   costing: {
    type: [String]
  },
   available: {
    type: [String]
  },
  certifications: {
    type: [String]
  },
  performance: {
    skillDistribution: [
      {
        name: String,
        value: Number
      }
    ],
    monthlyPerformance: [
      {
        month: String,
        score: Number
      }
    ],
    projectCompletion: [
      {
        name: String,
        value: Number
      }
    ],
    codeQuality: [
      {
        name: String,
        value: Number
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
