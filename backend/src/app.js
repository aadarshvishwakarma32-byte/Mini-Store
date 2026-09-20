// app.js
// Express application setup — registers global middleware and mounts routes.
// Kept separate from server.js so the app can be imported in tests without
// actually binding to a port.
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const environment = require('./config/environment');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { trackActivity } = require('./utils/activityMonitor');

// Ensure the uploads directory exists so multer/static-serving never fail
// with ENOENT on a fresh checkout (the folder only ships with a .gitkeep).
if (!fs.existsSync(environment.UPLOAD_PATH)) {
  fs.mkdirSync(environment.UPLOAD_PATH, { recursive: true });
}

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const supportRoutes = require('./routes/supportRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- Global middleware ---
app.use(cors({ origin: environment.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trackActivity);

if (environment.NODE_ENV !== 'test') {
  app.use(morgan(environment.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Serve uploaded product images statically
app.use('/uploads', express.static(environment.UPLOAD_PATH));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 + global error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
