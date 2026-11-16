import { useState, useEffect } from 'react';
import { ShieldCheck, DollarSign, TrendingUp, Users, Store, CheckCircle, Ban, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3500);
  };

  const loadAdminData = async () => {
    try {
      const stats = await api.getAdminAnalytics();
      setAnalytics(stats);

      const vList = await api.getVendors();
      setVendors(vList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVendor = async (vendorId) => {
    try {
      await api.toggleVendorStatus(vendorId);
      showNotice('success', 'Vendor verification status updated successfully');
      loadAdminData();
    } catch (err) {
      showNotice('error', err.message || 'Failed to update vendor status');
    }
  };

  if (loading) {
    return (
      <div className="container admin-loading">
        <p>Loading platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        {notice && (
          <div className={`vendor-notice-toast ${notice.type}`} style={{ marginBottom: 20 }}>
            <span>{notice.message}</span>
            <button onClick={() => setNotice(null)} className="notice-close">✕</button>
          </div>
        )}
        <div className="admin-header">
          <div className="admin-title-row">
            <ShieldCheck size={28} className="admin-icon" />
            <div>
              <h1>Platform Admin Analytics</h1>
              <p>Monitor platform gross merchandise value, automated commission splits, and vendor controls</p>
            </div>
          </div>
          <span className="badge badge-primary">Platform Master Control</span>
        </div>

        {/* 4 Analytics Metric Cards */}
        <div className="admin-metrics-grid">
          <div className="card admin-metric-card">
            <div className="metric-header">
              <span>Platform GMV</span>
              <DollarSign size={20} className="metric-icon green" />
            </div>
            <strong className="metric-value">₹{Number(analytics?.totalGMV || 0).toLocaleString('en-IN')}</strong>
            <small>Gross Marketplace Transactions</small>
          </div>

          <div className="card admin-metric-card">
            <div className="metric-header">
              <span>Commission Earned</span>
              <TrendingUp size={20} className="metric-icon indigo" />
            </div>
            <strong className="metric-value">₹{Number(analytics?.totalCommission || 0).toLocaleString('en-IN')}</strong>
            <small>10% Platform fee collected</small>
          </div>

          <div className="card admin-metric-card">
            <div className="metric-header">
              <span>Total Orders</span>
              <Store size={20} className="metric-icon sky" />
            </div>
            <strong className="metric-value">{analytics?.totalOrders || 0}</strong>
            <small>Completed & in-transit orders</small>
          </div>

          <div className="card admin-metric-card">
            <div className="metric-header">
              <span>Active Vendors</span>
              <Users size={20} className="metric-icon amber" />
            </div>
            <strong className="metric-value">{analytics?.totalVendors || 0}</strong>
            <small>Independent verified sellers</small>
          </div>
        </div>

        {/* Order Lifecycle Status Overview */}
        <div className="card status-breakdown-card">
          <h3>Marketplace Order Pipeline</h3>
          <div className="status-bars-grid">
            <div className="pipeline-box placed">
              <span>Placed</span>
              <strong>{analytics?.ordersByStatus?.placed || 0}</strong>
            </div>
            <div className="pipeline-box packed">
              <span>Packed</span>
              <strong>{analytics?.ordersByStatus?.packed || 0}</strong>
            </div>
            <div className="pipeline-box shipped">
              <span>Shipped</span>
              <strong>{analytics?.ordersByStatus?.shipped || 0}</strong>
            </div>
            <div className="pipeline-box delivered">
              <span>Delivered</span>
              <strong>{analytics?.ordersByStatus?.delivered || 0}</strong>
            </div>
          </div>
        </div>

        {/* Vendor Management & Approval Table */}
        <div className="card vendor-management-card">
          <div className="table-card-head">
            <div>
              <h3>Vendor Onboarding & Compliance</h3>
              <p>Control merchant access, inspect sales volume and fee splits</p>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Vendor Store</th>
                <th>Owner Email</th>
                <th>Fee Rate</th>
                <th>Total Sales</th>
                <th>Wallet Balance</th>
                <th>Approval Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>
                    <strong>{v.storeName}</strong>
                    <small className="vendor-id-sub">ID: {v.id}</small>
                  </td>
                  <td>{v.email}</td>
                  <td>
                    <span className="badge badge-primary">{v.commissionRate}% Fee</span>
                  </td>
                  <td>{v.totalSales} items</td>
                  <td>
                    <strong>₹{Number(v.balance).toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className={`badge badge-${v.status === 'approved' ? 'success' : 'danger'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleVendor(v.id)}
                      className={`btn btn-sm ${v.status === 'approved' ? 'btn-danger' : 'btn-primary'}`}
                    >
                      {v.status === 'approved' ? (
                        <>
                          <Ban size={13} /> Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} /> Approve
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="card top-products-card">
          <h3>Top Selling Products on Platform</h3>
          <div className="top-prods-list">
            {analytics?.topSellingProducts?.map((p, idx) => (
              <div key={p.id} className="top-prod-row">
                <span className="rank-num">#{idx + 1}</span>
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80'}
                  alt={p.name}
                />
                <div className="top-prod-info">
                  <strong>{p.name}</strong>
                  <small>Vendor: {p.vendorName || 'TechWorld Official'} • {p.category}</small>
                </div>
                <div className="top-prod-meta">
                  <span className="price">₹{Number(p.price).toLocaleString('en-IN')}</span>
                  <small>★ {p.rating} ({p.numReviews} reviews)</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;

