// controllers/paymentController.js
// Controller — PhonePe gateway checkout, verification, and refunds
const orderService = require('../services/orderService');
const paymentService = require('../services/paymentService');
const response = require('../utils/response');

/**
 * POST /api/payments/initiate
 * Body: { orderId, method, upiId?, cardLast4?, cardNetwork?, bankCode? }
 * Creates a PhonePe checkout payload and returns a redirect URL.
 */
const initiate = async (req, res, next) => {
  try {
    const { orderId, method = 'upi', upiId, cardLast4, cardNetwork, bankCode } = req.body;
    if (!orderId) {
      return response.error(res, { message: 'orderId is required', statusCode: 400 });
    }

    const order = await orderService.getOrderById(orderId, req.user);
    const result = await paymentService.initiatePayment(order, {
      method,
      upiId,
      cardLast4,
      cardNetwork,
      bankCode,
    });
    return response.success(res, { message: 'Payment initiated', data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/verify/:merchantOrderRef
 * Verifies payment status with PhonePe and updates order + payment records.
 */
const verify = async (req, res, next) => {
  try {
    const { merchantOrderRef } = req.params;
    const result = await paymentService.verifyPayment(merchantOrderRef);
    return response.success(res, { message: 'Payment verified', data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/callback
 * PhonePe server-to-server webhook. Accepts merchantOrderId / merchantOrderRef
 * from JSON or form body and runs the same verification path.
 */
const callback = async (req, res, next) => {
  try {
    const merchantOrderRef =
      req.body?.merchantOrderId ||
      req.body?.merchantOrderRef ||
      req.body?.transactionId ||
      req.query?.merchantOrderId;

    if (!merchantOrderRef) {
      return response.error(res, { message: 'merchantOrderId is required', statusCode: 400 });
    }

    const result = await paymentService.verifyPayment(String(merchantOrderRef));
    return response.success(res, { message: 'Payment callback processed', data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/refund/:paymentId
 * Admin-only refund flow.
 */
const refund = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const payment = await paymentService.refundPayment(req.params.paymentId, amount);
    return response.success(res, { message: 'Refund processed', data: payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { initiate, verify, callback, refund };
