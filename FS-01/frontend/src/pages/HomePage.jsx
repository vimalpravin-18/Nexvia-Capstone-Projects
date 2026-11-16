import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Truck,
  CheckCircle2,
  Zap,
  Tag,
  Star,
  Store,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await api.getProducts({ featured: 'true' });
        setFeaturedProducts(prodData.products || []);

        const catData = await api.getCategories();
        setCategories(catData.filter(c => c !== 'All'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const categoryIcons = {
    Mobiles: '📱',
    Audio: '🎧',
    Wearables: '⌚',
    Fashion: '👕',
    Footwear: '👟',
    Accessories: '⌨️'
  };

  return (
    <div className="home-page">
      {/* Hero Showcase Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <Sparkles size={14} className="sparkle-icon" />
              <span>India's Premier Multi-Vendor E-Commerce Network</span>
            </div>

            <h1 className="hero-title">
              Shop Top Brands Direct from <span className="gradient-text">Verified Vendors</span>.
            </h1>

            <p className="hero-description">
              Discover authentic electronics, audio gear, and luxury streetwear. Automated split payouts, real-time fulfillment tracking, and transparent vendor economics.
            </p>

            <div className="hero-cta-group">
              <Link to="/catalog" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} />
                Explore 50+ Products
              </Link>
              <Link to="/auth?mode=vendor" className="btn btn-secondary btn-lg btn-merchant">
                <Store size={18} />
                Sell as Vendor <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Coupon Voucher Card */}
            <div className="hero-coupon-banner">
              <div className="coupon-tag-icon">
                <Tag size={16} />
              </div>
              <div className="coupon-text">
                <span className="coupon-title">New Buyer Promo:</span>
                <span className="coupon-desc">Use coupon <strong>WELCOME10</strong> for 10% instant discount at checkout</span>
              </div>
              <button
                className="btn-copy-coupon"
                onClick={() => copyCouponCode('WELCOME10')}
                title="Copy Coupon Code"
              >
                {copiedCoupon ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Hero Visual Glassmorphism Card */}
          <div className="hero-visual-col">
            <div className="hero-glass-card">
              <div className="glass-card-header">
                <div className="vendor-avatar-tag">
                  <span className="verified-dot"></span>
                  <strong>TechWorld Official</strong>
                  <span className="badge badge-success">Top Merchant</span>
                </div>
                <div className="rating-pill">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>

              <div className="glass-product-preview">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&q=80"
                  alt="Apple iPhone 16 Pro Max"
                  className="preview-img"
                />
                <div className="preview-details">
                  <h4>Apple iPhone 16 Pro Max (256GB)</h4>
                  <div className="preview-price-row">
                    <span className="preview-price">₹1,34,900</span>
                    <span className="preview-tag">Free Express Shipping</span>
                  </div>
                </div>
              </div>

              {/* Multi-Vendor Split Economics Display */}
              <div className="glass-split-pill">
                <div className="split-metric">
                  <small>Vendor Net (90%)</small>
                  <strong>₹1,21,410</strong>
                </div>
                <div className="split-divider"></div>
                <div className="split-metric">
                  <small>Platform Fee (10%)</small>
                  <strong>₹13,490</strong>
                </div>
                <div className="split-divider"></div>
                <div className="split-metric">
                  <small>GST Payout Audit</small>
                  <strong className="status-badge-auto">Verified</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="trust-strip">
        <div className="container trust-container">
          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div>
              <strong>100% Buyer Protection</strong>
              <p>Escrow released on delivery</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">
              <TrendingUp size={22} />
            </div>
            <div>
              <strong>Automated Payouts</strong>
              <p>90% net earnings to merchants</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={22} />
            </div>
            <div>
              <strong>Live Stage Tracking</strong>
              <p>Placed → Packed → Shipped</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">
              <Zap size={22} />
            </div>
            <div>
              <strong>GST Tax Invoices</strong>
              <p>Instant PDF download</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Category Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-pre-title">Curated Departments</span>
              <h2 className="section-main-title">Browse by Category</h2>
            </div>
            <Link to="/catalog" className="view-more-link">
              View All Categories <ArrowRight size={15} />
            </Link>
          </div>

          <div className="categories-grid-cards">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/catalog?category=${encodeURIComponent(cat)}`}
                className={`category-card-box cat-${cat.toLowerCase()}`}
              >
                <div className="cat-icon-bubble">
                  {categoryIcons[cat] || '📦'}
                </div>
                <div className="cat-card-text">
                  <h3>{cat}</h3>
                  <span className="cat-browse-action">Explore Collection →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-pre-title">Verified Merchant Catalog</span>
              <h2 className="section-main-title">Featured Trending Products</h2>
            </div>
            <Link to="/catalog" className="btn btn-secondary btn-sm">
              Explore Full Catalog
            </Link>
          </div>

          {loading ? (
            <div className="loading-state-card">
              <div className="spinner"></div>
              <p>Loading catalog items...</p>
            </div>
          ) : (
            <div className="grid-cols-4">
              {featuredProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Vendor Onboarding Commercial Banner */}
      <section className="vendor-spotlight-section">
        <div className="container">
          <div className="vendor-spotlight-card">
            <div className="spotlight-left">
              <span className="badge badge-warning">Sell on Nexvia Marketplace</span>
              <h2>Start Selling to Millions of Verified Shoppers</h2>
              <p>
                List your products in minutes, benefit from automated split commissions (keep 90% of every sale), and streamline warehouse fulfillment.
              </p>
              <div className="spotlight-actions">
                <Link to="/auth?mode=vendor" className="btn btn-primary btn-lg">
                  Open Vendor Account <ArrowRight size={16} />
                </Link>
                <Link to="/catalog" className="btn btn-secondary btn-lg">
                  Browse Verified Sellers
                </Link>
              </div>
            </div>

            <div className="spotlight-metrics-panel">
              <div className="metric-panel-row">
                <div className="metric-check">
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div>
                  <strong>Zero Setup or Listing Fees</strong>
                  <p>Pay only when you successfully make a sale</p>
                </div>
              </div>

              <div className="metric-panel-row">
                <div className="metric-check">
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div>
                  <strong>Direct Vendor Wallet Payouts</strong>
                  <p>Transparent balance ledger updated on payment capture</p>
                </div>
              </div>

              <div className="metric-panel-row">
                <div className="metric-check">
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div>
                  <strong>Order Management & Dispatch Control</strong>
                  <p>Pack, ship and generate packing slips directly from your portal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
