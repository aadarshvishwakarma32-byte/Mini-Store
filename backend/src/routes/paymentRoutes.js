// routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect);

// User: initiate a PhonePe checkout for an existing order
router.post('/initiate', paymentController.initiate);

// PhonePe callback / verify endpoint (called by gateway or frontend)
router.post('/verify/:merchantOrderRef', paymentController.verify);

// Admin: refund a payment
router.post('/refund/:paymentId', adminOnly, paymentController.refund);

module.exports = router;