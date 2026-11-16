# Nexvia Technologies — Full-Stack Capstone Projects Portfolio

> Professional repository housing full-stack software development projects assigned by **Nexvia Technologies**. Each project is independently modularized with isolated frontends, backends, environment configs, and technical documentation.

---

## 🗂️ Portfolio Repository Structure

```text
Nexvia-Projects/
│
├── FS-01/                                # Project 1: Multi-Vendor E-Commerce Marketplace (Production-Ready)
│   ├── frontend/                         # React 19 + Vite Single Page Application
│   ├── backend/                          # Node.js + Express REST API Engine
│   ├── screenshots/                      # UI Walkthroughs & Mobile Responsive Proofs
│   ├── .env.example                      # Safe Backend/Frontend Environment Template
│   └── README.md                         # Detailed Architectural & API Documentation
│
├── FS-03/                                # Project 2: Nexvia Capstone Assignment (In Development)
│   ├── frontend/                         # Client Application Scaffold
│   ├── backend/                          # Backend Service Scaffold
│   ├── screenshots/                      # Evaluation Artifacts
│   ├── .env.example                      # Environment Template
│   └── README.md                         # Project Specifications & Milestone Tracker
│
├── .gitignore                            # Unified Multi-Project Security Rules
└── README.md                             # Master Portfolio Overview (This Document)
```

---

## 🚀 Projects Summary

| Project ID | Project Title | Architecture | Status | Documentation |
|---|---|---|---|:---:|
| **`FS-01`** | **Multi-Vendor E-Commerce Marketplace** | React 19 • Node.js • MongoDB • Redis • Elasticsearch DSL • Razorpay | **Completed & Ready** | [FS-01 Documentation](./FS-01/README.md) |
| **`FS-03`** | **Nexvia Capstone Assignment 2** | *TBD upon project kickoff* | **In Development** | [FS-03 Documentation](./FS-03/README.md) |

---

## 🌟 Project 1: FS-01 — Multi-Vendor E-Commerce Marketplace

### 📌 Overview
An enterprise-grade, Amazon/Shopify-style multi-vendor platform where multiple independent merchants list and fulfill products, customers purchase across stores in a unified checkout, and the platform automatically splits payments into vendor payouts and platform commission fees.

### 🛠️ Technology Stack
- **Frontend:** React 19, Vite, React Router v7, Lucide Icons, Pure Responsive CSS Tokens (100% Mobile & Desktop optimized).
- **Backend:** Node.js, Express.js REST API, JSON Web Token (JWT) RBAC.
- **Database:** MongoDB & Mongoose schemas with seamless local JSON store persistence.
- **Caching Layer:** Redis session & cart key-value caching with TTL and in-memory resilience fallback.
- **Search & Discovery:** Elasticsearch Query DSL with multi-match fuzzy search, dynamic category filtering, and price range sorting.
- **Payment & Split Engine:** Razorpay / Stripe Connect simulated split transactions (10% platform fee, 90% vendor payout).
- **Asset Storage:** AWS S3 adapter with local multipart file upload fallback.
- **Invoicing:** GST-compliant printable tax invoices with itemized vendor breakdown and transaction audit trails.

### 🌐 Live Deployment
- **Frontend Application (Vercel):** [https://nexvia-vendor-marketplace.vercel.app](https://nexvia-vendor-marketplace.vercel.app)  
  *(Vercel Root Directory: `FS-01/frontend`)*
- **Backend API (Render):** [https://nexvia-backend.onrender.com](https://nexvia-backend.onrender.com)  
  *(Render Root Directory: `FS-01/backend` — Health Check: `/api/health`)*

### 🔑 Test Accounts for Evaluation
| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Customer** | `customer@nexvia.com` | `password123` | Browsing, Cart, Coupon Validation, Simulated Checkout, My Orders & Invoices |
| **Vendor (TechWorld)** | `vendor1@nexvia.com` | `password123` | Merchant Dashboard, Inventory CRUD, Stock Alerts, Order Fulfillment |
| **Vendor (UrbanStyle)** | `vendor2@nexvia.com` | `password123` | Merchant Dashboard, Fashion Inventory, Payout Balance |
| **Administrator** | `admin@nexvia.com` | `password123` | Platform Master Control, GMV & Revenue Analytics, Vendor Approval/Suspension |

---

## 🔮 Project 2: FS-03 — Nexvia Assignment 2

### 📌 Overview
Capstone Project **FS-03** is organized in a dedicated directory and scheduled for development immediately following Project 1. The workspace contains an isolated, production-ready directory scaffold ready for implementation.

- **Status:** Pending implementation.
- **Directory:** [`./FS-03`](./FS-03)
- **Detailed Specifications:** Refer to [FS-03 README](./FS-03/README.md).

---

## ⚡ Quickstart & Local Execution

### Project 1 (FS-01) Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vimalpravin-18/Nexvia-Vendor-marketplace.git
   cd Nexvia-Vendor-marketplace
   ```

2. **Run Backend Service (`FS-01/backend`):**
   ```bash
   cd FS-01/backend
   npm install
   cp .env.example .env
   node server.js
   ```
   *Backend runs on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).*

3. **Run Frontend Application (`FS-01/frontend`):**
   ```bash
   cd FS-01/frontend
   npm install
   npm run dev
   ```
   *Frontend dev server runs on `http://localhost:5173`.*

4. **Execute Automated Backend Tests:**
   ```bash
   cd FS-01/backend
   npm test
   ```
   *Validates all 7/7 unit and integration test suites.*

---

## 🔒 Security & Environment Isolation

- **Zero-Secret Policy:** `.env` files across both projects are strictly ignored by `.gitignore`.
- **Database & Cloud Protection:** MongoDB connection strings, AWS access keys, Razorpay credentials, and JWT secrets are stored exclusively in local or deployment-platform environment variables.
- **Reference Templates:** Safe templates ([`FS-01/backend/.env.example`](./FS-01/backend/.env.example), [`FS-01/frontend/.env.example`](./FS-01/frontend/.env.example), and [`FS-03/.env.example`](./FS-03/.env.example)) are provided for development setup.

---

## 📄 License & Attribution
Developed for **Nexvia Technologies** Technical Evaluations.  
Author: **Vimal Pravin** ([@vimalpravin-18](https://github.com/vimalpravin-18))
