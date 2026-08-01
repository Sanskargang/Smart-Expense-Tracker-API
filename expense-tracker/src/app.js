const express = require('express');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Creates and configures the Express application.
 * Separated from server.js to allow supertest testing without binding to a network port.
 */
function createApp() {
  const app = express();

  // Middleware to parse incoming JSON payloads
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Smart Expense Tracker REST API' });
  });

  // Mount API endpoints
  app.use('/expenses', expenseRoutes);
  app.use('/api/v1/expenses', expenseRoutes); // Support versioned API prefix as well

  // Centralized error handler middleware
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
