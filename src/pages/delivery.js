import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead, breadcrumbJsonLd, jsonLdScripts } from "../lib/seo.js";

export function renderDeliveryPage(appConfig, locale = "ru") {
  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);
  const isRu = locale === "ru";

  const iconSearch = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"></circle><path d="m20 20-4.45-4.45"></path></svg>`;
  const iconHeart  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.2 4.85 13.55a4.7 4.7 0 0 1 6.65-6.65l.5.5.5-.5a4.7 4.7 0 1 1 6.65 6.65L12 20.2Z"></path></svg>`;
  const iconBag    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"></path><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"></path></svg>`;
  const iconMenu   = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>`;
  const iconTruck  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1.5"/><path d="M16 8h4l3 5v3h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
  const iconPin    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
  const iconBox    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
  const iconClock  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`;
  const iconCheck  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

  const heroTitle    = isRu ? "Доставка" : "Delivery";
  const heroSubtitle = isRu ? "Курьер СДЭК привезёт прямо до двери" : "CDEK courier delivers straight to your door";
  const infoTitle    = isRu ? "Как мы доставляем" : "How we deliver";

  const steps = isRu ? [
    { n: "01", icon: iconBox,   t: "Заказ обрабатывается", s: "1–3 дня после оплаты" },
    { n: "02", icon: iconTruck, t: "Отправка СДЭК",        s: "Трек-номер на почту" },
    { n: "03", icon: iconClock, t: "Курьер в пути",        s: "14–21 дней по России" },
    { n: "04", icon: iconCheck, t: "Доставка до двери",    s: "Звонок перед приездом" },
  ] : [
    { n: "01", icon: iconBox,   t: "Order processed",      s: "1–3 days after payment" },
    { n: "02", icon: iconTruck, t: "Shipped via CDEK",     s: "Tracking number by email" },
    { n: "03", icon: iconClock, t: "Courier en route",     s: "14–21 days across Russia" },
    { n: "04", icon: iconCheck, t: "Delivered to door",    s: "Call before arrival" },
  ];

  const faqs = isRu ? [
    { q: "Сколько стоит доставка?",              a: "Стоимость рассчитывается по тарифам СДЭК и зависит от веса посылки и расстояния. В среднем 300–700 ₽." },
    { q: "Как скоро приедет курьер?",            a: "Срок доставки — 14–21 рабочих дней в зависимости от региона. Курьер позвонит за 30–60 минут до приезда." },
    { q: "Можно ли изменить адрес доставки?",   a: "Да, до момента отправки посылки. Напиши нам в WhatsApp или Telegram." },
    { q: "Что делать, если меня не будет дома?", a: "Уточни у курьера удобное время для повторной доставки. Обычно делается до трёх попыток." },
  ] : [
    { q: "How much does delivery cost?",         a: "Cost is calculated by CDEK tariffs based on parcel weight and distance. Usually 300–700 ₽." },
    { q: "When will the courier arrive?",        a: "Delivery takes 14–21 business days depending on the region. The courier will call 30–60 minutes before arrival." },
    { q: "Can I change my delivery address?",    a: "Yes, before shipment. Message us on WhatsApp or Telegram." },
    { q: "What if I'm not home?",                a: "Arrange a convenient time for re-delivery with the courier. Usually up to three attempts are made." },
  ];

  const faqTitle = isRu ? "Вопросы о доставке" : "Delivery FAQ";

  return `<!DOCTYPE html>
