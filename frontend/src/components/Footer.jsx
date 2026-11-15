import { Store, ShieldCheck, RefreshCw, Zap, Truck, Headphones, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="container">
        {/* Top Guarantee Strip */}
        <div className="footer-features">
          <div className="feature-item">
            <div className="feature-icon-box">
              <Store className="feature-icon" />
            </div>
            <div>
              <h4>Direct Multi-Vendor Hub</h4>
              <p>Authentic products straight from KYC-verified merchants.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <Zap className="feature-icon" />
            </div>
            <div>
              <h4>Automated 10/90 Split</h4>
              <p>10% platform fee, 90% instant net credit to seller balance.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <ShieldCheck className="feature-icon" />
            </div>
            <div>
              <h4>Razorpay Escrow Security</h4>
              <p>256-bit encrypted checkout with UPI, Card, and NetBanking.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-box">
              <Truck className="feature-icon" />
            </div>
            <div>
              <h4>Live Fulfillment Tracking</h4>
              <p>Real-time lifecycle: Placed → Packed → Shipped → Delivered.</p>
            </div>
          </div>
        </div>

        {/* Multi-Column Sitemap */}
        <div className="footer-columns-grid">
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <Store size={22} color="#ffffff" />
              </div>
              <span className="footer-brand-title">Nexvia</span>
            </div>
            <p className="footer-brand-desc">
              India's premier Amazon-grade multi-vendor commerce platform with automated vendor payouts, elastic search filters, and GST-compliant tax invoicing.
            </p>
            <div className="footer-platform-tags">
              <span className="tag-pill">MongoDB Atlas</span>
              <span className="tag-pill">Razorpay 2.9</span>
              <span className="tag-pill">AWS S3</span>
              <span className="tag-pill">Redis Cache</span>
            </div>
          </div>

          <div className="footer-col">
            <h5>Marketplace</h5>
            <ul className="footer-nav-list">
              <li><Link to="/catalog?category=Mobiles">Smartphones & Tablets</Link></li>
              <li><Link to="/catalog?category=Audio">Wireless Audio & ANC</Link></li>
              <li><Link to="/catalog?category=Wearables">Smartwatches & Fitness</Link></li>
              <li><Link to="/catalog?category=Fashion">Streetwear & Apparel</Link></li>
              <li><Link to="/catalog?category=Footwear">Performance Footwear</Link></li>
              <li><Link to="/catalog?category=Accessories">Computing Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Seller & Vendors</h5>
            <ul className="footer-nav-list">
              <li><Link to="/auth?mode=vendor">Sell on Nexvia (Onboarding)</Link></li>
              <li><Link to="/vendor/dashboard">Merchant Portal Login</Link></li>
              <li><Link to="/admin/dashboard">Platform Admin Console</Link></li>
              <li><span className="disabled-link">10% Platform Fee Policy</span></li>
              <li><span className="disabled-link">T+1 Settlement Cycle</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Customer Support</h5>
            <ul className="footer-nav-list">
              <li><Link to="/orders">Track Order Status</Link></li>
              <li><Link to="/cart">Review Shopping Bag</Link></li>
              <li><span className="disabled-link">Printable GST Tax Invoices</span></li>
              <li><span className="disabled-link">7-Day Easy Replacements</span></li>
              <li><span className="disabled-link">support@nexvia.com</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 Nexvia Multi-Vendor Marketplace. Full-Stack Production Release.</p>
          <div className="footer-payment-badges">
            <span className="pay-badge">Razorpay Verified</span>
            <span className="pay-badge">UPI / GPay / PhonePe</span>
            <span className="pay-badge">Visa & Mastercard</span>
            <span className="pay-badge">256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
