import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { orderService } from '../services/order.service.js';
import { toast } from 'sonner';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">Checkout</h1>
          <div className="status error">Please login to continue checkout.</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">Checkout</h1>
          <div className="status">Your cart is empty. <a href="/">Continue shopping</a></div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      navigate('/card-payment', { state: { shippingAddress: form } });
      return;
    }
    if (paymentMethod === 'upi') {
      navigate('/upi-payment', { state: { shippingAddress: form } });
      return;
    }
    if (paymentMethod === 'netbanking') {
      navigate('/net-banking', { state: { shippingAddress: form } });
      return;
    }
    setSubmitting(true);
    try {
      const res = await orderService.createOrder(form, paymentMethod);
      if (res.success) {
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        toast.error(res.message || 'Order failed');
      }
    } catch (error) {
      toast.error(error.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  const round2 = (n) => Math.round(n * 100) / 100;
  const total = round2(cartTotal);

  return (
    <div className="main">
      <div className="checkoutWrap">
        <h1 className="pageTitle">Checkout</h1>

        <div className="checkoutGrid">
          <form className="checkoutForm" onSubmit={handleSubmit}>
            <section>
              <h2 className="checkoutSectionTitle">Shipping Address</h2>
              <div className="field">
                <label className="labelText" htmlFor="street">Street Address</label>
                <input
                  id="street"
                  name="street"
                  className="input"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="field">
                <label className="labelText" htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  className="input"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  required
                />
              </div>
              <div className="field">
                <label className="labelText" htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  className="input"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
              </div>
              <div className="field">
                <label className="labelText" htmlFor="zipCode">ZIP / Postal Code</label>
                <input
                  id="zipCode"
                  name="zipCode"
                  className="input"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="400001"
                  required
                />
              </div>
              <div className="field">
                <label className="labelText" htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  className="input"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="India"
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="checkoutSectionTitle">Payment Method</h2>
              <div className="paymentOptions">
                <label className={`paymentOption ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span className="paymentIcon">💵</span>
                  <span className="paymentLabel">Cash on Delivery (COD)</span>
                </label>
                <label className={`paymentOption ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span className="paymentIcon">💳</span>
                  <span className="paymentLabel">Credit / Debit Card</span>
                </label>
                <label className={`paymentOption ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <span className="paymentIcon">📱</span>
                  <span className="paymentLabel">UPI</span>
                </label>
                <label className={`paymentOption ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  <span className="paymentIcon">🏦</span>
                  <span className="paymentLabel">Net Banking</span>
                </label>
                <label className={`paymentOption ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  <span className="paymentIcon">PayPal</span>
                  <span className="paymentLabel">PayPal</span>
                </label>
              </div>
            </section>

            <button type="submit" className="btn checkoutSubmit" disabled={submitting}>
              {submitting ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
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
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;