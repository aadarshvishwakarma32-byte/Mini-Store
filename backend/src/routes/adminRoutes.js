const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { importWebCatalog, getStoreSettings, updateStoreSettings, getMonitoring } = require('../controllers/adminController');

const router = express.Router();

router.post('/catalog/import', protect, adminOnly, importWebCatalog);
router.get('/settings', protect, adminOnly, getStoreSettings);
router.put('/settings', protect, adminOnly, updateStoreSettings);
router.get('/monitoring', protect, adminOnly, getMonitoring);

module.exports = router;
