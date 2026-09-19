// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect);

// User endpoints
router.post('/', orderController.placeOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.delete('/:id', orderController.cancelOrder);

// Admin endpoints
router.get('/', adminOnly, orderController.listAllOrders);
router.put('/:id/status', adminOnly, orderController.updateOrderStatus);

module.exports = router;
