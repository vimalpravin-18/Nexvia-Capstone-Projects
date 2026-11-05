import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, TrendingUp, Sparkles, Truck } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-pill">
              <Sparkles size={14} /> Next-Gen Multi-Vendor Commerce
            </span>
            <h1 className="hero-title">
              Shop from Verified Sellers. <br />
              All in One Marketplace.
            </h1>
            <p className="hero-desc">
              Discover cutting-edge gadgets, fashion, and accessories. Transparent vendor payouts, verified customer reviews, and end-to-end order tracking.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn btn-primary">
                <ShoppingBag size={18} />
                Explore Marketplace
              </Link>
              <Link to="/auth?mode=vendor" className="btn btn-secondary">
                Become a Vendor <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="hero-stats-card">
            <div className="stat-box">
              <span className="stat-number">10%</span>
              <span className="stat-label">Platform Fee</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">90%</span>
              <span className="stat-label">Vendor Payout</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Verified Orders</span>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="section-head">
            <h2>Shop by Category</h2>
            <Link to="/catalog" className="view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/catalog?category=${encodeURIComponent(cat)}`}
                className="category-tile"
              >
                <div className="cat-bullet"></div>
                <span className="cat-name">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Featured Trending Products</h2>
              <p className="section-sub">Top picks hand-selected from top rated marketplace vendors</p>
            </div>
            <Link to="/catalog" className="btn btn-secondary btn-sm">
              Explore All
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : (
            <div className="grid-cols-4">
              {featuredProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="vendor-banner-section">
        <div className="container">
          <div className="vendor-banner-card">
            <div className="vendor-banner-info">
              <span className="badge badge-warning">Sell on Nexvia</span>
              <h3>Expand Your Business Worldwide</h3>
              <p>
                List your products, receive automated split payments, track orders, and keep 90% of your total sales. Zero setup fee.
              </p>
              <Link to="/auth?mode=vendor" className="btn btn-primary">
                Open Vendor Account <ArrowRight size={16} />
              </Link>
            </div>
            <div className="vendor-banner-highlights">
              <div className="banner-point">
                <TrendingUp size={20} className="point-icon" />
                <div>
                  <strong>Automated Split Payouts</strong>
                  <p>Direct commission distribution to vendor wallet</p>
                </div>
              </div>
              <div className="banner-point">
                <Truck size={20} className="point-icon" />
                <div>
                  <strong>Order Management Portal</strong>
                  <p>Pack, ship, and track status with instant customer updates</p>
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
