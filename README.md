# ArtSora — Online Art Store

A full-stack e-commerce platform for selling artwork online, with a customer-facing storefront and a complete admin dashboard. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and a 3D animated hero powered by **Three.js / React Three Fiber**. Fully bilingual (English / Arabic with RTL), supports multiple local and international payment methods, and ships with a secure admin panel protected by JWT and TOTP-based 2FA.

> Live demo: _add your deployed URL here_  
> Repository: [github.com/obadayasser/art-sora](https://github.com/obadayasser/art-sora)

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Available Scripts](#available-scripts)
9. [Admin Dashboard](#admin-dashboard)
10. [Internationalization (i18n)](#internationalization-i18n)
11. [Payments](#payments)
12. [Security](#security)
13. [Performance & UX](#performance--ux)
14. [Highlights for Reviewers](#highlights-for-reviewers)

---

## Overview

ArtSora is a production-style e-commerce app built around a real backend REST API. It is designed to sell physical artworks with **multiple sizes, color variants, and per-variant pricing/stock**. The storefront is optimized for performance (Next.js Image, server components where possible, lazy loading) and for visual impact (a 3D animated hero, scroll-driven Framer Motion sections, dark/light theming). The admin panel is a complete back-office: dashboard analytics, CRUD for catalog and content, order workflow, discount codes, location/shipping management, and a moderated review system.

This project demonstrates end-to-end ownership: data modeling, state management, API integration, auth + 2FA, payments, real-time messaging, accessibility, RTL support, and deployment-ready config.

---

## Key Features

### Storefront

- **3D animated hero section** built with `@react-three/fiber`, `@react-three/drei`, and `@react-three/postprocessing` — floating framed artworks with custom shaders, environment lighting, and orbital interaction.
- **Product catalog** with categories, subcategories, featured products, best sellers, new arrivals, and special offers sections.
- **Product detail pages** with image gallery, **size and variant selection** (per-variant SKU, price, stock, color), reviews tab, and rich descriptions.
- **Shopping cart** with `localStorage` persistence, quantity management, slide-in cart sidebar, and a dedicated checkout flow.
- **Multi-step checkout** with country/governorate-aware shipping, address capture, discount code validation, and multiple payment methods.
- **Order confirmation** page with order tracking details.
- **Light / dark theme** via `next-themes` with system preference detection.
- **Bilingual UI (EN / AR)** with proper RTL layout switching.
- **Toast notifications** (Sonner + react-hot-toast) with success/error styling.
- **Responsive** mobile-first design with custom scrollbars and skeleton loaders.

### Admin Dashboard (`/admin`)

A protected back-office with sidebar navigation and the following modules:

| Module        | Capabilities                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Dashboard     | KPI cards (users, orders, revenue, products), pending order counter, recent orders, charts             |
| Users         | List, search, role management (`ADMIN` / `SUPER_ADMIN`), activate/deactivate                            |
| Categories    | Tree of categories & subcategories with bilingual names, slugs, sort order, descriptions                |
| Sizes         | Reusable size definitions (width × height, unit, sort order)                                            |
| Products      | Full CRUD with image upload, **variant matrix** (size × color × price × stock), featured flag, revisions |
| Orders        | List, filter by status, status workflow (`PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`), refund/cancel |
| Discount codes | Percentage / fixed-amount, min order, max cap, usage limits (global + per device), validity window, scoping to products/categories or shipping |
| Locations     | Countries and governorates with phone codes, shipping cost, and estimated delivery days                 |
| Reviews       | Moderation queue, approve/reject, admin response, per-product visibility                                |
| Revisions     | Per-product change log with diff (who changed what, IP, browser/OS/device, timestamp)                   |

### Authentication

- JWT-based admin login with cookie persistence.
- **TOTP two-factor authentication** with QR code provisioning and backup codes.
- Auto-redirect, protected layout, and a lightweight `AdminAuthContext` for the entire dashboard.

---

## Tech Stack

**Framework & Language**

- [Next.js 16](https://nextjs.org/) (App Router, Server Components, Route Handlers, Image, rewrites & headers)
- [React 19](https://react.dev/) with the new compiler-friendly APIs
- [TypeScript 5](https://www.typescriptlang.org/) (strict mode, fully typed domain models)

**Styling & UI**

- [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- `tailwind-merge`, `clsx`
- [Lucide](https://lucide.dev/) + `react-icons` icon sets
- [Framer Motion 12](https://www.framer.com/motion/) for page and scroll animations
- [Swiper](https://swiperjs.com/) for product carousels
- `simplebar-react` custom scrollbars
- `emoji-picker-react` for review composer

**3D & Graphics**

- [Three.js](https://threejs.org/) + `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`

**State & Data**

- React Context (`CartContext`, `AdminAuthContext`) with `localStorage` persistence
- Custom typed API client layer (`lib/client/*.ts`) over `fetch` with bearer-token auth and error normalization

**i18n & Theming**

- [next-intl 4](https://next-intl.dev/) (cookie-based locale, server-side message loading, RTL handling)
- [next-themes](https://github.com/pacocoursey/next-themes)

**Payments**

- Local payment methods: Cash on Delivery, Vodafone Cash, InstaPay
- Discount codes validated server-side

**Storage & Misc**

- Cloudflare R2 (remote image hosting via `next/image` `remotePatterns`)
- `react-hot-toast` for notifications

**Tooling**

- ESLint 9 with `eslint-config-next`
- PostCSS + Tailwind v4 plugin

---

## Architecture

```
Browser (Next.js App)
   │
   │  fetch ─►  /api/* (rewrites)  ─►  Backend REST API (NestJS)
   │                                       │
   │                                       ├─ Postgres / Prisma
   │                                       └─ R2 Object Storage (images)
   │
   ├─ next-intl  (cookie-driven locale, EN/AR)
   ├─ next-themes (dark/light)
   ├─ React Context (cart, admin auth)
   └─ React Three Fiber (3D hero)
```

- **API proxy**: `next.config.ts` rewrites `/api/:path*` to the backend, sidestepping Mixed-Content issues and keeping the browser on a single origin.
- **CSP headers**: an explicit `Content-Security-Policy` is configured at the framework level for `connect-src`, `media-src`, and `default-src`.
- **Image pipeline**: `next/image` with `remotePatterns` whitelisting R2 (`pub-*.r2.dev`), Unsplash, Pravatar, and the backend.
- **Strongly typed domain layer**: every entity (Product, Variant, Size, Category, Order, Discount, Review, Revision, Country, Governorate, AdminUser, …) lives in `types/index.ts` and is reused by the client API and the React tree — there is no `any` leaking into the UI.

---

## Project Structure

```
art-sora/
├─ app/
│  ├─ (admindashboards)/
│  │  └─ admin/                     # protected admin shell
│  │     ├─ layout.tsx              # sidebar + auth guard
│  │     ├─ page.tsx                # dashboard with KPIs & recent orders
│  │     ├─ login/                  # email/password + 2FA
│  │     ├─ users/
│  │     ├─ categories/
│  │     ├─ sizes/
│  │     ├─ products/               # full CRUD + variants + revisions
│  │     ├─ orders/
│  │     ├─ discounts/
│  │     ├─ locations/
│  │     └─ reviews/
│  ├─ products/[slug]/page.tsx      # product detail with variants & reviews
│  ├─ checkout/page.tsx             # multi-step checkout (~930 LOC)
│  ├─ order-confirmation/
│  ├─ layout.tsx                    # providers, fonts, toasters, navbar
│  ├─ page.tsx                      # storefront home composition
│  ├─ globals.css
│  └─ custom-scrollbar.css
│
├─ components/
│  ├─ home/                         # Hero (3D), Navbar, Categories, Best Sellers, etc.
│  ├─ admin/                        # DataTable, Charts, Modal, FormComponents, StatsCard, Badge
│  ├─ ui/                           # Card, Input, ProductCard, CartSidebar, ThemeToggle, …
│  ├─ providers/                    # ThemeProvider, LanguageProvider, DeviceProvider
│  └─ ErrorBoundary.tsx
│
├─ contexts/
│  ├─ CartContext.tsx               # cart state + localStorage persistence
│  └─ AdminAuthContext.tsx          # admin auth + 2FA flow
│
├─ lib/
│  ├─ actions/api.ts                # server-side API helpers
│  ├─ client/
│  │  ├─ api.ts                     # public storefront API
│  │  ├─ api-client.ts              # base fetch helpers, headers, app-id
│  │  ├─ api-client-orders.ts       # checkout / orders / shipping / discounts
│  │  └─ api-admin.ts               # admin API surface (~1k LOC, fully typed)
│  └─ utils.ts                      # cn() + misc
│
├─ i18n/request.ts                  # next-intl cookie-based locale resolver
├─ locales/{en,ar}.json             # translation messages
├─ types/index.ts                   # all domain types
├─ public/img/                      # hero textures and static art
├─ next.config.ts                   # rewrites, CSP, image domains
├─ tsconfig.json
└─ package.json
```

---

## Getting Started

### Prerequisites

- Node.js **18.18+** (or 20+)
- npm / pnpm / yarn
- A running backend that exposes the REST API (default base: `http://76.13.135.206:5000/api/v1`)

### Install

```bash
git clone https://github.com/obadayasser/art-sora.git
cd art-sora
npm install
```

### Run the dev server

```bash
npm run dev
```

The app starts on **http://localhost:4044** (port is set in `package.json`).

### Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` at the project root. Copy `.env.example` as a starting point.

```env
# Backend API (used by the client SDK in lib/client/*)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

> The API base URL is also reachable through the Next.js rewrite (`/api/*` → backend), which avoids browser Mixed-Content errors when serving over HTTPS.

---

## Available Scripts

| Script        | Description                              |
| ------------- | ---------------------------------------- |
| `npm run dev` | Start the dev server on port 4044        |
| `npm run build` | Production build                       |
| `npm start`   | Start the production server              |
| `npm run lint` | Run ESLint                              |

---

## Admin Dashboard

Login at **`/admin/login`** with admin credentials. If 2FA is enabled, you will be prompted for a 6-digit TOTP code after the password step.

The dashboard layout (`app/(admindashboards)/admin/layout.tsx`) provides:

- A collapsible responsive sidebar (desktop fixed, mobile drawer).
- An auth guard that redirects unauthenticated users to `/admin/login` and away from login when already signed in.
- Modular pages for Users, Categories, Sizes, Products, Orders, Discounts, Locations, and Reviews.
- A `DataTable` component supporting sort, filter, pagination, row actions, and bulk operations, plus a typed `FormComponents` set, `Modal`, `Charts`, `StatsCard`, and `Badge`.

The Products page (~1.5k LOC) is the most feature-rich screen: variant matrix editor, image upload to R2, featured-toggle, revision history with field-level diff, and inline validation.

---

## Internationalization (i18n)

- All UI strings live in `locales/en.json` and `locales/ar.json`.
- `next-intl` resolves the active locale from a `locale` cookie (see `i18n/request.ts`).
- The root `<html>` element gets `dir="rtl"` automatically when the active locale is Arabic.
- A `LanguageSwitcher` component in the navbar toggles the cookie and reloads messages.

Add a new locale by:

1. Adding the code to `locales` in `i18n/request.ts`.
2. Adding the JSON file under `locales/`.
3. Optionally extending `rtlLocales` if it is right-to-left.

---

## Payments

The checkout (`app/checkout/page.tsx`) supports:

- **Cash on Delivery** — no upfront capture.
- **Vodafone Cash** — manual reference workflow.
- **InstaPay** — instant transfer reference workflow.
- **Discount codes** — validated server-side, supports percentage / fixed amount, minimum order, max cap, per-device usage limits, and category/product scoping.
- **Shipping** — country and governorate selection drives a server-calculated shipping cost and ETA.

---

## Security

- **JWT** stored in cookies, attached to every admin request via a typed `getAuthHeaders` helper.
- **TOTP 2FA** using QR provisioning + backup codes (`qrcode` on the client, server validates with the backend).
- **CSP** configured in `next.config.ts`.
- **Cookie hygiene**: explicit expiry on logout, no tokens left in `localStorage`.
- **API proxy** keeps the backend URL off the client and prevents Mixed-Content over HTTPS.
- All inputs in admin forms are validated; mutations require an authenticated `Bearer` token.
- An `ErrorBoundary` wraps the entire app to prevent crash-screens.

---

## Performance & UX

- Next.js 16 App Router with server components where they fit (data fetching, metadata).
- `next/image` with explicit `remotePatterns` for image CDN and backend.
- Skeletons and `LoadingSpinner` placeholders during data fetches.
- `localStorage`-persisted cart that hydrates on mount with an `mounted` flag to avoid SSR/CSR mismatch.
- Code-splitting via the App Router segments; the admin bundle is isolated from the storefront.
- Animations gated behind `framer-motion` so they don't block first paint.
- Custom Google Fonts (Cairo for Arabic, Montserrat for Latin) self-hosted via `next/font` with `display: swap`.

---

## Highlights for Reviewers

If you are reviewing this project (e.g. on a CV), the most representative files are:

- [`app/checkout/page.tsx`](app/checkout/page.tsx) — multi-step checkout with shipping math, discount validation, and payment method routing (~930 LOC).
- [`app/(admindashboards)/admin/products/page.tsx`](app/(admindashboards)/admin/products/page.tsx) — the most complex screen: variant matrix CRUD, image uploads, revisions (~1.6k LOC).
- [`lib/client/api-admin.ts`](lib/client/api-admin.ts) — the typed admin API surface (~1k LOC).
- [`contexts/AdminAuthContext.tsx`](contexts/AdminAuthContext.tsx) — login + 2FA state machine.
- [`components/home/Hero.tsx`](components/home/Hero.tsx) — 3D animated hero with React Three Fiber.
- [`types/index.ts`](types/index.ts) — the complete domain model.

---

## What I Built (Skills Demonstrated)

- End-to-end e-commerce architecture on Next.js 16 + React 19.
- Strongly-typed integration layer over a real REST API (no mocks).
- Admin back-office with role-based access, 2FA, and revision history.
- Internationalization with full RTL support.
- Multi-method local payment integration (COD, Vodafone Cash, InstaPay) with server-validated discounts.
- 3D web graphics (Three.js / R3F) integrated into a production layout.
- State management with React Context, persistence, and SSR-safe hydration.
- Responsive, accessible, theme-aware UI with Tailwind v4 and Framer Motion.
- Production concerns: CSP, image domains, API proxy, error boundaries.

---

## License

This project is provided as a portfolio piece. Contact the author before using commercially.

## Author

**Obada Yasser** — Full-Stack Developer  
GitHub: [@obadayasser](https://github.com/obadayasser)
