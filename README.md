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
| **`FS-03`** | **Learning Management System with Live Classes** | React 19 • Redux Toolkit • Node.js • MongoDB • WebRTC • FFmpeg • BullMQ • CloudFront | **Completed & Ready** | [FS-03 Documentation](./FS-03/README.md) |

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

## 🎓 Project 2: FS-03 — Learning Management System with Live Classes

### 📌 Overview
An enterprise-grade online school platform engineered for modern education academies. Features curriculum authoring, HD video lesson streaming, real-time peer-to-peer WebRTC live classrooms with camera/mic controls and screen sharing, timed interactive quizzes with automated grading, tamper-proof certificates of completion with verification serials, and automated instructor revenue splitting.

### 🛠️ Technology Stack
- **Frontend:** React 19, Redux Toolkit, React Router v7, Lucide Icons, Canvas Confetti.
- **Backend:** Node.js, Express.js REST API engine, JWT RBAC (Student, Instructor, Admin).
- **Database:** MongoDB & Mongoose schemas with isolated `nexvia_lms` namespace and persistent local fallback.
- **Live Classroom:** WebRTC (`RTCPeerConnection`) with Socket.io real-time signaling and Google STUN servers.
- **Video Processing:** FFmpeg (`fluent-ffmpeg` with installer binaries) for automated metadata extraction and faststart MP4 optimization.
- **Background Jobs:** BullMQ + Redis for asynchronous video transcoding and thumbnail generation.
- **Media Delivery:** AWS CloudFront distribution routing with local HTTP 206 Partial Content byte-range video streaming fallback.

### 🔑 Test Accounts for Evaluation
| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Student (Diane Nguyen)** | `student@nexvia.com` | `password123` | Student Dashboard, Video Lessons, Enrolled Courses, Quizzes, Certificates, Live Classroom |
| **Instructor (Jenny Wilson)** | `instructor@nexvia.com` | `password123` | Instructor Studio, Course Builder, Video Uploader, Schedule Live Classes, Earnings |
| **Administrator** | `admin@nexvia.com` | `password123` | Platform Command Center, Course Approval/Rejection Queue, User Directory |

- **Directory:** [`./FS-03`](./FS-03)
- **Detailed Specifications:** Refer to [FS-03 README](./FS-03/README.md).

---

## ⚡ Quickstart & Local Execution

### Project 1 (FS-01) Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vimalpravin-18/Nexvia-Capstone-Projects.git
   cd Nexvia-Capstone-Projects
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
