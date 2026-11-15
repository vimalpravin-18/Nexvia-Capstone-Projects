import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthPage() {
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'vendor' ? 'register' : 'login';
  const defaultRole = searchParams.get('mode') === 'vendor' ? 'vendor' : 'customer';
  const redirectPath = searchParams.get('redirect') || '';

  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loggedUser;
      if (isLogin) {
        loggedUser = await login(email, password);
      } else {
        loggedUser = await register({
          name,
          email,
          password,
          role,
          storeName: role === 'vendor' ? storeName : undefined,
          description: role === 'vendor' ? description : undefined
        });
      }

      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedUser.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
            <h2>{isLogin ? 'Sign In to Nexvia' : 'Create an Account'}</h2>
            <p>
              {isLogin
                ? 'Enter your verified account credentials to access your dashboard'
                : 'Join the multi-vendor marketplace as a buyer or registered vendor'}
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
                    placeholder="e.g. Alex Morgan"
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
                        placeholder="e.g. Apex Tech & Audio"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Store Description</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Speciality category or product line..."
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
              {loading ? 'Authenticating with JWT...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
