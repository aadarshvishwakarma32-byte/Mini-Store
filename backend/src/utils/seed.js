// src/utils/seed.js
// Convenience script (not part of the core layered structure) that populates
// the database with sample data so the frontend has something to display
// right after setup. Run with: npm run seed
const { connectDatabase, disconnectDatabase } = require('../config/database');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const { hashPassword } = require('./password');

const categoriesData = [
  { name: 'Electronics', description: 'Gadgets, devices and accessories' },
  { name: 'Fashion', description: 'Apparel for everyone' },
  { name: 'Home & Kitchen', description: 'Everything for your home' },
  { name: 'Beauty', description: 'Beauty and personal care products' },
  { name: 'Sports', description: 'Sports and fitness essentials' },
  { name: 'Books', description: 'Books for every reader' },
  { name: 'Accessories', description: 'Everyday accessories' },
  { name: 'Mobiles', description: 'Smartphones and mobile devices' },
  { name: 'Computers', description: 'Computers and peripherals' },
];

const productsData = (categoryMap) => [
  {
    title: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with noise cancellation.',
    price: 59.99,
    category: categoryMap.Electronics,
    image: 'https://picsum.photos/seed/headphones/400/400',
    stock: 25,
    rating: { rate: 4.3, count: 120 },
  },
  {
    title: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart-rate monitor.',
    price: 89.99,
    category: categoryMap.Electronics,
    image: 'https://picsum.photos/seed/smartwatch/400/400',
    stock: 15,
    rating: { rate: 4.1, count: 80 },
  },
  {
    title: 'Cotton T-Shirt',
    description: 'Soft, breathable 100% cotton t-shirt.',
    price: 14.99,
    category: categoryMap.Fashion,
    image: 'https://picsum.photos/seed/tshirt/400/400',
    stock: 100,
    rating: { rate: 4.5, count: 300 },
  },
  {
    title: 'Denim Jacket',
    description: 'Classic fit denim jacket for all seasons.',
    price: 49.99,
    category: categoryMap.Fashion,
    image: 'https://picsum.photos/seed/jacket/400/400',
    stock: 40,
    rating: { rate: 4.0, count: 65 },
  },
  {
    title: 'Non-Stick Frying Pan',
    description: '10-inch non-stick frying pan, dishwasher safe.',
    price: 24.99,
    category: categoryMap['Home & Kitchen'],
    image: 'https://picsum.photos/seed/pan/400/400',
    stock: 50,
    rating: { rate: 4.6, count: 210 },
  },
  {
    title: 'Ceramic Mug Set',
    description: 'Set of 4 ceramic coffee mugs.',
    price: 19.99,
    category: categoryMap['Home & Kitchen'],
    image: 'https://picsum.photos/seed/mugs/400/400',
    stock: 60,
    rating: { rate: 4.7, count: 140 },
  },
];

const seed = async () => {
  await connectDatabase();

  console.log('Clearing existing categories & products...');
  await Category.deleteMany({});
  await Product.deleteMany({});

  console.log('Creating categories...');
  const createdCategories = await Category.insertMany(categoriesData);
  const categoryMap = createdCategories.reduce((map, c) => {
    map[c.name] = c._id;
    return map;
  }, {});

  console.log('Creating products...');
  await Product.insertMany(productsData(categoryMap));

  // Create a default admin if one doesn't already exist
  const adminEmail = 'admin@ministore.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    console.log('Creating default admin user...');
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: await hashPassword('Admin@123'),
      role: 'admin',
    });
    console.log(`Admin created -> email: ${adminEmail} / password: Admin@123`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  console.log('Seeding complete.');
  await disconnectDatabase();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
