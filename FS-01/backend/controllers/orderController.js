const store = require('../config/store');

const DEFAULT_COMMISSION = Number(process.env.PLATFORM_COMMISSION_PERCENT) || 10;

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'Razorpay', couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    let subtotal = 0;
    const vendorMap = {};

    items.forEach(item => {
      const lineTotal = item.price * (item.qty || 1);
      subtotal += lineTotal;

      const vId = item.vendorId || 'usr_vendor1';
      if (!vendorMap[vId]) {
        vendorMap[vId] = {
          vendorId: vId,
          subtotal: 0,
          items: []
        };
      }
      vendorMap[vId].subtotal += lineTotal;
      vendorMap[vId].items.push(item);
    });

    let discount = 0;
    if (couponCode) {
      const coupon = store.findCouponByCode(couponCode);
      if (coupon && subtotal >= (coupon.minPurchase || 0)) {
        if (coupon.discountPercent) {
          discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount || Infinity);
        } else if (coupon.flatDiscount) {
          discount = coupon.flatDiscount;
        }
      }
    }

    const finalAmount = Math.max(0, subtotal - discount);

    let platformCommissionTotal = 0;
    const vendorPayouts = Object.values(vendorMap).map(v => {
      const vendorUser = store.findUserById(v.vendorId);
      const commissionRate = vendorUser && vendorUser.vendorProfile && vendorUser.vendorProfile.commissionRate
        ? vendorUser.vendorProfile.commissionRate
        : DEFAULT_COMMISSION;

      const commissionFee = Math.round((v.subtotal * commissionRate) / 100);
      const payoutAmount = v.subtotal - commissionFee;
      platformCommissionTotal += commissionFee;

      if (vendorUser && vendorUser.vendorProfile) {
        const curProf = vendorUser.vendorProfile;
        store.updateUser(v.vendorId, {
          vendorProfile: {
            ...curProf,
            balance: (curProf.balance || 0) + payoutAmount,
            totalSales: (curProf.totalSales || 0) + v.items.length
          }
        });
      }

      return {
        vendorId: v.vendorId,
        vendorName: vendorUser ? (vendorUser.vendorProfile ? vendorUser.vendorProfile.storeName : vendorUser.name) : 'Vendor',
        subtotal: v.subtotal,
        commissionFee,
        payoutAmount,
        status: 'allocated'
      };
    });

    const newOrder = {
      id: 'ord_' + Date.now(),
      customer: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid',
      totalAmount: subtotal,
      discountAmount: discount,
      couponCode: couponCode || null,
      finalAmount,
      platformCommissionTotal,
      vendorPayouts,
      orderStatus: 'placed',
      timeline: [
        {
          status: 'placed',
          timestamp: new Date().toISOString(),
          note: `Order received and confirmed via ${paymentMethod}`
        }
      ],
      createdAt: new Date().toISOString()
    };

    store.createOrder(newOrder);
    store.clearCart(req.user.id);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = store.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      req.user.role !== 'admin' &&
      order.customer.id !== req.user.id &&
      !order.items.some(i => i.vendorId === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = store.getOrders().filter(o => o.customer.id === req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const orders = store.getOrders().filter(o =>
      o.items.some(i => i.vendorId === req.user.id)
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = store.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = store.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validStatuses = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const newTimeline = [
      ...order.timeline,
      {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order updated to ${status}`
      }
    ];

    const updated = store.updateOrder(req.params.id, {
      orderStatus: status,
      timeline: newTimeline
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus
};

