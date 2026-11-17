# Nexvia Technologies – Full Stack Development Assessment

## About This Repository

This repository contains two full-stack development projects developed as part of the Nexvia Technologies technical assessment.

Both projects are organized into separate directories, with independent frontend and backend applications, documentation, configuration examples, and supporting screenshots.

## Projects Overview

### Project 1 – Nexvia Marketplace

**Assignment ID:** FS-01

**Technology Stack:**
- React.js
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- AWS S3
- Razorpay / Stripe
- Redis

**Key Features:**
- User authentication and authorization (Customer, Vendor, Admin)
- Multi-vendor product listing and inventory management
- Redis-backed shopping cart with promotional coupon validation
- Split order management and automated earnings distribution
- Simulated payment integration with Razorpay and Stripe Connect
- Product image and media uploads via AWS S3
- Responsive user interface optimized for desktop and mobile viewports

**Source Code:** `./FS-01/`

**Live Application:** [https://nexvia-vendor-marketplace.vercel.app](https://nexvia-vendor-marketplace.vercel.app)

**Documentation:** [FS-01/README.md](./FS-01/README.md)

---

### Project 2 – Learning Management System with Live Classes

**Assignment ID:** FS-03

**Technology Stack:**
- MongoDB
- Express.js
- React.js
- Node.js
- WebRTC
- FFmpeg
- AWS CloudFront
- BullMQ
- Redis
- Redux Toolkit

**Key Features:**
- Student, instructor and admin dashboards
- Course creation wizard with multi-stage curriculum management
- Video lessons with custom cinema player, scrubbing, and speed adjustment
- Real-time peer-to-peer WebRTC live classes with audio/video controls and screen sharing
- Timed interactive quizzes and auto-grading assessments
- Learning progress tracking with lesson completion meters
- Automated certificate generation with unique verification serials
- Instructor earnings ledger and automated revenue management

**Source Code:** `./FS-03/`

**Live Application:** [https://nexvia-capstone-projects-hcv3.vercel.app](https://nexvia-capstone-projects-hcv3.vercel.app)

**Documentation:** [FS-03/README.md](./FS-03/README.md)

---

## Repository Structure

```text
Nexvia-Projects/
│
├── README.md
│
├── FS-01/
│   ├── frontend/
│   ├── backend/
│   ├── screenshots/
│   ├── .env.example
│   └── README.md
│
└── FS-03/
    ├── frontend/
    ├── backend/
    ├── screenshots/
    ├── .env.example
    └── README.md
```

## Installation

Each project has its own installation instructions and environment configuration.

Please refer to the individual project README files:
- [Project 1 (FS-01) Setup Guide](./FS-01/README.md#7-installation-and-execution)
- [Project 2 (FS-03) Setup Guide](./FS-03/README.md#7-installation-and-execution)

## Security

- Sensitive credentials are not included in this repository.
- Environment variables are documented using example files (`.env.example`).
- Production secrets must be configured separately in deployment platform dashboards.

## Developer

**Vimal Pravin**

Full Stack Development

## Assessment

Developed as part of the Nexvia Technologies Full Stack Development technical assessment.
