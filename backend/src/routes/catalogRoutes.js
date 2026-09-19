const express = require('express');
const categories = require('../data/storeCategories');

const router = express.Router();

// Public navigation catalog. Product categories remain managed through /api/products/categories.
router.get('/categories', (req, res) => res.status(200).json({ success: true, data: categories }));

router.get('/categories/:slug', (req, res) => {
  const category = categories.find(({ slug }) => slug === req.params.slug.toLowerCase());

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  return res.status(200).json({ success: true, data: category });
});

module.exports = router;
