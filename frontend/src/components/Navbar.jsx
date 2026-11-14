import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Store, ShieldCheck, User, LogOut, Package, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout, quickSwitch } = useAuth();
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
      {/* Top Banner & Multi-Vendor Role Switcher */}
      <div className="navbar-top-strip">
        <div className="container top-strip-inner">
          <div className="strip-left">
            <span className="strip-highlight">
              <Zap size={13} fill="#38bdf8" color="#38bdf8" /> NEXT-GEN MULTI-VENDOR COMMERCE
            </span>
            <span className="dot">•</span>
            <span>Automated 10% Platform Split & Direct Vendor Payouts</span>
          </div>

          <div className="role-switcher-wrap">
            <span className="switcher-label">Simulate Role:</span>
            <div className="role-pills-group">
              <button
                className={`role-pill ${user?.role === 'customer' ? 'active customer' : ''}`}
                onClick={() => quickSwitch('customer')}
                title="Switch to Customer account (John Doe)"
              >
                Customer
              </button>
              <button
                className={`role-pill ${user?.role === 'vendor' ? 'active vendor' : ''}`}
                onClick={() => quickSwitch('vendor')}
                title="Switch to Vendor account (TechWorld Official)"
              >
                Vendor
              </button>
              <button
                className={`role-pill ${user?.role === 'admin' ? 'active admin' : ''}`}
                onClick={() => quickSwitch('admin')}
                title="Switch to Platform Admin account"
              >
                Admin
              </button>
            </div>
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
            <Link to="/catalog" className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`}>
              Explore
            </Link>

            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
              <Package size={17} />
              <span>Orders</span>
            </Link>

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
                    <span className={`user-role-badge ${user.role}`}>{user.role}</span>
                  </div>
                </div>
                <button onClick={logout} className="logout-btn" title="Sign Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary btn-sm">
                Sign In
              </Link>
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
            <span className="badge badge-success">Razorpay Split Payments Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
