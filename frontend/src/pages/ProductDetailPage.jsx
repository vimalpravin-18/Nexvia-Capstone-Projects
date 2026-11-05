import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Store, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const loadProduct = async () => {
    try {
      const data = await api.getProductById(id);
      setProduct(data);
      const img = (data.images && data.images[0]) || data.url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80';
      setSelectedImage(img);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await api.addReview(product.id, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewComment('');
      setReviewMessage('Thank you! Your review has been posted.');
      setTimeout(() => setReviewMessage(''), 4000);
      loadProduct();
    } catch (err) {
      setReviewMessage(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container detail-loading">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container detail-not-found">
        <h2>Product Not Found</h2>
        <Link to="/catalog" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/catalog" className="back-link">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="main-image-wrap">
              <img src={selectedImage} alt={product.name} />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="thumbnails-row">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-panel">
            <span className="badge badge-primary">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta-row">
              <div className="rating-pill">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span className="rating-num">{product.rating}</span>
                <span className="rating-total">({product.numReviews} ratings)</span>
              </div>
              <span className="brand-tag">Brand: <strong>{product.brand || 'Verified'}</strong></span>
            </div>

            <div className="product-vendor-card">
              <Store size={18} className="vendor-icon" />
              <div>
                <span>Vendor:</span>
                <strong>{product.vendorName || 'TechWorld Official'}</strong>
                <span className="split-badge">Automated Split Payout</span>
              </div>
            </div>

            <div className="price-tag-box">
              <div className="price-main">
                <span className="currency">₹</span>
                <span className="price-val">{Number(product.price).toLocaleString('en-IN')}</span>
              </div>
              <span className="tax-inclusive">Inclusive of all taxes</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">● In Stock ({product.stock} units available)</span>
              ) : (
                <span className="out-stock">● Currently Out of Stock</span>
              )}
            </div>

            <div className="add-cart-action-group">
              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                className={`btn btn-primary btn-add-main ${added ? 'btn-success' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <div className="perks-list">
              <div className="perk-item">
                <Truck size={18} />
                <span>Standard Delivery in 2-4 business days</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={18} />
                <span>100% Buyer Protection & Razorpay Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section card">
          <div className="reviews-header">
            <div>
              <h2>Customer Reviews & Ratings</h2>
              <p>Real feedback from verified buyers</p>
            </div>
            <div className="overall-score">
              <Star size={24} fill="#f59e0b" color="#f59e0b" />
              <span className="big-rating">{product.rating}</span>
              <span className="out-of">/ 5.0</span>
            </div>
          </div>

          <div className="reviews-layout">
            <div className="review-list">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="review-item">
                    <div className="review-user-row">
                      <strong>{rev.userName}</strong>
                      <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rev.rating ? '#f59e0b' : 'none'}
                          color={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                        />
                      ))}
                    </div>
                    <p className="review-text">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="no-reviews">No reviews yet for this product. Be the first to review!</p>
              )}
            </div>

            <div className="write-review-box">
              <h3>Write a Review</h3>
              {reviewMessage && <div className="review-alert">{reviewMessage}</div>}
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className="star-pick-btn"
                        onClick={() => setReviewRating(star)}
                      >
                        <Star
                          size={22}
                          fill={star <= reviewRating ? '#f59e0b' : 'none'}
                          color={star <= reviewRating ? '#f59e0b' : '#cbd5e1'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Review Description</label>
                  <textarea
                    rows={4}
                    placeholder="Share your experience with this item..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
