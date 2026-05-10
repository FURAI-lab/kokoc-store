export function renderLandingPage(appConfig, products = []) {
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
    const badge = escapeHtml(product.badge);
    const badgeClass = escapeHtml(product.badgeClass);
    const price = escapeHtml(product.price || "Нет в наличии");
    const comparePrice = escapeHtml(product.comparePrice);

    return `
      <article class="product-card">
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
          <button class="favorite-button" type="button"
            aria-label="Добавить ${title} в избранное">
            ${iconHeart}
          </button>
        </div>
        <div class="product-copy">
          <h3>${title}</h3>
          ${description
            ? `<p>${description}</p>`
            : ""}
          <div class="product-price">
            ${comparePrice
              ? `<s class="price-compare">${comparePrice}</s>`
              : ""}
            <strong>${price}</strong>
          </div>
        </div>
      </article>
    `;
  };

  const Navbar = () => `
      <header class="navbar" aria-label="Основная навигация">
        <a class="brand" href="/" aria-label="${appConfig.domain}">
          <img src="/menu-logo.png" alt="Kokoc Store" />
        </a>
        <nav class="desktop-nav">
          <a href="#hits">Shop</a>
          <a href="#collabs">Collabs</a>
          <a href="#newsletter">About</a>
        </nav>
        <div class="nav-actions" aria-label="Быстрые действия">
          <button class="icon-button" type="button" aria-label="Поиск">${iconSearch}</button>
          <button class="icon-button desktop-only" type="button" aria-label="Избранное">${iconHeart}</button>
          <button class="icon-button" type="button" aria-label="Корзина">${iconBag}</button>
          <button class="icon-button mobile-only" type="button" aria-label="Меню">${iconMenu}</button>
        </div>
      </header>
  `;

  const Hero = () => `
    <section class="hero" id="about">
      <div class="hero__cta">
        <button class="hero__button" type="button">Shop Now</button>
      </div>
    </section>
  `;

  const HitsSection = () => `
    <section class="hits-section" id="hits">
      <div class="section-inner">
        <div class="section-header">
          <h2>HITS</h2>
          <a href="#collabs">Смотреть все</a>
        </div>
        ${products.length > 0
          ? `<div class="product-grid">
               ${products.map(ProductCard).join("")}
             </div>`
          : `<p style="color:var(--secondary-text);padding:40px 0;text-align:center">
               Товары скоро появятся
             </p>`
        }
      </div>
    </section>
  `;

  const PromoBanner = () => `
    <section class="promo-banner" id="collabs" aria-label="Доставка">
      <a class="image-panel" href="#newsletter">
        <img src="/crops/delivery-bg.png" alt="Доставка по Вьетнаму" loading="lazy" />
      </a>
    </section>
  `;

  const MiniGame = () => `
    <section class="mini-game" aria-label="Mini Game">
      <a class="image-panel" href="#newsletter">
        <img src="/crops/minigame-banner-final.png" alt="Mini Game" loading="lazy" />
      </a>
    </section>
  `;

  const Newsletter = () => `
    <section class="newsletter-section" id="newsletter">
      <div class="newsletter">
        <img class="newsletter-avatar" src="/favbig.jpg" alt="Kokoc cat avatar" loading="lazy" />
        <div class="newsletter-copy">
          <h2>Будь в теме</h2>
          <p>Подпишись и получай новости о дропах первым.</p>
        </div>
        <div class="newsletter-form" id="newsletter-form">
          <input
            type="email"
            id="newsletter-email"
            placeholder="Твоя почта / e-mail"
            aria-label="Email"
            autocomplete="email"
          />
          <button type="button" id="newsletter-btn" aria-label="Подписаться">
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
              msg.textContent = data.error || 'Ошибка, попробуй ещё раз';
              btn.disabled = false;
              input.disabled = false;
            }
          } catch {
            msg.style.display = 'block';
            msg.style.color = '#ff4757';
            msg.textContent = 'Нет соединения, попробуй позже';
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
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appConfig.domain}</title>
    <meta name="theme-color" content="#F7F7F6" />
    <meta
      name="description"
      content="Kokoc Store. Premium pastel lifestyle drops, Crocs collabs, hits and mini game."
    />
    <link rel="preload" as="image" href="/images/hero.png" />
    <link rel="preload" as="image" href="/images/hero-mobile.png" media="(max-width: 768px)" />
    <link rel="preload" as="image" href="/menu-logo.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favsmall.png" />
    <link rel="icon" type="image/jpeg" sizes="720x720" href="/favbig.jpg" />
    <link rel="apple-touch-icon" href="/favbig.jpg" />
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
        font-family: "Avenir Next", "Segoe UI", Arial, sans-serif;
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
        gap: 24px;
        transform: translateX(-50%);
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

      .hero {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 90vh;
        min-height: 700px;
        overflow: hidden;
        background-image: url('/images/hero.png');
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

      .hero__cta button {
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
      }

      .hero__cta button:hover {
        animation: none;
        transform: scale(1.08);
        box-shadow: 0 18px 45px rgba(255, 105, 180, 0.35);
      }

      .hero__cta button:active {
        animation: none;
        transform: scale(0.94);
      }

      .hero__cta button:focus-visible {
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
        transition: transform 250ms ease, box-shadow 250ms ease;
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

      .product-copy {
        display: grid;
        gap: 8px;
      }

      .product-copy h3,
      .product-copy p {
        margin: 0;
      }

      .product-copy h3 {
        color: var(--text);
        font-size: clamp(16px, 1.6vw, 18px);
        font-weight: 600;
        line-height: 1.25;
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
        background: #FFFFFF;
        box-shadow: var(--shadow-default);
        transition: transform 250ms ease, box-shadow 250ms ease;
      }

      .image-panel:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-hover);
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
        grid-template-columns: auto minmax(0, 1fr) minmax(320px, 500px);
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
        padding: 0 0 28px;
        color: var(--secondary-text);
        font-size: 13px;
        text-align: right;
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

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition-duration: 1ms !important;
        }

        .hero__cta button {
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
          background-image: url('/images/hero-mobile.png');
          background-size: cover;
          background-position: center 20%;
          background-repeat: no-repeat;
        }

        .hero__cta {
          position: absolute;
          top: 43%;
          left: 50%;
          transform: translateX(-50%);
        }

        .hero__cta button {
          animation: none;
          transform: none;
        }

        .hero__cta button:hover {
          transform: scale(1.08);
        }
      }

      @media (max-width: 640px) {
        .navbar {
          height: 56px;
        }

        .nav-actions {
          gap: 4px;
        }

        .icon-button {
          width: 34px;
          height: 34px;
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
          grid-template-columns: 64px 1fr;
          gap: 14px;
          padding: 16px;
          border-radius: 20px;
        }

        .newsletter-avatar {
          width: 64px;
          height: 64px;
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
    </style>
  </head>
  <body>
    <div class="page">
      <main>
        ${Navbar()}
        ${Hero()}
        ${HitsSection()}
        ${PromoBanner()}
        ${MiniGame()}
        ${Newsletter()}
      </main>
      <footer class="site-footer">stay chill</footer>
      <p class="sr-only">
        Главная страница ${appConfig.domain} с hero, хитами, промо-баннером, мини-игрой и подпиской.
      </p>
    </div>
  </body>
</html>`;
}
