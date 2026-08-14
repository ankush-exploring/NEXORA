# AURA DTC — Production-Grade Next.js 15 E-Commerce Storefront

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)

A minimal, fast, visually confident DTC storefront built with **Next.js 15 App Router**, **Prisma ORM**, **Tailwind CSS**, **Zustand**, and an **AI Shopping Assistant ("Ask Aura AI")**.

Inspired by the calm, whitespace-heavy aesthetics of Allbirds, Gymshark, and Nike DTC sites, combined with the functional performance of Amazon, Linear, and Vercel.

---

## 🚀 Key Features

* **Storefront Core**: Category filters, keyword search with instant filtering, sorting (price low/high, newest, top rated), featured equipment carousel.
* **Product Detail Page (PDP)**: High-resolution photography, stock urgency badges (*"Only X left in stock"*), customer star reviews, price savings badges, and related products carousel.
* **Persistent Cart Drawer**: Slide-over cart drawer using **Zustand** persisted to `localStorage`.
* **Checkout Flow**: 3-step checkout with shipping form, Stripe test mode payment simulation, instant receipt generation, and order persistence.
* **Role-Gated Admin Dashboard (`/admin`)**: Executive analytics overview (revenue, order counts, low-stock warnings), product CRUD (add/delete products), and fulfillment order status manager (`PROCESSING` -> `SHIPPED` -> `DELIVERED`).
* **🤖 AI Shopping Assistant ("Ask Aura AI")**: Floating natural language search widget allowing shoppers to search with prompts like *"something for a rainy hike under $150"* or *"minimalist desk accessories"*. Matches real Prisma DB products and provides tailored recommendation reasons.
* **1-Click Demo Access**: Instant 1-click **"Continue as Demo Shopper"** and **"Continue as Demo Admin"** shortcuts on the login page for effortless reviewing without typing credentials.

---

## 🛠️ Tech Stack & Trade-Offs

| Technology | Purpose | Why Chosen |
|---|---|---|
| **Next.js 15** | Full-Stack Framework | App Router, Server Components for fast initial render, Server Actions, TypeScript type safety |
| **Tailwind CSS** | Styling | Custom DTC dark mode design system, HSL color tokens, responsive glassmorphism primitives |
| **Prisma ORM** | Data Layer | Strongly typed queries, zero-config SQLite local database execution, migration safety |
| **Zustand** | State Management | Lightweight, zero-boilerplate cart state manager with `localStorage` persistence |
| **Lucide React** | Iconography | Clean, consistent SVG icon set |

---

## ⚡ How to Run Locally

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd aura-ecommerce
npm install
```

### 2. Initialize Database & Seed Products
```bash
npx prisma db push
npx prisma db seed
```
This generates `prisma/dev.db` pre-populated with **6 categories**, **24+ realistic products**, **3 demo user accounts**, and **10 sample orders**.

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Demo Credentials

Reviewers can use the 1-click buttons on **[http://localhost:3000/auth/login](http://localhost:3000/auth/login)** or log in manually:

* **Demo Shopper**: `shopper@aura.com` / `shopper1234`
* **Demo Admin**: `admin@aura.com` / `admin1234`
