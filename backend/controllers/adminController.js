const store = require('../config/store');

const getAdminAnalytics = async (req, res) => {
  try {
    const orders = store.getOrders();
    const products = store.getProducts();
    const users = store.getUsers();

    const totalGMV = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const totalCommission = orders.reduce((sum, o) => sum + (o.platformCommissionTotal || 0), 0);
    const totalOrders = orders.length;

    const vendors = users.filter(u => u.role === 'vendor');
    const customers = users.filter(u => u.role === 'customer');

    const ordersByStatus = {
      placed: orders.filter(o => o.orderStatus === 'placed').length,
      packed: orders.filter(o => o.orderStatus === 'packed').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length
    };

    const topSellingProducts = [...products]
      .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
      .slice(0, 5);

    res.json({
      totalGMV,
      totalCommission,
      totalOrders,
      totalProducts: products.length,
      totalVendors: vendors.length,
      totalCustomers: customers.length,
      ordersByStatus,
      topSellingProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorsList = async (req, res) => {
  try {
    const vendors = store.getUsers()
      .filter(u => u.role === 'vendor')
      .map(v => ({
        id: v.id,
        name: v.name,
        email: v.email,
        storeName: v.vendorProfile?.storeName || v.name,
        commissionRate: v.vendorProfile?.commissionRate || 10,
        balance: v.vendorProfile?.balance || 0,
        totalSales: v.vendorProfile?.totalSales || 0,
        status: v.vendorProfile?.status || 'approved'
      }));
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = store.findUserById(id);
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const currentStatus = vendor.vendorProfile?.status || 'approved';
    const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';

    const updated = store.updateUser(id, {
      vendorProfile: {
        ...vendor.vendorProfile,
        status: newStatus
      }
    });

    res.json({
      message: `Vendor ${newStatus}`,
      vendor: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminAnalytics,
  getVendorsList,
  toggleVendorStatus
};

