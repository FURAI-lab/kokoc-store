# Kokoc Store

> Crocs store with Jibbitz gamification — edge-native on Cloudflare Workers + D1 + R2.
> Built by [FURAI lab](https://github.com/FURAI-LAB) — specialized in AI systems, edge-native architecture, and digital autonomy.

Live at [kokoc.store](https://kokoc.store) · Work in progress

---

## Stack

- **Runtime** — Cloudflare Workers (edge-native, no framework)
- **DB** — Cloudflare D1 (SQLite at the edge)
- **Storage** — Cloudflare R2
- **KV** — Cloudflare KV
- **Routing** — native Workers fetch handler
- **Testing** — Vitest + `@cloudflare/vitest-pool-workers`

## What's live

- Landing page with product catalog at `kokoc.store`
- Product detail pages (`/product/:slug`)
- Catalog browsing, brand pages (Adidas Originals), collabs page
- Cart API (`/api/cart`)
- Delivery page — CDEK courier door-to-door
- Custom 404 page with branded assets
- SEO: structured sitemap, `robots.txt`, JSON-LD, on-page metadata
- i18n support
- Admin panel (auth, products, orders)
- Newsletter subscribe (`/api/subscribe`)
- Security headers on all routes
- Jibbitz mini-game page

## Roadmap

- [ ] Payment integration (YooKassa)
- [ ] Order flow polish end-to-end
- [ ] Expand catalog coverage

## Structure

```
src/
  index.js              — entry point
  server.js             — main router
  config/app.js          — app config
  lib/
    security.js          — CSP and security headers
    response.js          — response helpers
    products.js          — catalog queries
    catalog.js           — catalog logic
    collabs.js            — brand collabs logic
    email.js             — email notifications
    i18n.js               — internationalization
    seo.js                — SEO metadata, JSON-LD
    sitemap.js            — sitemap generation
  pages/
    landing.js            — landing page HTML
    catalog.js            — catalog page
    product.js            — product detail page
    about.js               — about page
    adidas.js              — Adidas Originals brand page
    collabs.js             — collabs page
    delivery.js            — delivery info (CDEK courier)
    minigame.js            — Jibbitz mini-game
    not-found.js           — 404 page
    admin.js                — admin panel page
  routes/
    api/                  — public API routes (cart, subscribe, etc.)
    admin/                — admin routes (auth, products, orders)
db/
  migrations/             — D1 schema migrations
docs/
  architecture-v1.md
public/                   — static assets (Cloudflare Assets)
test/                     — Vitest test suite
```

## Local dev

```bash
npm install
npm run dev       # wrangler dev
```

Requires `wrangler.toml` with real bindings (D1, R2, KV).
Secrets go through `wrangler secret put`, never in files.

## Testing

```bash
npm test          # vitest run
npm run test:watch
```

## Deploy

```bash
npm run deploy    # wrangler deploy
```

---

Built by [FURAI LAB](https://github.com/FURAI-LAB)
