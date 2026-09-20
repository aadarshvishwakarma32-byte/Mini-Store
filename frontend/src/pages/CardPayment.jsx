import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { orderService } from '../services/order.service.js';
import { toast } from 'sonner';

const CardPayment = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shippingAddress = location.state?.shippingAddress || null;

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isAuthenticated) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">Card Payment</h1>
          <div className="status error">Please login to continue.</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">Card Payment</h1>
          <div className="status">
            Your cart is empty. <a href="/">Continue shopping</a>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    const digitsOnly = card.number.replace(/\s/g, '');
    if (!digitsOnly || digitsOnly.length < 12) {
      newErrors.number = 'Enter a valid card number';
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      newErrors.expiry = 'Use MM/YY format';
    }
    if (!/^\d{3,4}$/.test(card.cvv)) {
      newErrors.cvv = 'Enter CVV';
    }
    if (!card.name.trim()) {
      newErrors.name = 'Name on card is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      const address = shippingAddress || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      };
      const res = await orderService.createOrder(address, 'card');
      if (res.success) {
        toast.success('Payment successful! Order placed.');
        await clearCart();
        navigate('/orders');
      } else {
        toast.error(res.message || 'Payment failed');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const round2 = (n) => Math.round(n * 100) / 100;
  const total = round2(cartTotal);

  return (
    <div className="main">
      <div className="cardPaymentWrap">
        <h1 className="pageTitle">Credit / Debit Card Payment</h1>

        <div className="cardPaymentGrid">
          <form className="cardPaymentForm" onSubmit={handleSubmit}>
            <section>
              <h2 className="checkoutSectionTitle">Card Details</h2>

              <div className="field">
                <label className="labelText" htmlFor="cardName">
                  Name on Card
                </label>
                <input
                  id="cardName"
                  className="input"
                  value={card.name}
                  onChange={(e) => setCard((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
                {errors.name && <span className="errorText">{errors.name}</span>}
              </div>

              <div className="field">
                <label className="labelText" htmlFor="cardNumber">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  className="input"
                  value={card.number}
                  onChange={(e) =>
                    setCard((prev) => ({ ...prev, number: formatCardNumber(e.target.value) }))
                  }
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autocomplete="cc-number"
                  required
                />
                {errors.number && <span className="errorText">{errors.number}</span>}
              </div>

              <div className="cardRow">
                <div className="field">
                  <label className="labelText" htmlFor="cardExpiry">
                    Expiry Date
                  </label>
                  <input
                    id="cardExpiry"
                    className="input"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }))
                    }
                    placeholder="MM/YY"
                    inputMode="numeric"
                    autocomplete="cc-exp"
                    required
                  />
                  {errors.expiry && <span className="errorText">{errors.expiry}</span>}
                </div>
                <div className="field">
                  <label className="labelText" htmlFor="cardCvv">
                    CVV
                  </label>
                  <input
                    id="cardCvv"
                    className="input"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard((prev) => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                      }))
                    }
                    placeholder="123"
                    inputMode="numeric"
                    autocomplete="cc-csc"
                    required
                  />
                  {errors.cvv && <span className="errorText">{errors.cvv}</span>}
                </div>
              </div>
            </section>

            <button type="submit" className="btn checkoutSubmit" disabled={processing}>
              {processing ? 'Processing Payment...' : `Pay ₹${total.toFixed(2)}`}
            </button>
          </form>

          <aside className="checkoutSummary">
            <h2 className="checkoutSectionTitle">Order Summary</h2>
            <div className="summaryItems">
              {cartItems.map((item) => (
                <div key={item.productId} className="summaryItem">
                  <span className="summaryName">
                    {item.product?.name || item.product?.title || 'Product'} × {item.quantity}
                  </span>
                  <span className="summaryPrice">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summaryDivider" />
            <div className="summaryRow">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summaryRow">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summaryTotal">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="cardSecurityNote">
              🔒 Your card details are processed securely. We never store your full card number.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;
