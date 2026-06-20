import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead, organizationJsonLd, websiteJsonLd, jsonLdScripts } from "../lib/seo.js";

export function renderLandingPage(appConfig, products = [], locale = "ru") {
  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);
  const uiJson = JSON.stringify({
    subscribeError: tr.t("subscribeError"),
    subscribeOffline: tr.t("subscribeOffline")
  });
  const iconSearch = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.7"></circle>
      <path d="m20 20-4.45-4.45"></path>
    </svg>
  `;

  const iconHeart = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 20.2 4.85 13.55a4.7 4.7 0 0 1 6.65-6.65l.5.5.5-.5a4.7 4.7 0 1 1 6.65 6.65L12 20.2Z"></path>
    </svg>
  `;

  const iconBag = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6.8 8.6h10.4l-1 10.2H7.8L6.8 8.6Z"></path>
      <path d="M9.2 8.6a2.8 2.8 0 1 1 5.6 0"></path>
    </svg>
  `;

  const iconMenu = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true">
      <path d="M4 7h16"></path>
      <path d="M4 12h16"></path>
      <path d="M4 17h16"></path>
    </svg>
  `;

  const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const ProductCard = (product) => {
    const title = escapeHtml(product.title);
    const description = escapeHtml(product.description);
    const image = escapeHtml(product.image || "/crops/product-placeholder.png");
    const badge = product.badge ? escapeHtml(product.badge) : null;
    const badgeClass = product.badgeClass ? escapeHtml(product.badgeClass) : null;
    const price = escapeHtml(product.price || tr.t("outOfStock"));
    const comparePrice = product.comparePrice ? escapeHtml(product.comparePrice) : null;

    const slug = escapeHtml(product.slug || "");
    return `
      <a class="product-card" href="/product/${slug}" data-slug="${slug}" aria-label="${title}">
        <div class="product-media">
          <img
            src="${image}"
            alt="${title}"
            loading="lazy"
            width="800"
            height="800"
          />
          ${badge
            ? `<span class="badge badge-${badgeClass}">${badge}</span>`
            : ""}
          <button class="favorite-button fav-btn" type="button" data-slug="${slug}"
            aria-label="${tr.t("addToWishlist")}: ${title}" aria-pressed="false">
            ${iconHeart}
          </button>
        </div>
        <div class="product-copy">
          <h3>${title}</h3>
          <div class="product-price">
            ${comparePrice
              ? `<s class="price-compare">${comparePrice}</s>`
              : ""}
            <strong>${price}</strong>
          </div>
        </div>
      </a>
    `;
  };

  const Navbar = () => `
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
          <button class="icon-button" type="button" id="search-btn" aria-label="${tr.t("search")}">${iconSearch}</button>
          <button class="icon-button desktop-only" type="button" id="wishlist-btn" aria-label="${tr.t("wishlist")}">${iconHeart}</button>
          <button class="icon-button" type="button" id="cart-btn" aria-label="${tr.t("cart")}">${iconBag}</button>
          <button class="icon-button mobile-only" type="button" id="menu-btn" aria-label="${tr.t("menu")}">${iconMenu}</button>
        </div>
      </header>
  `;

  const OverlayPanels = () => `
<!-- ── Search overlay ── -->
<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("search")}">
  <div class="search-box">
    <input type="search" id="search-input" placeholder="${tr.t("searchPlaceholder")}" autocomplete="off" />
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

<!-- ── Wishlist drawer ── -->
<div class="drawer-overlay" id="wishlist-overlay" role="dialog" aria-modal="true" aria-label="${tr.t("wishlist")}">
  <div class="side-drawer" id="wishlist-drawer">
    <div class="drawer-head">
      <span class="drawer-title">${tr.t("wishlist")}</span>
      <button class="drawer-close" type="button" id="wishlist-close" aria-label="${tr.t("closeMenu")}">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div class="drawer-body" id="wishlist-body">
      <div class="drawer-empty" id="wishlist-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.2 4.85 13.55a4.7 4.7 0 0 1 6.65-6.65l.5.5.5-.5a4.7 4.7 0 1 1 6.65 6.65L12 20.2Z"/></svg>
        <p>${tr.t("wishlist") + ` ${tr.locale === "ru" ? "пуст" : "is empty"}`}</p>
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
      <a href="/catalog?brand=crocs">Crocs</a>
      <a href="/adidas">Adidas</a>
      <a href="/catalog">${tr.t("navAllProducts")}</a>
      <a href="/collabs">${tr.t("navCollabs")}</a>
      <a href="/delivery">${tr.t("deliveryTitle")}</a>
      <a href="/about">${tr.t("navAbout")}</a>
    </nav>
    <div class="mobile-nav-footer">
      <a href="/catalog" class="drawer-cta">${tr.t("shopNow")}</a>
    </div>
  </div>
</div>
  `;

  const Hero = () => `
    <section class="hero" id="about">
      <h1 class="sr-only">${tr.t("landingTitle")}</h1>
      <div class="hero__cta">
        <a class="hero__button" href="/catalog">${tr.t("shopNow")}</a>
      </div>
    </section>
  `;

  const HitsSection = () => `
    <section class="hits-section" id="hits">
      <div class="section-inner">
        <div class="section-header">
          <h2>${tr.t("hits")}</h2>
          <a href="/catalog">${tr.t("seeAll")}</a>
        </div>
        ${products.length > 0
          ? `<div class="product-grid" id="hits-grid">
               ${products.map(ProductCard).join("")}
             </div>`
          : `<p style="color:var(--secondary-text);padding:40px 0;text-align:center">
               ${tr.t("productsComingSoon")}
             </p>`
        }
      </div>
    </section>
  `;

  const PromoBanner = () => `
    <section class="promo-banner" aria-label="${tr.t("deliveryTitle")}">
      <a class="image-panel delivery-banner-link" href="/delivery">
        <picture>
          <source srcset="/crops/delivery-bg.webp" type="image/webp" />
          <img src="/crops/delivery-bg.jpg" alt="${tr.t("deliveryTitle")}" loading="lazy" />
        </picture>
      </a>
    </section>
  `;

  const MiniGame = () => `
    <section class="mini-game" aria-label="Mini Game">
      <a class="image-panel" href="/minigame">
        <picture>
          <source srcset="/crops/minigame-banner-final.webp" type="image/webp" />
          <img src="/crops/minigame-banner-final.jpg" alt="Mini Game" loading="lazy" />
        </picture>
      </a>
    </section>
  `;

  const Newsletter = () => `
    <section class="newsletter-section" id="newsletter">
      <div class="newsletter">
        <img class="newsletter-avatar" src="/favbig.jpg" alt="Kokoc cat avatar" loading="lazy" />
        <div class="newsletter-copy">
          <h2>${tr.t("stayLoop")}</h2>
          <p>${tr.t("newDrops")}</p>
        </div>
        <div class="newsletter-form" id="newsletter-form">
          <input
            type="email"
            id="newsletter-email"
            placeholder="${tr.t("yourEmail")}"
            aria-label="${tr.t("yourEmail")}"
            autocomplete="email"
          />
          <button type="button" id="newsletter-btn" aria-label="${tr.t("subscribe")}">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.85" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m13 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
        <p id="newsletter-msg" style="display:none;grid-column:1/-1;margin:0;
          font-size:13px;text-align:center"></p>
      </div>
    </section>
    <script>
      (function () {
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

        /* ── Wishlist ── */
        const wishlistOverlay = document.getElementById('wishlist-overlay');
        const wishlistBody = document.getElementById('wishlist-body');

        function renderWishlistDrawer() {
          const slugs = [...favs];
          if (!slugs.length) {
            const empty = document.getElementById('wishlist-empty');
            if (empty) empty.style.display = '';
            return;
          }
          wishlistBody.innerHTML = slugs.map(slug => {
            const label = slug.replace(/-/g, ' ');
            return \`<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.06)">
              <a href="/product/\${encodeURIComponent(slug)}" style="font-size:14px;font-weight:500;color:var(--text);text-decoration:none;flex:1">\${label}</a>
              <button type="button" data-slug="\${slug}" aria-label="Remove"
                style="background:none;border:none;cursor:pointer;padding:4px 8px;color:#aaa;font-size:18px;line-height:1"
                onclick="(function(btn){
                  const s=btn.dataset.slug;
                  favs.delete(s);saveFavs();syncFavButtons();renderWishlistDrawer();
                })(this)">×</button>
            </div>\`;
          }).join('') + \`<div style="margin-top:20px"><a href="/catalog" class="drawer-cta" style="width:100%;box-sizing:border-box">${tr.t("browseShop")}</a></div>\`;
        }

        document.getElementById('wishlist-btn')?.addEventListener('click', () => {
          renderWishlistDrawer();
          wishlistOverlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
        document.getElementById('wishlist-close')?.addEventListener('click', closeWishlist);
        wishlistOverlay?.addEventListener('click', e => { if (e.target === wishlistOverlay) closeWishlist(); });
        function closeWishlist() {
          wishlistOverlay?.classList.remove('open');
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
          closeSearch(); closeCart(); closeWishlist(); closeMenu();
        });

        /* ── Favourites (localStorage) ── */
        const favs = new Set(JSON.parse(localStorage.getItem('kokoc_favs') || '[]'));
        function saveFavs() { localStorage.setItem('kokoc_favs', JSON.stringify([...favs])); }
        function syncFavButtons() {
          document.querySelectorAll('.fav-btn[data-slug]').forEach(btn => {
            btn.setAttribute('aria-pressed', favs.has(btn.dataset.slug) ? 'true' : 'false');
          });
        }
        syncFavButtons();

        /* ── Hits product grid: fav toggle only — card <a> handles navigation natively ── */
        const hitsGrid = document.getElementById('hits-grid');
        if (hitsGrid) {
          hitsGrid.addEventListener('click', function(e) {
            const favBtn = e.target.closest('.fav-btn');
            if (favBtn) {
              e.preventDefault();
              e.stopPropagation();
              const s = favBtn.dataset.slug;
              favs.has(s) ? favs.delete(s) : favs.add(s);
              saveFavs();
              favBtn.setAttribute('aria-pressed', favs.has(s) ? 'true' : 'false');
            }
            /* Native <a href="/catalog?open=slug"> handles card navigation — no JS needed */
          });
        }

        const btn   = document.getElementById('newsletter-btn');
        const input = document.getElementById('newsletter-email');
        const msg   = document.getElementById('newsletter-msg');

        async function subscribe() {
          const email = input.value.trim();
          if (!email) { input.focus(); return; }

          btn.disabled = true;
          input.disabled = true;

          try {
            const r = await fetch('/api/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            const data = await r.json();

            msg.style.display = 'block';
            if (data.ok) {
              msg.style.color = '#2ed573';
              msg.style.transition = 'opacity 0.6s ease';
              msg.style.opacity = '1';
              msg.textContent = '✓ ' + data.message;
              input.value = '';

              // Fade out after 5 seconds
              setTimeout(() => {
                msg.style.opacity = '0';
                setTimeout(() => {
                  msg.style.display = 'none';
                  msg.style.opacity = '1';
                }, 650);
              }, 5000);
            } else {
              msg.style.color = '#ff4757';
              msg.textContent = data.error || UI.subscribeError;
              btn.disabled = false;
              input.disabled = false;
            }
          } catch {
            msg.style.display = 'block';
            msg.style.color = '#ff4757';
            msg.textContent = UI.subscribeOffline;
            btn.disabled = false;
            input.disabled = false;
          }
        }

        btn.addEventListener('click', subscribe);
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') subscribe();
        });
      })();
    </script>
  `;

  return `<!DOCTYPE html>
<html lang="${tr.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    ${renderSeoHead({
      appConfig,
      title: tr.t("landingTitle"),
      description: tr.t("landingDescription"),
      path: "/",
      locale: tr.locale,
      image: "/images/hero.jpg",
      alternates: { ru: "/", en: "/" }
    })}
    ${jsonLdScripts(organizationJsonLd(appConfig), websiteJsonLd(appConfig))}
    <meta name="yandex-verification" content="96b240868d48e87e" />
    <meta name="theme-color" content="#F7F7F6" />
    <link rel="preload" as="image" href="/images/hero.webp" type="image/webp" media="(min-width: 769px)" />
    <link rel="preload" as="image" href="/images/hero.jpg" media="(min-width: 769px)" />
    <link rel="preload" as="image" href="/images/hero-mobile.webp" type="image/webp" media="(max-width: 768px)" />
    <link rel="preload" as="image" href="/images/hero-mobile.jpg" media="(max-width: 768px)" />
    <link rel="preload" as="image" href="/menu-logo.png" />
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
        --shadow-default: 0 8px 24px rgba(0, 0, 0, 0.06);
        --shadow-hover: 0 16px 40px rgba(0, 0, 0, 0.12);
        --container: 1180px;
      }

      * {
        box-sizing: border-box;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      html {
        scroll-behavior: smooth;
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 240, 245, 0.4), transparent 60%),
          #F7F7F6;
      }

      body {
        margin: 0;
        min-height: 100vh;
        overflow-x: hidden;
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 240, 245, 0.4), transparent 60%),
          #F7F7F6;
        color: var(--text);
        font-family: "Manrope", "Segoe UI", Arial, sans-serif;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button,
      input {
        font: inherit;
      }

      button {
        border: 0;
        padding: 0;
        color: inherit;
        background: none;
        cursor: pointer;
      }

      img {
        display: block;
        max-width: 100%;
      }

      .page {
        min-height: 100vh;
        background: transparent;
      }

      .navbar {
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        padding: 0 24px;
        background: rgba(255, 255, 255, 0.6);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .brand {
        display: inline-flex;
        align-items: center;
        width: 82px;
        min-width: 82px;
      }

      .brand img {
        width: 100%;
        height: auto;
      }

      .desktop-nav {
        position: absolute;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        transform: translateX(-50%);
        white-space: nowrap;
      }

      .desktop-nav a {
        color: var(--text);
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
        transition: color 220ms ease, transform 220ms ease;
      }

      .desktop-nav a:hover {
        color: var(--primary);
        transform: translateY(-1px);
      }

      .nav-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
      }

      .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        transition: color 220ms ease, transform 220ms ease, background 220ms ease;
      }

      .icon-button svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
      }

      .icon-button:hover {
        color: var(--primary);
        background: rgba(255, 255, 255, 0.72);
        transform: translateY(-1px);
      }

      .mobile-only {
        display: none;
      }

${languageSwitcherStyles}

      .hero {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 90vh;
        min-height: 700px;
        overflow: hidden;
        background-image: url('/images/hero.jpg');
        background-image: image-set(
          url('/images/hero.webp') type('image/webp'),
          url('/images/hero.jpg') type('image/jpeg')
        );
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .hero__cta {
        position: absolute;
        top: 68%;
        left: 20%;
        transform: translateX(-50%);
      }

      .hero__cta .hero__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 190px;
        height: 50px;
        border-radius: 999px;
        background: linear-gradient(135deg, #ff7eb3, #ff4fa3);
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.3px;
        border: none;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(255, 105, 180, 0.25);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        animation: heroButtonFloat 2.4s ease-in-out infinite;
        text-decoration: none;
      }

      .hero__cta .hero__button:hover {
        animation: none;
        transform: scale(1.08);
        box-shadow: 0 18px 45px rgba(255, 105, 180, 0.35);
      }

      .hero__cta .hero__button:active {
        animation: none;
        transform: scale(0.94);
      }

      .hero__cta .hero__button:focus-visible {
        outline: 3px solid rgba(255, 79, 163, 0.35);
        outline-offset: 4px;
      }

      @keyframes heroButtonFloat {
        0% {
          transform: translateY(0) scale(1);
        }

        50% {
          transform: translateY(-4px) scale(1.03);
        }

        100% {
          transform: translateY(0) scale(1);
        }
      }

      .hits-section {
        position: relative;
        z-index: 2;
        margin-top: -80px;
        padding-top: 120px;
        padding-bottom: 80px;
        background: transparent;
      }

      .section-inner,
      .promo-banner,
      .mini-game,
      .newsletter-section {
        width: min(calc(100% - 48px), var(--container));
        margin-inline: auto;
      }

      .section-header {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 40px;
      }

      .section-header h2 {
        margin: 0;
        color: var(--text);
        font-size: clamp(34px, 5vw, 56px);
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0;
      }

      .section-header a {
        padding-bottom: 5px;
        color: var(--secondary-text);
        font-size: 13px;
        font-weight: 600;
        transition: color 220ms ease;
      }

      .section-header a:hover {
        color: var(--primary);
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
      }

      .product-card {
        position: relative;
        display: grid;
        gap: 16px;
        padding: 18px;
        border-radius: 24px;
        background: #FFFFFF;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        transition: transform 250ms ease, box-shadow 250ms ease;
        min-width: 0;
        overflow: hidden;
      }

      .product-card:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
      }

      .product-media {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        background: #FFFFFF;
      }

      .product-media img {
        width: 100%;
        height: auto;
        filter: contrast(1.08);
        transition: transform 300ms ease;
      }

      .product-card:hover .product-media img {
        transform: scale(1.04);
      }

      .badge {
        position: absolute;
        top: 12px;
        left: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 28px;
        padding: 6px 12px;
        border-radius: 999px;
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 600;
        line-height: 1;
        box-shadow: none;
      }

      .badge-new {
        background: #FF6B9A;
      }

      .badge-bestseller {
        background: #22C55E;
      }

      .badge-limited {
        background: #8B5CF6;
      }

      .favorite-button {
        position: absolute;
        top: 12px;
        right: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        color: var(--text);
        transition: color 220ms ease, transform 220ms ease, background 220ms ease;
      }

      .favorite-button svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
      }

      .favorite-button:hover {
        color: #FF6B9A;
        transform: scale(1.1);
      }

      .favorite-button[aria-pressed="true"] {
        color: #FF6B9A;
      }

      .favorite-button[aria-pressed="true"] svg {
        fill: #FF6B9A;
        stroke: #FF6B9A;
      }

      .product-copy {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .product-copy h3,
      .product-copy p {
        margin: 0;
      }

      .product-copy h3 {
        color: var(--text);
        font-size: clamp(14px, 1.6vw, 18px);
        font-weight: 600;
        line-height: 1.25;
        overflow-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
        min-width: 0;
      }

      .product-copy p {
        color: var(--secondary-text);
        font-size: 13px;
        line-height: 1.35;
      }

      .product-copy strong {
        color: var(--text);
        font-size: clamp(18px, 1.8vw, 20px);
        font-weight: 700;
        line-height: 1.1;
      }

      .product-price {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .price-compare {
        color: var(--secondary-text);
        font-size: 0.85em;
        font-weight: 400;
      }

      .promo-banner,
      .mini-game,
      .newsletter-section {
        padding-bottom: 40px;
        background: transparent;
      }

      .image-panel {
        display: block;
        overflow: hidden;
        border-radius: 24px;
        background: #f0efed;
        box-shadow: var(--shadow-default);
        transition: transform 250ms ease, box-shadow 250ms ease;
      }

      .image-panel:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-hover);
      }

      .delivery-banner-link {
        cursor: pointer;
        display: block;
        text-decoration: none;
      }

      .image-panel img {
        width: 100%;
        min-height: 260px;
        object-fit: cover;
        object-position: center;
        filter: contrast(1.03);
      }

      .newsletter {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) minmax(min(320px, 100%), 500px);
        align-items: center;
        gap: 22px;
        padding: 22px;
        border-radius: 24px;
        background: #FFFFFF;
        box-shadow: var(--shadow-default);
      }

      .newsletter-avatar {
        width: 84px;
        height: 84px;
        border-radius: 50%;
        object-fit: cover;
      }

      .newsletter-copy {
        display: grid;
        gap: 8px;
      }

      .newsletter-copy h2,
      .newsletter-copy p {
        margin: 0;
      }

      .newsletter-copy h2 {
        color: var(--text);
        font-size: clamp(22px, 2vw, 30px);
        font-weight: 700;
        line-height: 1.05;
      }

      .newsletter-copy p {
        color: var(--secondary-text);
        font-size: 13px;
        line-height: 1.45;
      }

      .newsletter-form {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        padding: 6px;
        border-radius: 999px;
        background: #F7F7F6;
      }

      .newsletter-form input {
        flex: 1;
        min-width: 0;
        height: 48px;
        padding: 0 16px;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--text);
        font-size: 14px;
      }

      .newsletter-form input::placeholder {
        color: var(--secondary-text);
      }

      .newsletter-form button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary);
        color: #FFFFFF;
        box-shadow: 0 8px 18px rgba(255, 107, 154, 0.24);
        transition: transform 220ms ease, box-shadow 220ms ease;
      }

      .newsletter-form button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(255, 107, 154, 0.3);
      }

      .newsletter-form svg {
        width: 21px;
        height: 21px;
        stroke: currentColor;
      }

      .site-footer {
        width: min(calc(100% - 48px), var(--container));
        margin: 0 auto;
        padding: 0 0 calc(28px + env(safe-area-inset-bottom, 0px));
        color: var(--secondary-text);
        font-size: 13px;
        text-align: right;
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

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition-duration: 1ms !important;
        }

        .hero__cta .hero__button {
          animation: none;
        }
      }

      @media (max-width: 900px) {
        .navbar {
          padding: 0 16px;
        }

        .brand {
          width: 74px;
          min-width: 74px;
        }

        .desktop-nav,
        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: inline-flex;
        }

        .section-inner,
        .promo-banner,
        .mini-game,
        .newsletter-section,
        .site-footer {
          width: min(calc(100% - 32px), var(--container));
        }

        .product-grid {
          gap: 18px;
        }

        .product-card {
          padding: 14px;
          border-radius: 22px;
        }

        .newsletter {
          grid-template-columns: auto 1fr;
        }

        .newsletter-form {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (max-width: 768px) {
        .hero {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 82vh;
          min-height: 620px;
          margin-top: 0 !important;
          padding-top: 0 !important;
          background-image: url('/images/hero-mobile.jpg');
          background-image: image-set(
            url('/images/hero-mobile.webp') type('image/webp'),
            url('/images/hero-mobile.jpg') type('image/jpeg')
          );
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
        }

        .hero__cta {
          position: absolute;
          top: calc(38% - 60px);
          left: 50%;
          transform: translateX(-50%);
        }

        .hero__cta .hero__button {
          animation: none;
          transform: none;
          width: 200px;
          height: 52px;
          font-size: 15px;
        }

        .hero__cta .hero__button:hover {
          transform: scale(1.08);
        }
      }

      @media (max-width: 640px) {
        .section-inner,
        .promo-banner,
        .mini-game,
        .newsletter-section,
        .site-footer {
          width: min(calc(100% - 32px), var(--container));
        }

        .navbar {
          height: 56px;
        }

        .nav-actions {
          gap: 4px;
        }

        .icon-button {
          width: 44px;
          height: 44px;
        }

        .icon-button svg {
          width: 19px;
          height: 19px;
        }

        .hits-section {
          margin-top: -80px;
          padding-top: 120px;
          padding-bottom: 64px;
        }

        .section-header {
          margin-bottom: 28px;
        }

        .product-grid {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(220px, 76vw);
          grid-template-columns: none;
          gap: 14px;
          margin-inline: -16px;
          padding-inline: 16px;
          scroll-padding-inline-start: 16px;
          overflow-x: auto;
          overscroll-behavior-inline: contain;
          scroll-snap-type: inline mandatory;
        }

        .product-card {
          gap: 12px;
          scroll-snap-align: start;
        }

        .badge {
          top: 10px;
          left: 10px;
        }

        .favorite-button {
          top: 10px;
          right: 10px;
        }

        .image-panel {
          border-radius: 20px;
        }

        .image-panel img {
          min-height: 180px;
        }

        .newsletter {
          grid-template-columns: 1fr;
          text-align: center;
          gap: 12px;
          padding: 20px 16px;
          border-radius: 20px;
        }

        .newsletter-avatar {
          width: 72px;
          height: 72px;
          margin: 0 auto;
        }

        .newsletter-copy {
          justify-items: center;
        }

        .newsletter-form {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (max-width: 430px) {
        .brand {
          width: 68px;
          min-width: 68px;
        }

        .section-header h2 {
          font-size: 34px;
        }

        .section-header a {
          font-size: 12px;
        }
      }

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
      <main>
        ${Navbar()}
        ${OverlayPanels()}
        ${Hero()}
        ${HitsSection()}
        ${PromoBanner()}
        ${MiniGame()}
        ${Newsletter()}
      </main>
      <footer class="site-footer">
        stay chill
        <span class="footer-sep">·</span>
        <a href="mailto:furai@furai.space" class="footer-credit">made by FURAI LAB</a>
      </footer>
      <p class="sr-only">
        ${appConfig.domain} homepage with a hero, hits, promo banner, mini game and newsletter.
      </p>
    </div>
  </body>
</html>`;
}
