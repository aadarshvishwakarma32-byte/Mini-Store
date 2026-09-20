import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { orderService } from '../services/order.service.js';
import { toast } from 'sonner';

const UPI_APPS = [
  { id: 'phonepe', name: 'PhonePe', logo: '📱', color: '#5F0BAC', upiId: 'ministore@upi' },
  { id: 'paytm', name: 'Paytm', logo: '💰', color: '#00BA7C', upiId: 'ministore@paytm' },
  { id: 'gpay', name: 'Google Pay', logo: '🔵', color: '#4285F4', upiId: 'ministore@gpay' },
  { id: 'bhim', name: 'BHIM', logo: '🇮🇳', color: '#0066B1', upiId: 'ministore@bhim' },
];

const UPI_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi%3A%2F%2Fpay%3Fpa%3Dministore%40upi%26pn%3DMini%20Store%26tr%3DORDER123%26cu%3DINR%26mn%3D1499';

const UpiPayment = () => {
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shippingAddress = location.state?.shippingAddress || null;

  const [selectedApp, setSelectedApp] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">UPI Payment</h1>
          <div className="status error">Please login to continue.</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="main">
        <div className="page">
          <h1 className="pageTitle">UPI Payment</h1>
          <div className="status">
            Your cart is empty. <a href="/">Continue shopping</a>
          </div>
        </div>
      </div>
    );
  }

  const round2 = (n) => Math.round(n * 100) / 100;
  const total = round2(cartTotal);

  const handleAppSelect = (app) => {
    setSelectedApp(app);
  };

  const handlePayment = async () => {
    if (!selectedApp) return;
    setProcessing(true);
    try {
      const address = shippingAddress || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      };
      const res = await orderService.createOrder(address, 'upi');
      if (res.success) {
        toast.success(`Payment initiated via ${selectedApp.name}! Order placed.`);
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
      <div className="upiPaymentWrap">
        <h1 className="pageTitle">UPI Payment</h1>

        <div className="upiPaymentGrid">
          <div className="upiPaymentForm">
            <section>
              <h2 className="checkoutSectionTitle">Choose a UPI App</h2>
              <div className="upiAppGrid">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className={`upiAppCard ${selectedApp?.id === app.id ? 'selected' : ''}`}
                    onClick={() => handleAppSelect(app)}
                  >
                    <span className="upiAppLogo" style={{ background: app.color }}>
                      {app.logo}
                    </span>
                    <span className="upiAppName">{app.name}</span>
                    <span className="upiAppUpiId">{app.upiId}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="checkoutSectionTitle">Or Scan QR Code</h2>
              <div className="upiQrWrap">
                <img src={UPI_QR} alt="UPI QR Code" className="upiQrImage" />
                <p className="upiQrHint">Scan with any UPI app to pay ₹{total.toFixed(2)}</p>
              </div>
            </section>

            <button
              type="button"
              className="btn checkoutSubmit"
              disabled={!selectedApp || processing}
              onClick={handlePayment}
            >
              {processing
                ? 'Processing...'
                : `Pay ₹${total.toFixed(2)} via ${selectedApp ? selectedApp.name : 'UPI'}`}
            </button>
          </div>

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
              🔒 UPI payments are processed securely through your chosen app.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
