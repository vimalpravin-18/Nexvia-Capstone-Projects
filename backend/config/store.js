const fs = require('fs');
const path = require('path');
const {
  initialUsers,
  initialProducts,
  initialCoupons,
  initialOrders,
  initialReviews
} = require('../data/seedData');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db_store.json');

class DataStore {
  constructor() {
    this.data = {
      users: [...initialUsers],
      products: [...initialProducts],
      coupons: [...initialCoupons],
      orders: [...initialOrders],
      reviews: [...initialReviews],
      carts: {}
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.data, ...parsed };
      } else {
        this.persist();
      }
    } catch (err) {
      console.log('Using in-memory store');
    }
  }

  persist() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      // safe fallback
    }
  }

  getUsers() {
    return this.data.users;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    this.data.users.push(userData);
    this.persist();
    return userData;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.persist();
      return this.data.users[idx];
    }
    return null;
  }

  getProducts() {
    return this.data.products;
  }

  findProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(productData) {
    this.data.products.unshift(productData);
    this.persist();
    return productData;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.persist();
      return this.data.products[idx];
    }
    return null;
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = this.data.products.splice(idx, 1)[0];
      this.persist();
      return deleted;
    }
    return null;
  }

  getOrders() {
    return this.data.orders;
  }

  findOrderById(id) {
    return this.data.orders.find(o => o.id === id);
  }

  createOrder(orderData) {
    this.data.orders.unshift(orderData);
    this.persist();
    return orderData;
  }

  updateOrder(id, updates) {
    const idx = this.data.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
      this.persist();
      return this.data.orders[idx];
    }
    return null;
  }

  getCoupons() {
    return this.data.coupons;
  }

  findCouponByCode(code) {
    return this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
  }

  createCoupon(couponData) {
    this.data.coupons.push(couponData);
    this.persist();
    return couponData;
  }

  getReviews(productId) {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId);
    }
    return this.data.reviews;
  }

  createReview(reviewData) {
    this.data.reviews.unshift(reviewData);
    const prodReviews = this.getReviews(reviewData.productId);
    const currentProduct = this.findProductById(reviewData.productId);
    const newReviewCount = (currentProduct && currentProduct.numReviews ? currentProduct.numReviews : 0) + 1;
    const avgRating = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));
    this.updateProduct(reviewData.productId, {
      rating: avgRating,
      numReviews: newReviewCount
    });
    this.persist();
    return reviewData;
  }

  getCart(userId) {
    return this.data.carts[userId] || [];
  }

  saveCart(userId, items) {
    this.data.carts[userId] = items;
    this.persist();
    return items;
  }

  clearCart(userId) {
    delete this.data.carts[userId];
    this.persist();
  }
}

const store = new DataStore();
module.exports = store;
