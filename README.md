# Kokoc Store

> Crocs store with Jibbitz gamification — edge-native on Cloudflare Workers + D1 + R2.  
> Built by [FURAI lab](https://github.com/FURAI-lab) — specialized in AI systems, edge-native architecture, and digital autonomy.

Live at [kokoc.store](https://kokoc.store) · Work in progress

---

## Stack

- **Runtime** — Cloudflare Workers (edge-native, no framework)
- **DB** — Cloudflare D1 (SQLite at the edge)
- **Storage** — Cloudflare R2
- **Routing** — native Workers fetch handler

## What's live

- Landing page at `kokoc.store`
- Security headers on all routes
- Responsive desktop/mobile banner delivery
- Newsletter subscribe at `/api/subscribe`
- D1 schema: products, variants, images, carts, orders, subscribers

## Roadmap

- [ ] Wire D1 to real product catalog
- [ ] Product detail page `/product/:slug`
- [ ] Cart and checkout flow
- [ ] Payment integration
- [ ] **Jibbitz mini-game** — catch Jibbitz, earn a discount on Crocs (AI-powered)

## Structure

```
src/
  index.js          — entry point
  server.js         — main router
  config/app.js     — app config
  lib/
    security.js     — CSP and security headers
    response.js     — response helpers
    products.js     — catalog queries
    email.js        — email notifications
  pages/
    landing.js      — landing page HTML
    coming-soon.js  — placeholder
  routes/
    api/            — public API routes
db/
  migrations/       — D1 schema migrations
docs/
  architecture-v1.md
public/             — static assets (Cloudflare Assets)
```

## Local dev

```bash
npm run dev       # wrangler dev
```

Requires `wrangler.toml` with real bindings (D1, R2).  
Secrets go through `wrangler secret put`, never in files.

## Deploy

```bash
npm run deploy    # wrangler deploy
```

---

Built by [FURAI lab](https://github.com/FURAI-lab) — Architecting the future of digital autonomy.  
Specialized in long-term AI memory, edge-native systems, Hono, and Web3.
