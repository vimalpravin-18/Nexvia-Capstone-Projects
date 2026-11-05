import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store, User, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthPage() {
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'vendor' ? 'register' : 'login';
  const defaultRole = searchParams.get('mode') === 'vendor' ? 'vendor' : 'customer';

  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, quickSwitch } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          storeName: role === 'vendor' ? storeName : undefined,
          description: role === 'vendor' ? description : undefined
        });
      }

      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    quickSwitch(demoRole);
    if (demoRole === 'vendor') {
      navigate('/vendor/dashboard');
    } else if (demoRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card card">
          <div className="auth-card-top">
            <div className="auth-icon-badge">
              <Store size={26} color="#ffffff" />
            </div>
            <h2>{isLogin ? 'Welcome Back to Nexvia' : 'Create an Account'}</h2>
            <p>
              {isLogin
                ? 'Sign in to access your orders or seller dashboard'
                : 'Join the multi-vendor marketplace as buyer or independent vendor'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="role-selector-group">
                  <label className="group-label">I want to register as:</label>
                  <div className="role-pick-row">
                    <button
                      type="button"
                      className={`role-choice-btn ${role === 'customer' ? 'selected' : ''}`}
                      onClick={() => setRole('customer')}
                    >
                      <User size={16} /> Customer
                    </button>
                    <button
                      type="button"
                      className={`role-choice-btn ${role === 'vendor' ? 'selected' : ''}`}
                      onClick={() => setRole('vendor')}
                    >
                      <Store size={16} /> Vendor / Seller
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                {role === 'vendor' && (
                  <>
                    <div className="form-group">
                      <label>Store Name *</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Prime Electronics"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Store Description</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Speciality category or items sold..."
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="form-group">
              <label>Email Address *</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Accounts for Fast Evaluation */}
          <div className="demo-accounts-strip">
            <span className="demo-label">1-Click Demo Evaluation Sign In:</span>
            <div className="demo-buttons">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="demo-btn customer"
              >
                <User size={13} /> Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('vendor')}
                className="demo-btn vendor"
              >
                <Store size={13} /> Vendor (TechWorld)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="demo-btn admin"
              >
                <ShieldCheck size={13} /> Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
