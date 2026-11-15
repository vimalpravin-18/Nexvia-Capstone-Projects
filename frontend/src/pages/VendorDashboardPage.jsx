import { useState, useEffect } from 'react';
import { Plus, Store, DollarSign, Package, TrendingUp, Edit, Trash2, CheckCircle, Upload, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './VendorDashboardPage.css';

function VendorDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [notice, setNotice] = useState(null);

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3500);
  };

  // Modal / Form state for Add / Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mobiles',
    brand: '',
    stock: 10,
    imageUrl: ''
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: res.url }));
      showNotice('success', 'Image uploaded successfully');
    } catch (err) {
      showNotice('error', err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const vendorId = user?.id || 'usr_vendor1';
  const vendorProfile = user?.vendorProfile || {
    storeName: 'TechWorld Official',
    balance: 14200,
    totalSales: 48,
    commissionRate: 10
  };

  const loadData = async () => {
    try {
      const prodRes = await api.getProducts({ vendorId });
      setProducts(prodRes.products || []);

      const ordersRes = await api.getVendorOrders();
      setVendorOrders(ordersRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Mobiles',
      brand: '',
      stock: 10,
      imageUrl: ''
    });
    setShowProductModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      brand: p.brand || '',
      stock: p.stock,
      imageUrl: p.images?.[0] || ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showNotice('success', 'Product deleted successfully');
      loadData();
    } catch (err) {
      showNotice('error', err.message || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        images: formData.imageUrl ? [formData.imageUrl] : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80'
        ]
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        showNotice('success', 'Product updated successfully');
      } else {
        await api.createProduct(payload);
        showNotice('success', 'New product published successfully');
      }

      setShowProductModal(false);
      loadData();
    } catch (err) {
      showNotice('error', err.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus} by vendor`);
      showNotice('success', `Order status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      showNotice('error', err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="vendor-dashboard-page">
      <div className="container">
        {notice && (
          <div className={`vendor-notice-toast ${notice.type}`}>
            {notice.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notice.message}</span>
            <button onClick={() => setNotice(null)} className="notice-close">✕</button>
          </div>
        )}

        {/* Header & Metrics */}
        <div className="vendor-header">
          <div>
            <div className="vendor-title-row">
              <Store size={26} className="store-icon" />
              <h1>{vendorProfile.storeName || 'Vendor Portal'}</h1>
              <span className="badge badge-success">Verified Merchant</span>
            </div>
            <p className="vendor-subtitle">Manage catalog, process customer orders, and inspect split earnings</p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add New Product
          </button>
        </div>

        <div className="vendor-stats-grid">
          <div className="card stat-card">
            <div className="stat-icon-wrap green">
              <DollarSign size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-title">Net Balance</span>
              <strong className="stat-val">₹{Number(vendorProfile.balance || 0).toLocaleString('en-IN')}</strong>
              <small>After 10% platform commission</small>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon-wrap indigo">
              <TrendingUp size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-title">Total Orders</span>
              <strong className="stat-val">{vendorOrders.length}</strong>
              <small>Customer purchases fulfilled</small>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon-wrap sky">
              <Package size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-title">Active Products</span>
              <strong className="stat-val">{products.length}</strong>
              <small>Live on Nexvia marketplace</small>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="vendor-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            My Products ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Fulfillment Orders ({vendorOrders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="card tab-content-card">
            <div className="tab-card-header">
              <h3>Listed Catalog Inventory</h3>
              <button onClick={handleOpenAdd} className="btn btn-secondary btn-sm">
                <Plus size={15} /> Add Item
              </button>
            </div>

            {loading ? (
              <p className="loading-text">Loading vendor catalog...</p>
            ) : products.length === 0 ? (
              <div className="empty-tab-state">
                <Package size={40} />
                <p>No products listed yet.</p>
                <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
                  Add Your First Product
                </button>
              </div>
            ) : (
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="product-table-cell">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80'}
                          alt={p.name}
                          className="table-prod-img"
                        />
                        <div>
                          <strong>{p.name}</strong>
                          <small>ID: {p.id}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category}</span>
                      </td>
                      <td>
                        <strong>₹{Number(p.price).toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span className={p.stock < 5 ? 'low-stock-alert' : ''}>
                          {p.stock} units
                        </span>
                      </td>
                      <td>★ {p.rating} ({p.numReviews})</td>
                      <td>
                        <div className="action-buttons-group">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="btn-action edit"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="btn-action delete"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card tab-content-card">
            <div className="tab-card-header">
              <h3>Fulfillment & Status Updates</h3>
              <small>Advance the order lifecycle to keep buyers updated</small>
            </div>

            {vendorOrders.length === 0 ? (
              <div className="empty-tab-state">
                <Package size={40} />
                <p>No customer orders placed yet for your products.</p>
              </div>
            ) : (
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Current Status</th>
                    <th>Advance Lifecycle</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong>#{ord.id}</strong>
                        <small className="block-date">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <strong>{ord.customer?.name}</strong>
                        <small className="block-date">{ord.customer?.email}</small>
                      </td>
                      <td>
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="order-item-line">
                            {it.name} (x{it.qty})
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>₹{Number(ord.finalAmount).toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span className={`badge badge-${ord.orderStatus === 'delivered' ? 'success' : ord.orderStatus === 'shipped' ? 'primary' : 'warning'}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-dropdown"
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        >
                          <option value="placed">Placed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Marketplace Product'}</h3>
                <button onClick={() => setShowProductModal(false)} className="close-btn">✕</button>
              </div>

              <form onSubmit={handleSaveProduct} className="modal-form">
                <div className="form-group">
                  <label>Product Title *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="29990"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Mobiles">Mobiles</option>
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. Sony, Apple, Nike"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Image (Upload File or Enter URL)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      <Upload size={14} />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImage}
                      />
                    </label>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>or paste URL below</span>
                  </div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                  />
                  {formData.imageUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                      />
                      <small style={{ color: '#10b981', fontWeight: 600 }}>Image preview loaded</small>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Key specifications, materials, warranty..."
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={savingProduct}>
                    {savingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDashboardPage;
