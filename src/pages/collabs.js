import { COLLABS } from "../lib/collabs.js";
import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead, breadcrumbJsonLd, jsonLdScripts } from "../lib/seo.js";

export function renderCollabsPage(appConfig, collabs = COLLABS, locale = "ru") {
  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);
  const escapeHtml = (v = "") => String(v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const iconMenu = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>`;
  const iconBag  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"/><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"/></svg>`;

  const CollabCard = (c) => {
    const name        = escapeHtml(c.name);
    const description = escapeHtml(c.description);
    const bannerUrl   = escapeHtml(c.bannerUrl);
    const logoUrl     = escapeHtml(c.logoUrl);
    const year        = escapeHtml(c.year);
    const isArchive   = c.status === "archive";

    return `
      <article class="collab-card${isArchive ? " collab-card--archive" : ""}">
        <a href="/collabs/${escapeHtml(c.slug)}" class="collab-card__media">
          <img src="${bannerUrl}" alt="${name}" loading="lazy" width="800" height="440" />
          ${isArchive ? `<span class="collab-badge collab-badge--archive">${tr.t("archiveBadge")} · ${year}</span>` : `<span class="collab-badge collab-badge--active">${tr.t("activeBadge")} · ${year}</span>`}
        </a>
        <div class="collab-card__body">
          <div class="collab-card__header">
            <img class="collab-card__logo" src="${logoUrl}" alt="${name} logo" width="48" height="48" />
            <h2>${name}</h2>
          </div>
          <p>${description}</p>
          <a href="/collabs/${escapeHtml(c.slug)}" class="collab-card__cta">
            ${tr.t("viewCollab")}
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>
          </a>
        </div>
      </article>
    `;
  };

  const active  = collabs.filter(c => c.status === "active");
  const archive = collabs.filter(c => c.status === "archive");

  return `<!DOCTYPE html>
<html lang="${tr.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    ${renderSeoHead({
      appConfig,
      title: `${tr.t("collabsTitle")} — Kokoc Store`,
      description: tr.t("collabsDescription"),
      path: "/collabs",
      locale: tr.locale,
      alternates: { ru: "/collabs", en: "/collabs" }
    })}
    ${jsonLdScripts(breadcrumbJsonLd(appConfig, [
      { name: tr.t("home"), path: "/" },
      { name: tr.t("collabsTitle"), path: "/collabs" }
    ]))}
    <meta name="theme-color" content="#F7F7F6" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favsmall.png" />
    <link rel="preload" as="image" href="/menu-logo.png" />
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
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0; min-height: 100vh; overflow-x: hidden;
        background: radial-gradient(circle at 50% 0%, rgba(255,240,245,0.4), transparent 60%), #F7F7F6;
        color: var(--text);
        font-family: "Manrope", "Segoe UI", Arial, sans-serif;
      }
      a { color: inherit; text-decoration: none; }
      button, input { font: inherit; }
      button { border: 0; padding: 0; color: inherit; background: none; cursor: pointer; }
      img { display: block; max-width: 100%; }

      /* ── Navbar (identical to landing) ── */
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
        display: flex; align-items: center; gap: 20px;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .desktop-nav a {
        color: var(--text); font-size: 13px; font-weight: 600; line-height: 1;
        transition: color 220ms ease, transform 220ms ease;
      }
      .desktop-nav a:hover { color: var(--primary); transform: translateY(-1px); }
      .desktop-nav a.active { color: var(--primary); }
      .nav-actions { display: flex; align-items: center; gap: 8px; }
      .icon-button {
        display: inline-flex; align-items: center; justify-content: center;
        width: 44px; height: 44px; border-radius: 50%;
        transition: color 220ms, transform 220ms, background 220ms;
      }
      .icon-button svg { width: 20px; height: 20px; stroke: currentColor; }
      .icon-button:hover { color: var(--primary); background: rgba(255,255,255,0.72); transform: translateY(-1px); }
      .mobile-only { display: none; }

${languageSwitcherStyles}

      /* ── Page layout ── */
      .page-inner {
        width: min(calc(100% - 48px), var(--container));
        margin-inline: auto;
        padding: 64px 0 80px;
      }
      .page-title {
        font-size: clamp(36px, 6vw, 64px); font-weight: 700;
        line-height: 1; letter-spacing: 0; margin: 0 0 8px;
      }
      .page-subtitle {
        color: var(--secondary-text); font-size: 14px;
        margin: 0 0 56px;
      }
      .collabs-section-label {
        font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
        text-transform: uppercase; color: var(--secondary-text);
        margin: 0 0 24px;
      }

      /* ── Collab grid ── */
      .collabs-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
        margin-bottom: 56px;
      }
      .collabs-grid--single { grid-template-columns: minmax(0, 1fr); max-width: 640px; }

      .collab-card {
        border-radius: 24px;
        background: var(--white);
        box-shadow: var(--shadow-default);
        overflow: hidden;
        transition: transform 250ms ease, box-shadow 250ms ease;
      }
      .collab-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
      .collab-card--archive { opacity: 0.72; }
      .collab-card--archive:hover { opacity: 1; }

      .collab-card__media {
        display: block; position: relative; overflow: hidden;
        background: #f0efed;
      }
      .collab-card__media img {
        width: 100%; aspect-ratio: 16/9; object-fit: cover;
        transition: transform 300ms ease;
        filter: contrast(1.05);
      }
      .collab-card:hover .collab-card__media img { transform: scale(1.03); }

      .collab-badge {
        position: absolute; top: 14px; left: 14px;
        display: inline-flex; align-items: center;
        height: 26px; padding: 0 12px;
        border-radius: 999px;
        font-size: 11px; font-weight: 700; line-height: 1;
      }
      .collab-badge--active { background: var(--primary); color: #fff; }
      .collab-badge--archive { background: rgba(0,0,0,0.55); color: #fff; }

      .collab-card__body { padding: 20px 22px 22px; }
      .collab-card__header {
        display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
      }
      .collab-card__logo {
        width: 48px; height: 48px; border-radius: 12px;
        object-fit: cover; background: #f0efed; flex-shrink: 0;
      }
      .collab-card__header h2 {
        margin: 0; font-size: 20px; font-weight: 700; line-height: 1.1;
      }
      .collab-card__body p {
        margin: 0 0 16px; color: var(--secondary-text);
        font-size: 13px; line-height: 1.5;
      }
      .collab-card__cta {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: var(--text);
        transition: color 200ms ease, gap 200ms ease;
      }
      .collab-card__cta:hover { color: var(--primary); gap: 10px; }

      /* ── Footer ── */
      .site-footer {
        width: min(calc(100% - 48px), var(--container));
        margin: 0 auto; padding: 0 0 calc(28px + env(safe-area-inset-bottom, 0px));
        color: var(--secondary-text); font-size: 13px; text-align: right;
      }

      .footer-sep { margin: 0 8px; opacity: 0.4; }

      .footer-credit {
        color: inherit;
        opacity: 0.45;
        text-decoration: none;
        font-size: inherit;
        letter-spacing: 0.04em;
      }

      .footer-credit:hover { opacity: 0.75; }

      /* ── Responsive ── */
      @media (max-width: 900px) {
        .navbar { padding: 0 16px; }
        .brand { width: 74px; min-width: 74px; }
        .desktop-nav, .desktop-only { display: none; }
        .mobile-only { display: inline-flex; }
        .page-inner { width: min(calc(100% - 32px), var(--container)); padding: 48px 0 64px; }
      }
      @media (max-width: 640px) {
        .collabs-grid { grid-template-columns: 1fr; gap: 16px; }
        .collabs-grid--single { max-width: 100%; }
        .collab-card__body { padding: 16px 18px 18px; }
        .page-title { margin-bottom: 6px; }
        .page-subtitle { margin-bottom: 36px; }
        .page-inner { width: min(calc(100% - 24px), var(--container)); }
      }

      /* ── Drawer overlay (mobile menu) ── */
      .drawer-overlay {
        display: none; position: fixed; inset: 0; z-index: 400;
        background: rgba(0,0,0,0.35);
      }
      .drawer-overlay.open { display: block; }
      .side-drawer {
        position: absolute; top: 0; right: auto; left: 0; bottom: 0;
        width: min(380px, 90vw);
        background: var(--white);
        display: flex; flex-direction: column;
        animation: slideInLeft 260ms cubic-bezier(.32,.72,0,1);
      }
      @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .drawer-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(0,0,0,0.06);
        flex-shrink: 0;
      }
      .drawer-title { font-size: 15px; font-weight: 700; letter-spacing: 0; }
      .drawer-close {
        display: inline-flex; align-items: center; justify-content: center;
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(0,0,0,0.05); border: none; cursor: pointer;
        transition: background 180ms;
      }
      .drawer-close svg { width: 16px; height: 16px; stroke: currentColor; }
      .drawer-close:hover { background: rgba(0,0,0,0.1); }
      .mobile-nav {
        display: flex; flex-direction: column; padding: 12px 0; flex: 1;
      }
      .mobile-nav a {
        padding: 16px 24px; font-size: 20px; font-weight: 600;
        color: var(--text); text-decoration: none;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        transition: color 180ms, padding-left 180ms;
      }
      .mobile-nav a:hover, .mobile-nav a.active { color: var(--primary); padding-left: 32px; }
      .mobile-nav-footer { padding: 24px; flex-shrink: 0; }
      .drawer-cta {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 12px 28px; border-radius: 999px;
        background: var(--text); color: #fff;
        font-size: 14px; font-weight: 600;
        transition: background 200ms;
      }
      .drawer-cta:hover { background: var(--primary); }
    </style>
  </head>
  <body>
    <header class="navbar" aria-label="${tr.t("menu")}">
      <a class="brand" href="/" aria-label="${escapeHtml(appConfig.domain)}">
        <img src="/menu-logo.png" alt="Kokoc Store" />
      </a>
      <nav class="desktop-nav">
        <a href="/catalog?brand=crocs">Crocs</a>
        <a href="/adidas">Adidas</a>
        <a href="/catalog">${tr.t("navAllProducts")}</a>
        <a href="/collabs" class="active">${tr.t("navCollabs")}</a>
        <a href="/about">${tr.t("navAbout")}</a>
        <a href="/about">${tr.t("navAbout")}</a>
      </nav>
      <div class="nav-actions">
        ${langSwitcher}
        <button class="icon-button" type="button" aria-label="${tr.t("cart")}">${iconBag}</button>
        <button class="icon-button mobile-only" type="button" aria-label="${tr.t("menu")}" id="menu-open">${iconMenu}</button>
      </div>
    </header>

    <!-- Mobile menu drawer -->
    <div class="drawer-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("menu")}">
      <div class="side-drawer" id="menu-drawer">
        <div class="drawer-head">
          <span class="drawer-title">${tr.t("menu")}</span>
          <button class="drawer-close" type="button" id="menu-close" aria-label="${tr.t("closeMenu")}">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <nav class="mobile-nav">
          <a href="/catalog?brand=crocs">Crocs</a>
          <a href="/adidas">Adidas</a>
          <a href="/catalog">${tr.t("navAllProducts")}</a>
          <a href="/collabs" class="active">${tr.t("navCollabs")}</a>
          <a href="/about">${tr.t("navAbout")}</a>
        </nav>
        <div class="mobile-nav-footer">
          <a href="/catalog" class="drawer-cta">${tr.t("shopNow")}</a>
        </div>
      </div>
    </div>

    <main>
      <div class="page-inner">
        <h1 class="page-title">${tr.t("collabsTitle")}</h1>
        <p class="page-subtitle">${tr.t("collabsSubtitle")}</p>

        ${active.length > 0 ? `
          <p class="collabs-section-label">${tr.t("active")}</p>
          <div class="collabs-grid${active.length === 1 ? " collabs-grid--single" : ""}">
            ${active.map(CollabCard).join("")}
          </div>
        ` : ""}

        ${archive.length > 0 ? `
          <p class="collabs-section-label">${tr.t("archive")}</p>
          <div class="collabs-grid${archive.length === 1 ? " collabs-grid--single" : ""}">
            ${archive.map(CollabCard).join("")}
          </div>
        ` : ""}
      </div>
    </main>

    <footer class="site-footer">
      ${tr.t("stayChill")}
      <span class="footer-sep">·</span>
      <a href="mailto:furai@furai.space" class="footer-credit">made by FURAI LAB</a>
    </footer>

    <script>
      (function () {
        ${languageSwitcherScript}
        const menuOverlay = document.getElementById('menu-overlay');
        document.getElementById('menu-open')?.addEventListener('click', () => {
          menuOverlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
        document.getElementById('menu-close')?.addEventListener('click', close);
        menuOverlay?.addEventListener('click', e => { if (e.target === menuOverlay) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        function close() { menuOverlay?.classList.remove('open'); document.body.style.overflow = ''; }
      })();
    </script>
  </body>
</html>`;
}
