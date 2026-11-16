import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Store, ShieldCheck, User, LogOut, Package, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  const navCategories = ['Mobiles', 'Audio', 'Wearables', 'Fashion', 'Footwear', 'Accessories'];

  return (
    <header className="navbar-header">
      {/* Enterprise Top Announcement Bar */}
      <div className="navbar-top-strip">
        <div className="container top-strip-inner">
          <div className="strip-left">
            <span className="strip-highlight">NEXVIA GLOBAL COMMERCE</span>
            <span className="dot">•</span>
            <span>Free Express Shipping on Orders Over ₹999</span>
            <span className="dot">•</span>
            <span>Verified Multi-Vendor Sellers</span>
          </div>

          <div className="strip-right-links">
            {(!user || user.role === 'customer') && (
              <Link to="/auth?mode=vendor" className="top-link vendor-cta">
                <Store size={13} />
                <span>Sell on Nexvia</span>
              </Link>
            )}
            <span className="dot">•</span>
            <span className="top-link">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar-main">
        <div className="container navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">
              <Store size={22} color="#ffffff" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Nexvia</span>
              <span className="brand-subtitle">Marketplace</span>
            </div>
          </Link>

          {/* Omnisearch */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search across all vendors, gadgets, fashion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" aria-label="Search" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* Action Navigation */}
          <nav className="navbar-nav">
            <Link to="/catalog" className={`nav-link nav-link-explore ${location.pathname === '/catalog' ? 'active' : ''}`}>
              Explore
            </Link>

            {user && (
              <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
                <Package size={17} />
                <span>Orders</span>
              </Link>
            )}

            {user?.role === 'vendor' && (
              <Link to="/vendor/dashboard" className="nav-link portal-link vendor">
                <Store size={16} />
                <span>Vendor Hub</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="nav-link portal-link admin">
                <ShieldCheck size={16} />
                <span>Admin Hub</span>
              </Link>
            )}

            <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="user-profile-menu">
                <div className="user-avatar-tag">
                  <div className="avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-text-info">
                    <span className="user-name">{user.name.split(' ')[0]}</span>
                    <span className={`user-role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'Administrator' : user.role === 'vendor' ? 'Verified Seller' : 'Customer'}
                    </span>
                  </div>
                </div>
                <button onClick={logout} className="logout-btn" title="Sign Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="guest-auth-actions">
                <Link to="/auth" className="btn btn-primary btn-sm">
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Sub-navigation category pills bar */}
      <div className="navbar-categories-bar">
        <div className="container subnav-container">
          <Link to="/catalog" className="subnav-item all">
            <Sparkles size={14} /> All Categories
          </Link>
          <div className="subnav-divider"></div>
          <div className="subnav-scroll">
            {navCategories.map(cat => (
              <Link
                key={cat}
                to={`/catalog?category=${encodeURIComponent(cat)}`}
                className="subnav-item"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="subnav-right-badge">
            <span className="badge badge-success">Automated 10% Split • Razorpay Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
