// services/paymentService.js
// Service — business logic for creating and verifying payments via PhonePe gateway
const paymentRepository = require('../repositories/paymentRepository');
const orderRepository = require('../repositories/orderRepository');
const AppError = require('../utils/AppError');
const environment = require('../config/environment');
const crypto = require('crypto');
const axios = require('axios');

/**
 * PhonePe API v1 constants (sandbox). In production, swap base URL + credentials.
 */
const PHONEPE = {
  BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com',
  CLIENT_ID: process.env.PHONEPE_CLIENT_ID || 'TEST',
  CLIENT_VERSION: process.env.PHONEPE_CLIENT_VERSION || '1',
  SALT_KEY: process.env.PHONEPE_SALT_KEY || 'TEST_SALT',
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || 'TEST_MERCHANT',
};

const X_VERIFY_URL = `${PHONEPE.BASE_URL}/v1/checkout/status`;

/**
 * Build a unique merchant order reference.
 */
const buildMerchantRef = (userId) => {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `MS_${userId.slice(-6)}_${stamp}${rand}`.toUpperCase();
};

/**
 * Create a PhonePe checkout payload for UPI collect / QR / card / netbanking.
 * Returns { redirectUrl, orderId } for the frontend to redirect the user.
 */
const initiatePayment = async (order, { method, upiId, cardLast4, cardNetwork, bankCode }) => {
  const merchantOrderRef = buildMerchantRef(order.user.toString());

  const payload = {
    merchantId: PHONEPE.MERCHANT_ID,
    merchantUserId: order.user.toString(),
    merchantOrderId: merchantOrderRef,
    amount: Math.round(order.totalAmount * 100), // paise
    merchantUiVersion: PHONEPE.CLIENT_VERSION,
    // Gateway callbacks must hit the API (Render), not the Vercel SPA
    callbackUrl: `${environment.API_PUBLIC_URL}/api/payments/callback`,
    redirectUrl: `${environment.CLIENT_URL}/orders?orderId=${order._id}&paid=1`,
    redirectMode: 'POST',
    paymentFlow: {
      mode: method === 'upi_qr' ? 'QR_CODE' : 'UPI_COLLECT',
      upiApp:
        method === 'phonepe'
          ? 'PHONEPE'
          : method === 'paytm'
            ? 'PAYTM'
            : method === 'gpay'
              ? 'GPay'
              : method === 'bhim'
                ? 'BHIM'
                : undefined,
    },
    paymentOptions: {
      upi: true,
      card: method === 'card',
      netbanking: method === 'netbanking',
      wallet: false,
    },
  };

  if (upiId) payload.paymentFlow.upiId = upiId;
  if (cardLast4) payload.cardLast4 = cardLast4;
  if (cardNetwork) payload.cardNetwork = cardNetwork;
  if (bankCode) payload.bankCode = bankCode;

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const XVerification = `${base64Payload}${PHONEPE.SALT_KEY}`;
  const checksum = crypto.createHash('sha256').update(XVerification).digest('hex');

  const payment = await paymentRepository.create({
    order: order._id,
    user: order.user,
    amount: order.totalAmount,
    currency: 'INR',
    provider: 'phonepe',
    method,
    merchantOrderRef,
    providerOrderId: payload.merchantOrderId,
    upiId: upiId || null,
    cardLast4: cardLast4 || null,
    cardNetwork: cardNetwork || null,
    bankCode: bankCode || null,
    status: 'pending',
  });

  return {
    paymentId: payment._id,
    merchantOrderRef,
    redirectUrl: `${PHONEPE.BASE_URL}/v1/checkout?data=${encodeURIComponent(base64Payload)}&checksum=${checksum}`,
    payload,
  };
};

/**
 * Verify a payment callback from PhonePe.
 */
const verifyPayment = async (merchantOrderRef) => {
  const payment = await paymentRepository.findByMerchantRef(merchantOrderRef);
  if (!payment) throw new AppError('Payment not found', 404);

  const base64Payload = Buffer.from(
    JSON.stringify({
      merchantId: PHONEPE.MERCHANT_ID,
      merchantOrderId: payment.merchantOrderRef,
    })
  ).toString('base64');
  const XVerification = `${base64Payload}${PHONEPE.SALT_KEY}`;
  const checksum = crypto.createHash('sha256').update(XVerification).digest('hex');

  try {
    const response = await axios.get(`${X_VERIFY_URL}/${payment.merchantOrderRef}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': PHONEPE.CLIENT_ID,
        'X-Client-Version': PHONEPE.CLIENT_VERSION,
        'X-Checksum': checksum,
      },
    });

    const data = response.data?.response
      ? JSON.parse(Buffer.from(response.data.response, 'base64').toString())
      : response.data;

    if (data?.code === 'PAYMENT_SUCCESS') {
      await paymentRepository.markPaid(payment._id, data);
      await orderRepository.updatePaymentStatus(payment.order, 'paid');
      return { success: true, payment, gateway: data };
    }

    await paymentRepository.updateStatus(payment._id, 'failed', { providerResponse: data });
    return { success: false, payment, gateway: data };
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.code === 'ENOTFOUND' || err.code === 'ECONNRESET') {
      await paymentRepository.updateStatus(payment._id, 'pending', {
        providerResponse: {
          error: err.message,
          note: 'Verification network error, status retained as pending',
        },
      });
      throw new AppError(
        'Payment verification temporarily unavailable. Please check status later.',
        503
      );
    }
    await paymentRepository.updateStatus(payment._id, 'failed', {
      providerResponse: { error: err.message },
    });
    throw new AppError('Unable to verify payment with gateway', 500);
  }
};

/**
 * Refund a payment (admin settlement flow).
 */
const refundPayment = async (paymentId, amount) => {
  const payment = await paymentRepository.findById(paymentId);
  if (!payment) throw new AppError('Payment not found', 404);
  if (payment.status !== 'success') throw new AppError('Payment not yet successful', 400);

  await paymentRepository.updateStatus(payment._id, 'refunded', {
    providerResponse: {
      refundAmount: amount,
      note: 'Refund processed locally; integrate provider refund API for actual settlement',
    },
  });
  return payment;
};

module.exports = {
  initiatePayment,
  verifyPayment,
  refundPayment,
};
