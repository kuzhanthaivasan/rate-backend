// routes/employees.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

/**
 * @route   GET /api/employees
 * @desc    Get all employees
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/employees/:id
 * @desc    Get single employee by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/employees
 * @desc    Create a new employee
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // Create default performance data if not provided
    if (!req.body.performance) {
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const previousMonths = getPreviousMonths(5);
      
      req.body.performance = {
        monthlyPerformance: [
          ...previousMonths.map((month, index) => ({
            month,
            score: 70 + Math.floor(Math.random() * 20) // Generate random scores between 70-89
          })),
          { month: currentMonth, score: 85 }
        ],
        skillDistribution: [
          { name: 'Technical', value: 40 },
          { name: 'Soft Skills', value: 30 },
          { name: 'Problem Solving', value: 20 },
          { name: 'Leadership', value: 10 }
        ],
        projectCompletion: [
          { name: 'Completed', value: 80 },
          { name: 'Pending', value: 20 }
        ],
        codeQuality: [
          { name: 'Clean Code', value: 75 },
          { name: 'Needs Improvement', value: 25 }
        ]
      };
    }
    
    const employee = await Employee.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
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
      message: 'Error creating employee',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/employees/:id
 * @desc    Update an employee
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Update the employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
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
      message: 'Error updating employee',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete an employee
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    await employee.deleteOne();
    
    res.json({
      success: true,
      message: 'Employee deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/employees/team/:teamId
 * @desc    Get employees by team ID
 * @access  Public
 */
router.get('/team/:teamId', async (req, res) => {
  try {
    const employees = await Employee.find({ team: req.params.teamId }).sort({ name: 1 });
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees by team',
      error: error.message
    });
  }
});

router.get('/team/name/:teamName', async (req, res) => {
  try {
    const teamName = req.params.teamName;
    
    // Find employees with the provided team name
    const employees = await Employee.find({ team: teamName }).sort({ name: 1 });
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees by team name',
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