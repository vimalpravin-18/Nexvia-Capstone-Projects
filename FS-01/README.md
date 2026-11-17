# Project 1 – Nexvia Marketplace

## 1. Project Overview

Nexvia Marketplace is a full-stack web application developed as part of the Nexvia Technologies technical assessment.

The platform provides a comprehensive multi-vendor online marketplace experience with user authentication, independent vendor store management, product discovery and catalog management, Redis-backed shopping cart functionality, automated split payment processing, order fulfillment tracking, and GST-compliant invoice generation.

## 2. Technology Stack

### Frontend
- React.js (React 19)
- Vite
- React Router DOM
- Lucide React (Icons)
- JavaScript (ES6+)
- HTML5
- CSS3 (Responsive Design with CSS Variables & Tokens)

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication (JSON Web Tokens with RBAC)
- Multer (Multipart file processing)
- CORS & Helmet Security Middleware

### Database
- MongoDB
- Mongoose ODM (Schemas, validation, indexes, and resilient file-backed fallback)

### Cloud and Integrations
- AWS S3 (Media asset storage & pre-signed URL generation)
- Razorpay / Stripe (Automated split payments: 10% platform commission, 90% vendor payout)
- Redis (Cart caching and session key-value storage with memory adapter fallback)
- Elasticsearch DSL (Fuzzy full-text search, multi-facet filtering, and price range sorting)

## 3. Key Features

### Authentication
- User registration and login for Customers, Vendors, and Administrators
- JWT-based authentication with secure cookie/header token transmission
- Protected routes with Role-Based Access Control (RBAC)
- Built-in role switcher for rapid assessment evaluation

### Marketplace
- Multi-vendor product listing with stock and category badges
- Detailed product pages with specifications, pricing breakdown, and customer reviews
- Elasticsearch Query DSL fuzzy search and multi-facet category/price filtering
- Vendor store profiles and vendor-specific product isolation
- Merchant inventory and stock management CRUD operations

### Shopping and Orders
- High-speed Redis-backed persistent shopping cart
- Promotional coupon code validation (e.g., `WELCOME10` for 10% discount)
- Split payment calculation and simulated checkout with Razorpay/Stripe Connect
- Automated earnings distribution: 90% to merchant balance, 10% platform fee
- Customer order history with four-stage lifecycle tracking (`Placed` → `Packed` → `Shipped` → `Delivered`)
- GST-compliant downloadable and printable tax invoices with itemized merchant breakdown

### Media Management
- Product image uploads with file format and size validation
- AWS S3 cloud storage integration with local multipart file fallback

### Additional Features
- Vendor Analytics Dashboard: real-time sales revenue, wallet balance, and pending fulfillment alerts
- Administrator Command Center: platform GMV analytics, commission tracking, and vendor onboarding/suspension
- 100% Mobile responsive layout optimized for all device viewports with zero horizontal overflow

## 4. Application Architecture

```text
React Frontend (Vite)
      |
      | REST API / JSON
      |
Node.js + Express Backend
      |
      | Mongoose ODM
      |
MongoDB Database

External Integrations:
- AWS S3 (Media Storage)
- Razorpay / Stripe (Payment Split Gateway)
- Redis (Session & Cart Cache)
- Elasticsearch DSL (Product Search)
```

## 5. Folder Structure

```text
FS-01/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
├── screenshots/
│   ├── 01_homepage_desktop.png
│   ├── 02_catalog_products.png
│   ├── 03_product_detail.png
│   ├── 04_cart_checkout.png
│   ├── 05_mobile_responsive_store.png
│   └── 06_mobile_catalog_filters.png
├── .env.example
└── README.md
```

## 6. Environment Configuration

Create a `.env` file in the `backend/` directory using `.env.example` as a template:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexvia_marketplace
JWT_SECRET=your_jwt_secret_key_here
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=nexvia-marketplace-assets
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Refer to `.env.example` for all required configuration variables. Never commit actual credentials or API secrets.

## 7. Installation and Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- MongoDB connection string or local MongoDB instance
- Required external service credentials (optional; built-in fallbacks are provided)

### Backend

```bash
cd backend
npm install
npm run dev
```

Use the production start command defined in package.json when deploying:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## 8. Deployment

- **Frontend:** [https://nexvia-vendor-marketplace.vercel.app](https://nexvia-vendor-marketplace.vercel.app) *(Vercel)*
- **Backend:** [https://nexvia-backend.onrender.com](https://nexvia-backend.onrender.com) *(Render — Health Check: `/api/health`)*

### Test Accounts for Evaluation
- **Customer:** `customer@nexvia.com` / `password123`
- **Vendor:** `vendor1@nexvia.com` / `password123`
- **Vendor 2:** `vendor2@nexvia.com` / `password123`
- **Administrator:** `admin@nexvia.com` / `password123`

## 9. Screenshots

Screenshots demonstrating the actual application are located in `./screenshots/`:

- **Home page:** `./screenshots/01_homepage_desktop.png`
- **Product listing & filters:** `./screenshots/02_catalog_products.png`
- **Product details & reviews:** `./screenshots/03_product_detail.png`
- **Shopping cart & checkout:** `./screenshots/04_cart_checkout.png`
- **Mobile storefront:** `./screenshots/05_mobile_responsive_store.png`
- **Mobile catalog & search:** `./screenshots/06_mobile_catalog_filters.png`

## 10. Future Improvements

- Automated push and SMS notifications for order fulfillment status transitions
- In-app real-time messaging between customers and verified merchants
- Multi-currency conversion and international payment gateway integration
- Advanced warehouse inventory multi-location management

## 11. Developer

**Vimal Pravin**

Developed for the Nexvia Technologies technical assessment.
