// routes/teams.js
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

/**
 * @route   GET /api/teams
 * @desc    Get all teams
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/teams/:id
 * @desc    Get single team by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/teams
 * @desc    Create a new team
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // Create default performance data if not provided
    if (!req.body.teamPerformance || req.body.teamPerformance.length === 0) {
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const previousMonths = getPreviousMonths(5);
      
      req.body.teamPerformance = [
        ...previousMonths.map((month, index) => ({
          month,
          score: 80 + Math.floor(Math.random() * 10) // Generate random scores between 80-89
        })),
        { month: currentMonth, score: req.body.performance || 75 }
      ];
    }
    
    const team = await Team.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating team',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/teams/:id
 * @desc    Update a team
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    // Update the team
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Team updated successfully',
      data: updatedTeam
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating team',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/teams/:id/performance
 * @desc    Update team performance
 * @access  Public
 */
router.put('/:id/performance', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    // Get current month
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    
    // Update overall performance score
    team.performance = req.body.performance;
    
    // Update or add performance for current month
    const monthIndex = team.teamPerformance.findIndex(p => p.month === currentMonth);
    
    if (monthIndex >= 0) {
      team.teamPerformance[monthIndex].score = req.body.performance;
    } else {
      team.teamPerformance.push({
        month: currentMonth,
        score: req.body.performance
      });
    }
    
    // Keep only the last 6 months of performance data
    if (team.teamPerformance.length > 6) {
      team.teamPerformance = team.teamPerformance.slice(-6);
    }
    
    await team.save();
    
    res.json({
      success: true,
      message: 'Team performance updated successfully',
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating team performance',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/teams/:id
 * @desc    Delete a team
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    await team.deleteOne();
    
    res.json({
      success: true,
      message: 'Team deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message
    });
  }
});

// Helper function to get previous months
function getPreviousMonths(count) {
  const months = [];
  const date = new Date();
  
  for (let i = count; i > 0; i--) {
    date.setMonth(date.getMonth() - 1);
    months.push(date.toLocaleString('default', { month: 'short' }));
  }
  
  return months.reverse();
}

module.exports = router;