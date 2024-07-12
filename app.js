const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use('/api', dataRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
