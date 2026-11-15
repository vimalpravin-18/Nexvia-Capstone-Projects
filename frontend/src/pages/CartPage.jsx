import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Sparkles,
  Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './CartPage.css';

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart, cartSubtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validating, setValidating] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      setLoadingRecommended(true);
      api.getProducts({ limit: 4 })
        .then(res => {
          if (res && res.products) {
            setRecommendedProducts(res.products.slice(0, 4));
          }
        })
        .catch(() => {})
        .finally(() => setLoadingRecommended(false));
    }
  }, [cartItems.length]);

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
          {/* Main Empty State Banner */}
          <div className="empty-cart-hero card">
            <div className="empty-hero-visual">
              <div className="empty-icon-ring">
                <ShoppingBag size={48} className="empty-bag-icon" />
              </div>
              <span className="empty-sparkle-pill">
                <Sparkles size={14} /> Ready for your next discovery
              </span>
            </div>

            <h2>Your Shopping Cart is Empty</h2>
            <p className="empty-hero-description">
              Looks like you haven't added anything to your cart yet, or your recent order has been confirmed!
              Browse verified multi-vendor products with genuine warranties and instant Razorpay checkout.
            </p>

            <div className="empty-cart-actions">
              <Link to="/catalog" className="btn btn-primary btn-lg">
                <Zap size={18} /> Explore Marketplace
              </Link>
              <Link to="/orders" className="btn btn-secondary btn-lg">
                View Past Orders <ArrowRight size={16} />
              </Link>
            </div>

            {/* Popular Categories Shortcut */}
            <div className="empty-category-chips">
              <span className="chips-label">Quick Search:</span>
              <Link to="/catalog?category=Electronics" className="chip">Electronics</Link>
              <Link to="/catalog?category=Audio" className="chip">Audio & Headphones</Link>
              <Link to="/catalog?category=Wearables" className="chip">Wearables</Link>
              <Link to="/catalog?category=Computers" className="chip">Laptops & PCs</Link>
            </div>
          </div>

          {/* Recommended Products Carousel / Grid */}
          {recommendedProducts.length > 0 && (
            <div className="empty-recommended-section">
              <div className="section-title-wrap">
                <div>
                  <h3 className="section-title">Trending Marketplace Picks</h3>
                  <p className="section-subtitle">Handpicked top-rated products from verified vendors</p>
                </div>
                <Link to="/catalog" className="see-all-link">
                  View Full Catalog <ArrowRight size={14} />
                </Link>
              </div>

              <div className="empty-products-grid">
                {recommendedProducts.map((prod) => (
                  <div key={prod.id} className="recommended-product-card card">
                    <div className="prod-img-wrap">
                      <img src={prod.images?.[0] || prod.url} alt={prod.name} />
                      <span className="vendor-pill">{prod.vendorName || 'Verified'}</span>
                    </div>

                    <div className="prod-details">
                      <span className="prod-category">{prod.category}</span>
                      <h4 className="prod-name" title={prod.name}>
                        <Link to={`/products/${prod.id}`}>{prod.name}</Link>
                      </h4>
                      <div className="prod-footer">
                        <span className="prod-price">₹{Number(prod.price).toLocaleString('en-IN')}</span>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="btn btn-secondary btn-sm btn-quick-add"
                          title="Add to Cart"
                        >
                          <Plus size={15} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace Buyer Guarantees */}
          <div className="cart-guarantees-grid">
            <div className="guarantee-box card">
              <Truck size={24} className="guarantee-icon" />
              <div>
                <h4>Express Multi-Vendor Dispatch</h4>
                <p>Direct priority delivery across 19,000+ pin codes in India.</p>
              </div>
            </div>
            <div className="guarantee-box card">
              <ShieldCheck size={24} className="guarantee-icon" />
              <div>
                <h4>100% Genuine Buyer Protection</h4>
                <p>Every seller is KYC-verified with guaranteed original products.</p>
              </div>
            </div>
            <div className="guarantee-box card">
              <RotateCcw size={24} className="guarantee-icon" />
              <div>
                <h4>7-Day Easy Replacement</h4>
                <p>Simple no-questions replacement for transit damage or defects.</p>
              </div>
            </div>
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

