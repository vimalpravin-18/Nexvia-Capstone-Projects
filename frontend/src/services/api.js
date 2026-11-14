const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(payload) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data;
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
    return data;
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Product not found');
    return data;
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async saveCart(items) {
    const res = await fetch(`${API_BASE}/cart/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items })
    });
    return res.json();
  },

  // Coupons
  async validateCoupon(code, amount) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid coupon');
    return data;
  },

  // Orders
  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create order');
    return data;
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/myorders`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
    return data;
  },

  async getVendorOrders() {
    const res = await fetch(`${API_BASE}/orders/vendor`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch vendor orders');
    return data;
  },

  async updateOrderStatus(orderId, status, note) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, note })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order not found');
    return data;
  },

  // Reviews
  async addReview(productId, review) {
    const res = await fetch(`${API_BASE}/reviews/${productId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(review)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add review');
    return data;
  },

  // Admin
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load analytics');
    return data;
  },

  async getVendors() {
    const res = await fetch(`${API_BASE}/admin/vendors`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load vendors');
    return data;
  },

  async toggleVendorStatus(id) {
    const res = await fetch(`${API_BASE}/admin/vendors/${id}/toggle-status`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update vendor');
    return data;
  },

  // Payments
  async getPaymentConfig() {
    const res = await fetch(`${API_BASE}/payments/config`);
    return res.json();
  },

  async createPaymentOrder(amount) {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount })
    });
    return res.json();
  },

  async verifyPayment(paymentData) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData)
    });
    return res.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  }
};
