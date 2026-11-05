const store = require('../config/store');
const searchService = require('../services/searchService');

const getProducts = async (req, res) => {
  try {
    const allProducts = store.getProducts();
    const { results, queryDSL } = await searchService.searchProducts(allProducts, req.query);

    res.json({
      count: results.length,
      products: results,
      searchEngine: 'elasticsearch-ready'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = store.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const reviews = store.getReviews(product.id);
    res.json({ ...product, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, images, featured } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price and category are required' });
    }

    const newProduct = {
      id: 'prod_' + Date.now(),
      name,
      description: description || '',
      price: Number(price),
      category,
      brand: brand || 'Generic',
      stock: stock ? Number(stock) : 10,
      rating: 5.0,
      numReviews: 0,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80'
      ],
      vendorId: req.user.id,
      vendorName: req.user.vendorProfile ? req.user.vendorProfile.storeName : req.user.name,
      featured: Boolean(featured),
      createdAt: new Date().toISOString()
    };

    const saved = store.createProduct(newProduct);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = store.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role !== 'admin' && product.vendorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = store.updateProduct(req.params.id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = store.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role !== 'admin' && product.vendorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    store.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const products = store.getProducts();
    const categories = ['All', ...new Set(products.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
