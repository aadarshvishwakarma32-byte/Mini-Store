import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { orderService } from '../services/order.service.js';
import { toast } from 'sonner';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const loadOrders = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getOrders();
      setOrders(res.data?.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const statusClass = (status) => (status || 'pending').toLowerCase();

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const canCancel = (order) =>
    order.status !== 'cancelled' && order.status !== 'shipped' && order.status !== 'delivered';

  const handleCancel = async (order) => {
    setCancellingId(order._id);
    try {
      const res = await orderService.cancelOrder(order._id);
      if (res.success) {
        toast.success('Order cancelled successfully');
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, status: 'cancelled', paymentStatus: 'cancelled' } : o))
        );
      } else {
        toast.error(res.message || 'Failed to cancel order');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="main">
      <div className="ordersPage">
        <h1 className="pageTitle">My Orders</h1>

        {loading && <div className="status">Loading your orders...</div>}
        {error && <div className="status error">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="emptyState">
            You haven't placed any orders yet. <a href="/">Start shopping</a>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="ordersList">
            {orders.map((order) => (
              <div key={order._id} className="orderCard">
                <div className="orderTop">
                  <div>
                    <div className="orderId">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="orderDate">{formatDate(order.createdAt)}</div>
                  </div>
                  <span className={`orderStatus ${statusClass(order.status)}`}>{order.status}</span>
                </div>

                <div className="orderItems">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="orderItem">
                      <span>{item.title} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="orderBottom">
                  <div className="orderMeta">
                    Payment: {order.paymentMethod} · Status: {order.paymentStatus}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="orderTotal">₹{order.totalAmount.toFixed(2)}</div>
                    {canCancel(order) && (
                      <button
                        type="button"
                        className="btn btnGhost cancelOrderBtn"
                        disabled={cancellingId === order._id}
                        onClick={() => setConfirmId(order._id)}
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>

                {confirmId === order._id && (
                  <div className="cancelConfirm">
                    <p>Cancel this order? Items will be returned to stock.</p>
                    <div className="cancelConfirmActions">
                      <button
                        type="button"
                        className="btn cancelConfirmYes"
                        onClick={() => handleCancel(order)}
                        disabled={cancellingId === order._id}
                      >
                        Yes, Cancel
                      </button>
                      <button
                        type="button"
                        className="btnGhost cancelConfirmNo"
                        onClick={() => setConfirmId(null)}
                        disabled={cancellingId === order._id}
                      >
                        Keep Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;