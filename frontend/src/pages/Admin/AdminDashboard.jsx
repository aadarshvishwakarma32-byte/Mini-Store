import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';
import { productService } from '../../services/product.service.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [productResponse, categoryResponse, orderResponse] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getCategories(),
        adminService.getAllOrders({ limit: 100 }),
      ]);
      setProducts(productResponse.data?.products || []);
      setCategories(categoryResponse.data || []);
      setOrders(orderResponse.data?.orders || []);
    } catch {
      toast.error('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  const categoryCounts = useMemo(
    () =>
      categories.map((category) => ({
        name: category.name,
        count: products.filter((product) => product.category?._id === category._id).length,
      })),
    [categories, products]
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;

  const handleImport = async () => {
    setImporting(true);
    try {
      const response = await adminService.importWebCatalog();
      toast.success(response.message || 'Web catalog imported');
      await loadDashboard();
    } catch (error) {
      toast.error(error.message || 'Could not import web catalog');
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <div className="adminDashboardLoading">Loading dashboard…</div>;

  return (
    <section className="adminDashboard">
      <div className="adminDashboardHeader">
        <div>
          <p className="adminEyebrow">STORE OVERVIEW</p>
          <h1>Admin Dashboard</h1>
          <p>Manage your catalog and see a quick view of store activity.</p>
        </div>
        <div className="adminHeaderActions">
          <button
            type="button"
            className="btnGhost adminImportBtn"
            onClick={handleImport}
            disabled={importing}
          >
            {importing ? 'Importing…' : 'Import web catalog'}
          </button>
          <Link className="btn adminAddProductBtn" to="/admin/products">
            + Add product
          </Link>
        </div>
      </div>

      <div className="adminStatsGrid">
        <article className="adminStatCard">
          <span>Products</span>
          <strong>{products.length}</strong>
          <small>Active catalog items</small>
        </article>
        <article className="adminStatCard">
          <span>Categories</span>
          <strong>{categories.length}</strong>
          <small>Store departments</small>
        </article>
        <article className="adminStatCard">
          <span>Orders</span>
          <strong>{orders.length}</strong>
          <small>{pendingOrders} awaiting processing</small>
        </article>
        <article className="adminStatCard">
          <span>Inventory value</span>
          <strong>{formatCurrency(inventoryValue)}</strong>
          <small>Based on listed prices</small>
        </article>
      </div>

      <div className="adminDashboardGrid">
        <article className="adminPanel">
          <div className="adminPanelTitle">
            <h2>Products by category</h2>
            <Link to="/admin/products">Manage products</Link>
          </div>
          <div className="categoryProgressList">
            {categoryCounts.map((category) => (
              <div key={category.name} className="categoryProgress">
                <div>
                  <span>{category.name}</span>
                  <b>{category.count}</b>
                </div>
                <div className="categoryProgressTrack">
                  <i
                    style={{
                      width: `${Math.max(6, (category.count / Math.max(products.length, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="adminPanel">
          <div className="adminPanelTitle">
            <h2>Recent products</h2>
            <Link to="/admin/products">View all</Link>
          </div>
          <div className="recentProducts">
            {products.slice(0, 5).map((product) => (
              <div key={product._id}>
                <span>{product.title}</span>
                <b>{formatCurrency(product.price)}</b>
              </div>
            ))}
            {!products.length && (
              <p className="adminEmpty">
                No products yet. Import the web catalog or add one manually.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default AdminDashboard;
