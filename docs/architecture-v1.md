# Kokoc Store V1 Foundation

## Current public behavior

- `/` keeps serving the live welcome landing page.
- Static assets are served from `public/` through Cloudflare Assets.
- `/api/*` is reserved for the future storefront backend.

## Target stack

- Runtime: Cloudflare Workers
- Database: Cloudflare D1
- Asset storage: Cloudflare R2
- Cache: Workers KV for non-critical cache only
- Payments: external checkout provider later, most likely Stripe Checkout

## Foundation decisions

1. Keep the landing page on the root route until the storefront is ready.
2. Build the store as one Worker app instead of splitting frontend and backend early.
3. Use D1 as the source of truth for catalog, carts, and orders.
4. Keep KV out of critical write paths like inventory and checkout state.

## Suggested route map

- `/` landing page
- `/shop` future catalog entry
- `/product/:slug` future product detail page
- `/cart` future cart page
- `/checkout` future checkout handoff
- `/api/health` service health
- `/api/catalog/products` product list API
- `/api/cart` cart read API

## Suggested implementation order

1. Create D1 database and bind it as `DB`.
2. Add read-only product listing from D1.
3. Add product detail route and image lookup from R2.
4. Add cart persistence in D1.
5. Add order creation flow.
6. Add payment provider checkout session creation.
7. Replace landing root or move landing to `/welcome` once catalog is ready.

## Minimal bindings to create later

- `DB` for D1
- `CACHE` for Workers KV
- `PRODUCT_IMAGES` for R2

## Why this foundation is cheap

- The public site stays static-like while the store is under construction.
- Catalog and cart logic can stay in one Worker.
- D1 and R2 cover the essential needs without introducing extra hosted services.

