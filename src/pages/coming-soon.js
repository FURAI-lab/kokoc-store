export function renderComingSoonPage(appConfig) {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appConfig.domain}</title>
    <meta name="theme-color" content="#f5c2d8" />
    <meta
      name="description"
      content="Мы готовим новый сайт Kokoc Store. Скоро здесь появится полноценный магазин."
    />
    <link rel="preload" as="image" href="/banner-desktop.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favsmall.png" />
    <link rel="icon" type="image/jpeg" sizes="720x720" href="/favbig.jpg" />
    <link rel="apple-touch-icon" href="/favbig.jpg" />
    <style>
      :root {
        --bg: #f9efe9;
        --text: #4d302c;
        --muted: rgba(77, 48, 44, 0.72);
        --line: rgba(255, 255, 255, 0.72);
        --shadow: 0 28px 80px rgba(102, 71, 80, 0.18);
        --glass: rgba(255, 249, 245, 0.62);
        --pink: #ff5aa6;
      }

      * {
        box-sizing: border-box;
      }

      html {
        background: var(--bg);
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(255, 196, 220, 0.52), transparent 26%),
          radial-gradient(circle at top right, rgba(143, 219, 255, 0.34), transparent 28%),
          linear-gradient(180deg, #fffaf5 0%, #f8ede8 100%);
        overflow-x: hidden;
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background:
          linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
          url("/banner-desktop.png") center top / cover no-repeat;
        filter: blur(36px) saturate(1.04);
        transform: scale(1.06);
        opacity: 0.22;
        pointer-events: none;
      }

      .page {
        position: relative;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 20px;
        opacity: 0;
        transform: translateY(18px);
        animation: enter 650ms ease forwards;
      }

      .shell {
        width: min(100%, 1180px);
        display: grid;
        gap: 18px;
      }

      .card {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        gap: 28px;
        align-items: center;
        padding: 24px;
        border-radius: 34px;
        background: var(--glass);
        border: 1px solid var(--line);
        backdrop-filter: blur(24px);
        box-shadow: var(--shadow);
      }

      .visual {
        overflow: hidden;
        border-radius: 26px;
        border: 1px solid rgba(255, 255, 255, 0.68);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.56);
      }

      .visual img {
        display: block;
        width: 100%;
        height: auto;
      }

      .copy {
        display: grid;
        gap: 16px;
        align-content: center;
        padding: 8px 6px;
      }

      .eyebrow {
        margin: 0;
        font-size: 0.86rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--muted);
      }

      h1 {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
        font-size: clamp(2.6rem, 5vw, 4.8rem);
        line-height: 0.96;
        letter-spacing: -0.04em;
      }

      .lead {
        margin: 0;
        font-size: 1.06rem;
        line-height: 1.7;
        color: var(--muted);
        max-width: 28rem;
      }

      .status {
        display: inline-flex;
        width: fit-content;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.56);
        border: 1px solid rgba(116, 82, 90, 0.12);
      }

      .status::before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--pink);
        box-shadow: 0 0 0 6px rgba(255, 90, 166, 0.14);
      }

      .footer-note {
        text-align: center;
        font-size: 0.92rem;
        color: rgba(77, 48, 44, 0.58);
      }

      @keyframes enter {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 900px) {
        .card {
          grid-template-columns: 1fr;
        }

        .copy {
          padding: 0;
        }
      }

      @media (max-width: 720px) {
        body::before {
          background:
            linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
            url("/banner-mobile.png") center top / cover no-repeat;
        }

        .page {
          padding: 12px;
        }

        .card {
          gap: 16px;
          padding: 12px;
          border-radius: 24px;
        }

        .visual {
          border-radius: 18px;
        }

        h1 {
          font-size: clamp(2.2rem, 10vw, 3.4rem);
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="shell">
        <div class="card">
          <div class="visual">
            <picture>
              <source media="(max-width: 720px)" srcset="/banner-mobile.png" />
              <img src="/banner-desktop.png" alt="Kokoc Store coming soon banner" fetchpriority="high" />
            </picture>
          </div>
          <div class="copy">
            <p class="eyebrow">Kokoc Store</p>
            <h1>Скоро тут будет сайт</h1>
            <p class="lead">
              Мы готовим новую версию ${appConfig.domain}. Пока здесь остается приветственный экран,
              а разработка новой витрины продолжается в отдельной beta-версии.
            </p>
            <div class="status">Сайт в разработке</div>
          </div>
        </div>
        <p class="footer-note">Основная витрина скоро откроется.</p>
      </section>
    </main>
  </body>
</html>`;
}
