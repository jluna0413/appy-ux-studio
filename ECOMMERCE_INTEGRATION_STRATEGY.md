# E-Commerce Integration Strategy — Appy-UX Studio

**Date:** 2026-11-15
**Goal:** Seamlessly integrate a royalty-free asset shop WITHOUT diluting the custom agency experience

---

## The Problem

Two business models, two UX needs:

| | Custom Agency (existing) | Royalty-Free Shop (new) |
|--|------------------------|----------------------|
| **Value prop** | Bespoke, premium, hands-on | Instant, affordable, self-serve |
| **Price point** | $29–$399+ | $5–$49 |
| **Turnaround** | 24–96 hours (queued) | Instant download |
| **Client interaction** | Brief → Create → Review → Revise → Deliver | Browse → Buy → Download |
| **Trust signal** | Portfolio, before/after, process | Preview, licensing terms, reviews |
| **Brand feel** | Premium, cinematic, curated | Accessible, browsable, catalog-like |

**The tension:** If you mix them on the same page, the premium agency feel gets diluted. If you separate them completely, you lose cross-selling.

---

## Recommended Approach: Dual-Track Funnel

### Principle: One site, two experiences, clean separation

The main site stays **100% focused on custom agency work**. The shop lives on its own pages with a distinct but complementary visual treatment. They're connected by strategic cross-links, not by mixing content.

### Navigation Structure

```
Home (agency pitch)
├── Image → (custom services + "Browse ready-made →")
├── Short Video → (custom services + "Browse ready-made →")
├── Long Video → (custom services + "Browse ready-made →")
├── Music → (custom services + "Browse ready-made →")
├── Games → (custom services + "Browse ready-made →")
└── Shop → (dedicated shop landing + catalog)  ← NEW
```

### Visual Differentiation

