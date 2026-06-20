import { appConfig } from "./config/app.js";
import { getActiveProducts } from "./lib/products.js";
import { getCatalogPage, getProductDetail } from "./lib/catalog.js";
import { htmlResponse, xmlResponse, textResponse } from "./lib/response.js";
import { buildSitemap } from "./lib/sitemap.js";
import { withSecurityHeaders } from "./lib/security.js";
import { getLocaleFromRequest, localeHeaders } from "./lib/i18n.js";
import { renderLandingPage } from "./pages/landing.js";
import { renderCatalogPage } from "./pages/catalog.js";
import { renderAdidasPage } from "./pages/adidas.js";
import { renderCollabsPage } from "./pages/collabs.js";
import { getCollabsFromKV } from "./lib/collabs.js";
import { renderProductPage } from "./pages/product.js";
import { renderDeliveryPage } from "./pages/delivery.js";
import { renderAboutPage } from "./pages/about.js";
import { handleApiRequest } from "./routes/api/index.js";
import { handleAdminRequest } from "./routes/admin/index.js";
import { renderMinigamePage } from "./pages/minigame.js";
import { renderNotFoundPage } from "./pages/not-found.js";

export async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const locale = getLocaleFromRequest(request);
  const localizedHeaders = localeHeaders(locale);

  // ── Admin (all /admin/* routes) ────────────────────────────────────────────
  if (url.pathname.startsWith("/admin")) {
    return withSecurityHeaders(await handleAdminRequest(request, env), {
      "cache-control": "no-store",
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

  // ── Landing page ───────────────────────────────────────────────────────────
  if (url.pathname === "/") {
    const products = await getActiveProducts(env);
    return withSecurityHeaders(
      htmlResponse(renderLandingPage(appConfig, products, locale.locale), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=60, stale-while-revalidate=300"
        }
      })
    );
  }

  // ── Catalog page ───────────────────────────────────────────────────────────
  if (url.pathname === "/catalog") {
    const limit  = 12;
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10));
    const sort   = ["newest", "price_asc", "price_desc"]
      .includes(url.searchParams.get("sort"))
      ? url.searchParams.get("sort")
      : "newest";
    const tag = url.searchParams.get("tag") || null;
    const q   = url.searchParams.get("q")   || null;
    const brandParam = url.searchParams.get("brand") || null;

    // "Crocs" nav link uses brand=crocs (lowercase) as a sentinel that maps
    // to the actual "Crocs" brand value used in the catalog.
    const isCrocsView = brandParam && brandParam.toLowerCase() === "crocs";
    const brand = isCrocsView ? "Crocs" : brandParam;

    const data = await getCatalogPage(env, { limit, offset, sort, tag, q, brand });

    return withSecurityHeaders(
      htmlResponse(renderCatalogPage(appConfig, { ...data, limit, offset, sort, tag, q, brand: brandParam }, locale.locale), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=30, stale-while-revalidate=120"
        }
      })
    );
  }

  // ── Adidas Originals page ──────────────────────────────────────────────────
  if (url.pathname === "/adidas") {
    const limit  = 12;
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10));
    const sort   = ["newest", "price_asc", "price_desc"]
      .includes(url.searchParams.get("sort"))
      ? url.searchParams.get("sort")
      : "newest";
    const tag = url.searchParams.get("tag") || null;
    const q   = url.searchParams.get("q")   || null;

    const data = await getCatalogPage(env, { limit, offset, sort, tag, q, brand: "Adidas Originals" });

    return withSecurityHeaders(
      htmlResponse(renderAdidasPage(appConfig, { ...data, limit, offset, sort, tag, q }, locale.locale), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=30, stale-while-revalidate=120"
        }
      })
    );
  }

  // ── Product page ───────────────────────────────────────────────────────────
  if (url.pathname.startsWith("/product/")) {
    const slug = decodeURIComponent(url.pathname.slice("/product/".length).split("?")[0]);
    if (!slug) return Response.redirect(new URL("/catalog", request.url).toString(), 302);

    const product = await getProductDetail(env, slug);

    if (!product) {
      return withSecurityHeaders(
        htmlResponse(renderNotFoundPage(appConfig, locale.locale), {
          status: 404,
          headers: {
            ...localizedHeaders,
            "cache-control": "no-store"
          }
        })
      );
    }

    const whatsappNumber = env.KV
      ? await env.KV.get("settings:whatsapp_number").catch(() => "")
      : "";

    return withSecurityHeaders(
      htmlResponse(renderProductPage(appConfig, product, locale.locale, whatsappNumber || ""), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=60, stale-while-revalidate=300"
        }
      })
    );
  }

  // ── Delivery page ──────────────────────────────────────────────────────────
  if (url.pathname === "/delivery") {
    return withSecurityHeaders(
      htmlResponse(renderDeliveryPage(appConfig, locale.locale), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=300, stale-while-revalidate=3600"
        }
      })
    );
  }

  // ── About page ────────────────────────────────────────────────────────────────
  if (url.pathname === "/about") {
    const whatsappNumber = env.KV
      ? await env.KV.get("settings:whatsapp_number").catch(() => "")
      : "";
    return withSecurityHeaders(
      htmlResponse(renderAboutPage(appConfig, locale.locale, whatsappNumber || ""), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=300, stale-while-revalidate=3600"
        }
      })
    );
  }

  // ── Collabs page ───────────────────────────────────────────────────────────
  if (url.pathname === "/collabs") {
    const collabs = await getCollabsFromKV(env, { status: "active" });
    return withSecurityHeaders(
      htmlResponse(renderCollabsPage(appConfig, collabs, locale.locale), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=300, stale-while-revalidate=3600"
        }
      })
    );
  }

  // ── Single collab page (placeholder — returns 404 until individual pages built) ──
  if (url.pathname.startsWith("/collabs/")) {
    // TODO: renderCollabDetailPage — redirect to /collabs for now
    return Response.redirect(new URL("/collabs", request.url).toString(), 302);
  }

  // ── Minigame page ──────────────────────────────────────────────────────────
  if (url.pathname === "/minigame") {
    return withSecurityHeaders(
      htmlResponse(renderMinigamePage(appConfig, locale.locale), {
        headers: {
          ...localizedHeaders,
          "cache-control": "public, max-age=300, stale-while-revalidate=3600"
        }
      })
    );
  }

  // ── robots.txt ──────────────────────────────────────────────────────────────
  if (url.pathname === "/robots.txt") {
    const body = [
      "User-agent: *",
      "Disallow:",
      "",
      `Sitemap: https://${appConfig.domain}/sitemap.xml`,
      ""
    ].join("\n");
    return withSecurityHeaders(
      textResponse(body, {
        headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" }
      })
    );
  }

  // ── sitemap.xml ─────────────────────────────────────────────────────────────
  if (url.pathname === "/sitemap.xml") {
    const xml = await buildSitemap(appConfig, env);
    return withSecurityHeaders(
      xmlResponse(xml, {
        headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" }
      })
    );
  }

  // ── API routes ─────────────────────────────────────────────────────────────
  if (url.pathname.startsWith("/api/")) {
    return withSecurityHeaders(
      await handleApiRequest(request, env, appConfig, ctx),
      { "cache-control": "no-store" }
    );
  }

  // ── R2 image proxy ─────────────────────────────────────────────────────────
  if ((url.pathname.startsWith("/r2/") || url.pathname.startsWith("/cdn/")) && env.PRODUCT_IMAGES) {
    const r2Key = url.pathname.startsWith("/cdn/") ? url.pathname.slice(5) : url.pathname.slice(4);
    const object = await env.PRODUCT_IMAGES.get(r2Key);
    if (!object) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(object.body, { headers });
  }

  // ── Static assets ──────────────────────────────────────────────────────────
  if (request.method === "GET" || request.method === "HEAD") {
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return withSecurityHeaders(assetResponse);
  }

  return withSecurityHeaders(
    htmlResponse(renderNotFoundPage(appConfig, locale.locale), {
      status: 404,
      headers: {
        ...localizedHeaders,
        "cache-control": "no-store"
      }
    })
  );
}
