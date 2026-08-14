# AURA DTC — System Architecture & Technical Interview Explainer

This document explains the technical decisions, data model, state architecture, and engineering trade-offs behind **AURA**, designed for technical code reviews and architectural discussions.

---

## 1. High-Level Architecture Overview

```
                      +---------------------------------------+
                      |         Next.js 15 App Router         |
                      |  (Server Components & Client Pages)   |
                      +-------------------+-------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
+-------v-------+                 +-------v-------+                 +-------v-------+
| Zustand Cart  |                 | Prisma Client |                 | AI Assistant  |
|  (Client Sync |                 | (ORM Layer to |                 | (Natural Query|
|  localStorage)|                 |  SQLite/Postgres)|             |  Function Call)|
+---------------+                 +-------+-------+                 +---------------+
                                          |
                                  +-------v-------+
                                  |  Database DB  |
                                  | (dev.db / SQL)|
                                  +---------------+
```

---

## 2. Key Architectural Decisions & Trade-Offs

### A. Next.js 15 App Router & Server Components (RSC)
* **Decision**: We leveraged React Server Components for the Homepage (`/`), Product Catalog (`/products`), PDP (`/products/[slug]`), and Admin routes (`/admin`).
* **Why**: Server Components fetch product catalogs directly from the Prisma DB at the server level, sending minimal JavaScript bundles to the browser.
* **Trade-Off**: Interactive features (Cart drawer toggle, quantity modifiers, AI assistant chat) require explicit `'use client'` boundaries to handle browser events and state persistence.

### B. Prisma ORM & Database Schema
* **Decision**: Selected **Prisma ORM** with an SQLite file database (`prisma/dev.db`) for zero-dependency local execution, fully structured for relational PostgreSQL migrations.
* **Schema Highlights**:
  * `User` 1 ── N `Order` 1 ── N `OrderItem` N ── 1 `Product`
  * `Product` belongs to `Category` and has 1 ── N `Review`
* **Why**: E-commerce data is inherently relational. Transactions, order line items, and product price snapshots require strict foreign key constraints.

### C. Zustand State Management & LocalStorage Persistence
* **Decision**: Used `Zustand` with `persist` middleware for shopping cart state management.
* **Why**: Avoids React Context re-render bloat across the component tree. Cart additions on product cards immediately reflect in the Navbar counter and Cart Drawer slide-over without page reloads.

### D. AI Shopping Assistant ("Ask Aura AI") Engine
* **Decision**: Implemented an intelligent natural language query matching API (`/api/ai-assistant`).
* **How it works**:
  1. Parses incoming query strings for intent, budget constraints (e.g. *"under $150"*), and category/activity keywords (e.g. *"rainy hike"*, *"audio"*, *"desk"*).
  2. Queries the Prisma catalog and ranks products using weighted scoring.
  3. Returns top recommended product items along with a synthesized recommendation reason for why each item satisfies the prompt.

---

## 3. Interview Talking Points

1. **How do you ensure cart consistency between guest shoppers and logged-in users?**
   > *"We store transient cart state in Zustand with `localStorage` persistence. When a user completes checkout, we create an order record tied to their user account in the Prisma DB, clear the client Zustand store, and redirect to the order tracking portal."*

2. **How is performance optimized for product catalog browsing?**
   > *"We use Next.js Incremental Static Regeneration (ISR) on the homepage (`revalidate = 60`) and dynamic server-side data fetching on `/products` with search parameters (`q`, `category`, `sort`). Images are served through `next/image` with automatic WebP conversion and responsive sizing."*

3. **How is security handled for admin endpoints?**
   > *"Admin routes (`/admin`) and API routes (`/api/admin/*`) check the authenticated user's `role` property (`ADMIN`). Unauthorized requests are rejected at the route handler level."*
