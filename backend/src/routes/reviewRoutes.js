const express = require('express');
const controller = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/:productId', controller.list);
router.post('/:productId', protect, controller.create);
router.put('/:id', protect, controller.update);
router.delete('/:id', protect, controller.remove);
module.exports = router;
