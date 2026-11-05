import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, ArrowLeft, Clock, Truck, CheckCheck, Store } from 'lucide-react';
import { api } from '../services/api';
import './OrderSuccessPage.css';

function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container success-loading">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container success-loading">
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary">Go to Orders</Link>
      </div>
    );
  }

  const stages = [
    { key: 'placed', label: 'Order Placed', icon: Clock },
    { key: 'packed', label: 'Packed by Vendor', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCheck }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === order.orderStatus);

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="no-print">
          <div className="success-banner">
            <CheckCircle2 size={54} color="#10b981" />
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. Your order ID is <strong>{order.id}</strong></p>
            <div className="success-actions">
              <button onClick={handlePrintInvoice} className="btn btn-secondary btn-sm">
                <Printer size={16} /> Print / Save PDF Invoice
              </button>
              <Link to="/orders" className="btn btn-primary btn-sm">
                View All My Orders
              </Link>
            </div>
          </div>

          {/* Order Lifecycle Stepper */}
          <div className="order-lifecycle-card card">
            <h3>Order Fulfillment Lifecycle</h3>
            <p className="lifecycle-sub">Real-time status managed by multi-vendor fulfillment center</p>

            <div className="lifecycle-stepper">
              {stages.map((stage, idx) => {
                const IconComponent = stage.icon;
                const isCompleted = idx <= (currentStageIndex === -1 ? 0 : currentStageIndex);
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} className={`stepper-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="step-circle">
                      <IconComponent size={18} />
                    </div>
                    <span className="step-label">{stage.label}</span>
                    {idx < stages.length - 1 && <div className="step-line"></div>}
                  </div>
                );
              })}
            </div>

            {/* Timeline Notes */}
            <div className="timeline-notes">
              <h4>Status Updates</h4>
              <div className="notes-list">
                {order.timeline?.map((item, index) => (
                  <div key={index} className="note-row">
                    <span className="note-status-badge badge badge-primary">{item.status}</span>
                    <span className="note-text">{item.note}</span>
                    <span className="note-time">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Printable Official Tax Invoice */}
        <div className="tax-invoice-printable card">
          <div className="invoice-header">
            <div>
              <h2>NEXVIA MARKETPLACE</h2>
              <p className="invoice-sub">Official Multi-Vendor Tax Invoice</p>
              <p>GSTIN: 29ABCDE1234F1Z5</p>
            </div>
            <div className="invoice-meta-right">
              <h3>INVOICE #{order.id}</h3>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.paymentMethod} (PAID)</p>
            </div>
          </div>

          <div className="invoice-addresses">
            <div className="invoice-col">
              <strong>Billed & Shipped To:</strong>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
            <div className="invoice-col">
              <strong>Order Summary:</strong>
              <p>Status: <span className="status-highlight">{order.orderStatus.toUpperCase()}</span></p>
              <p>Customer ID: {order.customer.id}</p>
              <p>Email: {order.customer.email}</p>
            </div>
          </div>

          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Vendor / Store</th>
                <th>Price</th>
                <th>Qty</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    <span className="vendor-tag">{item.vendorName || 'TechWorld Official'}</span>
                  </td>
                  <td>₹{Number(item.price).toLocaleString('en-IN')}</td>
                  <td>{item.qty}</td>
                  <td className="text-right">₹{Number(item.price * item.qty).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-totals-wrapper">
            <div className="invoice-split-audit">
              <strong>Multi-Vendor Payout Audit:</strong>
              {order.vendorPayouts?.map((vp, idx) => (
                <div key={idx} className="audit-row">
                  <span>{vp.vendorName}: ₹{vp.payoutAmount?.toLocaleString('en-IN')} (Net after 10% fee)</span>
                </div>
              ))}
              <div className="audit-row platform-row">
                <span>Platform Commission Retained: ₹{order.platformCommissionTotal?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="invoice-math">
              <div className="math-row">
                <span>Subtotal:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="math-row discount">
                  <span>Coupon Discount:</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="math-row">
                <span>Delivery Charges:</span>
                <span>FREE</span>
              </div>
              <div className="math-row grand-total">
                <span>Total Paid:</span>
                <span>₹{order.finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="invoice-footer">
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
            <p>Nexvia Multi-Vendor Platform • Built for Enterprise Marketplace Scalability</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
