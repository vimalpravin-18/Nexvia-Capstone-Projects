import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Eye, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import './MyOrdersPage.css';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'shipped':
        return <span className="badge badge-primary">In Transit / Shipped</span>;
      case 'packed':
        return <span className="badge badge-warning">Packed</span>;
      default:
        return <span className="badge badge-neutral">Order Placed</span>;
    }
  };

  return (
    <div className="my-orders-page">
      <div className="container">
        <div className="orders-header">
          <div>
            <h1>My Order History</h1>
            <p>Track your multi-vendor purchases and download official invoices</p>
          </div>
          <Link to="/catalog" className="btn btn-primary btn-sm">
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="orders-loading">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="card empty-orders-card">
            <Package size={48} className="empty-icon" />
            <h3>No Orders Placed Yet</h3>
            <p>Once you make a purchase, your order history and tracking updates will appear here.</p>
            <Link to="/catalog" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-history-card card">
                <div className="order-card-top">
                  <div className="order-id-meta">
                    <strong>Order ID: #{order.id}</strong>
                    <span className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-status-wrap">
                    {getStatusBadge(order.orderStatus)}
                    <span className="order-amount">
                      ₹{Number(order.finalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="order-items-grid">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-chip">
                      <img src={item.image} alt={item.name} />
                      <div className="item-chip-details">
                        <span className="item-chip-name">{item.name}</span>
                        <small>Qty: {item.qty} • ₹{Number(item.price).toLocaleString('en-IN')}</small>
                        <span className="chip-vendor">Vendor: {item.vendorName || 'TechWorld Official'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-bottom">
                  <div className="order-payment-info">
                    <ShieldCheck size={16} />
                    <span>Payment: {order.paymentMethod} (Paid)</span>
                  </div>

                  <Link to={`/order-success/${order.id}`} className="btn btn-secondary btn-sm">
                    <Eye size={15} /> Track & Invoice <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;

