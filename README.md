# Trove — Headless E-Commerce Platform & Design System

A full-stack headless e-commerce storefront with a real database, authentication, an admin dashboard, and a companion Storybook design system. Built with Next.js (App Router), MongoDB, NextAuth, Tailwind CSS, and Zustand.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI + class-variance-authority (shadcn-style) |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth v5 (Credentials provider, JWT sessions, bcrypt password hashing) |
| Client State | Zustand (cart & wishlist, persisted to `localStorage`) |
| Product Data | [DummyJSON](https://dummyjson.com) product API |
| CMS | Mock headless CMS layer (`lib/cms.js`) shaped after Contentful/Sanity entries, for hero & promo banners |
| Docs | Storybook 10 (`@storybook/nextjs-vite`) |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string, including the database name |
| `AUTH_SECRET` | Random secret used by NextAuth to sign session tokens. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

For Vercel, add the same two variables under Project Settings → Environment Variables.

## Running the Project

```bash
npm install
npm run dev
# → http://localhost:3000
```

Run Storybook in a second terminal:

```bash
npm run storybook
# → http://localhost:6006
```

Other scripts:

```bash
npm run build             # production build
npm run start              # serve the production build
npm run build-storybook    # static Storybook export
npm run lint                # ESLint
```

### Granting admin access

New accounts default to the `user` role. Promote one to `admin`:

```bash
node --env-file=.env.local scripts/make-admin.js <username>
```

Admins get an "Admin Panel" link in the account menu, leading to `/admin` (dashboard stats, order management, user list).

## Folder Structure

```
app/
  layout.js                   Root layout — Navbar, Footer, Providers
  page.js                     Home page
  products/                   Listing (filter/search/sort/infinite scroll) + [id] detail (SSR)
  cart/, checkout/             Cart review and checkout (shipping address + order placement)
  orders/, wishlist/           Signed-in order history and saved items
  login/, register/            Auth pages
  admin/                       Dashboard, order management, user list (role-gated)
  api/
    auth/[...nextauth]/        NextAuth route handlers
    auth/register/             Account creation endpoint
    orders/                    Create/list the signed-in user's orders
    admin/orders/, admin/users/ Admin-only endpoints

components/
  ui/            Design-system primitives, each with a colocated *.stories.jsx file
  layout/        Navbar, Footer, AnnouncementBar, CategoryDrawer
  product/       ProductCard, ProductGallery, FiltersSidebar, SearchBar, SortSelect, ...
  cart/          CartDrawer, CartLineItem, PromoCodeInput
  home/          HeroBanner, PromoBanner, CategoryGrid, TrustBadges
  admin/         AdminSidebar

lib/
  api.js            DummyJSON fetch services (products, categories, search, sort)
  cms.js             Mock headless-CMS content (hero slides, promo banners, category tiles)
  db.js              Cached Mongoose connection helper
  require-admin.js  Route-handler guard for admin-only API endpoints
  utils.js           cn(), formatPrice(), shimmer blurDataURL helper

models/
  User.js, Order.js   Mongoose schemas

hooks/
  use-cart-store.js, use-wishlist-store.js   Zustand stores (persisted)
  use-debounce.js, use-in-view.js            Debounce and IntersectionObserver hooks

scripts/
  make-admin.js   Promotes a user to the admin role

auth.js            NextAuth configuration (Credentials provider, JWT callbacks)
```

## Notable Implementation Details

- **Auth** is real: NextAuth v5 with a Credentials provider backed by MongoDB, passwords hashed with bcrypt, JWT sessions. `/orders`, `/checkout`, and `/admin` all guard against unauthenticated access.
- **Checkout** creates a real `Order` document (Cash on Delivery for now). Pricing is recomputed server-side from the submitted items rather than trusting client-sent totals.
- **Admin dashboard** (`/admin`) is role-gated (`role: "admin"` on the `User` document) and covers revenue/order/user stats, order status management, and a user list.
- **Product data** comes live from `https://dummyjson.com`. `lib/api.js` normalizes the raw shape (discounted price, stock status, sale flag) and synthesizes size/color variants, since the public API doesn't model those.
- **Hero & promo banners** are served from `lib/cms.js`, a mock headless-CMS layer whose entries are shaped like a Contentful/Sanity response (`sys` metadata + typed `fields`). Swapping in a real CMS client later means only touching that one file.
- **Cart & wishlist** use Zustand with the `persist` middleware, so state survives page reloads without a backend round trip.
- **Lazy loading**: the cart drawer is code-split with `next/dynamic`; the `/products` grid uses infinite scroll (`useInView` + IntersectionObserver); all remote images use `next/image` with a generated shimmer `blurDataURL` placeholder.

## Not Yet Implemented

- Payment gateway (Razorpay) — checkout currently only supports Cash on Delivery
- Product reviews
- Transactional email (order confirmations)
- Real CMS integration (currently mocked in `lib/cms.js`)
