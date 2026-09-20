// config/database.js
// Database connection setup — similar to Java's DataSource / EntityManagerFactory config
const mongoose = require('mongoose');
const environment = require('./environment');

const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(environment.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB disconnect error:', error.message);
  }
};

module.exports = { connectDatabase, disconnectDatabase };
