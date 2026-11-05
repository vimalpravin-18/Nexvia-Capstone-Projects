import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Store, ShieldCheck, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout, quickSwitch } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-top-strip">
        <div className="container top-strip-inner">
          <div className="strip-left">
            <span>Multi-Vendor Platform</span>
            <span className="dot">•</span>
            <span>Automated Split Payouts (10% Commission)</span>
          </div>
          <div className="role-switcher">
            <span className="switcher-label">View As:</span>
            <button
              className={`role-pill ${user?.role === 'customer' ? 'active' : ''}`}
              onClick={() => quickSwitch('customer')}
            >
              Customer
            </button>
            <button
              className={`role-pill ${user?.role === 'vendor' ? 'active' : ''}`}
              onClick={() => quickSwitch('vendor')}
            >
              Vendor
            </button>
            <button
              className={`role-pill ${user?.role === 'admin' ? 'active' : ''}`}
              onClick={() => quickSwitch('admin')}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

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

          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          <nav className="navbar-nav">
            <Link to="/catalog" className="nav-link">
              Explore
            </Link>

            <Link to="/orders" className="nav-link">
              <Package size={17} />
              <span>Orders</span>
            </Link>

            {user?.role === 'vendor' && (
              <Link to="/vendor/dashboard" className="nav-link highlight-link">
                <Store size={17} />
                <span>Vendor Hub</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="nav-link highlight-link admin-link">
                <ShieldCheck size={17} />
                <span>Admin</span>
              </Link>
            )}

            <Link to="/cart" className="cart-btn">
              <ShoppingBag size={20} />
              <span className="cart-badge">{cartCount}</span>
            </Link>

            {user ? (
              <div className="user-profile-menu">
                <div className="user-avatar-tag">
                  <User size={16} />
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  <span className={`user-role-badge ${user.role}`}>{user.role}</span>
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
    </header>
  );
}

export default Navbar;