<html lang="${tr.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    ${renderSeoHead({
      appConfig,
      title: `${heroTitle} — Kokoc Store`,
      description: tr.t("deliverySeoDescription"),
      path: "/delivery",
      locale: tr.locale,
      alternates: { ru: "/delivery", en: "/delivery" }
    })}
    ${jsonLdScripts(breadcrumbJsonLd(appConfig, [
      { name: tr.t("home"), path: "/" },
      { name: heroTitle, path: "/delivery" }
    ]))}
    <meta name="theme-color" content="#F7F7F6" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favsmall.png" />
    <link rel="icon" type="image/jpeg" sizes="720x720" href="/favbig.jpg" />
    <link rel="apple-touch-icon" href="/favbig.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        --background: #F7F7F6;
        --primary: #FF6B9A;
        --text: #111;
        --secondary-text: #888;
        --white: #FFFFFF;
        --shadow-default: 0 8px 24px rgba(0,0,0,0.06);
        --shadow-hover: 0 16px 40px rgba(0,0,0,0.12);
        --container: 1180px;
        --cdek-green: #00b33c;
      }
      * { box-sizing: border-box; }
      html {
        scroll-behavior: smooth;
        background: radial-gradient(circle at 50% 0%, rgba(255,240,245,0.4), transparent 60%), #F7F7F6;
      }
      body {
        margin: 0; min-height: 100vh; overflow-x: hidden;
        background: radial-gradient(circle at 50% 0%, rgba(255,240,245,0.4), transparent 60%), #F7F7F6;
        color: var(--text);
        font-family: "Manrope", "Segoe UI", Arial, sans-serif;
      }
      a { color: inherit; text-decoration: none; }
      button, input { font: inherit; }
      button { border: 0; padding: 0; color: inherit; background: none; cursor: pointer; }
      img { display: block; max-width: 100%; }

      /* ── Navbar ── */
      .navbar {
        position: sticky; top: 0; z-index: 100;
        display: flex; align-items: center; justify-content: space-between;
        height: 56px; padding: 0 24px;
        background: rgba(255,255,255,0.6);
        border-bottom: 1px solid rgba(0,0,0,0.05);
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      }
      .brand { display: inline-flex; align-items: center; width: 82px; min-width: 82px; }
      .brand img { width: 100%; height: auto; }
      .desktop-nav {
        position: absolute; left: 50%;
        display: flex; align-items: center; justify-content: center;
        gap: 20px; transform: translateX(-50%);
        white-space: nowrap;
      }
      .desktop-nav a { color: var(--text); font-size: 13px; font-weight: 600; line-height: 1; transition: color 220ms, transform 220ms; }
      .desktop-nav a:hover { color: var(--primary); transform: translateY(-1px); }
      .desktop-nav a.active { color: var(--primary); }
      .nav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
      .icon-button {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 36px; border-radius: 50%;
        transition: color 220ms, transform 220ms, background 220ms;
      }
      .icon-button svg { width: 20px; height: 20px; stroke: currentColor; }
      .icon-button:hover { color: var(--primary); background: rgba(255,255,255,0.72); transform: translateY(-1px); }
      .mobile-only { display: none; }

