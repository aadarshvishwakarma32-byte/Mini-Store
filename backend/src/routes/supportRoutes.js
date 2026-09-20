const express = require('express');
const supportController = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', supportController.create);
router.get('/my', supportController.mine);
router.get('/:id', supportController.one);

module.exports = router;
