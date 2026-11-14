import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './CartPage.css';

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validating, setValidating] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidating(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(couponCode.trim(), cartSubtotal);
      setAppliedCoupon(res);
      setCouponError('');
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setValidating(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);
  const estimatedCommission = Math.round(finalTotal * 0.10);
  const estimatedVendorPayout = finalTotal - estimatedCommission;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart-card card">
            <ShoppingBag size={56} className="empty-icon" />
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/catalog" className="btn btn-primary">
              Discover Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page-header">
          <h1>Shopping Cart</h1>
          <p>Review items from different vendors before checking out</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section card">
            <div className="cart-items-head">
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-product-info">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <span className="cart-item-vendor">
                        Sold by: <strong>{item.vendorName || 'Verified Vendor'}</strong>
                      </span>
                      <span className="cart-item-price">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="cart-qty-wrapper">
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cart-remove-btn"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="cart-line-total">
                    ₹{Number(item.price * item.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="card summary-card">
              <h3>Order Summary</h3>

              {/* Coupon Engine */}
              <div className="coupon-box">
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <div className="coupon-input-wrap">
                    <Tag size={16} />
                    <input
                      type="text"
                      placeholder="Try: WELCOME10 or SUPER500"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary btn-sm" disabled={validating}>
                    {validating ? '...' : 'Apply'}
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="coupon-success-msg">
                    <CheckCircle2 size={14} />
                    <span>{appliedCoupon.message}</span>
                  </div>
                )}

                {couponError && (
                  <div className="coupon-error-msg">
                    <AlertCircle size={14} />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span className="free-tag">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span className="total-val">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Marketplace Transparent Split Preview */}
              <div className="marketplace-split-preview">
                <span className="split-head">Platform Split Preview:</span>
                <div className="split-metrics">
                  <div>
                    <small>Vendor Net (90%)</small>
                    <strong>₹{estimatedVendorPayout.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <small>Platform Fee (10%)</small>
                    <strong>₹{estimatedCommission.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-checkout"
                onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon?.code, discountAmount } })}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

