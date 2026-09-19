// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

// Self-service (any logged-in user)
router.get('/me', protect, userController.getMe);
router.put('/me', protect, userController.updateMe);

// Admin only
router.get('/', protect, adminOnly, userController.listUsers);
router.get('/:id', protect, adminOnly, userController.getUserById);
router.put('/:id/role', protect, adminOnly, userController.updateUserRole);
router.put('/:id/status', protect, adminOnly, userController.setUserActiveStatus);
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;
