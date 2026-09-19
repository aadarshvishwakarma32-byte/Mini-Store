const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'Mini Store', trim: true },
  announcement: { type: String, default: 'Free delivery on orders over ₹999', trim: true },
  supportEmail: { type: String, default: 'support@ministore.com', trim: true },
  currency: { type: String, default: 'INR', trim: true, uppercase: true },
  isStoreOpen: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
