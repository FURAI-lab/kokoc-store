import { jsonResponse, methodNotAllowedResponse, notFoundResponse } from "../../lib/response.js";
import { handleSubscribe } from "./subscribe.js";
import { getCatalogPage, getProductDetail } from "../../lib/catalog.js";
import { handleCartRequest } from "./cart.js";

function buildBindingStatus(env) {
  return {
    assets:   Boolean(env.ASSETS),
    database: Boolean(env.DB),
    cache:    Boolean(env.KV),
  };
}

function handleHealth(request, env, appConfig) {
  if (request.method !== "GET") return methodNotAllowedResponse(["GET"]);
  return jsonResponse({
    ok: true,
    service: appConfig.serviceName,
    domain:  appConfig.domain,
    version: appConfig.apiVersion,
    storeStatus: appConfig.storeStatus,
    timestamp: new Date().toISOString(),
    bindings: buildBindingStatus(env),
  });
}

/**
 * GET /api/catalog/products
 * Query params: sort, tag, limit (max 48), offset
 */
async function handleCatalogProducts(request, env) {
  if (request.method !== "GET") return methodNotAllowedResponse(["GET"]);

  const url    = new URL(request.url);
  const sort   = ["newest", "price_asc", "price_desc"]
    .includes(url.searchParams.get("sort"))
    ? url.searchParams.get("sort")
    : "newest";
  const tag    = url.searchParams.get("tag") || null;
  const limit  = Math.min(48, Math.max(1, parseInt(url.searchParams.get("limit") || "12", 10)));
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10));

  if (!env.DB) {
    return jsonResponse({
      ok: true,
      products: [],
      pagination: { total: 0, limit, offset },
      message: "DB not bound yet.",
    });
  }

  const data = await getCatalogPage(env, { limit, offset, sort, tag });
  return jsonResponse({
    ok: true,
    ...data,
    pagination: { total: data.total, limit, offset },
  });
}

/**
 * GET /api/catalog/products/:slug
 * Returns full product detail including variants (with crocs_size) and images.
 * Used by the quick-view modal on /catalog.
 */
async function handleProductDetail(request, env, slug) {
  if (request.method !== "GET") return methodNotAllowedResponse(["GET"]);

  if (!env.DB) {
    return jsonResponse({ ok: false, error: "DB not bound" }, { status: 503 });
  }

  const product = await getProductDetail(env, slug);
  if (!product) {
    return jsonResponse({ ok: false, error: "Not found" }, { status: 404 });
  }

  return jsonResponse({ ok: true, product });
}

export async function handleApiRequest(request, env, appConfig, ctx) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return handleHealth(request, env, appConfig);
  }

  // Catalog list
  if (url.pathname === "/api/catalog/products") {
    return handleCatalogProducts(request, env);
  }

  // Product detail by slug (used by quick-view)
  const detailMatch = url.pathname.match(/^\/api\/catalog\/products\/([^/]+)$/);
  if (detailMatch) {
    return handleProductDetail(request, env, decodeURIComponent(detailMatch[1]));
  }

  // Cart routes
  if (url.pathname.startsWith("/api/cart")) {
    return handleCartRequest(request, env);
  }

  if (url.pathname === "/api/subscribe") {
    return handleSubscribe(request, env, ctx);
  }

  return notFoundResponse({ message: "API route not found", pathname: url.pathname });
}
