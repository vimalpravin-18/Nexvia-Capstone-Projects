import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check, Zap, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imageSrc = (product.images && product.images[0]) || product.url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80';
  const originalPrice = Math.round(Number(product.price) * 1.18);
  const discountPercent = Math.round(((originalPrice - Number(product.price)) / originalPrice) * 100);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-card-image-wrap">
          <img src={imageSrc} alt={product.name} loading="lazy" />
          <div className="product-badges-overlay">
            <span className="product-card-category">{product.category}</span>
            {product.featured ? (
              <span className="product-card-badge popular">
                <Zap size={11} fill="#ffffff" /> Top Rated
              </span>
            ) : (
              <span className="product-card-badge discount">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="product-card-body">
          <div className="product-vendor-meta">
            <ShieldCheck size={13} className="vendor-shield" />
            <span>Sold by:</span>
            <strong>{product.vendorName || 'Verified Merchant'}</strong>
          </div>

          <h3 className="product-card-title">{product.name}</h3>

          <div className="product-card-rating">
            <div className="stars-pill">
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span className="rating-value">{product.rating || 4.8}</span>
            </div>
            <span className="rating-count">({product.numReviews || 24} reviews)</span>
          </div>

          <div className="product-card-footer">
            <div className="product-price-box">
              <div className="price-primary">
                <span className="currency-symbol">₹</span>
                <span className="product-price">{Number(product.price).toLocaleString('en-IN')}</span>
              </div>
              <span className="mrp-strikethrough">₹{originalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              className={`product-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              title="Add to Shopping Cart"
            >
              {added ? (
                <>
                  <Check size={15} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
