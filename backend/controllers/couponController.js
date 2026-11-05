const store = require('../config/store');

const getCoupons = async (req, res) => {
  try {
    const coupons = store.getCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = store.findCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    const subtotal = Number(amount) || 0;
    if (subtotal < (coupon.minPurchase || 0)) {
      return res.status(400).json({
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`
      });
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount || Infinity);
    } else if (coupon.flatDiscount) {
      discount = coupon.flatDiscount;
    }

    res.json({
      valid: true,
      code: coupon.code,
      discount,
      message: `Coupon applied! You saved ₹${discount}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, flatDiscount, minPurchase, maxDiscount } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const newCoupon = {
      code: code.toUpperCase(),
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      flatDiscount: flatDiscount ? Number(flatDiscount) : undefined,
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      active: true
    };

    store.createCoupon(newCoupon);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCoupons,
  validateCoupon,
  createCoupon
};
