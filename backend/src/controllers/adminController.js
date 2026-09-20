const Category = require('../models/Category');
const Product = require('../models/Product');
const StoreSettings = require('../models/StoreSettings');
const response = require('../utils/response');
const { getSnapshot } = require('../utils/activityMonitor');

const sourceUrl = 'https://dummyjson.com/products?limit=0';

const categoryRules = [
  { name: 'Electronics', sourceCategories: ['tablets', 'audio'] },
  { name: 'Fashion', sourceCategories: ['tops', 'mens-shirts', 'womens-dresses'] },
  {
    name: 'Home & Kitchen',
    sourceCategories: ['kitchen-accessories', 'home-decoration', 'furniture'],
  },
  { name: 'Beauty', sourceCategories: ['beauty', 'skin-care', 'fragrances'] },
  { name: 'Sports', sourceCategories: ['sports-accessories'] },
  { name: 'Accessories', sourceCategories: ['womens-bags', 'womens-jewellery', 'sunglasses'] },
  { name: 'Mobiles', sourceCategories: ['smartphones', 'mobile-accessories'] },
  { name: 'Computers', sourceCategories: ['laptops'] },
];

const localOnlyProducts = [
  {
    title: 'The Little Prince',
    description: 'A beloved illustrated classic for readers of all ages.',
    price: 12.99,
    category: 'Books',
    image: 'https://dummyjson.com/image/600x400/2563eb/ffffff?text=The+Little+Prince',
    stock: 42,
    rating: { rate: 4.8, count: 318 },
  },
  {
    title: 'Atomic Habits',
    description: 'A practical guide to building good habits and making lasting changes.',
    price: 16.99,
    category: 'Books',
    image: 'https://dummyjson.com/image/600x400/0f766e/ffffff?text=Atomic+Habits',
    stock: 34,
    rating: { rate: 4.7, count: 241 },
  },
];

const importWebCatalog = async (req, res, next) => {
  try {
    const apiResponse = await fetch(sourceUrl);
    if (!apiResponse.ok) throw new Error(`Catalog source returned ${apiResponse.status}`);
    const { products: sourceProducts = [] } = await apiResponse.json();

    const categoryNames = [...categoryRules.map((rule) => rule.name), 'Books', 'Offers'];
    const existingCategories = await Category.find({ name: { $in: categoryNames } });
    const categoryByName = new Map(existingCategories.map((category) => [category.name, category]));

    for (const name of categoryNames) {
      if (!categoryByName.has(name)) {
        const category = await Category.create({ name, description: `${name} products` });
        categoryByName.set(name, category);
      }
    }

    const candidates = [];
    categoryRules.forEach(({ name, sourceCategories }) => {
      const matchingProducts = sourceProducts
        .filter((product) => sourceCategories.includes(product.category))
        .slice(0, 2);

      matchingProducts.forEach((product) => {
        candidates.push({
          title: product.title,
          description: product.description,
          price: Number(product.price),
          category: categoryByName.get(name)._id,
          image: product.thumbnail || product.images?.[0] || '',
          stock: Number(product.stock) || 0,
          rating: {
            rate: Number(product.rating) || 0,
            count: Math.max(Number(product.reviews?.length) || 0, 1),
          },
        });
      });
    });

    localOnlyProducts.forEach((product) => {
      candidates.push({ ...product, category: categoryByName.get(product.category)._id });
    });

    // Offers reuse genuine catalog entries with a lower promotional price.
    sourceProducts.slice(0, 2).forEach((product) => {
      candidates.push({
        title: `${product.title} - Special Offer`,
        description: `${product.description} Limited-time promotional price.`,
        price: Math.max(1, Math.round(Number(product.price) * 0.8 * 100) / 100),
        category: categoryByName.get('Offers')._id,
        image: product.thumbnail || product.images?.[0] || '',
        stock: Number(product.stock) || 0,
        rating: {
          rate: Number(product.rating) || 0,
          count: Math.max(Number(product.reviews?.length) || 0, 1),
        },
      });
    });

    const existingTitles = new Set(
      (
        await Product.find({ title: { $in: candidates.map((product) => product.title) } }).select(
          'title'
        )
      ).map((product) => product.title)
    );
    const newProducts = candidates.filter((product) => !existingTitles.has(product.title));
    if (newProducts.length) await Product.insertMany(newProducts);

    return response.success(res, {
      message: `${newProducts.length} products imported from the web catalog`,
      data: { imported: newProducts.length, skipped: candidates.length - newProducts.length },
    });
  } catch (error) {
    return next(error);
  }
};

const getStoreSettings = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) settings = await StoreSettings.create({});
    return response.success(res, { data: settings });
  } catch (error) {
    return next(error);
  }
};

const updateStoreSettings = async (req, res, next) => {
  try {
    const allowed = ['storeName', 'announcement', 'supportEmail', 'currency', 'isStoreOpen'];
    const updates = Object.fromEntries(
      allowed.filter((key) => key in req.body).map((key) => [key, req.body[key]])
    );
    const settings = await StoreSettings.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return response.success(res, { message: 'Store settings updated', data: settings });
  } catch (error) {
    return next(error);
  }
};

const getMonitoring = async (req, res, next) => {
  try {
    const [products, activeProducts, users, activeUsers, orders] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      require('../models/User').countDocuments(),
      require('../models/User').countDocuments({ isActive: true }),
      require('../models/Order').countDocuments(),
    ]);
    return response.success(res, {
      data: { ...getSnapshot(), totals: { products, activeProducts, users, activeUsers, orders } },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { importWebCatalog, getStoreSettings, updateStoreSettings, getMonitoring };
