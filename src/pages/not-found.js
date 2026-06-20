import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead } from "../lib/seo.js";

export function renderNotFoundPage(appConfig, locale = "ru") {
  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);

  const iconSearch = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>`;
  const iconHeart  = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  const iconBag    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"/><path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"/></svg>`;
  const iconMenu   = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>`;

  return `<!DOCTYPE html>
<html lang="${tr.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${renderSeoHead({
      appConfig,
      title: `404 — ${tr.t("notFoundTitle")} — Kokoc Store`,
      description: tr.t("notFoundSub"),
      path: "/404",
      locale: tr.locale,
      noindex: true,
      alternates: { ru: "/404", en: "/404" }
    })}
    <meta name="theme-color" content="#F7F7F6" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favsmall.png" />
    <link rel="apple-touch-icon" href="/favbig.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      ${languageSwitcherStyles}

      :root {
        --primary: #FF6B9A;
        --text: #1A1A1A;
        --secondary-text: #888;
        --white: #FFFFFF;
        --shadow-default: 0 8px 24px rgba(0,0,0,0.06);
        --shadow-hover: 0 16px 40px rgba(0,0,0,0.12);
        --container: 840px;
      }

      * { box-sizing: border-box; }

      html { scroll-behavior: smooth; background: #F7F7F6; }

      body {
        margin: 0;
        min-height: 100vh;
        overflow-x: hidden;
        background: radial-gradient(circle at 50% 0%, rgba(255,240,245,0.45), transparent 55%), #F7F7F6;
        color: var(--text);
        font-family: "Manrope", "Segoe UI", Arial, sans-serif;
        display: flex;
        flex-direction: column;
      }

      a { color: inherit; text-decoration: none; }
      button, input { font: inherit; }
      button { border: 0; padding: 0; color: inherit; background: none; cursor: pointer; }

      /* ── Navbar (shared shell) ── */
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
        position: absolute; left: 50%; display: flex;
        align-items: center; gap: 18px; transform: translateX(-50%);
        white-space: nowrap;
      }
      .desktop-nav a { font-size: 13px; font-weight: 600; transition: color 220ms; }
      .desktop-nav a:hover { color: var(--primary); }
      .nav-actions { display: flex; align-items: center; gap: 8px; }
      .icon-button {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 36px; border-radius: 50%;
        transition: color 220ms, transform 220ms, background 220ms;
      }
      .icon-button svg { width: 20px; height: 20px; stroke: currentColor; }
      .icon-button:hover { background: rgba(0,0,0,0.06); }
      .mobile-only { display: none; }
      .desktop-only { display: inline-flex; }

      /* ── 404 hero ── */
      .nf-wrap {
        flex: 1;
        width: min(calc(100% - 48px), 1080px);
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0 0 64px;
      }
      .nf-img-frame {
        width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        margin-bottom: 12px;
        background: #F7F7F6;
      }
      .nf-img {
        display: block;
        width: 100%;
        height: auto;
      }
      .nf-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 28px;
      }
      .nf-cta {
        display: inline-flex; align-items: center; justify-content: center;
        height: 52px; padding: 0 32px;
        border-radius: 999px;
        background: var(--text);
        color: #fff;
        font-size: 15px; font-weight: 700;
        transition: background 200ms, transform 200ms;
      }
      .nf-cta:hover { background: #333; transform: translateY(-2px); }
      .nf-cta--secondary {
        background: var(--white);
        color: var(--text);
        box-shadow: var(--shadow-default);
      }
      .nf-cta--secondary:hover { box-shadow: var(--shadow-hover); background: var(--white); }

      /* ── Footer ── */
      .site-footer {
        width: min(calc(100% - 48px), var(--container));
        margin-inline: auto;
        padding: 24px 0 32px;
        border-top: 1px solid rgba(0,0,0,0.07);
        display: flex; align-items: center; justify-content: space-between;
        font-size: 12px; color: var(--secondary-text);
      }
      .footer-credit { transition: opacity 180ms; }
      .footer-credit:hover { opacity: .75; }

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

      /* ── Drawer overlay ── */
      .drawer-overlay {
        display: none; position: fixed; inset: 0; z-index: 400;
        background: rgba(0,0,0,0.35);
      }
      .drawer-overlay.open { display: block; }
      .side-drawer {
        position: absolute; top: 0; right: 0; bottom: 0;
        width: min(380px, 90vw); background: var(--white);
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
        color: var(--secondary-text);
      }
      .drawer-empty svg { width: 40px; height: 40px; stroke: currentColor; opacity: .4; }

      /* ── Mobile ── */
      @media (max-width: 900px) {
        .mobile-only { display: inline-flex; }
        .desktop-only { display: none; }
        .desktop-nav { display: none; }
      }

      @media (max-width: 640px) {
        .nf-wrap { padding: 0 0 56px; }
        .nf-actions { flex-direction: column; align-items: stretch; width: 100%; }
        .nf-cta, .nf-cta--secondary { width: 100%; }
      }
    </style>
  </head>
  <body>

    <!-- Navbar -->
    <header class="navbar" aria-label="${tr.t("menu")}">
      <a class="brand" href="/" aria-label="${appConfig.domain}">
        <img src="/menu-logo.png" alt="Kokoc Store" />
      </a>
      <nav class="desktop-nav">
        <a href="/catalog?brand=crocs">Crocs</a>
        <a href="/adidas">Adidas</a>
        <a href="/catalog">${tr.t("navAllProducts")}</a>
        <a href="/collabs">${tr.t("navCollabs")}</a>
        <a href="/delivery">${tr.t("deliveryTitle")}</a>
        <a href="/about">${tr.t("navAbout")}</a>
      </nav>
      <div class="nav-actions" aria-label="Quick actions">
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
      <div class="side-drawer">
        <div class="drawer-head">
          <span class="drawer-title">${tr.t("cart")}</span>
          <button class="drawer-close" type="button" id="cart-close" aria-label="${tr.t("close")}">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="drawer-body">
          <div class="drawer-empty">
            ${iconBag}
            <p>${tr.t("cartEmpty")}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu drawer -->
    <div class="drawer-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("menu")}">
      <div class="side-drawer side-drawer--left">
        <div class="drawer-head">
          <span class="drawer-title">${appConfig.domain}</span>
          <button class="drawer-close" type="button" id="menu-close" aria-label="${tr.t("close")}">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="drawer-body">
          <nav style="display:grid;gap:8px;">
            <a href="/catalog?brand=crocs" style="font-size:15px;font-weight:600;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">Crocs</a>
            <a href="/adidas" style="font-size:15px;font-weight:600;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">Adidas</a>
            <a href="/catalog" style="font-size:15px;font-weight:600;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">${tr.t("navAllProducts")}</a>
            <a href="/collabs" style="font-size:15px;font-weight:600;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">${tr.t("navCollabs")}</a>
            <a href="/delivery" style="font-size:15px;font-weight:600;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">${tr.t("deliveryTitle")}</a>
            <a href="/about" style="font-size:15px;font-weight:600;padding:10px 0">${tr.t("navAbout")}</a>
          </nav>
        </div>
      </div>
    </div>

    <!-- Page content -->
    <main class="nf-wrap">
      <picture class="nf-img-frame">
        <source media="(max-width: 640px)" srcset="/images/404/404-mobile.webp" type="image/webp" />
        <source media="(max-width: 640px)" srcset="/images/404/404-mobile.jpg" />
        <source srcset="/images/404/404-desktop.webp" type="image/webp" />
        <img class="nf-img" src="/images/404/404-desktop.jpg" alt="${tr.t("notFoundImgAlt")}" width="1280" height="600" />
      </picture>
      <div class="nf-actions">
        <a href="/" class="nf-cta">${tr.t("notFoundCta")}</a>
        <a href="/catalog" class="nf-cta nf-cta--secondary">${tr.t("notFoundCtaSecondary")}</a>
      </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <span>© ${new Date().getFullYear()} ${appConfig.domain}</span>
      <a href="mailto:furai@furai.space" class="footer-credit">made by FURAI LAB</a>
    </footer>

    <script>
      (function () {
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
        function closeSearch() {
          searchOverlay?.classList.remove('open');
          document.body.style.overflow = '';
        }

        /* ── Cart ── */
        const cartOverlay = document.getElementById('cart-overlay');
        document.querySelector('button[aria-label="${tr.t("cart")}"]')
          ?.addEventListener('click', () => {
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          });
        document.getElementById('cart-close')?.addEventListener('click', closeCart);
        cartOverlay?.addEventListener('click', e => { if (e.target === cartOverlay) closeCart(); });
        function closeCart() { cartOverlay?.classList.remove('open'); document.body.style.overflow = ''; }

        /* ── Mobile menu ── */
        const menuOverlay = document.getElementById('menu-overlay');
        document.querySelector('button[aria-label="${tr.t("menu")}"]')
          ?.addEventListener('click', () => {
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          });
        document.getElementById('menu-close')?.addEventListener('click', closeMenu);
        menuOverlay?.addEventListener('click', e => { if (e.target === menuOverlay) closeMenu(); });
        function closeMenu() { menuOverlay?.classList.remove('open'); document.body.style.overflow = ''; }

        /* ── Escape key ── */
        document.addEventListener('keydown', e => {
          if (e.key !== 'Escape') return;
          closeSearch(); closeCart(); closeMenu();
        });
      })();
    </script>
  </body>
</html>`;
}
