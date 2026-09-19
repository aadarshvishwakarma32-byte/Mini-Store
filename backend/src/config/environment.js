// config/environment.js
// Centralized environment configuration — similar to Java's application.properties / application.yml
require('dotenv').config();
const path = require('path');

const environment = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_store',

  // Auth / JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

  // CORS
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  MAIL_FROM: process.env.MAIL_FROM || 'Mini Store <onboarding@resend.dev>',

  // Uploads — UPLOAD_DIR is the display/relative name; UPLOAD_PATH is the
  // absolute, cwd-independent path actually used by multer/static serving.
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  UPLOAD_PATH: path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads'),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,
};

if (!process.env.MONGO_URI || /YOUR_CLUSTER|YOUR_USERNAME|YOUR_PASSWORD/.test(process.env.MONGO_URI)) {
  console.error('ERROR: MONGO_URI is not configured. Set a valid MongoDB connection string in your environment variables.');
  process.exit(1);
}

module.exports = environment;
