// models/Payment.js
// Entity — records every payment attempt and its PhonePe gateway lifecycle
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    provider: {
      type: String,
      enum: ['phonepe', 'razorpay', 'stripe', 'cod', 'other'],
      default: 'phonepe',
    },
    method: {
      type: String,
      enum: ['upi', 'upi_qr', 'card', 'netbanking', 'wallet', 'cod'],
      default: 'upi',
    },
    // PhonePe merchant order id (our internal reference)
    merchantOrderRef: {
      type: String,
      required: true,
      unique: true,
    },
    providerOrderId: {
      type: String,
      default: null,
    },
    // UPI / QR details
    upiId: { type: String, default: null },
    qrImageUrl: { type: String, default: null },
    // Card / netbanking details (stored minimally, never full PAN)
    cardLast4: { type: String, default: null },
    cardNetwork: { type: String, default: null },
    bankCode: { type: String, default: null },
    // Response payload from PhonePe for auditing
    providerResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'timeout', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
