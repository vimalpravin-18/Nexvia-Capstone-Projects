import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, AlertTriangle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './CheckoutPage.css';

function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const couponCode = location.state?.couponCode || null;
  const discountAmount = location.state?.discountAmount || 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const [address, setAddress] = useState({
    fullName: user?.name || 'John Doe',
    phone: '+91 9876543210',
    street: '142 Innovation Park, 4th Avenue',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001'
  });

  const [paymentGateway, setPaymentGateway] = useState('Razorpay');
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.fullName || !address.street || !address.city || !address.pincode) {
      setErrorMessage('Please provide all required shipping fields to proceed');
      return;
    }

    setErrorMessage('');
    setProcessing(true);
    setPaymentStep('processing');

    try {
      // Create Razorpay payment intent
      await api.createPaymentOrder(finalTotal);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify payment transaction
      await api.verifyPayment({
        paymentId: 'pay_' + Date.now(),
        orderId: 'order_gw_' + Math.floor(Math.random() * 10000)
      });

      // Submit actual order to backend
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          vendorId: item.vendorId || 'usr_vendor1',
          vendorName: item.vendorName || 'TechWorld Official',
          image: item.image
        })),
        shippingAddress: address,
        paymentMethod: paymentGateway,
        couponCode
      };

      const createdOrder = await api.createOrder(orderPayload);
      
      // Clean up cart safely
      clearCart();

      setPaymentStep('success');
      setTimeout(() => {
        navigate(`/order-success/${createdOrder.id}`);
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
      setProcessing(false);
      setPaymentStep('form');
    }
  };

  if (cartItems.length === 0 && paymentStep === 'form') {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty-card card">
            <div className="empty-circle-icon">
              <ShoppingBag size={44} />
            </div>
            <h2>No items pending checkout</h2>
            <p>Your shopping bag is currently empty. Explore our multi-vendor catalog to discover trending electronics and gadgets.</p>
            <div className="empty-cta-group">
              <Link to="/catalog" className="btn btn-primary">
                Browse Marketplace <ArrowRight size={16} />
              </Link>
              <Link to="/orders" className="btn btn-secondary">
                View Past Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <div className="checkout-header">
          <h1>Checkout & Payment</h1>
          <p>Complete your shipping and payment to place the multi-vendor order</p>
        </div>

        {errorMessage && (
          <div className="checkout-error-banner">
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="checkout-layout">
          <div className="checkout-main">
            {/* Shipping Address */}
            <div className="checkout-card card">
              <div className="card-title-row">
                <span className="step-num">1</span>
                <h3>Shipping Address</h3>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Gateway */}
            <div className="checkout-card card">
              <div className="card-title-row">
                <span className="step-num">2</span>
                <h3>Payment Method (Razorpay)</h3>
              </div>

              <div className="gateway-options">
                <label className="gateway-option active">
                  <input
                    type="radio"
                    name="gateway"
                    value="Razorpay"
                    checked={true}
                    readOnly
                  />
                  <div className="gateway-meta">
                    <strong>Razorpay Payment Gateway</strong>
                    <span>Instant UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking</span>
                  </div>
                  <span className="badge badge-success">Automated 10% Split</span>
                </label>
              </div>

              <div className="security-note">
                <Lock size={15} />
                <span>256-Bit SSL Encrypted & Verified by Razorpay Secure Payments.</span>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="checkout-sidebar">
            <div className="card summary-card">
              <h3>Order Review</h3>

              <div className="checkout-items-preview">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item-mini">
                    <img src={item.image} alt={item.name} />
                    <div className="item-mini-info">
                      <span className="item-name">{item.name}</span>
                      <small>Qty: {item.qty} • Sold by {item.vendorName || 'Vendor'}</small>
                    </div>
                    <span className="item-total">
                      ₹{Number(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Coupon ({couponCode})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-tag">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total Payable</span>
                  <span className="total-val">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="split-explanation">
                <strong>Platform Commission Mechanics:</strong>
                <p>Upon payment completion, the platform automatically allocates 10% platform commission (₹{Math.round(finalTotal * 0.10).toLocaleString('en-IN')}) and credits 90% (₹{(finalTotal - Math.round(finalTotal * 0.10)).toLocaleString('en-IN')}) to the respective vendor balance.</p>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-pay-now"
                disabled={processing}
              >
                {processing ? (
                  <>Processing Gateway...</>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay ₹{finalTotal.toLocaleString('en-IN')} & Confirm Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Processing Overlay Modal */}
        {paymentStep === 'processing' && (
          <div className="payment-modal-overlay">
            <div className="payment-modal-content">
              <div className="spinner"></div>
              <h3>Authorizing {paymentGateway} Payment...</h3>
              <p>Simulating 3D Secure verification & multi-vendor split calculation</p>
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="payment-modal-overlay">
            <div className="payment-modal-content success">
              <CheckCircle2 size={48} color="#10b981" />
              <h3>Payment Captured!</h3>
              <p>Redirecting to your order confirmation...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;

