import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';

const round2 = (n) => Math.round(n * 100) / 100;

const Cart = ({ onClose }) => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = round2(cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0));

  const handleBuyNow = () => {
    if (cartItems.length === 0) return;
    onClose();
    navigate('/checkout');
  };

  return (
    <aside className="cart cartOpen" aria-hidden="false">
      <div className="cartHeader">
        <h3> CART🛒</h3>
        <button type="button" className="btn btnGhost" onClick={onClose}>
          {' '}
          Close{' '}
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="emptyState"> Your Cart is empty. </div>
      ) : (
        <>
          <div className="cartBody">
            {cartItems.map((item) => (
              <div key={item.productId} className="cartItem">
                <img
                  className="cartThumb"
                  src={
                    item.product?.image ||
                    item.product?.images?.[0] ||
                    'https://cdn-icons-png.flaticon.com/512/3081/3081558.png'
                  }
                  alt={item.product?.name || item.product?.title || 'Product'}
                />

                <div className="cartMeta">
                  <div className="cartTitle">
                    {item.product?.name || item.product?.title || 'Product'}
                  </div>
                  <div className="cartPrice">₹{item.price}</div>

                  <div className="cartControls">
                    <button
                      type="button"
                      className="qtyBtn"
                      onClick={() => decreaseQuantity(item.productId)}
                    >
                      {' '}
                      -{' '}
                    </button>

                    <span className="qty">{item.quantity}</span>
                    <button
                      type="button"
                      className="qtyBtn"
                      onClick={() => increaseQuantity(item.productId)}
                    >
                      {' '}
                      +{' '}
                    </button>

                    <button
                      type="button"
                      className="linkBtn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      {' '}
                      Remove{' '}
                    </button>
                  </div>
                </div>

                <div className="cartItemTotal">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="cartFooter">
            <div>
              <div className="cartTotalLabel">Total</div>
              <div className="cartTotal">₹{total.toFixed(2)}</div>
            </div>
            <button type="button" className="btn checkoutBtn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default Cart;
