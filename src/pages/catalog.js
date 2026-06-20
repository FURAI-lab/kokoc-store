import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  pluralItems,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead, breadcrumbJsonLd, itemListJsonLd, jsonLdScripts } from "../lib/seo.js";

/**
 * catalog.js — Server-rendered /catalog page
 * Design tokens match landing.js exactly.
 * Client JS handles: sort/filter, quick-view modal, size guide, add-to-cart.
 */
 
export function renderCatalogPage(appConfig, data = {}, locale = "ru") {
  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);
  const uiJson = JSON.stringify({
    addToCart: tr.t("addToCart"),
    added: tr.t("added"),
    addToWishlist: tr.t("addToWishlist"),
    close: tr.t("closeMenu"),
    crocsSizeGuide: tr.t("crocsSizeGuide"),
    hit: tr.t("hit"),
    limited: tr.t("limited"),
    new: tr.t("new"),
    outOfStock: tr.t("outOfStock"),
    photo: tr.t("photo"),
    size: tr.t("size"),
    sizeGuide: tr.t("sizeGuide")
  });
  const {
    products = [],
    total = 0,
    limit = 12,
    offset = 0,
    sort = "newest",
    tag = null,
    q = null,
    brand = null,
  } = data;
 
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
 
  /* ── SVG icons (same stroke style as landing) ─────────────────── */
  const iconSearch = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m20 20-4.45-4.45"/></svg>`;
  const iconHeart  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.2 4.85 13.55a4.7 4.7 0 0 1 6.65-6.65l.5.5.5-.5a4.7 4.7 0 1 1 6.65 6.65L12 20.2Z"/></svg>`;
  const iconBag    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"/><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"/></svg>`;
  const iconMenu   = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>`;
  const iconClose  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  const iconChev   = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
  const iconRuler  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 10.53 10.5 21.3a1.5 1.5 0 0 1-2.12 0L2.7 15.62a1.5 1.5 0 0 1 0-2.12L13.47 2.7a1.5 1.5 0 0 1 2.12 0l5.71 5.71a1.5 1.5 0 0 1 0 2.12Z"/><path d="m7.5 10.5 1.5 1.5"/><path d="m10.5 7.5 1.5 1.5"/><path d="m13.5 4.5 1.5 1.5"/><path d="m4.5 13.5 1.5 1.5"/></svg>`;
 
  /* ── Tag chips for filter bar ─────────────────────────────────── */
  const ALL_TAGS = [
    { key: "",        label: tr.t("all") },
    { key: "crocs",   label: "Crocs" },
    { key: "jibbitz", label: "Jibbitz" },
    { key: "adidas",  label: "Adidas" },
    { key: "limited", label: tr.t("limited") },
    { key: "sale",    label: tr.t("sale") },
  ];
 
  /* ── Product card ─────────────────────────────────────────────── */
  const escHtml = (s = "") => String(s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
 
  const badgeMap = { new: tr.t("new"), hit: tr.t("hit"), limited: tr.t("limited") };
  const badgeClass = { new: "badge-new", hit: "badge-hit", limited: "badge-ltd" };
 
  const ProductCard = (p) => {
    const title = escHtml(p.title);
    const slug  = escHtml(p.slug);
    const image = escHtml(p.image);
    const price = escHtml(p.price || tr.t("outOfStock"));
    const comparePrice = p.comparePrice ? escHtml(p.comparePrice) : null;
    const badge = p.badge && badgeMap[p.badge];
    const bc    = badge ? badgeClass[p.badge] : "";
 
    return `
      <article class="pc" data-slug="${slug}" tabindex="0" role="button"
        aria-label="${tr.t("open")} ${title}">
        <div class="pc-media">
          <img src="${image}" alt="${title}" loading="lazy" width="800" height="800" />
          ${badge ? `<span class="badge ${bc}">${badge}</span>` : ""}
          <button class="fav-btn" type="button" data-slug="${slug}"
            aria-label="${tr.t("addToWishlist")}: ${title}" aria-pressed="false">
            ${iconHeart}
          </button>
        </div>
        <div class="pc-body">
          <h3>${title}</h3>
          <div class="pc-foot">
            <div class="pc-price">
              ${comparePrice ? `<s>${comparePrice}</s>` : ""}
              <strong>${price}</strong>
            </div>
            <a class="cart-btn" href="/product/${slug}"
              aria-label="${tr.t("open")} ${title}">
              <span class="cart-btn-label">${tr.t("view")}</span>
              <span class="cart-btn-icon" aria-hidden="true">${iconChev}</span>
            </a>
          </div>
        </div>
      </article>`;
  };
 
  /* ── Pagination links ─────────────────────────────────────────── */
  const pageLink = (p, label, disabled = false, current = false) => {
    if (disabled) return `<span class="pg-btn pg-disabled">${label}</span>`;
    if (current)  return `<span class="pg-btn pg-current">${label}</span>`;
    const newOffset = (p - 1) * limit;
    return `<a class="pg-btn" href="?sort=${sort}${tag ? `&tag=${tag}` : ""}${brand ? `&brand=${encodeURIComponent(brand)}` : ""}&offset=${newOffset}">${label}</a>`;
  };
 
  const PaginationBar = () => {
    if (totalPages <= 1) return "";
    let btns = pageLink(page - 1, "←", page === 1);
    for (let i = 1; i <= totalPages; i++) {
      btns += pageLink(i, i, false, i === page);
    }
    btns += pageLink(page + 1, "→", page === totalPages);
    return `<nav class="pagination" aria-label="Catalog pages">${btns}</nav>`;
  };
 
  /* ── Size guide table data ────────────────────────────────────── */
  const sizeGuide = [
    ["M4 W6",  "36–37", "22"],
    ["M5 W7",  "37–38", "23"],
    ["M6 W8",  "38–39", "24"],
    ["M7 W9",  "39–40", "25"],
    ["M8 W10", "41–42", "26"],
    ["M9 W11", "42–43", "27"],
    ["M10 W12","43–44", "28"],
  ];
 
  const SizeGuideTable = () => `
    <table class="sg-table" aria-label="${tr.t("crocsSizeGuide")}">
      <thead>
        <tr>
          <th>Crocs</th>
          <th>EU</th>
          <th>CM</th>
        </tr>
      </thead>
      <tbody>
        ${sizeGuide.map(([cs, eu, cm]) => `
          <tr>
            <td>${cs}</td>
            <td>${eu}</td>
            <td>${cm} cm</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
 
  /* ── Serialise products to JSON for client quick-view ─────────── */
  const productsJson = JSON.stringify(products.map(p => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    badge: p.badge,
    image: p.image,
    price: p.price,
    comparePrice: p.comparePrice,
  })));
 
  /* ── SEO: dynamic title/description per filter ──────────────────
     Search queries and pagination beyond page 1 add no unique value to
     index — keep them out of search results while staying fully
     crawlable/followable. Tag/brand filters DO get their own indexable,
     self-canonical URL (e.g. /catalog?tag=new) — giving them a unique
     title/description while canonicalizing to a *different* page would be
     a contradictory signal that search engines typically resolve by
     dropping the unique page from the index entirely. */
  const tagLabelMap = { new: tr.t("new"), hit: tr.t("hit"), limited: tr.t("limited"), sale: tr.t("sale") };
  const filterLabel = tag ? tagLabelMap[tag] : (brand || null);
  const seoTitle = filterLabel
    ? `${filterLabel} — ${tr.t("catalogTitle")}`
    : tr.t("catalogTitle");
  const seoDescription = filterLabel
    ? (locale === "en"
        ? `${filterLabel} at Kokoc Store. ${tr.t("catalogDescription")}`
        : `${filterLabel} в Kokoc Store. ${tr.t("catalogDescription")}`)
    : tr.t("catalogDescription");
  const seoNoindex = Boolean(q) || page > 1;

  const filterQueryParams = [];
  if (tag) filterQueryParams.push(`tag=${encodeURIComponent(tag)}`);
  if (brand) filterQueryParams.push(`brand=${encodeURIComponent(brand)}`);
  const seoCanonicalPath = filterQueryParams.length && !seoNoindex
    ? `/catalog?${filterQueryParams.join("&")}`
    : "/catalog";

  const breadcrumbs = breadcrumbJsonLd(appConfig, [
    { name: tr.t("home"), path: "/" },
    { name: tr.t("catalogTitle"), path: "/catalog" }
  ]);
  const itemList = itemListJsonLd(appConfig, products, "/catalog");

  /* ── HTML shell ───────────────────────────────────────────────── */
  return `<!DOCTYPE html>
<html lang="${tr.locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  ${renderSeoHead({
    appConfig,
    title: seoTitle,
    description: seoDescription,
    path: seoCanonicalPath,
    locale: tr.locale,
    noindex: seoNoindex,
    alternates: { ru: seoCanonicalPath, en: seoCanonicalPath }
  })}
  ${jsonLdScripts(breadcrumbs, products.length ? itemList : null)}
  <link rel="icon" href="/favsmall.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ─── Design tokens (match landing.js) ─────────────────── */
    :root {
      --background: #F7F7F6;
      --primary: #FF6B9A;
      --text: #111111;
      --secondary-text: #888888;
      --white: #FFFFFF;
      --shadow-default: 0 8px 24px rgba(0,0,0,.06);
      --shadow-hover: 0 16px 40px rgba(0,0,0,.12);
      --container: 1180px;
      --radius-card: 24px;
      --radius-inner: 16px;
    }
 
    *,*::before,*::after { box-sizing: border-box; }
 
    html {
      scroll-behavior: smooth;
      background: #F7F7F6;
    }
 
    body {
      margin: 0;
      min-height: 100vh;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 50% 0%, rgba(255,240,245,.4), transparent 60%),
        var(--background);
      color: var(--text);
      font-family: "Manrope", "Segoe UI", Arial, sans-serif;
    }
 
    a { color: inherit; text-decoration: none; }
    button, input, select { font: inherit; }
    button { border: 0; padding: 0; background: none; cursor: pointer; color: inherit; }
    img { display: block; max-width: 100%; }
 
    /* ─── Navbar (identical to landing) ────────────────────── */
    .navbar {
      position: sticky; top: 0; z-index: 200;
      display: flex; align-items: center; justify-content: space-between;
      height: 56px; padding: 0 24px;
      background: rgba(255,255,255,.6);
      border-bottom: 1px solid rgba(0,0,0,.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .brand { display: inline-flex; align-items: center; width: 82px; min-width: 82px; }
    .brand img { width: 100%; height: auto; }
    .desktop-nav {
      position: absolute; left: 50%;
      display: flex; align-items: center; gap: 20px;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .desktop-nav a {
      font-size: 13px; font-weight: 600; line-height: 1;
      transition: color 220ms ease, transform 220ms ease;
    }
    .desktop-nav a:hover { color: var(--primary); transform: translateY(-1px); }
    .desktop-nav a.active { color: var(--primary); }
    .nav-actions { display: flex; align-items: center; gap: 8px; }
    .icon-button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 50%;
      transition: color 220ms, transform 220ms, background 220ms;
    }
    .icon-button svg { width: 20px; height: 20px; stroke: currentColor; }
    .icon-button:hover {
      color: var(--primary);
      background: rgba(255,255,255,.72);
      transform: translateY(-1px);
    }
    .mobile-only { display: none; }

${languageSwitcherStyles}
 
    /* ─── Page shell ────────────────────────────────────────── */
    .page { min-height: 100vh; }
    .inner {
      width: min(calc(100% - 48px), var(--container));
      margin-inline: auto;
    }
 
    /* ─── Catalog header ────────────────────────────────────── */
    .cat-header {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 16px;
      padding-top: 48px; padding-bottom: 28px;
      flex-wrap: wrap;
    }
    .cat-title {
      font-size: clamp(34px, 5vw, 56px);
      font-weight: 700; line-height: 1; margin: 0;
    }
    .cat-meta { color: var(--secondary-text); font-size: 13px; padding-bottom: 6px; }
 
    /* ─── Controls bar ──────────────────────────────────────── */
    .controls {
      padding-bottom: 28px;
    }
    .tag-chips {
      display: flex; gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 4px;
    }
    .tag-chips::-webkit-scrollbar { display: none; }
    .chip {
      padding: 8px 18px; border-radius: 999px;
      font-size: 13px; font-weight: 500;
      border: 1px solid rgba(0,0,0,.12);
      background: var(--white);
      color: var(--text);
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 180ms, border-color 180ms, color 180ms;
    }
    .chip:hover:not(.chip-active) { background: rgba(0,0,0,.04); }
    .chip.chip-active { background: var(--text); color: var(--white); border-color: var(--text); }
    .search-active-bar {
      display: flex; align-items: center; gap: 12px;
      padding: 6px 0 2px;
      font-size: 0.9rem; color: var(--muted);
    }
    .search-active-bar strong { color: var(--text); }
    .search-clear {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 999px;
      background: rgba(0,0,0,.06); color: var(--text);
      text-decoration: none; font-size: 0.82rem;
      transition: background 150ms;
    }
    .search-clear:hover { background: rgba(0,0,0,.12); }
 
    /* ─── Product grid ──────────────────────────────────────── */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px;
      padding-bottom: 48px;
    }
 
    /* ─── Product card ──────────────────────────────────────── */
    .pc {
      position: relative; display: grid; gap: 0;
      border-radius: var(--radius-card);
      background: var(--white);
      box-shadow: var(--shadow-default);
      overflow: hidden;
      cursor: pointer;
      transition: transform 250ms ease, box-shadow 250ms ease;
      outline: none;
    }
    .pc:hover, .pc:focus-visible {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
    }
    .pc:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
 
    .pc-media {
      position: relative; overflow: hidden;
      background: var(--white);
    }
    .pc-media img {
      width: 100%; height: auto;
      filter: contrast(1.08);
      transition: transform 300ms ease;
      aspect-ratio: 1/1; object-fit: cover;
    }
    .pc:hover .pc-media img { transform: scale(1.04); }
 
    .badge {
      position: absolute; top: 12px; left: 12px;
      display: inline-flex; align-items: center;
      min-height: 24px; padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px; font-weight: 500; line-height: 1;
      letter-spacing: 0.03em;
      color: var(--white);
      background: rgba(0,0,0,.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .badge-new, .badge-hit, .badge-ltd { /* единый стиль */ }
 
    .fav-btn {
      position: absolute; top: 12px; right: 12px;
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,.9);
      transition: color 220ms, transform 220ms;
    }
    .fav-btn svg { width: 18px; height: 18px; stroke: currentColor; }
    .fav-btn:hover { color: var(--primary); transform: scale(1.1); }
    .fav-btn[aria-pressed="true"] { color: var(--primary); }
    .fav-btn[aria-pressed="true"] svg path { fill: var(--primary); stroke: var(--primary); }
 
    .pc-body { display: grid; gap: 10px; padding: 14px 16px 16px; }
    .pc-body h3 {
      margin: 0; font-size: clamp(13px, 1.3vw, 15px);
      font-weight: 500; line-height: 1.3;
    }
    .pc-foot {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    .pc-price { display: flex; flex-direction: column; gap: 2px; }
    .pc-price s { font-size: 11px; color: var(--secondary-text); font-weight: 400; }
    .pc-price strong { font-size: clamp(14px, 1.4vw, 16px); font-weight: 500; }
 
    .cart-btn {
      display: inline-flex; align-items: center; justify-content: center;
      height: 36px; padding: 0 16px;
      border-radius: 999px;
      background: var(--text); color: var(--white);
      font-size: 12px; font-weight: 500;
      flex-shrink: 0;
      gap: 6px;
      transition: opacity 180ms;
    }
    .cart-btn:hover { opacity: .72; }
    .cart-btn-icon { display: none; }
    .cart-btn-icon svg { width: 16px; height: 16px; stroke: currentColor; }
 
    /* ─── Empty state ───────────────────────────────────────── */
    .empty-state {
      grid-column: 1/-1; padding: 60px 0; text-align: center;
      color: var(--secondary-text); font-size: 14px;
    }
 
    /* ─── Pagination ────────────────────────────────────────── */
    .pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; padding-bottom: 60px;
    }
    .pg-btn {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 36px; height: 36px; padding: 0 8px;
      border-radius: 10px; font-size: 13px; font-weight: 500;
      border: 1px solid rgba(0,0,0,.1); background: var(--white);
      transition: background 180ms, color 180ms;
    }
    a.pg-btn:hover { background: var(--background); }
    .pg-current { background: var(--text); color: var(--white); border-color: var(--text); }
    .pg-disabled { opacity: .35; pointer-events: none; }
 
    /* ─── Quick-view modal ──────────────────────────────────── */
    .qv-overlay {
      display: none;
      position: fixed; inset: 0; z-index: 500;
      background: rgba(0,0,0,.5);
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .qv-overlay.open { display: flex; }

    .qv-sheet {
      width: 100%; max-width: 900px;
      max-height: 90dvh;
      background: var(--white);
      border-radius: 28px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 1fr;
      animation: qvFadeUp 260ms cubic-bezier(.32,.72,0,1);
    }
    @keyframes qvFadeUp {
      from { transform: translateY(16px) scale(.98); opacity: 0; }
      to   { transform: translateY(0) scale(1);      opacity: 1; }
    }

    /* ── Gallery (left column) ── */
    .qv-gallery {
      position: relative;
      background: var(--background);
      display: flex; flex-direction: column;
      overflow: hidden; min-height: 0;
    }
    .qv-main-img {
      flex: 1; overflow: hidden; min-height: 0;
    }
    .qv-main-img img {
      width: 100%; height: 100%;
      object-fit: cover;
      filter: contrast(1.06);
      transition: opacity 180ms ease;
    }
    .qv-main-img img.switching { opacity: 0; }

    .qv-thumbs {
      display: flex; gap: 8px; padding: 12px;
      overflow-x: auto; scrollbar-width: none;
      flex-shrink: 0;
    }
    .qv-thumbs::-webkit-scrollbar { display: none; }
    .qv-thumb {
      flex-shrink: 0;
      width: 56px; height: 56px; border-radius: 12px;
      overflow: hidden; cursor: pointer;
      border: 2px solid transparent;
      background: rgba(0,0,0,.05);
      transition: border-color 180ms, transform 180ms;
    }
    .qv-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .qv-thumb:hover { transform: scale(1.06); }
    .qv-thumb.active { border-color: var(--text); }

    /* ── Info (right column) ── */
    .qv-info {
      display: flex; flex-direction: column;
      padding: 32px 32px 28px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .qv-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 20px; gap: 12px;
    }
    .qv-header-left { display: flex; flex-direction: column; gap: 6px; }
    .qv-close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 50%;
      flex-shrink: 0;
      background: var(--background);
      transition: background 180ms;
    }
    .qv-close svg { width: 18px; height: 18px; stroke: currentColor; }
    .qv-close:hover { background: rgba(0,0,0,.1); }

    .qv-badge { display: inline-flex; }

    .qv-title {
      font-size: clamp(17px, 2vw, 22px); font-weight: 700;
      line-height: 1.2; margin: 0;
    }
    .qv-desc {
      font-size: 13px; color: var(--secondary-text);
      line-height: 1.6; margin: 0 0 20px;
    }

    .qv-price-row {
      display: flex; align-items: baseline; gap: 10px; margin-bottom: 24px;
    }
    .qv-price-row strong { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
    .qv-price-row s { font-size: 14px; color: var(--secondary-text); }

    /* Size selector */
    .size-section { margin-bottom: 24px; }
    .size-label {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: .08em; color: var(--secondary-text);
      margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .size-guide-link {
      font-size: 11px; font-weight: 500; color: var(--primary);
      text-transform: none; letter-spacing: 0;
      cursor: pointer; display: inline-flex; align-items: center; gap: 3px;
    }
    .size-guide-link svg { width: 13px; height: 13px; stroke: currentColor; }
    .size-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .sz {
      padding: 8px 16px; border-radius: 12px;
      border: 1.5px solid rgba(0,0,0,.12);
      font-size: 13px; font-weight: 500;
      background: var(--white); cursor: pointer;
      transition: border-color 180ms, background 180ms;
    }
    .sz:hover { border-color: var(--text); }
    .sz.sz-active { border-color: var(--text); background: var(--text); color: var(--white); }
    .sz.sz-oos { opacity: .4; pointer-events: none; text-decoration: line-through; }

    /* Actions */
    .qv-actions { display: flex; gap: 10px; margin-top: auto; padding-top: 8px; }
    .btn-cart {
      flex: 1; height: 52px; border-radius: 999px;
      background: var(--text); color: var(--white);
      font-size: 15px; font-weight: 600;
      transition: background 220ms, transform 120ms;
    }
    .btn-cart:hover { background: var(--primary); }
    .btn-cart:active { transform: scale(.97); }
    .btn-fav {
      width: 52px; height: 52px; border-radius: 50%;
      border: 1.5px solid rgba(0,0,0,.12);
      background: var(--white);
      display: inline-flex; align-items: center; justify-content: center;
      transition: border-color 180ms, color 180ms;
    }
    .btn-fav svg { width: 20px; height: 20px; stroke: currentColor; }
    .btn-fav:hover { color: var(--primary); border-color: var(--primary); }
    .btn-fav.on { color: var(--primary); border-color: var(--primary); }

    /* ── Mobile: single column sheet ── */
    @media (max-width: 640px) {
      .qv-overlay { padding: 0; align-items: flex-end; }
      .qv-sheet {
        grid-template-columns: 1fr;
        border-radius: 28px 28px 0 0;
        max-height: 94dvh;
        animation-name: qvSlideUp;
      }
      @keyframes qvSlideUp {
        from { transform: translateY(40px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      .qv-gallery { flex-direction: column; height: auto; max-height: none; }
      .qv-main-img { flex: none; height: 62vw; max-height: 280px; }
      .qv-thumbs { display: none; }
      .qv-dots {
        display: flex; justify-content: center; gap: 6px;
        padding: 10px 0 4px; flex-shrink: 0;
      }
      .qv-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: rgba(0,0,0,.18);
        transition: background 180ms, transform 180ms;
        cursor: pointer; border: none; padding: 0;
      }
      .qv-dot.active { background: var(--text); transform: scale(1.3); }
      .qv-thumb { width: 52px; height: 52px; }
      .qv-info { padding: 20px 20px 32px; }
      .qv-actions { margin-top: 20px; }
    }
 
    /* ─── Size guide panel ──────────────────────────────────── */
    .sg-panel {
      display: none; margin-top: 20px; padding: 20px;
      border-radius: 18px; background: var(--background);
    }
    .sg-panel.open { display: block; }
    .sg-title {
      font-size: 13px; font-weight: 600; margin: 0 0 14px;
      color: var(--text);
    }
    .sg-table {
      width: 100%; border-collapse: collapse;
      font-size: 13px;
    }
    .sg-table th {
      font-weight: 600; font-size: 11px; text-transform: uppercase;
      letter-spacing: .06em; color: var(--secondary-text);
      padding: 6px 10px; text-align: left;
      border-bottom: 1px solid rgba(0,0,0,.08);
    }
    .sg-table td {
      padding: 9px 10px; color: var(--text);
      border-bottom: 1px solid rgba(0,0,0,.05);
    }
    .sg-table tr.sg-highlight td {
      background: rgba(255,107,154,.08);
      font-weight: 600;
    }
    .sg-table tr:last-child td { border-bottom: 0; }
 
    /* ─── Footer ────────────────────────────────────────────── */
    .site-footer {
      width: min(calc(100% - 48px), var(--container));
      margin: 0 auto; padding: 0 0 calc(28px + env(safe-area-inset-bottom, 0px));
      color: var(--secondary-text); font-size: 13px; text-align: right;
    }
 
    /* ─── Responsive ────────────────────────────────────────── */
    @media (max-width: 900px) {
      .navbar { padding: 0 16px; }
      .brand { width: 74px; min-width: 74px; }
      .desktop-nav, .desktop-only { display: none; }
      .mobile-only { display: inline-flex; }
      .inner { width: min(calc(100% - 32px), var(--container)); }
      .site-footer { width: min(calc(100% - 32px), var(--container)); }
      .cart-btn { height: 40px; padding: 0 18px; font-size: 13px; }
      .fav-btn { width: 40px; height: 40px; }
    }
 
    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
      .cat-header { padding-top: 32px; padding-bottom: 20px; }
    }
 
    @media (max-width: 480px) {
      .inner { width: min(calc(100% - 24px), var(--container)); }
      .site-footer { width: min(calc(100% - 24px), var(--container)); }
      .product-grid { gap: 12px; }
      .pc { border-radius: 20px; }
      .pc-body { padding: 10px 12px 12px; gap: 8px; }
      .pc-body h3 { font-size: 12px; }
      .cart-btn { height: 36px; width: 36px; padding: 0; border-radius: 50%; }
      .cart-btn-label { display: none; }
      .cart-btn-icon { display: flex; }
      .qv-sheet { padding: 20px 20px 36px; }
    }

    @media (max-width: 360px) {
      .product-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .cat-title { font-size: 28px; }
    }
 
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        transition-duration: 1ms !important;
        animation-duration: 1ms !important;
      }
    }
 
    /* ── Wishlist drawer ── */
    .wishlist-backdrop {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,.32); z-index: 299;
    }
    .wishlist-backdrop.open { display: block; }
    .wishlist-drawer {
      position: fixed; top: 0; right: -380px; bottom: 0;
      width: min(380px, 100vw);
      background: var(--background, #fff);
      box-shadow: -8px 0 40px rgba(0,0,0,.12);
      z-index: 300; display: flex; flex-direction: column;
      transition: right 300ms ease;
    }
    .wishlist-drawer.open { right: 0; }
    .wishlist-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px; border-bottom: 1px solid rgba(0,0,0,.08);
      font-weight: 600; font-size: 1rem;
    }
    .wishlist-close {
      background: none; border: none; cursor: pointer; padding: 4px;
      color: var(--text); opacity: .6; border-radius: 6px;
    }
    .wishlist-close:hover { opacity: 1; background: rgba(0,0,0,.06); }
    .wishlist-close svg { width: 18px; height: 18px; stroke: currentColor; display: block; }
    .wishlist-body {
      flex: 1; overflow-y: auto; padding: 16px 20px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .wishlist-empty {
      text-align: center; color: var(--muted, #888);
      padding: 40px 0; font-size: 0.95rem;
    }
    .wl-item {
      display: flex; gap: 12px; align-items: center;
      padding: 10px; border-radius: 12px;
      background: rgba(0,0,0,.03); text-decoration: none; color: inherit;
      transition: background 150ms;
    }
    .wl-item:hover { background: rgba(0,0,0,.07); }
    .wl-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
    .wl-item-info { flex: 1; min-width: 0; }
    .wl-item-title { font-size: 0.9rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wl-item-price { font-size: 0.82rem; color: var(--muted, #888); margin-top: 2px; }
    .wl-item-remove { background: none; border: none; cursor: pointer; padding: 4px; color: var(--muted, #888); flex-shrink: 0; border-radius: 50%; }
    .wl-item-remove:hover { color: var(--primary); background: rgba(0,0,0,.06); }
    .wl-item-remove svg { width: 16px; height: 16px; stroke: currentColor; display: block; }

    /* ── Search overlay ── */
    .search-overlay {
      display: none; position: fixed; inset: 0; z-index: 400;
      background: rgba(247,247,246,0.92);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      align-items: flex-start; justify-content: center;
      padding-top: 80px;
    }
    .search-overlay.open { display: flex; }
    .search-box {
      display: flex; align-items: center; gap: 12px;
      width: min(calc(100% - 48px), 600px);
    }
    #search-input {
      flex: 1; height: 52px; border-radius: 999px;
      border: 1.5px solid rgba(0,0,0,0.12);
      background: #fff; padding: 0 20px;
      font-size: 16px; font-family: inherit; outline: none;
      transition: border-color 180ms;
    }
    #search-input:focus { border-color: var(--primary); }
    .search-close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(0,0,0,0.06); border: none; cursor: pointer;
      flex-shrink: 0; transition: background 180ms;
    }
    .search-close svg { width: 18px; height: 18px; stroke: currentColor; }
    .search-close:hover { background: rgba(0,0,0,0.12); }
 
    /* ── Drawer overlay (cart + menu) ── */
    .drawer-overlay {
      display: none; position: fixed; inset: 0; z-index: 400;
      background: rgba(0,0,0,0.35);
    }
    .drawer-overlay.open { display: block; }
    .side-drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: min(380px, 90vw);
      background: var(--white, #fff);
      display: flex; flex-direction: column;
      animation: slideInRight 260ms cubic-bezier(.32,.72,0,1);
    }
    .side-drawer--left { right: auto; left: 0; animation-name: slideInLeft; }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes slideInLeft  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
    .drawer-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      flex-shrink: 0;
    }
    .drawer-title { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
    .drawer-close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(0,0,0,0.05); border: none; cursor: pointer;
      transition: background 180ms;
    }
    .drawer-close svg { width: 16px; height: 16px; stroke: currentColor; }
    .drawer-close:hover { background: rgba(0,0,0,0.1); }
    .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
    .drawer-empty {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 48px 0; text-align: center;
      color: var(--secondary-text, #888);
    }
    .drawer-empty svg { width: 40px; height: 40px; stroke: currentColor; opacity: .4; }
    .drawer-empty p { margin: 0; font-size: 14px; }
    .drawer-cta {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 12px 28px; border-radius: 999px;
      background: var(--text, #111); color: #fff;
      font-size: 14px; font-weight: 600;
      text-decoration: none;
      transition: background 200ms;
    }
    .drawer-cta:hover { background: var(--primary, #FF6B9A); }
    .mobile-nav {
      display: flex; flex-direction: column;
      padding: 12px 0; flex: 1;
    }
    .mobile-nav a {
      padding: 16px 24px;
      font-size: 20px; font-weight: 600;
      color: var(--text, #111); text-decoration: none;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      transition: color 180ms, padding-left 180ms;
    }
    .mobile-nav a:hover, .mobile-nav a.active { color: var(--primary, #FF6B9A); padding-left: 32px; }
    .mobile-nav-footer { padding: 24px; flex-shrink: 0; }
  </style>
</head>
<body>
<div class="page">
 
  <!-- Navbar -->
  <header class="navbar" aria-label="${tr.t("menu")}">
    <a class="brand" href="/" aria-label="${appConfig.domain}">
      <img src="/menu-logo.png" alt="Kokoc Store" />
    </a>
    <nav class="desktop-nav">
      <a href="/catalog?brand=crocs" class="${brand === "crocs" ? "active" : ""}">Crocs</a>
      <a href="/adidas">Adidas</a>
      <a href="/catalog" class="${!brand ? "active" : ""}">${tr.t("navAllProducts")}</a>
      <a href="/about">${tr.t("navAbout")}</a>
      <a href="/#collabs">${tr.t("navCollabs")}</a>
    </nav>
    <div class="nav-actions">
      ${langSwitcher}
      <button class="icon-button" type="button" id="search-btn" aria-label="${tr.t("search")}">${iconSearch}</button>
      <button class="icon-button desktop-only" type="button" id="wishlist-btn" aria-label="${tr.t("wishlist")}">${iconHeart}</button>
      <button class="icon-button" type="button" id="cart-btn" aria-label="${tr.t("cart")}">${iconBag}</button>
      <button class="icon-button mobile-only" type="button" id="menu-btn" aria-label="${tr.t("menu")}">${iconMenu}</button>
    </div>
  </header>
 
  <!-- ── Wishlist drawer ── -->
  <div class="wishlist-backdrop" id="wishlist-backdrop"></div>
  <aside class="wishlist-drawer" id="wishlist-drawer" role="dialog" aria-modal="true" aria-label="${tr.t("wishlist")}">
    <div class="wishlist-header">
      <span>${tr.t("wishlist")}</span>
      <button class="wishlist-close" id="wishlist-close" type="button" aria-label="${tr.t("close")}">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div class="wishlist-body" id="wishlist-body"></div>
  </aside>

  <!-- ── Search overlay ── -->
  <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("search")}">
    <div class="search-box">
      <input type="search" id="search-input" placeholder="${tr.t("searchPlaceholder")}" autocomplete="off"${q ? ` value="${q.replace(/"/g, '&quot;')}"` : ""} />
      <button class="search-close" type="button" id="search-close" aria-label="${tr.t("closeSearch")}">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  </div>
 
  <!-- ── Cart drawer ── -->
  <div class="drawer-overlay" id="cart-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("cart")}">
    <div class="side-drawer" id="cart-drawer">
      <div class="drawer-head">
        <span class="drawer-title">${tr.t("cart")}</span>
        <button class="drawer-close" type="button" id="cart-close" aria-label="${tr.t("closeCart")}">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="drawer-body">
        <div class="drawer-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"/><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"/></svg>
          <p>${tr.t("emptyCart")}</p>
          <a href="/catalog" class="drawer-cta">${tr.t("browseShop")}</a>
        </div>
      </div>
    </div>
  </div>
 
  <!-- ── Mobile menu drawer ── -->
  <div class="drawer-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("menu")}">
    <div class="side-drawer side-drawer--left" id="menu-drawer">
      <div class="drawer-head">
        <span class="drawer-title">${tr.t("menu")}</span>
        <button class="drawer-close" type="button" id="menu-close" aria-label="${tr.t("closeMenu")}">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <nav class="mobile-nav">
        <a href="/catalog?brand=crocs" class="${brand === "crocs" ? "active" : ""}">Crocs</a>
        <a href="/adidas">Adidas</a>
        <a href="/catalog" class="${!brand ? "active" : ""}">${tr.t("navAllProducts")}</a>
        <a href="/about">${tr.t("navAbout")}</a>
        <a href="/#collabs">${tr.t("navCollabs")}</a>
      </nav>
      <div class="mobile-nav-footer">
        <a href="/catalog" class="drawer-cta">${tr.t("shopNow")}</a>
      </div>
    </div>
  </div>
 
  <main>
    <div class="inner">
 
      <!-- Catalog header -->
      <div class="cat-header">
        <h1 class="cat-title">${brand === "crocs" ? "Crocs" : tr.t("catalogTitle")}</h1>
        <p class="cat-meta">${pluralItems(total, tr)}</p>
      </div>
 
      <!-- Controls: tag chips -->
      <div class="controls">
        <div class="tag-chips" role="group" aria-label="${tr.t("filterByCategory")}">
          ${ALL_TAGS.map(t => `
            <a class="chip${(tag || "") === t.key ? " chip-active" : ""}"
              href="?sort=${sort}${t.key ? `&tag=${t.key}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}${brand ? `&brand=${encodeURIComponent(brand)}` : ""}"
              aria-current="${(tag || "") === t.key ? "true" : "false"}">
              ${t.label}
            </a>`).join("")}
        </div>
        ${q ? `<div class="search-active-bar">
          <span class="search-active-label">${tr.t("searchResultsFor") || "Поиск"}: <strong>${q.replace(/</g,"&lt;")}</strong></span>
          <a class="search-clear" href="?sort=${sort}${tag ? `&tag=${tag}` : ""}${brand ? `&brand=${encodeURIComponent(brand)}` : ""}">${tr.t("clearSearch") || "✕ Сбросить"}</a>
        </div>` : ""}
      </div>
 
      <!-- Product grid -->
      <div class="product-grid" id="product-grid">
        ${products.length > 0
          ? products.map(ProductCard).join("")
          : `<div class="empty-state">${tr.t("noProducts")}</div>`}
      </div>
 
      <!-- Pagination -->
      ${PaginationBar()}
 
    </div><!-- /.inner -->
  </main>
 
  <footer class="site-footer">© ${new Date().getFullYear()} ${appConfig.siteName || "Kokoc Store"}</footer>
</div><!-- /.page -->
 
<!-- Quick-view modal -->
<div class="qv-overlay" id="qv-overlay" role="dialog" aria-modal="true"
  aria-label="${tr.t("quickView")}">
  <div class="qv-sheet" id="qv-sheet">
    <div class="qv-gallery" id="qv-gallery">
      <div class="qv-main-img" id="qv-main-img">
        <!-- main image filled by JS -->
      </div>
      <div class="qv-thumbs" id="qv-thumbs">
        <!-- thumbnails filled by JS -->
      </div>
      <div class="qv-dots" id="qv-dots" aria-hidden="true">
        <!-- dots filled by JS on mobile -->
      </div>
    </div>
    <div class="qv-info" id="qv-info">
      <!-- info filled by JS -->
    </div>
  </div>
</div>
 
<script>
/* ── Product data (SSR-injected) ────────────────────────────── */
const PRODUCTS = ${productsJson};
const SIZE_GUIDE = ${JSON.stringify(sizeGuide)};
const UI = ${uiJson};
${languageSwitcherScript}
 
/* ── Search ── */
const searchOverlay = document.getElementById('search-overlay');
document.getElementById('search-btn')
  ?.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('search-input')?.focus(), 50);
  });
document.getElementById('search-close')?.addEventListener('click', closeSearch);
searchOverlay?.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.getElementById('search-input')?.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) { window.location.href = '/catalog?q=' + encodeURIComponent(q); }
  }
});
function closeSearch() {
  searchOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}
 
/* ── Cart ── */
const cartOverlay = document.getElementById('cart-overlay');
/* ── Wishlist drawer ── */
const wishlistDrawer   = document.getElementById('wishlist-drawer');
const wishlistBackdrop = document.getElementById('wishlist-backdrop');

function openWishlist() {
  renderWishlist();
  wishlistDrawer?.classList.add('open');
  wishlistBackdrop?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeWishlist() {
  wishlistDrawer?.classList.remove('open');
  wishlistBackdrop?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderWishlist() {
  const body = document.getElementById('wishlist-body');
  if (!body) return;
  if (favs.size === 0) {
    body.innerHTML = '<div class="wishlist-empty">Список желаний пуст</div>';
    return;
  }
  body.innerHTML = '';
  favs.forEach(slug => {
    // Try to get product info from already-rendered cards
    const card = document.querySelector('.pc[data-slug="' + slug + '"]');
    const img   = card?.querySelector('img')?.src || '/crops/product-placeholder.png';
    const title = card?.querySelector('h3')?.textContent || slug;
    const price = card?.querySelector('.pc-price strong')?.textContent || '';
    const item = document.createElement('a');
    item.className = 'wl-item';
    item.href = '/product/' + encodeURIComponent(slug);
    item.innerHTML =
      '<img src="' + img + '" alt="' + title + '" loading="lazy">' +
      '<div class="wl-item-info">' +
        '<div class="wl-item-title">' + title + '</div>' +
        (price ? '<div class="wl-item-price">' + price + '</div>' : '') +
      '</div>' +
      '<button class="wl-item-remove" type="button" data-slug="' + slug + '" aria-label="Удалить">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '</button>';
    body.appendChild(item);
  });

  // Remove button handlers
  body.querySelectorAll('.wl-item-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const s = btn.dataset.slug;
      favs.delete(s); saveFavs(); syncFavButtons();
      renderWishlist();
    });
  });
}

document.getElementById('wishlist-btn')?.addEventListener('click', openWishlist);
document.getElementById('wishlist-close')?.addEventListener('click', closeWishlist);
wishlistBackdrop?.addEventListener('click', closeWishlist);

document.getElementById('cart-btn')
  ?.addEventListener('click', () => {
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
document.getElementById('cart-close')?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', e => { if (e.target === cartOverlay) closeCart(); });
function closeCart() {
  cartOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}
 
/* ── Mobile menu ── */
const menuOverlay = document.getElementById('menu-overlay');
document.getElementById('menu-btn')
  ?.addEventListener('click', () => {
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
document.getElementById('menu-close')?.addEventListener('click', closeMenu);
menuOverlay?.addEventListener('click', e => { if (e.target === menuOverlay) closeMenu(); });
function closeMenu() {
  menuOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}
 
/* ── Global Escape key ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeSearch(); closeCart(); closeMenu(); closeWishlist();
});
 
/* ── Sort: default newest, no UI control ────────────────────── */
 
/* ── Favourites (localStorage) ──────────────────────────────── */
const favs = new Set(JSON.parse(localStorage.getItem("kokoc_favs") || "[]"));
function saveFavs() { localStorage.setItem("kokoc_favs", JSON.stringify([...favs])); }
function syncFavButtons() {
  document.querySelectorAll(".fav-btn[data-slug]").forEach(btn => {
    btn.setAttribute("aria-pressed", favs.has(btn.dataset.slug) ? "true" : "false");
  });
}
syncFavButtons();
 
document.getElementById("product-grid").addEventListener("click", (e) => {
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    e.stopPropagation();
    const s = favBtn.dataset.slug;
    favs.has(s) ? favs.delete(s) : favs.add(s);
    saveFavs(); syncFavButtons();
    return;
  }
  /* Клик на карточку → переход на страницу товара */
  const card = e.target.closest(".pc[data-slug]");
  if (card && !e.target.closest("a")) {
    window.location.href = "/product/" + card.dataset.slug;
  }
});
 
 
 
/* ── Quick-view ─────────────────────────────────────────────── */
const overlay = document.getElementById("qv-overlay");
 
const badgeLabel = { new: UI.new || "${tr.t("new")}", hit: UI.hit || "${tr.t("hit")}", limited: UI.limited || "${tr.t("limited")}" };
const badgeClass = { new: "badge-new", hit: "badge-hit", limited: "badge-ltd" };
const sizeGuideHtml = buildSizeGuideHtml();
 
function buildSizeGuideHtml() {
  const rows = SIZE_GUIDE.map(([cs, eu, cm]) =>
    '<tr><td>' + cs + '</td><td>' + eu + '</td><td>' + cm + ' cm</td></tr>'
  ).join('');
  return '<table class="sg-table" aria-label="' + UI.crocsSizeGuide + '">' +
    '<thead><tr><th>Crocs</th><th>EU</th><th>CM</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>';
}
 
function openQuickView(slug) {
  const p = PRODUCTS.find(x => x.slug === slug);
  if (!p) return;

  /* Show immediately with basic data */
  renderQuickView(p, null);
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => document.querySelector(".qv-close")?.focus());

  /* Fetch full variant/image data */
  fetch('/api/catalog/products/' + encodeURIComponent(slug))
    .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
    .then(data => { if (overlay.classList.contains("open")) renderQuickView(p, data); })
    .catch(() => {
      /* Fetch failed — show link to full product page as fallback */
      const infoEl = document.getElementById('qv-info');
      if (infoEl && overlay.classList.contains("open")) {
        const errBanner = document.createElement('p');
        errBanner.style.cssText = 'margin:0 0 16px;padding:10px 14px;background:rgba(0,0,0,0.04);border-radius:10px;font-size:13px;color:var(--secondary-text)';
        errBanner.innerHTML = '<a href="/product/' + encodeURIComponent(slug) + '" style="color:var(--primary);font-weight:600">${tr.t("view")} →</a>';
        infoEl.prepend(errBanner);
      }
    });
}

function renderQuickView(p, data) {
  const badge = p.badge && badgeLabel[p.badge]
    ? '<span class="badge qv-badge ' + (badgeClass[p.badge] || '') + '">' + badgeLabel[p.badge] + '</span>'
    : '';

  const product  = data?.product ?? data ?? null;
  const variants = product?.variants || [];
  const images   = product?.images?.length ? product.images : [{ src: p.image, alt: p.title }];

  /* ── Gallery ── */
  const mainImgEl = document.getElementById('qv-main-img');
  const thumbsEl  = document.getElementById('qv-thumbs');
  const dotsEl    = document.getElementById('qv-dots');

  if (mainImgEl) {
    mainImgEl.innerHTML = '<img src="' + images[0].src + '" alt="' + images[0].alt + '" id="qv-active-img" />';
  }

  /* shared switch helper — updates image + thumbs + dots */
  function switchImage(idx) {
    const activeImg = document.getElementById('qv-active-img');
    if (!activeImg) return;
    activeImg.classList.add('switching');
    setTimeout(() => {
      activeImg.src = images[idx].src;
      activeImg.alt = images[idx].alt;
      activeImg.classList.remove('switching');
    }, 100);
    if (thumbsEl) thumbsEl.querySelectorAll('.qv-thumb').forEach((b, i) => b.classList.toggle('active', i === idx));
    if (dotsEl)   dotsEl.querySelectorAll('.qv-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  if (thumbsEl) {
    if (images.length > 1) {
      thumbsEl.innerHTML = images.map((img, i) =>
        '<button class="qv-thumb' + (i === 0 ? ' active' : '') + '" type="button" data-idx="' + i + '">' +
          '<img src="' + img.src + '" alt="' + img.alt + '" loading="lazy" />' +
        '</button>'
      ).join('');
      thumbsEl.style.display = '';

      thumbsEl.querySelectorAll('.qv-thumb').forEach(btn => {
        btn.addEventListener('click', () => switchImage(+btn.dataset.idx));
      });
    } else {
      thumbsEl.style.display = 'none';
    }
  }

  /* ── Dots (mobile only — rendered always, CSS hides on desktop) ── */
  if (dotsEl) {
    if (images.length > 1) {
      dotsEl.innerHTML = images.map((_, i) =>
        '<button class="qv-dot' + (i === 0 ? ' active' : '') + '" type="button" data-idx="' + i + '" aria-label="' + UI.photo + ' ' + (i + 1) + '"></button>'
      ).join('');
      dotsEl.querySelectorAll('.qv-dot').forEach(dot => {
        dot.addEventListener('click', () => switchImage(+dot.dataset.idx));
      });
    } else {
      dotsEl.style.display = 'none';
    }
  }

  /* ── Sizes HTML ── */
  const sizesHtml = variants.length
    ? '<div class="size-section">' +
        '<div class="size-label">' + UI.size +
          '<button class="size-guide-link" id="sg-toggle" type="button" aria-expanded="false">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 10.53 10.5 21.3a1.5 1.5 0 0 1-2.12 0L2.7 15.62a1.5 1.5 0 0 1 0-2.12L13.47 2.7a1.5 1.5 0 0 1 2.12 0l5.71 5.71a1.5 1.5 0 0 1 0 2.12Z"/><path d="m7.5 10.5 1.5 1.5"/><path d="m10.5 7.5 1.5 1.5"/><path d="m13.5 4.5 1.5 1.5"/><path d="m4.5 13.5 1.5 1.5"/></svg>' +
            UI.sizeGuide +
          '</button>' +
        '</div>' +
        '<div class="size-chips">' +
          variants.map(v =>
            '<button class="sz' + (v.inStock ? '' : ' sz-oos') + '" ' +
              'data-variant-id="' + v.id + '" ' +
              'data-price="' + (v.price || '') + '" ' +
              'data-compare="' + (v.comparePrice || '') + '">' +
              (v.crocsSize || v.sizeLabel || v.title) +
            '</button>'
          ).join('') +
        '</div>' +
        '<div class="sg-panel" id="sg-panel">' +
          '<p class="sg-title">' + UI.crocsSizeGuide + '</p>' +
          sizeGuideHtml +
        '</div>' +
      '</div>'
    : '';

  /* ── Info panel ── */
  const infoEl = document.getElementById('qv-info');
  if (!infoEl) return;

  infoEl.innerHTML =
    '<div class="qv-header">' +
      '<div class="qv-header-left">' +
        (badge ? badge + ' ' : '') +
        '<h2 class="qv-title">' + p.title + '</h2>' +
      '</div>' +
      '<button class="qv-close" type="button" aria-label="' + UI.close + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '</button>' +
    '</div>' +
    (p.description ? '<p class="qv-desc">' + p.description + '</p>' : '') +
    '<div class="qv-price-row">' +
      (p.comparePrice ? '<s>' + p.comparePrice + '</s>' : '') +
      '<strong id="qv-price">' + (p.price || UI.outOfStock) + '</strong>' +
    '</div>' +
    sizesHtml +
    '<div class="qv-actions">' +
      '<button class="btn-cart" type="button" id="qv-add-btn">' + UI.addToCart + '</button>' +
      '<button class="btn-fav ' + (favs.has(p.slug) ? 'on' : '') + '" type="button" id="qv-fav-btn" aria-label="' + UI.addToWishlist + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.2 4.85 13.55a4.7 4.7 0 0 1 6.65-6.65l.5.5.5-.5a4.7 4.7 0 1 1 6.65 6.65L12 20.2Z"/></svg>' +
      '</button>' +
    '</div>';

  /* Close */
  infoEl.querySelector(".qv-close").addEventListener("click", closeQuickView);

  /* Size guide toggle */
  const sgToggle = infoEl.querySelector("#sg-toggle");
  const sgPanel  = infoEl.querySelector("#sg-panel");
  if (sgToggle && sgPanel) {
    sgToggle.addEventListener("click", () => {
      const open = sgPanel.classList.toggle("open");
      sgToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Size chip select */
  infoEl.querySelectorAll(".sz:not(.sz-oos)").forEach(btn => {
    btn.addEventListener("click", () => {
      infoEl.querySelectorAll(".sz").forEach(b => b.classList.remove("sz-active"));
      btn.classList.add("sz-active");
      if (btn.dataset.price) {
        const priceEl = infoEl.querySelector("#qv-price");
        if (priceEl) priceEl.textContent = btn.dataset.price;
      }
    });
  });

  /* Fav */
  const favBtn = infoEl.querySelector("#qv-fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      const s = p.slug;
      favs.has(s) ? favs.delete(s) : favs.add(s);
      saveFavs(); syncFavButtons();
      favBtn.classList.toggle("on", favs.has(s));
    });
  }

  /* Add to cart — Fix #3: real localStorage cart, Fix #8: require size when variants exist */
  infoEl.querySelector("#qv-add-btn")?.addEventListener("click", () => {
    const activeSize = infoEl.querySelector(".sz.sz-active");

    /* Fix #8: if variants exist but no size selected, prompt and abort */
    if (variants.length > 0 && !activeSize) {
      const sizeSection = infoEl.querySelector(".size-section");
      if (sizeSection) {
        sizeSection.style.outline = '2px solid var(--primary)';
        sizeSection.style.borderRadius = '12px';
        sizeSection.style.padding = '8px';
        sizeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { sizeSection.style.outline = ''; sizeSection.style.padding = ''; }, 1800);
      }
      return;
    }

    const variantId    = activeSize?.dataset.variantId || null;
    const sizeLabel    = activeSize ? activeSize.textContent.trim() : '—';
    const priceMinor   = variantId
      ? (variants.find(v => String(v.id) === String(variantId))?.priceMinor || 0)
      : 0;
    const image = p.image || '/crops/product-placeholder.png';

    /* Read cart from localStorage */
    let cart = JSON.parse(localStorage.getItem('kokoc_cart') || '{"items":[]}');
    const existing = cart.items.find(i => i.variantId === variantId && i.productSlug === p.slug);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.items.push({
        variantId,
        productSlug: p.slug,
        title:       p.title,
        sizeLabel,
        priceMinor,
        image,
        qty: 1,
      });
    }
    localStorage.setItem('kokoc_cart', JSON.stringify(cart));

    /* Update cart badge if present on page */
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = cart.items.reduce((s, i) => s + (i.qty || 1), 0);
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    }

    /* Button feedback */
    const addBtn = infoEl.querySelector("#qv-add-btn");
    if (addBtn) {
      const prev = addBtn.textContent;
      addBtn.textContent = "✓ " + UI.added;
      addBtn.style.background = '#27ae60';
      setTimeout(() => {
        if (addBtn) { addBtn.textContent = prev; addBtn.style.background = ''; }
      }, 1800);
    }
  });
}
 
function closeQuickView() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
 
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeQuickView();
});
 
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeQuickView();
});

/* ── Auto-redirect from ?open=slug (landing link) ── */
(function() {
  const params = new URLSearchParams(location.search);
  const openSlug = params.get("open");
  if (openSlug) {
    /* Редирект на страницу товара — убираем ?open= из URL и переходим */
    window.location.replace("/product/" + encodeURIComponent(openSlug));
  }
})();
</script>
</body>
</html>`;
}
