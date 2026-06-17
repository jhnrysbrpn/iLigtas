const express = require('express');
const cors = require('cors');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const alertsRoutes = require('./routes/alerts');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});