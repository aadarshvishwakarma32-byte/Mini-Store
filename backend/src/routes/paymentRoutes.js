// routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

// PhonePe server-to-server callback (no JWT — gateway cannot authenticate)
router.post('/callback', paymentController.callback);

// User: initiate a PhonePe checkout for an existing order
router.post('/initiate', protect, paymentController.initiate);

// PhonePe verify endpoint (called by frontend after redirect)
router.post('/verify/:merchantOrderRef', protect, paymentController.verify);

// Admin: refund a payment
router.post('/refund/:paymentId', protect, adminOnly, paymentController.refund);

module.exports = router;
