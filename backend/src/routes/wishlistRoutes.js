const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addProduct);
router.delete('/:productId', wishlistController.removeProduct);

module.exports = router;
