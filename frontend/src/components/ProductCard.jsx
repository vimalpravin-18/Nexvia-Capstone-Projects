import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
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

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-card-image-wrap">
          <img src={imageSrc} alt={product.name} loading="lazy" />
          <span className="product-card-category">{product.category}</span>
          {product.featured && <span className="product-card-badge">Popular</span>}
        </div>

        <div className="product-card-body">
          <div className="product-vendor-meta">
            <span>Sold by:</span>
            <strong>{product.vendorName || 'Verified Vendor'}</strong>
          </div>

          <h3 className="product-card-title">{product.name}</h3>

          <div className="product-card-rating">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span className="rating-value">{product.rating || 4.5}</span>
            <span className="rating-count">({product.numReviews || 12})</span>
          </div>

          <div className="product-card-footer">
            <div className="product-price-box">
              <span className="currency-symbol">₹</span>
              <span className="product-price">{Number(product.price).toLocaleString('en-IN')}</span>
            </div>

            <button
              className={`product-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
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