| Element | Agency Pages | Shop Pages |
|---------|-------------|------------|
| Background | Pure black void (#000000) | Slightly lighter (#0a0a0f) |
| Typography | Compressed, cinematic (Inter, negative tracking) | Cleaner, more browsable (Inter, standard tracking) |
| Layout | Full-screen scroll-snap, one idea per section | Grid catalog, filters, search |
| CTAs | "Start a project", "Get a quote" | "Add to cart", "Buy now", "Download" |
| Imagery | Cinematic before/after, hero shots | Product thumbnails, preview grids |
| Tone | Premium, curated, bespoke | Accessible, browsable, instant |

### Cross-Linking Strategy

**On agency category pages** (bottom, after packages):
> "Looking for ready-made assets? Browse our shop →" (subtle link, not a CTA button)

**On shop product pages** (bottom, after purchase):
> "Need something custom? We can create it for you →" (links to agency service)

**On home page** (footer or last section):
> "Shop ready-made assets" (small link, not competing with main CTA)

---

## Architecture: Two-Track System

### Track 1: Custom Agency (existing)
- Order → Payment → Processing (ComfyUI) → Review → Revision → Delivery
- High touch, queued, premium pricing
- Already built: backend API, client portal, admin dashboard

### Track 2: Royalty-Free Shop (new)
- Browse → Preview → Cart → Checkout → Instant Download
- Self-serve, instant, affordable pricing
- Needs: product catalog, cart, checkout, download delivery, licensing

### Shared Infrastructure
- **Auth:** Same user accounts (JWT)
- **Payments:** Same Stripe/PayPal integration
- **Storage:** Same file storage (uploads/)
- **Admin:** Same admin dashboard (extended with shop tab)

### Separate Infrastructure
- **Products:** New table (product catalog with categories, previews, prices, licenses)
- **Cart:** New table (session-based or user-based cart)
- **Downloads:** New table (track download counts, license terms)
- **Reviews:** New table (product reviews/ratings)

---

## Database Schema (New Tables)

```sql
-- Products (royalty-free assets)
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,  -- music, video, game_asset, image, template
    subcategory VARCHAR(50),         -- jingle, sfx, texture, 3d_model, etc.
    price_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    preview_url VARCHAR(500),       # Watermarked preview
    file_url VARCHAR(500),          # Full-res downloadable file
    file_size_bytes INTEGER,
    file_type VARCHAR(50),          # mp3, wav, mp4, png, zip, etc.
    license_type VARCHAR(50) DEFAULT 'royalty_free',  # royalty_free, extended, exclusive
    tags TEXT,                      # JSON array of tags
    is_active BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(100),        # For anonymous carts
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases (instant download records)
CREATE TABLE purchases (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    order_id INTEGER REFERENCES orders(id),  # Optional link to order
    payment_id INTEGER REFERENCES payments(id),
    download_token VARCHAR(100) UNIQUE,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP  # Optional expiry for download link
);

-- Product Reviews
CREATE TABLE product_reviews (
    id INTEGER PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL,  # 1-5
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints (New)

### Shop (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shop/products` | List products (filter by category, tag, price) |
| GET | `/api/shop/products/:id` | Product detail |
| GET | `/api/shop/categories` | List categories with counts |
| GET | `/api/shop/search?q=` | Search products |

### Cart (User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/cart/checkout` | Create payment for cart |

### Downloads (User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/downloads` | List user's purchases |
| GET | `/api/downloads/:token` | Download file (with token validation) |

### Admin (Shop Management)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product |
| PATCH | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| POST | `/api/admin/products/:id/upload` | Upload product file |
| GET | `/api/admin/shop/stats` | Shop analytics |

---

## Shop Frontend Structure

### Shop Landing Page (`/shop`)
- Hero: "Ready-made creative assets. Instant download."
- Category grid: Music, Video, Game Assets, Images, Templates
- Featured products carousel
- "Need something custom? →" link to agency

### Category Pages (`/shop/music`, `/shop/video`, etc.)
- Filter sidebar: type, price range, license, tags
- Product grid (thumbnail, title, price, preview play button)
- Sort: newest, price, popular, rating
- Pagination

### Product Detail (`/shop/product/:id`)
- Large preview (image/video/audio player)
- Title, description, price, license terms
- "Add to Cart" / "Buy Now" buttons
- Related products
- Reviews
- "Need a custom version? →" link to agency

### Cart & Checkout (`/shop/cart`, `/shop/checkout`)
- Cart items with thumbnails and prices
- Remove items
- Total calculation
- PayPal/Stripe checkout
- Instant download after payment

### My Downloads (`/shop/downloads`)
- List of purchased products
- Download buttons (with remaining download count)
- License terms

---

## Implementation Plan

### Phase 1: Backend (Week 1)
- [ ] Add Product, CartItem, Purchase, ProductReview models
- [ ] Create shop router (products CRUD, cart, checkout, downloads)
- [ ] Add admin shop endpoints (product management, upload, stats)
- [ ] Seed sample products (use the 6 vintage images as free samples)
- [ ] Test all endpoints

### Phase 2: Shop Frontend (Week 2)
- [ ] Create shop landing page (React SPA or static HTML)
- [ ] Create category pages with filters and grid
- [ ] Create product detail page with preview
- [ ] Create cart and checkout flow
- [ ] Create downloads page
- [ ] Integrate with existing auth (same JWT tokens)

### Phase 3: Admin Dashboard Extension (Week 3)
- [ ] Add "Shop" tab to admin dashboard
- [ ] Product management (create, edit, delete, upload)
- [ ] Shop analytics (revenue, top products, downloads)
- [ ] Order fulfillment tracking

### Phase 4: Integration & Polish (Week 4)
- [ ] Cross-links between agency and shop
- [ ] Search functionality
- [ ] Product reviews
- [ ] Email notifications for purchases
- [ ] Download tracking and license enforcement

---

## Key Design Decisions

1. **Separate routes, shared auth:** Shop lives at `/shop/*`, agency at `/` and `/image`, etc. Same JWT tokens work for both.

2. **Visual distinction:** Shop pages use a slightly different color treatment (lighter background, standard tracking) to feel more "browsable" while maintaining brand consistency.

3. **Instant download:** Unlike agency orders (which go through ComfyUI processing), shop purchases are instant — the file is already processed and stored.

4. **Licensing:** Each product has a license type (royalty-free, extended, exclusive). Download tokens track usage.

5. **No ComfyUI needed for shop:** Shop products are pre-made. The backend just serves files. This means the shop can run even when ComfyUI is busy.

6. **Cross-selling:** Every shop product page has "Need a custom version? →" linking to the agency service. Every agency package page has "Looking for ready-made? →" linking to the shop.

---

## Immediate Next Steps

1. Add Product, CartItem, Purchase, ProductReview models to database.py
2. Create shop router with CRUD + cart + checkout + download endpoints
3. Add admin shop endpoints
4. Seed sample products (use vintage images as free downloads)
5. Build shop frontend (React SPA or extend existing client portal)
6. Add "Shop" tab to admin dashboard
7. Add cross-links between agency and shop pages
8. Test end-to-end: browse → cart → checkout → download
