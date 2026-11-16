const store = require('../config/store');

const getProductReviews = async (req, res) => {
  try {
    const reviews = store.getReviews(req.params.productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const product = store.findProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = {
      id: 'rev_' + Date.now(),
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    const saved = store.createReview(newReview);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  addReview
};

