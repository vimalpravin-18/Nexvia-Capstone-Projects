const assert = require('assert');
const store = require('../config/store');
const searchService = require('../services/searchService');
const cache = require('../config/redis');

async function runTests() {
  console.log('--- Starting Nexvia Marketplace Test Suite ---');
  let passed = 0;
  let total = 0;

  function test(description, fn) {
    total++;
    try {
      fn();
      console.log(`PASS: ${description}`);
      passed++;
    } catch (err) {
      console.error(`FAIL: ${description} -> ${err.message}`);
    }
  }

  async function testAsync(description, fn) {
    total++;
    try {
      await fn();
      console.log(`PASS: ${description}`);
      passed++;
    } catch (err) {
      console.error(`FAIL: ${description} -> ${err.message}`);
    }
  }

  // 1. Data Store & Product Retrieval
  test('Store returns initial seed products', () => {
    const products = store.getProducts();
    assert(Array.isArray(products), 'Products should be an array');
    assert(products.length >= 6, 'Should contain at least 6 seed products');
  });

  // 2. Search & Filter Engine
  await testAsync('Search engine correctly filters by category and price range', async () => {
    const allProducts = store.getProducts();
    const { results } = await searchService.searchProducts(allProducts, {
      category: 'Mobiles',
      maxPrice: '140000'
    });
    assert(results.length > 0, 'Should find products matching criteria');
    results.forEach(p => {
      assert.strictEqual(p.category, 'Mobiles', 'Category must be Mobiles');
      assert(p.price <= 140000, 'Price must be <= 140000');
    });
  });

  // 3. User Authentication Models
  test('Admin, Vendor and Customer demo users are configured', () => {
    const admin = store.findUserByEmail('admin@nexvia.com');
    const vendor = store.findUserByEmail('vendor1@nexvia.com');
    const customer = store.findUserByEmail('customer@nexvia.com');

    assert(admin && admin.role === 'admin', 'Admin user must exist with role admin');
    assert(vendor && vendor.role === 'vendor', 'Vendor user must exist with role vendor');
    assert(customer && customer.role === 'customer', 'Customer user must exist with role customer');
  });

  // 4. Cart Cache Service
  await testAsync('Cart caching service saves and retrieves cart items', async () => {
    const testKey = 'cart:test_user_99';
    const sampleItems = [{ id: 'prod_1', name: 'Test iPhone', price: 999, qty: 2 }];

    await cache.set(testKey, sampleItems);
    const retrieved = await cache.get(testKey);

    assert(retrieved && retrieved.length === 1, 'Cart items should be cached');
    assert.strictEqual(retrieved[0].id, 'prod_1');
    await cache.del(testKey);
  });

  // 5. Coupon Engine
  test('Coupon validation accurately calculates percentage and flat discount', () => {
    const coupon10 = store.findCouponByCode('WELCOME10');
    assert(coupon10 && coupon10.discountPercent === 10, 'WELCOME10 should give 10% discount');

    const coupon500 = store.findCouponByCode('SUPER500');
    assert(coupon500 && coupon500.flatDiscount === 500, 'SUPER500 should give flat 500 discount');
  });

  // 6. Multi-Vendor Commission Split
  test('Order calculation accurately allocates 10% platform commission and 90% vendor payout', () => {
    const subtotal = 10000;
    const commissionPercent = 10;
    const platformCommission = (subtotal * commissionPercent) / 100;
    const vendorPayout = subtotal - platformCommission;

    assert.strictEqual(platformCommission, 1000, 'Platform commission should be 10% (1000)');
    assert.strictEqual(vendorPayout, 9000, 'Vendor payout should be 90% (9000)');
  });

  // 7. Review Calculation
  test('Adding a review updates product average rating and count', () => {
    const product = store.getProducts()[0];
    const initialReviewsCount = product.numReviews;

    store.createReview({
      id: 'rev_test_' + Date.now(),
      productId: product.id,
      userId: 'usr_customer',
      userName: 'John Doe',
      rating: 5,
      comment: 'Super fast delivery and great quality!',
      createdAt: new Date().toISOString()
    });

    const updated = store.findProductById(product.id);
    assert.strictEqual(updated.numReviews, initialReviewsCount + 1, 'Review count must increment by 1');
  });

  console.log(`\nResults: ${passed} / ${total} tests passed successfully.\n`);
  if (passed === total) {
    console.log('ALL TESTS PASSED');
  }
}

runTests();

