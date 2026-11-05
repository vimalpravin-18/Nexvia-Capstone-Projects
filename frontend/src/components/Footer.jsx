import { Store, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="container">
        <div className="footer-features">
          <div className="feature-item">
            <Store className="feature-icon" />
            <div>
              <h4>Multi-Vendor Hub</h4>
              <p>Direct from verified independent vendors</p>
            </div>
          </div>
          <div className="feature-item">
            <Zap className="feature-icon" />
            <div>
              <h4>Split Payouts</h4>
              <p>Automated vendor earnings & transparent commissions</p>
            </div>
          </div>
          <div className="feature-item">
            <ShieldCheck className="feature-icon" />
            <div>
              <h4>Secure Test Payments</h4>
              <p>Integrated with Razorpay & Stripe Connect</p>
            </div>
          </div>
          <div className="feature-item">
            <RefreshCw className="feature-icon" />
            <div>
              <h4>Realtime Tracking</h4>
              <p>Track orders through placed to delivery</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Nexvia Multi-Vendor Marketplace. Capstone Project FS-01.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Vendor Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
