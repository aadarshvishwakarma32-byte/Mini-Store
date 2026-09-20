const mongoose = require('mongoose');
const supportTicketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['general', 'order', 'payment', 'product', 'account', 'other'],
      default: 'general',
    },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    adminReply: { type: String, default: '' },
  },
  { timestamps: true }
);
module.exports = mongoose.model('SupportTicket', supportTicketSchema);
