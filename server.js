// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const teamRoutes = require('./routes/teams');
app.use('/api/teams', teamRoutes);

const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://pinkymine:pinkymine@cluster0.j193iul.mongodb.net/teamsdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
