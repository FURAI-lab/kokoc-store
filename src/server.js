import { appConfig } from "./config/app.js";
import { getActiveProducts } from "./lib/products.js";
import { htmlResponse, notFoundResponse } from "./lib/response.js";
import { withSecurityHeaders } from "./lib/security.js";
import { renderLandingPage } from "./pages/landing.js";
import { handleApiRequest } from "./routes/api/index.js";
import { handleAdminRequest } from "./routes/admin/index.js";

export async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);

  // ── Admin (все /admin/* маршруты) ──────────────────────────────────────────
  if (url.pathname.startsWith("/admin")) {
    // CSP для admin SPA: нужен 'unsafe-inline' для скриптов и стилей.
    // withSecurityHeaders уже включает это — дополнительного override не нужно.
    return withSecurityHeaders(await handleAdminRequest(request, env), {
      "cache-control": "no-store",
      // Разрешаем форм-экшен на /admin/* (иначе CSP form-action 'none' блокирует fetch)
      "content-security-policy": [
        "default-src 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "img-src 'self' data: blob:",
        "object-src 'none'",
        "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
        "style-src 'self' 'unsafe-inline'",
        "upgrade-insecure-requests"
      ].join("; ")
    });
  }

  // ── Public storefront ──────────────────────────────────────────────────────

  if (url.pathname === "/") {
    const products = await getActiveProducts(env);

    return withSecurityHeaders(
      htmlResponse(renderLandingPage(appConfig, products), {
        headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" }
      })
    );
  }

  if (url.pathname.startsWith("/api/")) {
    return withSecurityHeaders(
      await handleApiRequest(request, env, appConfig, ctx),
      { "cache-control": "no-store" }
    );
  }

  if (url.pathname.startsWith("/r2/") && env.PRODUCT_IMAGES) {
    const r2Key = url.pathname.slice(4);
    const object = await env.PRODUCT_IMAGES.get(r2Key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(object.body, { headers });
  }

  if (request.method === "GET" || request.method === "HEAD") {
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return withSecurityHeaders(assetResponse);
    }
  }

  return withSecurityHeaders(
    notFoundResponse({ message: "Route not found", pathname: url.pathname })
  );
}
