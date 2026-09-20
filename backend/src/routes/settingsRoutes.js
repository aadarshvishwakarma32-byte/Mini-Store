const express = require('express');
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', settingsController.get);
router.put('/', settingsController.update);

module.exports = router;
