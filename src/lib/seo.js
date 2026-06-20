/**
 * seo.js — Shared SEO helpers for all server-rendered pages.
 * Centralizes canonical URLs, Open Graph tags, and JSON-LD builders
 * so every page emits consistent, correct metadata.
 */

const escAttr = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Builds the canonical absolute URL for a path on the configured domain.
 * Always strips query strings unless explicitly passed in `path`.
 */
export function canonicalUrl(appConfig, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `https://${appConfig.domain}${clean}`;
}

/**
 * Builds the canonical URL for a *specific locale* variant of a page.
 *
 * The site doesn't use locale-prefixed paths (e.g. /en/catalog) — locale is
 * switched via the `?lang=en` query param (which also sets the `kokoc_lang`
 * cookie, see i18n.js). That query param is therefore the only thing that
 * makes the English version of a page a distinct, crawlable URL.
 *
 * IMPORTANT: this must be used both for <link rel="canonical"> and for
 * hreflang annotations. Pointing hreflang at a URL that isn't also that
 * locale's own canonical (and vice versa) is an invalid/conflicting signal
 * that search engines will ignore.
 */
export function localizedUrl(appConfig, path, locale = "ru") {
  const base = canonicalUrl(appConfig, path);
  if (locale !== "en") return base;
  return base.includes("?") ? `${base}&lang=en` : `${base}?lang=en`;
}

/**
 * Renders the standard <head> SEO block: title, meta description,
 * canonical, robots, and Open Graph/Twitter tags.
 *
 * @param {object} opts
 * @param {object} opts.appConfig
 * @param {string} opts.title - Plain text page title (already includes brand suffix if desired)
 * @param {string} opts.description - Plain text meta description
 * @param {string} opts.path - Path used to build canonical + og:url (no query string)
 * @param {string} [opts.locale] - "ru" | "en"
 * @param {string} [opts.image] - Absolute or root-relative image URL for og:image
 * @param {string} [opts.type] - og:type, defaults to "website"
 * @param {boolean} [opts.noindex] - When true, emits robots noindex,follow
 * @param {object} [opts.alternates] - { ru: "/path", en: "/path" } for hreflang tags
 */
export function renderSeoHead({
  appConfig,
  title,
  description,
  path,
  locale = "ru",
  image,
  type = "website",
  noindex = false,
  alternates = null
}) {
  // Canonical points to THIS locale's own URL (clean path for ru, ?lang=en
  // for en) — never to the other language's page. A canonical that points
  // across languages tells search engines the two pages are duplicates of
  // each other, which silently drops one language from the index.
  const url = localizedUrl(appConfig, path, locale);
  const safeTitle = escAttr(title);
  const safeDesc = escAttr(description || "");
  const imageUrl = image
    ? (image.startsWith("http") ? image : `https://${appConfig.domain}${image}`)
    : `https://${appConfig.domain}/favbig.jpg`;

  const robots = noindex
    ? `<meta name="robots" content="noindex, follow" />`
    : `<meta name="robots" content="index, follow" />`;

  // Each hreflang entry must point to that language's own real, distinct
  // URL — pointing every language at the same href is invalid and gets
  // ignored by search engines.
  const hreflang = alternates
    ? Object.entries(alternates)
        .map(([loc, p]) => `<link rel="alternate" hreflang="${loc}" href="${localizedUrl(appConfig, p, loc)}" />`)
        .join("\n  ") +
      `\n  <link rel="alternate" hreflang="x-default" href="${localizedUrl(appConfig, alternates.ru || path, "ru")}" />`
    : "";

  return `<title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${url}" />
  ${robots}
  ${hreflang}
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="Kokoc Store" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="${locale === "ru" ? "ru_RU" : "en_US"}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${imageUrl}" />`;
}

/** JSON-LD: Organization (use once, on the homepage). */
export function organizationJsonLd(appConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kokoc Store",
    "url": `https://${appConfig.domain}/`,
    "logo": `https://${appConfig.domain}/favbig.jpg`,
    "sameAs": []
  };
}

/** JSON-LD: WebSite with SearchAction (enables sitelinks searchbox eligibility). */
export function websiteJsonLd(appConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kokoc Store",
    "url": `https://${appConfig.domain}/`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://${appConfig.domain}/catalog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

/** JSON-LD: BreadcrumbList. items = [{ name, path }] in order from home. */
export function breadcrumbJsonLd(appConfig, items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": canonicalUrl(appConfig, item.path)
    }))
  };
}

/** JSON-LD: ItemList for catalog/category pages (lightweight — names + URLs only). */
export function itemListJsonLd(appConfig, products = [], path = "/catalog") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": canonicalUrl(appConfig, path),
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": canonicalUrl(appConfig, `/product/${p.slug}`)
    }))
  };
}

/** Serializes one or more JSON-LD objects into <script> tags. */
export function jsonLdScripts(...objects) {
  return objects
    .filter(Boolean)
    .map(obj => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n  ");
}
