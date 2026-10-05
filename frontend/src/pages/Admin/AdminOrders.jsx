import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';
import { getImageUrl } from '../../services/api.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_COLORS = {
  pending: { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
  processing: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
  shipped: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' },
  delivered: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllOrders({ limit: 100 });
      setOrders(response.data?.orders || []);
    } catch (error) {
      toast.error(error.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesStatus;

      const orderId = (order._id || '').toLowerCase();
      const customerName = (order.user?.name || '').toLowerCase();
      const customerEmail = (order.user?.email || '').toLowerCase();
      const matchesSearch =
        orderId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const processing = orders.filter((o) => o.status === 'processing').length;
    const shipped = orders.filter((o) => o.status === 'shipped').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return { total, pending, processing, shipped, delivered, cancelled, revenue };
  }, [orders]);

  return (
    <section className="adminContentPage">
      <div className="adminPageIntro">
        <p className="adminEyebrow">FULFILLMENT & SALES</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Orders Management</h1>
            <p>Track customer orders, review delivery addresses, and manage processing states.</p>
          </div>
          <button type="button" className="adminRefreshButton" onClick={loadOrders} disabled={loading}>
            {loading ? 'Refreshing…' : '↻ Refresh Orders'}
          </button>
        </div>
      </div>

      <div className="adminStatsGrid">
        <article className="adminStatCard">
          <span>Total Orders</span>
          <strong>{stats.total}</strong>
          <small>All time orders</small>
        </article>
        <article className="adminStatCard">
          <span>Pending</span>
          <strong style={{ color: '#eab308' }}>{stats.pending}</strong>
          <small>Awaiting processing</small>
        </article>
        <article className="adminStatCard">
          <span>Delivered</span>
          <strong style={{ color: '#10b981' }}>{stats.delivered}</strong>
          <small>Successfully delivered</small>
        </article>
        <article className="adminStatCard">
          <span>Total Revenue</span>
          <strong style={{ color: 'var(--accent)' }}>{formatCurrency(stats.revenue)}</strong>
          <small>Active orders volume</small>
        </article>
      </div>

      <div className="adminOrdersControls">
        <div className="adminFilterTabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: `Pending (${stats.pending})` },
            { id: 'processing', label: `Processing (${stats.processing})` },
            { id: 'shipped', label: `Shipped (${stats.shipped})` },
            { id: 'delivered', label: `Delivered (${stats.delivered})` },
            { id: 'cancelled', label: `Cancelled (${stats.cancelled})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`adminFilterTab ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="adminOrdersSearch">
          <input
            type="text"
            className="input"
            placeholder="Search by Order ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="adminDashboardLoading">Loading orders…</div>
      ) : (
        <div className="productTableWrap">
          <table className="productTable">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusColor = STATUS_COLORS[order.status] || { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
                const firstItem = order.items?.[0];
                const extraCount = (order.items?.length || 0) - 1;

                return (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <br />
                      <small style={{ color: 'var(--muted)', fontSize: 11 }}>
                        {formatDate(order.createdAt)}
                      </small>
                    </td>
                    <td>
                      <strong style={{ display: 'block', fontSize: 13 }}>{order.user?.name || 'Customer'}</strong>
                      <small style={{ color: 'var(--muted)' }}>{order.user?.email || '-'}</small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {firstItem && (
                          <img
                            className="productTableThumb"
                            src={getImageUrl(firstItem.image)}
                            alt={firstItem.title}
                            onError={(e) => {
                              e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';
                            }}
                          />
                        )}
                        <span style={{ fontSize: 13 }}>
                          {firstItem?.title ? (
                            firstItem.title.length > 20
                              ? `${firstItem.title.slice(0, 20)}…`
                              : firstItem.title
                          ) : (
                            'Item'
                          )}
                          {extraCount > 0 && (
                            <small style={{ color: 'var(--muted)', display: 'block' }}>
                              +{extraCount} more
                            </small>
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent)' }}>
                        {formatCurrency(order.totalAmount)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>
                        {order.paymentMethod || 'COD'}
                      </span>
                      <br />
                      <span
                        style={{
                          fontSize: 11,
                          color: order.paymentStatus === 'paid' ? '#10b981' : 'var(--muted)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="adminInlineSelect"
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          fontWeight: 700,
                          borderColor: statusColor.text,
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btnGhost"
                        style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6 }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="emptyState" style={{ padding: 40, textAlign: 'center' }}>
              No orders found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="modalOverlay" onClick={() => setSelectedOrder(null)}>
            <motion.div
              className="modalContent"
              style={{ maxWidth: 680, width: '90%' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 20, margin: 0 }}>
                    Order #{selectedOrder._id}
                  </h2>
                  <small style={{ color: 'var(--muted)' }}>
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </small>
                </div>
                <button
                  type="button"
                  className="cartClose"
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Customer</h4>
                  <div style={{ fontWeight: 600 }}>{selectedOrder.user?.name || 'Customer'}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{selectedOrder.user?.email || '-'}</div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Payment</h4>
                  <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>{selectedOrder.paymentMethod || 'COD'}</div>
                  <div style={{ fontSize: 13, color: selectedOrder.paymentStatus === 'paid' ? '#10b981' : '#eab308', textTransform: 'capitalize' }}>
                    Status: {selectedOrder.paymentStatus || 'Pending'}
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Order Status</h4>
                  <select
                    className="adminInlineSelect"
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    style={{
                      backgroundColor: (STATUS_COLORS[selectedOrder.status] || {}).bg,
                      color: (STATUS_COLORS[selectedOrder.status] || {}).text,
                      fontWeight: 700,
                      width: '100%',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div style={{ marginBottom: 20, padding: 14, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Shipping Address</h4>
                  <div style={{ fontSize: 14 }}>
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Ordered Items ({selectedOrder.items?.length})</h4>
                <div style={{ display: 'grid', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, background: '#fff' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                          <small style={{ color: 'var(--muted)' }}>Qty: {item.quantity} × {formatCurrency(item.price)}</small>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Total Order Amount:</span>
                <strong style={{ fontSize: 20, color: 'var(--accent)' }}>
                  {formatCurrency(selectedOrder.totalAmount)}
                </strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default AdminOrders;
