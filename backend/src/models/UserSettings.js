const mongoose = require('mongoose');
const userSettingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    notifications: {
      email: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
    },
    preferences: {
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'USD' },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('UserSettings', userSettingsSchema);
