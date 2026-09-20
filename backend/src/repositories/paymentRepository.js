// repositories/paymentRepository.js
// Repository — data-access calls against the Payment collection
const Payment = require('../models/Payment');

const create = (paymentData) => Payment.create(paymentData);

const findById = (id) => Payment.findById(id).populate('order').populate('user', 'name email');

const findByMerchantRef = (merchantOrderRef) =>
  Payment.findOne({ merchantOrderRef }).populate('order').populate('user', 'name email');

const findByOrder = (orderId) => Payment.find({ order: orderId }).sort({ createdAt: -1 });

const updateStatus = (id, status, extra = {}) =>
  Payment.findByIdAndUpdate(id, { status, ...extra }, { new: true, runValidators: true });

const markPaid = (id, providerResponse) =>
  Payment.findByIdAndUpdate(
    id,
    {
      status: 'success',
      paidAt: new Date(),
      providerResponse,
    },
    { new: true, runValidators: true }
  );

module.exports = { create, findById, findByMerchantRef, findByOrder, updateStatus, markPaid };
