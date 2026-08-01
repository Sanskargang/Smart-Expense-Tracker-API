const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  console.log(`[Smart Expense Tracker REST API] Server listening on http://${HOST}:${PORT}`);
  console.log(`[Smart Expense Tracker REST API] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

module.exports = server;
