import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
          const fresh = await api.getMe();
          if (fresh && fresh.user) {
            setUser(fresh.user);
            localStorage.setItem('user', JSON.stringify(fresh.user));
          }
        } catch (e) {
          try {
            const res = await api.login('customer@nexvia.com', 'password123');
            setToken(res.token);
            setUser(res.user);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
          } catch (loginErr) {}
        }
      } else {
        try {
          const res = await api.login('customer@nexvia.com', 'password123');
          setToken(res.token);
          setUser(res.user);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        } catch (e) {
          const demoUser = {
            id: 'usr_customer',
            name: 'John Doe',
            email: 'customer@nexvia.com',
            role: 'customer'
          };
          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const quickSwitch = async (role) => {
    let email = 'customer@nexvia.com';
    if (role === 'admin') email = 'admin@nexvia.com';
    else if (role === 'vendor') email = 'vendor1@nexvia.com';

    try {
      const res = await api.login(email, 'password123');
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res.user;
    } catch (e) {
      if (role === 'admin') {
        const adminUser = {
          id: 'usr_admin',
          name: 'Platform Admin',
          email: 'admin@nexvia.com',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
      } else if (role === 'vendor') {
        const vendorUser = {
          id: 'usr_vendor1',
          name: 'TechWorld Electronics',
          email: 'vendor1@nexvia.com',
          role: 'vendor',
          vendorProfile: {
            storeName: 'TechWorld Official',
            description: 'Premium gadgets, smartphones, and audio gear.',
            commissionRate: 10,
            balance: 14200,
            totalSales: 48,
            status: 'approved'
          }
        };
        setUser(vendorUser);
        localStorage.setItem('user', JSON.stringify(vendorUser));
      } else {
        const custUser = {
          id: 'usr_customer',
          name: 'John Doe',
          email: 'customer@nexvia.com',
          role: 'customer'
        };
        setUser(custUser);
        localStorage.setItem('user', JSON.stringify(custUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