${languageSwitcherStyles}

      /* ── Layout ── */
      .page { min-height: 100vh; }
      .wrap { width: min(calc(100% - 48px), var(--container)); margin-inline: auto; }

      /* ── Hero ── */
      .delivery-hero {
        position: relative; overflow: hidden;
        border-radius: 0 0 32px 32px;
        margin-bottom: 56px;
        background: var(--primary);
        min-height: 180px;
        display: flex; align-items: center;
      }
      .delivery-hero__content {
        position: relative; z-index: 1;
        display: flex; flex-direction: column; justify-content: center;
        min-height: 180px; padding: 40px 48px;
      }
      .delivery-hero__eyebrow {
        display: inline-flex; align-items: center; gap: 8px;
        color: rgba(255,255,255,0.75); font-size: 12px; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px;
      }
      .delivery-hero__eyebrow svg { width: 16px; height: 16px; stroke: currentColor; }
      .delivery-hero__title {
        margin: 0 0 6px; color: #fff;
        font-size: clamp(32px, 5vw, 58px);
        font-weight: 800; line-height: 1; letter-spacing: -0.02em;
      }
      .delivery-hero__sub { margin: 0; color: rgba(255,255,255,0.8); font-size: clamp(13px, 1.6vw, 16px); }

      /* ── Courier info section ── */
      .courier-section { margin-bottom: 56px; }
      .section-heading { margin: 0 0 8px; font-size: clamp(26px, 3vw, 36px); font-weight: 700; }
      .section-sub { margin: 0 0 28px; color: var(--secondary-text); font-size: 14px; }

      .courier-info-grid {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 16px; margin-bottom: 16px;
      }
      .courier-info-card {
        background: #fff; border-radius: 20px; padding: 28px 24px;
        box-shadow: var(--shadow-default);
        display: flex; flex-direction: column; gap: 12px;
      }
      .courier-info-card__icon {
        width: 44px; height: 44px; border-radius: 14px;
        background: rgba(255,107,154,0.08);
        display: flex; align-items: center; justify-content: center;
        color: var(--primary); flex-shrink: 0;
      }
      .courier-info-card__icon svg { width: 22px; height: 22px; stroke: currentColor; }
      .courier-info-card__title { font-size: 16px; font-weight: 700; margin: 0; }
      .courier-info-card__text { font-size: 13px; color: var(--secondary-text); margin: 0; line-height: 1.6; }

      /* ── Hint below map ── */
      .map-hint { margin-top: 4px; }
      .cdek-badge {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 18px; border-radius: 14px;
        background: rgba(0,179,60,0.06);
        border: 1px solid rgba(0,179,60,0.18);
      }
      .cdek-badge__logo {
        font-size: 15px; font-weight: 900; color: var(--cdek-green);
        letter-spacing: -0.03em; line-height: 1; flex-shrink: 0;
      }
      .cdek-badge__text { font-size: 13px; color: var(--secondary-text); line-height: 1.5; }

      /* ── Steps ── */
      .steps-section { margin-bottom: 56px; }
      .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
      .step-card { background: #fff; border-radius: 20px; padding: 24px 20px; box-shadow: var(--shadow-default); }
      .step-number { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--primary); margin-bottom: 16px; }
      .step-icon {
        width: 40px; height: 40px; border-radius: 12px;
        background: rgba(255,107,154,0.08);
        display: flex; align-items: center; justify-content: center;
        color: var(--primary); margin-bottom: 14px;
      }
      .step-icon svg { width: 20px; height: 20px; stroke: currentColor; }
      .step-title { font-size: 16px; font-weight: 700; margin: 0 0 6px; }
      .step-text { font-size: 13px; color: var(--secondary-text); margin: 0; line-height: 1.5; }

      /* ── FAQ ── */
      .faq-section { margin-bottom: 72px; }
      .faq-list { display: flex; flex-direction: column; gap: 10px; }
      .faq-item { background: #fff; border-radius: 16px; box-shadow: var(--shadow-default); overflow: hidden; }
      .faq-question {
        width: 100%; display: flex; align-items: center; justify-content: space-between;
        gap: 16px; padding: 18px 22px;
        font-size: 15px; font-weight: 600; text-align: left;
        background: none; border: none; cursor: pointer; transition: color 200ms;
      }
      .faq-question:hover { color: var(--primary); }
      .faq-arrow { flex-shrink: 0; width: 20px; height: 20px; stroke: currentColor; transition: transform 250ms; }
      .faq-item.open .faq-arrow { transform: rotate(180deg); }
      .faq-answer {
        max-height: 0; overflow: hidden; padding: 0 22px;
        color: var(--secondary-text); font-size: 14px; line-height: 1.6;
        transition: max-height 300ms ease, padding 300ms ease;
      }
      .faq-item.open .faq-answer { max-height: 200px; padding: 0 22px 18px; }

      /* ── Footer ── */
      .site-footer {
        width: min(calc(100% - 48px), var(--container));
        margin: 0 auto; padding: 0 0 calc(28px + env(safe-area-inset-bottom, 0px));
        color: var(--secondary-text); font-size: 13px; text-align: right;
      }
      .footer-sep { margin: 0 8px; opacity: 0.4; }
      .footer-credit { color: inherit; opacity: 0.45; text-decoration: none; font-size: inherit; letter-spacing: 0.04em; }
      .footer-credit:hover { opacity: 0.75; }

      /* ── Drawers ── */
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
        padding: 0 20px; font-size: 16px; font-family: inherit; outline: none; transition: border-color 180ms;
      }
      #search-input:focus { border-color: var(--primary); }
      .search-close {
        display: inline-flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(0,0,0,0.06); border: none; cursor: pointer; flex-shrink: 0; transition: background 180ms;
      }
      .search-close svg { width: 18px; height: 18px; stroke: currentColor; }
      .search-close:hover { background: rgba(0,0,0,0.12); }
      .drawer-overlay { display: none; position: fixed; inset: 0; z-index: 400; background: rgba(0,0,0,0.35); }
      .drawer-overlay.open { display: block; }
      .side-drawer {
        position: absolute; top: 0; right: 0; bottom: 0;
        width: min(380px, 90vw); background: var(--white, #fff);
        display: flex; flex-direction: column;
        animation: slideInRight 260ms cubic-bezier(.32,.72,0,1);
      }
      .side-drawer--left { right: auto; left: 0; animation-name: slideInLeft; }
      @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes slideInLeft  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .drawer-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 24px; border-bottom: 1px solid rgba(0,0,0,0.06); flex-shrink: 0;
      }
      .drawer-title { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
      .drawer-close {
        display: inline-flex; align-items: center; justify-content: center;
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(0,0,0,0.05); border: none; cursor: pointer; transition: background 180ms;
      }
      .drawer-close svg { width: 16px; height: 16px; stroke: currentColor; }
      .drawer-close:hover { background: rgba(0,0,0,0.1); }
      .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
      .drawer-empty {
        display: flex; flex-direction: column; align-items: center;
        gap: 12px; padding: 48px 0; text-align: center; color: var(--secondary-text, #888);
      }
      .drawer-empty svg { width: 40px; height: 40px; stroke: currentColor; opacity: .4; }
      .drawer-empty p { margin: 0; font-size: 14px; }
      .drawer-cta {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 12px 28px; border-radius: 999px;
        background: var(--text, #111); color: #fff;
        font-size: 14px; font-weight: 600; text-decoration: none; transition: background 200ms;
      }
      .drawer-cta:hover { background: var(--primary, #FF6B9A); }
      .mobile-nav { display: flex; flex-direction: column; padding: 12px 0; flex: 1; }
      .mobile-nav a {
        padding: 16px 24px; font-size: 20px; font-weight: 600;
        color: var(--text, #111); text-decoration: none;
        border-bottom: 1px solid rgba(0,0,0,0.05); transition: color 180ms, padding-left 180ms;
      }
      .mobile-nav a:hover, .mobile-nav a.active { color: var(--primary, #FF6B9A); padding-left: 32px; }
      .mobile-nav-footer { padding: 24px; flex-shrink: 0; }

      /* ── Responsive ── */
      @media (max-width: 900px) {
        .navbar { padding: 0 16px; }
        .brand { width: 74px; min-width: 74px; }
        .desktop-nav, .desktop-only { display: none; }
        .mobile-only { display: inline-flex; }
        .courier-info-grid { grid-template-columns: 1fr; }
        .steps-grid { grid-template-columns: repeat(2, 1fr); }
        .delivery-hero__content { padding: 32px 24px; }
      }
      @media (max-width: 600px) {
        .navbar { padding: 0 12px; }
        .delivery-hero { border-radius: 0 0 24px 24px; margin-bottom: 40px; }
        .delivery-hero__content { padding: 24px 16px; }
        .steps-grid { grid-template-columns: 1fr; }
        .wrap { width: calc(100% - 24px); }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 1ms !important; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <main>

        <!-- Navbar -->
        <header class="navbar" aria-label="${tr.t("menu")}">
          <a class="brand" href="/" aria-label="${appConfig.domain}">
            <img src="/menu-logo.png" alt="Kokoc Store" />
          </a>
          <nav class="desktop-nav">
            <a href="/catalog?brand=crocs">Crocs</a>
            <a href="/adidas">Adidas</a>
            <a href="/catalog">${tr.t("navShop")}</a>
            <a href="/collabs">${tr.t("navCollabs")}</a>
            <a href="/delivery" class="active">${heroTitle}</a>
            <a href="/about">${tr.t("navAbout")}</a>
          </nav>
          <div class="nav-actions">
            ${langSwitcher}
            <button class="icon-button" type="button" aria-label="${tr.t("search")}">${iconSearch}</button>
            <button class="icon-button desktop-only" type="button" aria-label="${tr.t("wishlist")}">${iconHeart}</button>
            <button class="icon-button" type="button" aria-label="${tr.t("cart")}">${iconBag}</button>
            <button class="icon-button mobile-only" type="button" aria-label="${tr.t("menu")}">${iconMenu}</button>
          </div>
        </header>

        <!-- Search overlay -->
        <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("search")}">
          <div class="search-box">
            <input type="search" id="search-input" placeholder="${tr.t("searchPlaceholder")}" autocomplete="off" />
            <button class="search-close" type="button" id="search-close" aria-label="${tr.t("closeSearch")}">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Cart drawer -->
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

        <!-- Mobile menu drawer -->
        <div class="drawer-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("menu")}">
          <div class="side-drawer side-drawer--left" id="menu-drawer">
            <div class="drawer-head">
              <span class="drawer-title">${tr.t("menu")}</span>
              <button class="drawer-close" type="button" id="menu-close" aria-label="${tr.t("closeMenu")}">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <nav class="mobile-nav">
              <a href="/catalog?brand=crocs">Crocs</a>
              <a href="/adidas">Adidas</a>
              <a href="/catalog">${tr.t("navShop")}</a>
              <a href="/collabs">${tr.t("navCollabs")}</a>
              <a href="/delivery" class="active">${heroTitle}</a>
              <a href="/about">${tr.t("navAbout")}</a>
            </nav>
            <div class="mobile-nav-footer">
              <a href="/catalog" class="drawer-cta">${tr.t("shopNow")}</a>
            </div>
          </div>
        </div>

        <!-- Hero -->
        <section class="delivery-hero" aria-label="${heroTitle}">
          <div class="delivery-hero__content">
            <div class="delivery-hero__eyebrow">${iconTruck} ${heroTitle}</div>
            <h1 class="delivery-hero__title">${heroSubtitle}</h1>
            <p class="delivery-hero__sub">${isRu ? "Курьер позвонит за 30–60 минут до приезда" : "Courier will call 30–60 min before arrival"}</p>
          </div>
        </section>

        <!-- Courier info -->
        <section class="courier-section wrap" aria-label="${isRu ? "Курьерская доставка" : "Courier Delivery"}">
          <h2 class="section-heading">${isRu ? "Курьерская доставка" : "Courier Delivery"}</h2>
          <p class="section-sub">${isRu ? "СДЭК доставит посылку прямо к вашей двери" : "CDEK will deliver the parcel right to your door"}</p>

          <div class="courier-info-grid">
            <div class="courier-info-card">
              <div class="courier-info-card__icon">${iconTruck}</div>
              <h3 class="courier-info-card__title">${isRu ? "Доставка до двери" : "Door-to-door"}</h3>
              <p class="courier-info-card__text">${isRu ? "Курьер СДЭК привезёт посылку по указанному адресу в удобное время" : "CDEK courier will bring your parcel to the specified address at a convenient time"}</p>
            </div>
            <div class="courier-info-card">
              <div class="courier-info-card__icon">${iconClock}</div>
              <h3 class="courier-info-card__title">${isRu ? "Сроки доставки" : "Delivery time"}</h3>
              <p class="courier-info-card__text">${isRu ? "14–21 рабочих дней в зависимости от региона. Трек-номер придёт на почту после отправки" : "3–14 business days depending on the region. Tracking number will be sent by email after dispatch"}</p>
            </div>
            <div class="courier-info-card">
              <div class="courier-info-card__icon">${iconCheck}</div>
              <h3 class="courier-info-card__title">${isRu ? "Удобное получение" : "Convenient receipt"}</h3>
              <p class="courier-info-card__text">${isRu ? "Курьер позвонит за 30–60 минут до приезда" : "Courier will call 30–60 min before arrival"}</p>
            </div>
          </div>

          <div class="map-hint">
            <div class="cdek-badge">
              <div class="cdek-badge__logo">СДЭК</div>
              <div class="cdek-badge__text">${isRu ? "Укажи точный адрес доставки при оформлении заказа — курьер приедет к тебе." : "Enter your exact delivery address at checkout — the courier will come to you."}</div>
            </div>
          </div>
        </section>

        <!-- Steps -->
        <section class="steps-section wrap" aria-label="${infoTitle}">
          <h2 class="section-heading">${infoTitle}</h2>
          <p class="section-sub">${isRu ? "Просто и прозрачно" : "Simple and transparent"}</p>
          <div class="steps-grid">
            ${steps.map(s => `
            <div class="step-card">
              <div class="step-number">${s.n}</div>
              <div class="step-icon">${s.icon}</div>
              <h3 class="step-title">${s.t}</h3>
              <p class="step-text">${s.s}</p>
            </div>`).join("")}
          </div>
        </section>

        <!-- FAQ -->
        <section class="faq-section wrap" aria-label="${faqTitle}">
          <h2 class="section-heading">${faqTitle}</h2>
          <p class="section-sub">${isRu ? "Отвечаем на частые вопросы" : "Answers to common questions"}</p>
          <div class="faq-list">
            ${faqs.map((f, i) => `
            <div class="faq-item" id="faq-${i}">
              <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${i}">
                ${f.q}
                <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div class="faq-answer" id="faq-answer-${i}" role="region">${f.a}</div>
            </div>`).join("")}
          </div>
        </section>

      </main>
      <footer class="site-footer">
        stay chill
        <span class="footer-sep">·</span>
        <a href="mailto:furai@furai.space" class="footer-credit">made by FURAI LAB</a>
      </footer>
    </div>

    <script>
      (function () {
        /* ── Language switcher ── */
        ${languageSwitcherScript}

        /* ── Search ── */
        const searchOverlay = document.getElementById('search-overlay');
        document.querySelector('button[aria-label="${tr.t("search")}"]')
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
            if (q) window.location.href = '/catalog?q=' + encodeURIComponent(q);
          }
        });
        function closeSearch() { searchOverlay?.classList.remove('open'); document.body.style.overflow = ''; }

        /* ── Cart ── */
        const cartOverlay = document.getElementById('cart-overlay');
        document.querySelector('button[aria-label="${tr.t("cart")}"]')
          ?.addEventListener('click', () => { cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; });
        document.getElementById('cart-close')?.addEventListener('click', () => { cartOverlay?.classList.remove('open'); document.body.style.overflow = ''; });
        cartOverlay?.addEventListener('click', e => { if (e.target === cartOverlay) { cartOverlay.classList.remove('open'); document.body.style.overflow = ''; } });

        /* ── Mobile menu ── */
        const menuOverlay = document.getElementById('menu-overlay');
        document.querySelector('button[aria-label="${tr.t("menu")}"]')
          ?.addEventListener('click', () => { menuOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; });
        document.getElementById('menu-close')?.addEventListener('click', () => { menuOverlay?.classList.remove('open'); document.body.style.overflow = ''; });
        menuOverlay?.addEventListener('click', e => { if (e.target === menuOverlay) { menuOverlay.classList.remove('open'); document.body.style.overflow = ''; } });

        /* ── Global Escape ── */
        document.addEventListener('keydown', e => {
          if (e.key !== 'Escape') return;
          closeSearch();
          cartOverlay?.classList.remove('open');
          menuOverlay?.classList.remove('open');
          document.body.style.overflow = '';
        });

        /* ── FAQ accordion ── */
        document.querySelectorAll('.faq-question').forEach(btn => {
          btn.addEventListener('click', function () {
            const item   = this.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(el => {
              el.classList.remove('open');
              el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) { item.classList.add('open'); this.setAttribute('aria-expanded', 'true'); }
          });
        });

      })();
    </script>
  </body>
</html>`;
}
