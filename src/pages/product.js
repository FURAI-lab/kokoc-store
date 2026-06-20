/**
 * product.js — Server-rendered /product/:slug page
 * Styles and tokens match catalog.js exactly.
 * Client JS handles: gallery swipe, size select, add-to-cart with drawer feedback.
 */

import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead, breadcrumbJsonLd, jsonLdScripts } from "../lib/seo.js";

const escHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const fmt = (minor, locale = "ru") =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(minor / 100);

export function renderProductPage(appConfig, product, locale = "ru", whatsappNumber = "") {
  if (!product) return null;

  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);

  // WhatsApp link — strip non-digits, build wa.me URL with prefilled message
  const waNumber = (whatsappNumber || "").replace(/\D/g, "");
  const waMessageText = locale === "en"
    ? `Hi! I'd like to order: ${product.title}`
    : `Привет! Хочу заказать: ${product.title}`;
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessageText)}`
    : null;

  const uiJson = JSON.stringify({
    addToCart: tr.t("addToCart"),
    addedCheck: tr.t("addedCheck"),
    addedToCart: tr.t("addedToCart"),
    browseShop: tr.t("browseShop"),
    checkout: tr.t("checkout"),
    emptyCart: tr.t("emptyCart"),
    removeFromCart: tr.t("removeFromCart"),
    sizeMeta: tr.t("sizeMeta"),
    cart: tr.t("cart"),
    locale: tr.locale
  });

  const title       = escHtml(product.title);
  const description = escHtml(product.description);
  const badge       = product.badge;
  const badgeLabel  = { new: tr.t("new"), hit: tr.t("hit"), limited: tr.t("limited") }[badge] || null;

  const images   = product.images?.length
    ? product.images
    : [{ src: "/crops/product-placeholder.png", alt: product.title }];

  const variants = product.variants || [];

  /* Canonical price — cheapest in-stock variant */
  const inStockVariants = variants.filter(v => v.inStock);
  const lowestVariant   = inStockVariants[0] || variants[0];
  const displayPrice    = lowestVariant?.price || null;
  const comparePrice    = lowestVariant?.comparePrice || null;

  /* ── Icons (same stroke style as catalog.js) ──────────────── */
  const iconSearch = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m20 20-4.45-4.45"/></svg>`;
  const iconHeart  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.2 4.85 13.55a4.7 4.7 0 0 1 6.65-6.65l.5.5.5-.5a4.7 4.7 0 1 1 6.65 6.65L12 20.2Z"/></svg>`;
  const iconBag    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"/><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"/></svg>`;
  const iconMenu   = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>`;
  const iconClose  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  const iconChevL  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;
  const iconRuler  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 10.53 10.5 21.3a1.5 1.5 0 0 1-2.12 0L2.7 15.62a1.5 1.5 0 0 1 0-2.12L13.47 2.7a1.5 1.5 0 0 1 2.12 0l5.71 5.71a1.5 1.5 0 0 1 0 2.12Z"/><path d="m7.5 10.5 1.5 1.5"/><path d="m10.5 7.5 1.5 1.5"/><path d="m13.5 4.5 1.5 1.5"/><path d="m4.5 13.5 1.5 1.5"/></svg>`;
  const iconCheck  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

  /* ── Size guide tables ────────────────────────────────────── */
  const crocsSizeGuide = [
    ["M3 W5",  "34–35", "21"],
    ["M4 W6",  "36–37", "22"],
    ["M5 W7",  "37–38", "23"],
    ["M6 W8",  "38–39", "24"],
    ["M7 W9",  "39–40", "25"],
    ["M8 W10", "41–42", "26"],
    ["M9 W11", "42–43", "27"],
    ["M10 W12","43–44", "28"],
    ["M11",    "45–46", "29"],
  ];

  const adidasSizeGuide = [
    ["US 4",    "UK 3.5",  "36",   "22.1"],
    ["US 4.5",  "UK 4",    "36.5", "22.5"],
    ["US 5",    "UK 4.5",  "37",   "22.9"],
    ["US 5.5",  "UK 5",    "38",   "23.3"],
    ["US 6",    "UK 5.5",  "38.5", "23.8"],
    ["US 6.5",  "UK 6",    "39",   "24.2"],
    ["US 7",    "UK 6.5",  "40",   "24.6"],
    ["US 7.5",  "UK 7",    "40.5", "25"],
    ["US 8",    "UK 7.5",  "41",   "25.5"],
    ["US 8.5",  "UK 8",    "42",   "25.9"],
    ["US 9",    "UK 8.5",  "42.5", "26.3"],
    ["US 9.5",  "UK 9",    "43",   "26.7"],
    ["US 10",   "UK 9.5",  "44",   "27.1"],
    ["US 10.5", "UK 10",   "44.5", "27.6"],
    ["US 11",   "UK 11",   "46",   "28.4"],
  ];

  const isAdidas = product.brand === "Adidas Originals";
  const sizeGuide = isAdidas ? adidasSizeGuide : crocsSizeGuide;
  const sizeGuideTitle = isAdidas
    ? (locale === "ru" ? "Таблица размеров Adidas" : "Adidas Size Guide")
    : tr.t("crocsSizeGuide");
  const sizeGuideHeadCols = isAdidas
    ? ["US", "UK", "EU", "CM"]
    : ["Crocs", "EU", "CM"];

  /* ── Structured data for SEO ──────────────────────────────── */
  // Google's Product rich-result validator wants a single `offers` object;
  // when there are multiple in-stock variants at different prices, that
  // must be an AggregateOffer (low/high price), not a bare array.
  const offerPrices = inStockVariants.map(v => v.priceMinor / 100);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": images.map(i => `https://${appConfig.domain}${i.src}`),
    "brand": { "@type": "Brand", "name": product.brand || "Kokoc Store" },
    "offers": offerPrices.length > 1
      ? {
          "@type": "AggregateOffer",
          "priceCurrency": "RUB",
          "lowPrice": Math.min(...offerPrices).toFixed(2),
          "highPrice": Math.max(...offerPrices).toFixed(2),
          "offerCount": offerPrices.length,
          "availability": "https://schema.org/InStock"
        }
      : {
          "@type": "Offer",
          "priceCurrency": "RUB",
          "price": (offerPrices[0] ?? 0).toFixed(2),
          "availability": inStockVariants.length ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
  };

  const breadcrumbs = breadcrumbJsonLd(appConfig, [
    { name: tr.t("home"), path: "/" },
    { name: tr.t("catalogTitle"), path: "/catalog" },
    { name: product.title, path: `/product/${product.slug}` }
  ]);

  const productJson  = JSON.stringify(product);
  const sizeGuideJson = JSON.stringify(sizeGuide);

  return `<!DOCTYPE html>
<html lang="${tr.locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  ${renderSeoHead({
    appConfig,
    title: `${product.title} — Kokoc Store`,
    description: product.description || product.title,
    path: `/product/${product.slug}`,
    locale: tr.locale,
    image: images[0].src,
    type: "product",
    alternates: { ru: `/product/${product.slug}`, en: `/product/${product.slug}` }
  })}
  <link rel="icon" href="/favsmall.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  ${jsonLdScripts(structuredData, breadcrumbs)}
  <style>
    /* ─── Design tokens (identical to catalog.js) ───────────── */
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

    html { scroll-behavior: smooth; background: #F7F7F6; }

    body {
      margin: 0; min-height: 100vh; overflow-x: hidden;
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

    /* ─── Navbar (identical to catalog.js) ──────────────────── */
    .navbar {
      position: sticky; top: 0; z-index: 200;
      display: flex; align-items: center; justify-content: space-between;
      height: 56px; padding: 0 24px;
      background: rgba(255,255,255,.6);
      border-bottom: 1px solid rgba(0,0,0,.05);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
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
    .nav-actions { display: flex; align-items: center; gap: 8px; }
    .icon-button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 50%;
      transition: color 220ms, transform 220ms, background 220ms;
      position: relative;
    }
    .icon-button svg { width: 20px; height: 20px; stroke: currentColor; }
    .icon-button:hover { color: var(--primary); background: rgba(255,255,255,.72); transform: translateY(-1px); }
    .mobile-only { display: none; }

${languageSwitcherStyles}

    /* Cart badge */
    .cart-badge {
      position: absolute; top: 2px; right: 2px;
      min-width: 16px; height: 16px; padding: 0 4px;
      background: var(--primary); color: #fff;
      font-size: 10px; font-weight: 700; line-height: 16px;
      border-radius: 999px; text-align: center;
      display: none;
    }
    .cart-badge.visible { display: block; }

    /* ─── Breadcrumb ─────────────────────────────────────────── */
    .breadcrumb {
      display: flex; align-items: center; gap: 6px;
      padding: 16px 0 0;
      font-size: 13px; color: var(--secondary-text);
    }
    .breadcrumb a { transition: color 180ms; }
    .breadcrumb a:hover { color: var(--text); }
    .breadcrumb-sep { opacity: .4; font-size: 11px; }
    .breadcrumb-current { color: var(--text); font-weight: 500;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px;
    }

    /* ─── Page layout ────────────────────────────────────────── */
    .page { min-height: 100vh; }
    .inner {
      width: min(calc(100% - 48px), var(--container));
      margin-inline: auto;
    }
    .product-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      padding: 24px 0 80px;
      align-items: start;
    }

    /* ─── Gallery column ─────────────────────────────────────── */
    .gallery { position: sticky; top: 72px; }

    .gallery-main {
      position: relative;
      background: var(--white);
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,.07);
      aspect-ratio: 1/1;
    }
    .gallery-main img {
      width: 100%; height: 100%;
      object-fit: cover; filter: contrast(1.06);
      transition: opacity 180ms ease;
    }
    .gallery-main img.switching { opacity: 0; }

    /* Nav arrows */
    .gallery-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(255,255,255,.88);
      display: inline-flex; align-items: center; justify-content: center;
      transition: opacity 200ms, transform 200ms;
      opacity: 0;
      z-index: 2;
    }
    .gallery-arrow svg { width: 20px; height: 20px; stroke: currentColor; }
    .gallery-arrow.prev { left: 12px; }
    .gallery-arrow.next { right: 12px; transform: translateY(-50%) rotate(180deg); }
    .gallery-main:hover .gallery-arrow { opacity: 1; }

    .gallery-thumbs {
      display: flex; gap: 10px; margin-top: 12px;
      overflow-x: auto; scrollbar-width: none;
    }
    .gallery-thumbs::-webkit-scrollbar { display: none; }
    .gallery-thumb {
      flex-shrink: 0; width: 72px; height: 72px;
      border-radius: 14px; overflow: hidden; cursor: pointer;
      border: 2px solid transparent;
      background: var(--white);
      box-shadow: 0 2px 8px rgba(0,0,0,.06);
      transition: border-color 180ms, transform 180ms;
    }
    .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-thumb:hover { transform: scale(1.04); }
    .gallery-thumb.active { border-color: var(--text); }

    /* ─── Info column ────────────────────────────────────────── */
    .product-info { display: flex; flex-direction: column; gap: 0; }

    .product-badge {
      display: inline-flex; align-items: center;
      padding: 4px 12px; border-radius: 999px;
      font-size: 11px; font-weight: 500; letter-spacing: .04em;
      background: rgba(0,0,0,.72); color: #fff;
      width: fit-content; margin-bottom: 12px;
    }

    .product-title {
      font-size: clamp(22px, 3vw, 32px);
      font-weight: 700; line-height: 1.15;
      margin: 0 0 16px; letter-spacing: -.02em;
    }

    .product-price-row {
      display: flex; align-items: baseline; gap: 10px;
      margin-bottom: 24px;
    }
    .product-price {
      font-size: clamp(24px, 3vw, 32px);
      font-weight: 700; letter-spacing: -.02em;
    }
    .product-compare {
      font-size: 16px; color: var(--secondary-text);
      text-decoration: line-through;
    }

    /* ─── Size selector ──────────────────────────────────────── */
    .size-section { margin-bottom: 24px; }
    .size-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px;
    }
    .size-label-text {
      font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: .08em;
    }
    .size-guide-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 500; color: var(--primary);
      cursor: pointer; transition: opacity 180ms;
    }
    .size-guide-link:hover { opacity: .7; }
    .size-guide-link svg { width: 13px; height: 13px; stroke: currentColor; }

    .size-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .sz {
      padding: 10px 20px; border-radius: 14px;
      border: 1.5px solid rgba(0,0,0,.12);
      font-size: 13px; font-weight: 500;
      background: var(--white); cursor: pointer;
      transition: border-color 160ms, background 160ms, color 160ms;
      user-select: none;
    }
    .sz:hover:not(.sz-oos) { border-color: var(--text); }
    .sz.sz-active {
      border-color: var(--text);
      background: var(--text); color: var(--white);
    }
    .sz.sz-oos {
      opacity: .38; pointer-events: none;
      text-decoration: line-through;
    }

    /* size guide panel */
    .sg-panel {
      display: none; margin-top: 16px; padding: 20px;
      border-radius: 18px; background: var(--background);
    }
    .sg-panel.open { display: block; }
    .sg-title { font-size: 13px; font-weight: 600; margin: 0 0 12px; }
    .sg-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .sg-table th {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: .06em; color: var(--secondary-text);
      padding: 6px 10px; text-align: left;
      border-bottom: 1px solid rgba(0,0,0,.08);
    }
    .sg-table td {
      padding: 9px 10px;
      border-bottom: 1px solid rgba(0,0,0,.05);
    }
    .sg-table tr:last-child td { border-bottom: 0; }

    /* ─── Actions ────────────────────────────────────────────── */
    .product-actions { display: flex; gap: 10px; margin-bottom: 28px; }
    .btn-cart {
      flex: 1; height: 56px; border-radius: 999px;
      background: var(--text); color: var(--white);
      font-size: 15px; font-weight: 600;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      transition: background 220ms, transform 120ms, opacity 220ms;
    }
    .btn-cart:hover { background: #2a2a2a; }
    .btn-cart:active { transform: scale(.97); }
    .btn-cart:disabled {
      background: rgba(0,0,0,.12);
      color: var(--secondary-text);
      cursor: not-allowed; pointer-events: none;
    }
    .btn-cart svg { width: 18px; height: 18px; stroke: currentColor; }
    .btn-cart.loading { opacity: .6; pointer-events: none; }
    .btn-cart.success { background: #27ae60; pointer-events: none; }

    .btn-fav {
      width: 56px; height: 56px; border-radius: 50%;
      border: 1.5px solid rgba(0,0,0,.12); background: var(--white);
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: border-color 180ms, color 180ms;
    }
    .btn-fav svg { width: 20px; height: 20px; stroke: currentColor; }
    .btn-fav:hover { color: var(--primary); border-color: var(--primary); }
    .btn-fav.on { color: var(--primary); border-color: var(--primary); }

    /* Size prompt */
    .size-prompt {
      font-size: 12px; color: var(--primary);
      margin: -16px 0 20px;
      display: none; align-items: center; gap: 4px;
    }
    .size-prompt.visible { display: flex; }

    /* ─── Description ────────────────────────────────────────── */
    .product-desc {
      font-size: 14px; color: var(--secondary-text);
      line-height: 1.7; margin: 0 0 28px;
      border-top: 1px solid rgba(0,0,0,.06);
      padding-top: 24px;
    }

    /* ─── Delivery info strip ────────────────────────────────── */
    .delivery-strip {
      display: flex; flex-direction: column; gap: 10px;
      padding: 20px; border-radius: 18px;
      background: var(--white);
      border: 0.5px solid rgba(0,0,0,.07);
      font-size: 13px;
    }
    .delivery-row {
      display: flex; align-items: center; gap: 10px;
      color: var(--secondary-text);
    }
    .delivery-row svg { width: 16px; height: 16px; stroke: currentColor; flex-shrink: 0; }
    .delivery-row strong { color: var(--text); font-weight: 500; }

    /* ─── Toast ──────────────────────────────────────────────── */
    .toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-radius: 999px;
      background: #111; color: #fff;
      font-size: 14px; font-weight: 500;
      z-index: 9999; white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 220ms, transform 220ms;
      transform: translateX(-50%) translateY(8px);
    }
    .toast.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }
    .toast svg { width: 16px; height: 16px; stroke: currentColor; flex-shrink: 0; }
    .toast-cart-link {
      margin-left: 6px; font-size: 13px; font-weight: 400;
      opacity: .7; text-decoration: underline; cursor: pointer; color: inherit;
    }
    .toast-cart-link:hover { opacity: 1; }

    /* ─── Drawer (cart) ──────────────────────────────────────── */
    .drawer-overlay {
      display: none; position: fixed; inset: 0; z-index: 400;
      background: rgba(0,0,0,.35);
    }
    .drawer-overlay.open { display: block; }
    .side-drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: min(400px, 92vw);
      background: var(--white);
      display: flex; flex-direction: column;
      animation: slideInRight 260ms cubic-bezier(.32,.72,0,1);
    }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .side-drawer--left { right: auto; left: 0; animation-name: slideInLeft; }
    @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
    .drawer-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(0,0,0,.06);
      flex-shrink: 0;
    }
    .drawer-title { font-size: 15px; font-weight: 700; }
    .drawer-close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(0,0,0,.05); transition: background 180ms;
    }
    .drawer-close svg { width: 16px; height: 16px; stroke: currentColor; }
    .drawer-close:hover { background: rgba(0,0,0,.1); }
    .drawer-body { flex: 1; overflow-y: auto; padding: 0; }
    .drawer-footer {
      flex-shrink: 0; padding: 20px 24px;
      border-top: 1px solid rgba(0,0,0,.06);
    }

    /* Cart items */
    .cart-item {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0,0,0,.05);
    }
    .cart-item-img {
      width: 64px; height: 64px; border-radius: 12px;
      overflow: hidden; flex-shrink: 0;
      background: var(--background);
    }
    .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
    .cart-item-body { flex: 1; min-width: 0; }
    .cart-item-title { font-size: 13px; font-weight: 500; margin: 0 0 3px; line-height: 1.3; }
    .cart-item-meta { font-size: 12px; color: var(--secondary-text); margin: 0; }
    .cart-item-price { font-size: 14px; font-weight: 600; white-space: nowrap; }
    .cart-item-remove {
      width: 28px; height: 28px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: var(--secondary-text);
      transition: background 160ms, color 160ms;
    }
    .cart-item-remove:hover { background: rgba(0,0,0,.06); color: var(--text); }
    .cart-item-remove svg { width: 14px; height: 14px; stroke: currentColor; }

    .cart-subtotal {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px; font-size: 14px;
    }
    .cart-subtotal-label { color: var(--secondary-text); }
    .cart-subtotal-value { font-size: 18px; font-weight: 700; }
    .btn-checkout {
      display: block; width: 100%; height: 52px;
      border-radius: 999px; background: var(--text); color: #fff;
      font-size: 15px; font-weight: 600; text-align: center;
      display: flex; align-items: center; justify-content: center;
      transition: background 200ms;
    }
    .btn-checkout:hover { background: var(--primary); }
    .drawer-empty {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 60px 24px; text-align: center;
      color: var(--secondary-text);
    }
    .drawer-empty svg { width: 40px; height: 40px; stroke: currentColor; opacity: .35; }
    .drawer-empty p { margin: 0; font-size: 14px; }
    .drawer-cta {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 12px 28px; border-radius: 999px;
      background: var(--text); color: #fff;
      font-size: 14px; font-weight: 600;
      transition: background 200ms;
    }
    .drawer-cta:hover { background: var(--primary); }

    /* ─── Payment modal ──────────────────────────────────────── */
    .payment-modal-overlay {
      display: none; position: fixed; inset: 0; z-index: 500;
      background: rgba(0,0,0,.45);
      align-items: center; justify-content: center; padding: 20px;
    }
    .payment-modal-overlay.open { display: flex; }
    .payment-modal {
      width: min(380px, 100%);
      background: var(--white); border-radius: 20px;
      padding: 28px 24px 24px;
      animation: popIn 220ms cubic-bezier(.32,.72,0,1);
      position: relative;
    }
    @keyframes popIn { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .payment-modal-close {
      position: absolute; top: 14px; right: 14px;
      width: 30px; height: 30px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,.05); transition: background 180ms;
    }
    .payment-modal-close svg { width: 14px; height: 14px; stroke: currentColor; }
    .payment-modal-close:hover { background: rgba(0,0,0,.1); }
    .payment-modal-title {
      font-size: 16px; font-weight: 700; margin: 0 0 10px; padding-right: 24px;
      line-height: 1.35;
    }
    .payment-modal-text {
      font-size: 14px; color: var(--secondary-text); line-height: 1.5; margin: 0 0 22px;
    }
    .payment-modal-cta {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; height: 52px; border-radius: 999px;
      background: #25D366; color: #fff;
      font-size: 15px; font-weight: 600;
      transition: background 200ms;
    }
    .payment-modal-cta:hover { background: #1ebe57; }
    .payment-modal-cta svg { width: 19px; height: 19px; flex-shrink: 0; }
    .mobile-nav {
      display: flex; flex-direction: column; padding: 12px 0; flex: 1;
    }
    .mobile-nav a {
      padding: 16px 24px; font-size: 20px; font-weight: 600;
      border-bottom: 1px solid rgba(0,0,0,.05);
      transition: color 180ms, padding-left 180ms;
    }
    .mobile-nav a:hover { color: var(--primary); padding-left: 32px; }
    .mobile-nav-footer { padding: 24px; flex-shrink: 0; }

    /* Search overlay */
    .search-overlay {
      display: none; position: fixed; inset: 0; z-index: 400;
      background: rgba(247,247,246,0.92);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      align-items: flex-start; justify-content: center; padding-top: 80px;
    }
    .search-overlay.open { display: flex; }
    .search-box { display: flex; align-items: center; gap: 12px; width: min(calc(100% - 48px), 600px); }
    #search-input {
      flex: 1; height: 52px; border-radius: 999px;
      border: 1.5px solid rgba(0,0,0,0.12); background: #fff;
      padding: 0 20px; font-size: 16px; font-family: inherit; outline: none;
      transition: border-color 180ms;
    }
    #search-input:focus { border-color: var(--primary); }
    .search-close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(0,0,0,.06); transition: background 180ms;
    }
    .search-close svg { width: 18px; height: 18px; stroke: currentColor; }
    .search-close:hover { background: rgba(0,0,0,.12); }

    /* ─── Footer ─────────────────────────────────────────────── */
    .site-footer {
      width: min(calc(100% - 48px), var(--container));
      margin: 0 auto; padding: 0 0 28px;
      color: var(--secondary-text); font-size: 13px; text-align: right;
    }

    /* ─── Responsive ─────────────────────────────────────────── */
    @media (max-width: 900px) {
      .navbar { padding: 0 16px; }
      .brand { width: 74px; min-width: 74px; }
      .desktop-nav, .desktop-only { display: none; }
      .mobile-only { display: inline-flex; }
      .inner { width: min(calc(100% - 32px), var(--container)); }
      .product-layout { grid-template-columns: 1fr; gap: 24px; padding-top: 16px; }
      .gallery { position: static; }
    }

    @media (max-width: 640px) {
      .inner { width: min(calc(100% - 24px), var(--container)); }
      .product-layout { gap: 16px; padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px)); }
      .product-title { font-size: 20px; margin-bottom: 12px; }
      .product-price { font-size: 22px; }
      .product-price-row { margin-bottom: 16px; }
      .size-section { margin-bottom: 16px; }
      .breadcrumb-current { max-width: 160px; }
    }

    @media (max-width: 480px) {
      .product-title { font-size: 20px; }
      .product-price { font-size: 22px; }
      .gallery-thumbs { gap: 8px; }
      .gallery-thumb { width: 58px; height: 58px; }
      .btn-cart { height: 52px; font-size: 14px; }
      .btn-fav { width: 52px; height: 52px; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition-duration: 1ms !important; animation-duration: 1ms !important; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Navbar -->
  <header class="navbar" aria-label="${tr.t("menu")}">
    <a class="brand" href="/" aria-label="${appConfig.domain || "Kokoc Store"}">
      <img src="/menu-logo.png" alt="Kokoc Store" />
    </a>
    <nav class="desktop-nav">
      <a href="/catalog?brand=crocs">Crocs</a>
      <a href="/adidas">Adidas</a>
      <a href="/catalog">${tr.t("navAllProducts")}</a>
      <a href="/collabs">${tr.t("navCollabs")}</a>
      <a href="/about">${tr.t("navAbout")}</a>
    </nav>
    <div class="nav-actions">
      ${langSwitcher}
      <button class="icon-button" id="search-btn" type="button" aria-label="${tr.t("search")}">${iconSearch}</button>
      <button class="icon-button desktop-only" type="button" id="fav-nav-btn" aria-label="${tr.t("wishlist")}">${iconHeart}</button>
      <button class="icon-button" type="button" id="cart-nav-btn" aria-label="${tr.t("cart")}">
        ${iconBag}
        <span class="cart-badge" id="cart-badge" aria-live="polite"></span>
      </button>
      <button class="icon-button mobile-only" type="button" id="menu-btn" aria-label="${tr.t("menu")}">${iconMenu}</button>
    </div>
  </header>

  <!-- Search overlay -->
  <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("search")}">
    <div class="search-box">
      <input type="search" id="search-input" placeholder="${tr.t("searchPlaceholder")}" autocomplete="off" />
      <button class="search-close" type="button" id="search-close" aria-label="${tr.t("closeSearch")}">${iconClose}</button>
    </div>
  </div>

  <!-- Cart drawer -->
  <div class="drawer-overlay" id="cart-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("cart")}">
    <div class="side-drawer" id="cart-drawer">
      <div class="drawer-head">
        <span class="drawer-title">${tr.t("cart")}</span>
        <button class="drawer-close" type="button" id="cart-close" aria-label="${tr.t("closeCart")}">${iconClose}</button>
      </div>
      <div class="drawer-body" id="cart-body">
        <div class="drawer-empty">
          ${iconBag}
          <p>${tr.t("emptyCart")}</p>
          <a href="/catalog" class="drawer-cta">${tr.t("browseShop")}</a>
        </div>
      </div>
      <div class="drawer-footer" id="cart-footer" style="display:none;">
        <div class="cart-subtotal">
          <span class="cart-subtotal-label">${tr.t("subtotal")}</span>
          <span class="cart-subtotal-value" id="cart-total">0 ₽</span>
        </div>
        <button type="button" id="checkout-btn" class="btn-checkout">${tr.t("checkout")}</button>
      </div>
    </div>
  </div>

  <!-- Payment-in-progress modal -->
  <div class="payment-modal-overlay" id="payment-modal-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("paymentModalTitle")}">
    <div class="payment-modal">
      <button class="payment-modal-close" type="button" id="payment-modal-close" aria-label="${tr.t("paymentModalClose")}">${iconClose}</button>
      <p class="payment-modal-title">${tr.t("paymentModalTitle")}</p>
      <p class="payment-modal-text">${tr.t("paymentModalText")}</p>
      ${waHref ? `
      <a href="${waHref}" class="payment-modal-cta" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        ${tr.t("paymentModalCta")}
      </a>
      ` : `
      <p class="payment-modal-text" style="margin-bottom:0;">${tr.t("paymentModalNoNumber")}</p>
      `}
    </div>
  </div>

  <!-- Mobile menu drawer -->
  <div class="drawer-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("menu")}">
    <div class="side-drawer side-drawer--left" id="menu-drawer">
      <div class="drawer-head">
        <span class="drawer-title">${tr.t("menu")}</span>
        <button class="drawer-close" type="button" id="menu-close" aria-label="${tr.t("closeMenu")}">${iconClose}</button>
      </div>
      <nav class="mobile-nav">
        <a href="/catalog?brand=crocs">Crocs</a>
        <a href="/adidas">Adidas</a>
        <a href="/catalog">${tr.t("navAllProducts")}</a>
        <a href="/collabs">${tr.t("navCollabs")}</a>
        <a href="/about">${tr.t("navAbout")}</a>
      </nav>
      <div class="mobile-nav-footer">
        <a href="/catalog" class="drawer-cta">${tr.t("shopNow")}</a>
      </div>
    </div>
  </div>

  <main>
    <div class="inner">

      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="${tr.t("breadcrumb")}">
        <a href="/">${tr.t("home")}</a>
        <span class="breadcrumb-sep">›</span>
        <a href="/catalog">${tr.t("navShop")}</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">${title}</span>
      </nav>

      <div class="product-layout">

        <!-- Gallery -->
        <div class="gallery" id="gallery">
          <div class="gallery-main" id="gallery-main">
            <img
              src="${escHtml(images[0].src)}"
              alt="${escHtml(images[0].alt)}"
              id="gallery-active-img"
              width="800" height="800"
            />
            ${images.length > 1 ? `
            <button class="gallery-arrow prev" id="gallery-prev" aria-label="${tr.t("prevPhoto")}">${iconChevL}</button>
            <button class="gallery-arrow next" id="gallery-next" aria-label="${tr.t("nextPhoto")}">${iconChevL}</button>
            ` : ""}
          </div>
          ${images.length > 1 ? `
          <div class="gallery-thumbs" id="gallery-thumbs" role="list">
            ${images.map((img, i) => `
              <button class="gallery-thumb${i === 0 ? " active" : ""}"
                data-idx="${i}" role="listitem"
                aria-label="${tr.t("photo")} ${i + 1}" aria-pressed="${i === 0 ? "true" : "false"}">
                <img src="${escHtml(img.src)}" alt="${escHtml(img.alt)}" loading="lazy" />
              </button>`).join("")}
          </div>
          ` : ""}
        </div>

        <!-- Product info -->
        <div class="product-info">
          ${badgeLabel ? `<div class="product-badge">${badgeLabel}</div>` : ""}
          <h1 class="product-title">${title}</h1>

          <div class="product-price-row">
            ${comparePrice ? `<span class="product-compare">${escHtml(comparePrice)}</span>` : ""}
            <span class="product-price" id="product-price">${displayPrice ? escHtml(displayPrice) : tr.t("outOfStock")}</span>
          </div>

          <!-- Size selector -->
          ${variants.length > 0 ? `
          <div class="size-section">
            <div class="size-header">
              <span class="size-label-text">${tr.t("size")}</span>
              <button class="size-guide-link" id="sg-toggle" type="button" aria-expanded="false">
                ${iconRuler} ${tr.t("sizeGuide")}
              </button>
            </div>
            <div class="size-chips" id="size-chips" role="group" aria-label="${tr.t("chooseSize")}">
              ${variants.map(v => `
                <button
                  class="sz${v.inStock ? "" : " sz-oos"}"
                  data-variant-id="${escHtml(String(v.id))}"
                  data-price="${escHtml(v.price || "")}"
                  data-price-minor="${v.priceMinor || 0}"
                  data-compare="${escHtml(v.comparePrice || "")}"
                  data-in-stock="${v.inStock ? "1" : "0"}"
                  ${v.inStock ? "" : "disabled aria-disabled=\"true\""}
                  aria-label="${escHtml(v.crocsSize || v.sizeLabel || v.title)}${v.inStock ? "" : ` - ${tr.t("outOfStock")}`}"
                >${escHtml(v.crocsSize || v.sizeLabel || v.title)}</button>
              `).join("")}
            </div>
            <div class="sg-panel" id="sg-panel">
              <p class="sg-title">${sizeGuideTitle}</p>
              <table class="sg-table" aria-label="${tr.t("sizeGuide")}">
                <thead>
                  <tr>${sizeGuideHeadCols.map(h => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${isAdidas
                    ? sizeGuide.map(([us, uk, eu, cm]) => `
                      <tr><td>${us}</td><td>${uk}</td><td>${eu}</td><td>${cm} cm</td></tr>
                    `).join("")
                    : sizeGuide.map(([cs, eu, cm]) => `
                      <tr><td>${cs}</td><td>${eu}</td><td>${cm} cm</td></tr>
                    `).join("")}
                </tbody>
              </table>
            </div>
          </div>
          ` : ""}

          <!-- Size prompt (shown when clicking Add without size) -->
          <p class="size-prompt" id="size-prompt" role="alert">
            ${iconRuler} ${tr.t("chooseSize")}
          </p>

          <!-- Actions -->
          <div class="product-actions">
            <button class="btn-cart" id="add-to-cart-btn" type="button"
              ${variants.length > 0 ? "disabled" : ""}
            >
              ${iconBag}
              <span id="add-btn-text">${variants.length > 0 ? tr.t("addToCart") : tr.t("outOfStock")}</span>
            </button>
            <button class="btn-fav" id="fav-btn" type="button" aria-label="${tr.t("addToWishlist")}">${iconHeart}</button>
          </div>

          <!-- Description -->
          ${product.description ? `
          <p class="product-desc">${description}</p>
          ` : ""}

          <!-- Delivery info -->
          <div class="delivery-strip">
            <div class="delivery-row">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span><strong>${tr.t("deliveryTitle")}</strong> ${tr.t("deliveryText")}</span>
            </div>
            <div class="delivery-row">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span><strong>${tr.t("pickupTitle")}</strong> ${tr.t("pickupText")}</span>
            </div>
            <div class="delivery-row">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18M3 15h18M3 3h18M3 21h18"/></svg>
              <span><strong>${tr.t("paymentTitle")}</strong> ${tr.t("paymentText")}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>

  <footer class="site-footer">© ${new Date().getFullYear()} ${appConfig.siteName || "Kokoc Store"}</footer>
</div>

<!-- Toast -->
<div class="toast" id="toast" role="status" aria-live="polite">
  ${iconCheck}
  <span id="toast-text">${tr.t("addedToCart")}</span>
  <button class="toast-cart-link" id="toast-cart-link" type="button">${tr.t("cart")} →</button>
</div>

<script>
/* ── Product data (SSR-injected) ──────────────────────────── */
const PRODUCT = ${productJson};
const SIZE_GUIDE = ${sizeGuideJson};
const UI = ${uiJson};
${languageSwitcherScript}

/* ── Cart state ───────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem("kokoc_cart") || '{"items":[]}');
function saveCart() { localStorage.setItem("kokoc_cart", JSON.stringify(cart)); }
function getCartCount() { return cart.items.reduce((s, i) => s + i.qty, 0); }
function getCartTotal() { return cart.items.reduce((s, i) => s + i.priceMinor * i.qty, 0); }

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  const count = getCartCount();
  if (!badge) return;
  badge.textContent = count;
  badge.classList.toggle("visible", count > 0);
}

/* ── Render cart drawer ───────────────────────────────────── */
function renderCartDrawer() {
  const body   = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  const totalEl = document.getElementById("cart-total");
  if (!body) return;

  if (!cart.items.length) {
    body.innerHTML = '<div class="drawer-empty">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"/><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"/></svg>' +
      '<p>' + UI.emptyCart + '</p>' +
      '<a href="/catalog" class="drawer-cta">' + UI.browseShop + '</a>' +
      '</div>';
    if (footer) footer.style.display = "none";
    return;
  }

  const fmt = (minor) => new Intl.NumberFormat(UI.locale === "en" ? "en-US" : "ru-RU", {
    style: "currency", currency: "RUB", minimumFractionDigits: 0
  }).format(minor / 100);

  body.innerHTML = cart.items.map((item, idx) => \`
    <div class="cart-item" data-idx="\${idx}">
      <div class="cart-item-img">
        <img src="\${item.image}" alt="\${item.title}" loading="lazy" />
      </div>
      <div class="cart-item-body">
        <p class="cart-item-title">\${item.title}</p>
        <p class="cart-item-meta">\${UI.sizeMeta} \${item.sizeLabel}</p>
      </div>
      <span class="cart-item-price">\${fmt(item.priceMinor)}</span>
      <button class="cart-item-remove" data-idx="\${idx}" aria-label="\${UI.removeFromCart}">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  \`).join("");

  body.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.items.splice(+btn.dataset.idx, 1);
      saveCart(); updateCartBadge(); renderCartDrawer();
    });
  });

  if (totalEl) totalEl.textContent = fmt(getCartTotal());
  if (footer) footer.style.display = "";
}

/* ── Favourites ───────────────────────────────────────────── */
const favs = new Set(JSON.parse(localStorage.getItem("kokoc_favs") || "[]"));
function saveFavs() { localStorage.setItem("kokoc_favs", JSON.stringify([...favs])); }
const favBtn = document.getElementById("fav-btn");
if (favBtn) {
  favBtn.classList.toggle("on", favs.has(PRODUCT.slug));
  favBtn.addEventListener("click", () => {
    favs.has(PRODUCT.slug) ? favs.delete(PRODUCT.slug) : favs.add(PRODUCT.slug);
    saveFavs();
    favBtn.classList.toggle("on", favs.has(PRODUCT.slug));
  });
}

/* ── Gallery ──────────────────────────────────────────────── */
const images = PRODUCT.images?.length
  ? PRODUCT.images
  : [{ src: "${escHtml(images[0].src)}", alt: PRODUCT.title }];
let currentImg = 0;

function switchImage(idx) {
  if (idx < 0) idx = images.length - 1;
  if (idx >= images.length) idx = 0;
  currentImg = idx;

  const activeImg = document.getElementById("gallery-active-img");
  if (activeImg) {
    activeImg.classList.add("switching");
    setTimeout(() => {
      activeImg.src = images[idx].src;
      activeImg.alt = images[idx].alt;
      activeImg.classList.remove("switching");
    }, 100);
  }
  document.querySelectorAll(".gallery-thumb").forEach((t, i) => {
    t.classList.toggle("active", i === idx);
    t.setAttribute("aria-pressed", i === idx ? "true" : "false");
  });
}

document.querySelectorAll(".gallery-thumb").forEach(btn => {
  btn.addEventListener("click", () => switchImage(+btn.dataset.idx));
});
document.getElementById("gallery-prev")?.addEventListener("click", () => switchImage(currentImg - 1));
document.getElementById("gallery-next")?.addEventListener("click", () => switchImage(currentImg + 1));

/* Touch swipe on gallery */
(function() {
  const el = document.getElementById("gallery-main");
  if (!el || images.length < 2) return;
  let startX = 0;
  el.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) switchImage(dx < 0 ? currentImg + 1 : currentImg - 1);
  });
})();

/* ── Size selection ───────────────────────────────────────── */
let selectedVariantId = null;
let selectedSizeLabel = null;
let selectedPriceMinor = null;

document.querySelectorAll(".sz:not(.sz-oos)").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sz").forEach(b => b.classList.remove("sz-active"));
    btn.classList.add("sz-active");
    selectedVariantId  = btn.dataset.variantId;
    selectedSizeLabel  = btn.textContent.trim();
    selectedPriceMinor = parseInt(btn.dataset.priceMinor, 10);

    /* Update price display */
    const priceEl = document.getElementById("product-price");
    if (priceEl && btn.dataset.price) priceEl.textContent = btn.dataset.price;

    /* Hide size prompt */
    document.getElementById("size-prompt")?.classList.remove("visible");

    /* Enable cart button */
    const addBtn = document.getElementById("add-to-cart-btn");
    if (addBtn) addBtn.disabled = false;
  });
});

/* Size guide toggle */
const sgToggle = document.getElementById("sg-toggle");
const sgPanel  = document.getElementById("sg-panel");
sgToggle?.addEventListener("click", () => {
  const open = sgPanel.classList.toggle("open");
  sgToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

/* ── Add to cart ──────────────────────────────────────────── */
const addBtn = document.getElementById("add-to-cart-btn");
addBtn?.addEventListener("click", () => {
  /* Must select a size if variants exist — button should already be disabled, but guard anyway */
  if (PRODUCT.variants?.length && !selectedVariantId) {
    document.getElementById("size-prompt")?.classList.add("visible");
    document.getElementById("size-chips")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  /* Fix #8: never write null variantId to cart */
  if (!selectedVariantId && PRODUCT.variants?.length) return;

  const image = PRODUCT.images?.[0]?.src || "/crops/product-placeholder.png";
  const existing = cart.items.find(i => i.variantId === selectedVariantId);
  if (existing) {
    existing.qty++;
  } else {
    cart.items.push({
      variantId:  selectedVariantId,
      productId:  PRODUCT.id,
      title:      PRODUCT.title,
      sizeLabel:  selectedSizeLabel || "—",
      priceMinor: selectedPriceMinor || 0,
      image,
      qty: 1,
    });
  }
  saveCart(); updateCartBadge(); renderCartDrawer();

  /* Button feedback */
  const btnText = document.getElementById("add-btn-text");
  if (btnText) {
    addBtn.classList.add("success");
    btnText.textContent = UI.addedCheck;
    setTimeout(() => {
      addBtn.classList.remove("success");
      btnText.textContent = UI.addToCart;
    }, 2000);
  }

  /* Toast */
  showToast(UI.addedToCart + " · " + UI.sizeMeta.toLowerCase() + " " + (selectedSizeLabel || ""));
});

/* ── Toast ────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const toast  = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  if (!toast) return;
  if (toastText) toastText.textContent = msg;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}
document.getElementById("toast-cart-link")?.addEventListener("click", () => {
  document.getElementById("toast")?.classList.remove("visible");
  openCartDrawer();
});

/* ── Cart drawer ──────────────────────────────────────────── */
function openCartDrawer() {
  renderCartDrawer();
  document.getElementById("cart-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCartDrawer() {
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("cart-nav-btn")?.addEventListener("click", openCartDrawer);
document.getElementById("cart-close")?.addEventListener("click", closeCartDrawer);
document.getElementById("cart-overlay")?.addEventListener("click", e => {
  if (e.target === document.getElementById("cart-overlay")) closeCartDrawer();
});

/* ── Payment-in-progress modal ───────────────────────────────── */
function openPaymentModal() {
  document.getElementById("payment-modal-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closePaymentModal() {
  document.getElementById("payment-modal-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("checkout-btn")?.addEventListener("click", openPaymentModal);
document.getElementById("payment-modal-close")?.addEventListener("click", closePaymentModal);
document.getElementById("payment-modal-overlay")?.addEventListener("click", e => {
  if (e.target === document.getElementById("payment-modal-overlay")) closePaymentModal();
});

/* ── Search ───────────────────────────────────────────────── */
const searchOverlay = document.getElementById("search-overlay");
document.getElementById("search-btn")?.addEventListener("click", () => {
  searchOverlay?.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("search-input")?.focus(), 50);
});
document.getElementById("search-close")?.addEventListener("click", () => {
  searchOverlay?.classList.remove("open");
  document.body.style.overflow = "";
});
document.getElementById("search-input")?.addEventListener("keydown", e => {
  if (e.key === "Escape") { searchOverlay?.classList.remove("open"); document.body.style.overflow = ""; }
  if (e.key === "Enter") {
    const q = e.target.value.trim();
    if (q) window.location.href = "/catalog?q=" + encodeURIComponent(q);
  }
});

/* ── Mobile menu ──────────────────────────────────────────── */
document.getElementById("menu-btn")?.addEventListener("click", () => {
  document.getElementById("menu-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
});
document.getElementById("menu-close")?.addEventListener("click", () => {
  document.getElementById("menu-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
});
document.getElementById("menu-overlay")?.addEventListener("click", e => {
  if (e.target === document.getElementById("menu-overlay")) {
    document.getElementById("menu-overlay").classList.remove("open");
    document.body.style.overflow = "";
  }
});

/* ── Global Escape ────────────────────────────────────────── */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  searchOverlay?.classList.remove("open");
  closeCartDrawer();
  closePaymentModal();
  document.getElementById("menu-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
});

/* ── Init ─────────────────────────────────────────────────── */
updateCartBadge();
</script>
</body>
</html>`;
}
