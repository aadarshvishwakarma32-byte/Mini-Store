// server.js
// Entry point — connects to the database, then starts the HTTP server.
// Run with: node src/server.js  (or `npm run dev` for nodemon)
const app = require('./app');
const environment = require('./config/environment');
const { connectDatabase } = require('./config/database');

const start = async () => {
  await connectDatabase();

  const server = app.listen(environment.PORT, () => {
    console.log(`Server running in ${environment.NODE_ENV} mode on port ${environment.PORT}`);
  });

  // Graceful shutdown & unhandled error safety nets
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

start();
