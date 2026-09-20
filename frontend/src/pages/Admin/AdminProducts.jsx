import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin.service.js';
import { productService } from '../../services/product.service.js';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    brand: '',
    category: '',
    image: '',
    stock: '',
    isActive: true,
    featured: false,
  });

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.data?.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data.data || []);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: formData.image.trim(),
        isActive: formData.isActive,
        featured: formData.featured,
        brand: formData.brand.trim() || undefined,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
      };

      await adminService.createProduct(payload);
      toast.success('Product created successfully');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        discountPrice: '',
        brand: '',
        category: '',
        image: '',
        stock: '',
        isActive: true,
        featured: false,
      });
      loadProducts();
    } catch {
      toast.error('Failed to create product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <main className="main">
        <section className="page">
          <div
            className="skeletonLine w60"
            style={{ height: '40px', width: '200px', borderRadius: '8px', margin: '0 auto 16px' }}
          />
          <div
            className="skeletonLine w40"
            style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto 8px' }}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="page adminPage">
        <div className="adminHeader">
          <h1 className="pageTitle">Admin Products</h1>
          <button type="button" className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <motion.form
            className="adminForm"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="formGrid">
              <div className="field">
                <label className="labelText">Product Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="field">
                <label className="labelText">Category *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="labelText">Price (₹) *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="field">
                <label className="labelText">Discount Price (₹)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="field">
                <label className="labelText">Brand</label>
                <input
                  type="text"
                  className="input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Brand name"
                />
              </div>

              <div className="field">
                <label className="labelText">Stock *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="field fullWidth">
                <label className="labelText">Image URLs (comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div className="field fullWidth">
                <label className="labelText">Description *</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows="4"
                  required
                />
              </div>

              <div className="field fullWidth">
                <label className="labelText">Specifications (key:value, comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Display:6.1 inch, Chip:A17 Pro, Camera:48MP"
                />
              </div>

              <div className="field">
                <label className="labelText">Status</label>
                <select
                  className="input"
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === 'active' })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="field">
                <label className="labelText">Featured</label>
                <select
                  className="input"
                  value={formData.featured ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.value === 'true' })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn authSubmit" style={{ marginTop: 18 }}>
              Create Product
            </button>
          </motion.form>
        )}

        <div className="productTableWrap">
          <table className="productTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.category?.name || '-'}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`statusBadge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="linkBtn danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="emptyState">No products found. Add your first product above.</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminProducts;
