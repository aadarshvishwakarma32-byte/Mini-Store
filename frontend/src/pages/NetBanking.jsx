import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { orderService } from '../services/order.service.js';
import { toast } from 'sonner';

const BANKS = [
  { id: 'sbi', name: 'State Bank of India (SBI)', logo: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'pnb', name: 'Punjab National Bank (PNB)', logo: '🏦' },
  { id: 'bob', name: 'Bank of Baroda', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
  { id: 'yes', name: 'Yes Bank', logo: '🏦' },
  { id: 'federal', name: 'Federal Bank', logo: '🏦' },
  { id: 'indusind', name: 'IndusInd Bank', logo: '🏦' },
];

const NetBanking = () => {
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shippingAddress = location.state?.shippingAddress || null;

  const [selectedBank, setSelectedBank] = useState(null);
  const [form, setForm] = useState({
    bankId: '',
    pin: '',
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isAuthenticated) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">Net Banking</h1>
          <div className="status error">Please login to continue.</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">Net Banking</h1>
          <div className="status">Your cart is empty. <a href="/">Continue shopping</a></div>
        </div>
      </div>
    );
  }

  const round2 = (n) => Math.round(n * 100) / 100;
  const total = round2(cartTotal);

  const validate = () => {
    const newErrors = {};
    if (!form.bankId) {
      newErrors.bankId = 'Please select your bank';
    }
    if (!/^\d{4,6}$/.test(form.pin)) {
      newErrors.pin = 'Enter a valid 4-6 digit PIN';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setForm((prev) => ({ ...prev, bankId: bank.id }));
    setErrors({});
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
      const res = await orderService.createOrder(address, 'netbanking');
      if (res.success) {
        toast.success(`Net Banking payment successful! Order placed.`);
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

  return (
    <div className="main">
      <div className="netbankingWrap">
        <h1 className="pageTitle">Net Banking Payment</h1>

        <div className="netbankingGrid">
          <form className="netbankingForm" onSubmit={handleSubmit}>
            <section>
              <h2 className="checkoutSectionTitle">Select Your Bank</h2>
              <div className="bankGrid">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    className={`bankCard ${selectedBank?.id === bank.id ? 'selected' : ''}`}
                    onClick={() => handleBankSelect(bank)}
                  >
                    <span className="bankLogo">{bank.logo}</span>
                    <span className="bankName">{bank.name}</span>
                  </button>
                ))}
              </div>
              {errors.bankId && <span className="errorText">{errors.bankId}</span>}
            </section>

            <section>
              <h2 className="checkoutSectionTitle">Net Banking Credentials</h2>
              <div className="field">
                <label className="labelText" htmlFor="bankId">Bank ID / Username</label>
                <input
                  id="bankId"
                  className="input"
                  value={form.bankId}
                  onChange={(e) => setForm((prev) => ({ ...prev, bankId: e.target.value }))}
                  placeholder="Enter your bank login ID"
                  required
                />
              </div>
              <div className="field">
                <label className="labelText" htmlFor="pin">Transaction PIN</label>
                <input
                  id="pin"
                  type="password"
                  className="input"
                  value={form.pin}
                  onChange={(e) => setForm((prev) => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="Enter 4-6 digit PIN"
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
                {errors.pin && <span className="errorText">{errors.pin}</span>}
              </div>
            </section>

            <button type="submit" className="btn checkoutSubmit" disabled={processing}>
              {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
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
              🔒 Your net banking credentials are processed securely. We never store your PIN.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NetBanking;