import { htmlResponse, jsonResponse } from "../../lib/response.js";
import { createSessionCookie, clearSessionCookie, requireAuth } from "./auth.js";
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct,
  createVariant, updateVariant, deleteVariant,
  uploadImage, deleteImage
} from "./products.js";
import { listOrders, getOrder, updateOrderStatus } from "./orders.js";
import { renderAdminPage } from "../../pages/admin.js";

// ── Login / Logout ─────────────────────────────────────────

async function handleLogin(request, env) {
  if (request.method === "GET") {
    return htmlResponse(renderAdminPage({ page: "login" }));
  }

  const body = await request.json().catch(() => ({}));
  if (body.password !== env.ADMIN_PASSWORD) {
    return jsonResponse({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  const cookie = await createSessionCookie(env);
  return jsonResponse({ ok: true }, { status: 200, headers: { "Set-Cookie": cookie } });
}

async function handleLogout(env) {
  return new Response(null, {
    status: 302,
    headers: {
      location: "/admin/login",
      "Set-Cookie": clearSessionCookie()
    }
  });
}

// ── Stats ──────────────────────────────────────────────────

async function handleStats(env) {
  try {
    const [productCount, orderCount, revenue, pendingCount] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as n FROM products WHERE status = 'active'`).first(),
      env.DB.prepare(`SELECT COUNT(*) as n FROM orders`).first(),
      env.DB.prepare(`SELECT COALESCE(SUM(total_minor), 0) as n FROM orders WHERE payment_status = 'paid'`).first(),
      env.DB.prepare(`SELECT COUNT(*) as n FROM orders WHERE status = 'pending'`).first(),
    ]);
    return jsonResponse({
      ok: true,
      activeProducts: productCount.n,
      totalOrders: orderCount.n,
      revenueMinor: revenue.n,
      pendingOrders: pendingCount.n
    });
  } catch (err) {
    return jsonResponse({
      ok: true,
      activeProducts: 0,
      totalOrders: 0,
      revenueMinor: 0,
      pendingOrders: 0,
      _error: err.message
    });
  }
}

// ── Main router ────────────────────────────────────────────

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Public routes
  if (path === "/admin/login") return handleLogin(request, env);
  if (path === "/admin/logout") return handleLogout(env);

  // Protected SPA shell - serve admin UI for all /admin/* GET requests (non-API)
  if (method === "GET" && !path.startsWith("/admin/api/")) {
    const redirect = await requireAuth(request, env);
    if (redirect) return redirect;
    return htmlResponse(renderAdminPage({ page: "app" }), {
      headers: { "cache-control": "no-store" }
    });
  }

  // All /admin/api/* routes require auth
  if (path.startsWith("/admin/api/")) {
    const redirect = await requireAuth(request, env);
    if (redirect) return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401 });

    // Stats
    if (path === "/admin/api/stats" && method === "GET") return handleStats(env);

    if (path === "/admin/api/subscribers" && method === "GET") {
      const { results } = await env.DB.prepare(`
        SELECT id, email, source, created_at
        FROM subscribers
        ORDER BY created_at DESC
        LIMIT 500
      `).all();
      return jsonResponse({ ok: true, subscribers: results, total: results.length });
    }

    // Products
    if (path === "/admin/api/products" && method === "GET") return listProducts(env);
    if (path === "/admin/api/products" && method === "POST") return createProduct(env, await request.json());

    const productMatch = path.match(/^\/admin\/api\/products\/([^/]+)$/);
    if (productMatch) {
      const [, pid] = productMatch;
      if (method === "GET") return getProduct(env, pid);
      if (method === "PATCH") return updateProduct(env, pid, await request.json());
      if (method === "DELETE") return deleteProduct(env, pid);
    }

    // Variants
    const variantCreate = path.match(/^\/admin\/api\/products\/([^/]+)\/variants$/);
    if (variantCreate && method === "POST") {
      return createVariant(env, variantCreate[1], await request.json());
    }

    const variantMatch = path.match(/^\/admin\/api\/variants\/([^/]+)$/);
    if (variantMatch) {
      const [, vid] = variantMatch;
      if (method === "PATCH") return updateVariant(env, vid, await request.json());
      if (method === "DELETE") return deleteVariant(env, vid);
    }

    // Images
    const imgUpload = path.match(/^\/admin\/api\/products\/([^/]+)\/images$/);
    if (imgUpload && method === "POST") return uploadImage(env, imgUpload[1], request);

    const imgDelete = path.match(/^\/admin\/api\/images\/([^/]+)$/);
    if (imgDelete && method === "DELETE") return deleteImage(env, imgDelete[1]);

    // Orders
    if (path === "/admin/api/orders" && method === "GET") return listOrders(env, url);

    const orderMatch = path.match(/^\/admin\/api\/orders\/([^/]+)$/);
    if (orderMatch) {
      const [, oid] = orderMatch;
      if (method === "GET") return getOrder(env, oid);
      if (method === "PATCH") return updateOrderStatus(env, oid, await request.json());
    }

    return jsonResponse({ ok: false, error: "Admin API route not found" }, { status: 404 });
  }

  return jsonResponse({ ok: false, error: "Not found" }, { status: 404 });
}
