import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await api.getCategories();
        setCategories(catData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          sort: sortBy,
          maxPrice: maxPrice.toString()
        };
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const data = await api.getProducts(params);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadProducts, 200);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchQuery, sortBy, maxPrice]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(150000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <div>
            <h1>Marketplace Catalog</h1>
            <p>Explore high quality products from certified vendors</p>
          </div>

          <div className="catalog-sort-box">
            <ArrowUpDown size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="catalog-search-strip">
          <div className="catalog-search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by product name, brand, or feature..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-btn">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-head">
                <SlidersHorizontal size={16} />
                <h3>Categories</h3>
              </div>
              <div className="category-filter-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="active-dot">•</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Max Budget</h3>
              <div className="price-slider-wrap">
                <input
                  type="range"
                  min="2000"
                  max="150000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="price-labels">
                  <span>Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button onClick={resetFilters} className="btn btn-secondary btn-sm reset-filters-btn">
              Reset Filters
            </button>
          </aside>

          <main className="catalog-content">
            <div className="results-meta">
              <span>Showing <strong>{products.length}</strong> items</span>
              {selectedCategory !== 'All' && (
                <span className="active-filter-tag">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategorySelect('All')}><X size={12} /></button>
                </span>
              )}
            </div>

            {loading ? (
              <div className="catalog-loading">Loading catalog items...</div>
            ) : products.length > 0 ? (
              <div className="grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="no-products-state">
                <h3>No products found</h3>
                <p>Try clearing search keywords or expanding your filters.</p>
                <button onClick={resetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;
