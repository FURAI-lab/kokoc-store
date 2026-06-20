import {
  i18n,
  languageSwitcherScript,
  languageSwitcherStyles,
  renderLanguageSwitcher
} from "../lib/i18n.js";
import { renderSeoHead } from "../lib/seo.js";

export function renderMinigamePage(appConfig, locale = "ru") {
  const tr = i18n(locale);
  const langSwitcher = renderLanguageSwitcher(tr);

  return `<!DOCTYPE html>
<html lang="${tr.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    ${renderSeoHead({
      appConfig,
      title: `${locale === "en" ? "Mini-game" : "Мини-игра"} — Kokoc Store`,
      description: tr.t("minigameSeoDescription"),
      path: "/minigame",
      locale: tr.locale,
      noindex: true
    })}
    <meta name="theme-color" content="#f5c2d8" />
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

      * { box-sizing: border-box; }

      html { background: var(--bg); }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(255, 196, 220, 0.52), transparent 26%),
          radial-gradient(circle at top right, rgba(143, 219, 255, 0.34), transparent 28%),
          linear-gradient(180deg, #fffaf5 0%, #f8ede8 100%);
        display: grid;
        place-items: center;
        overflow-x: hidden;
      }

      .page {
        position: relative;
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 40px 20px;
        opacity: 0;
        transform: translateY(18px);
        animation: enter 650ms ease forwards;
      }

      .card {
        max-width: 520px;
        width: 100%;
        padding: 48px 40px;
        border-radius: 34px;
        background: var(--glass);
        border: 1px solid var(--line);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        box-shadow: var(--shadow);
        text-align: center;
        display: grid;
        gap: 20px;
      }

      .icon {
        font-size: 3.2rem;
        line-height: 1;
      }

      .eyebrow {
        margin: 0;
        font-size: 0.82rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--muted);
      }

      h1 {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
        font-size: clamp(2rem, 6vw, 3.2rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
      }

      .lead {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--muted);
      }

      .status {
        display: inline-flex;
        align-self: center;
        justify-self: center;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.56);
        border: 1px solid rgba(116, 82, 90, 0.12);
        font-size: 0.9rem;
      }

      .status::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--pink);
        box-shadow: 0 0 0 5px rgba(255, 90, 166, 0.18);
        animation: pulse 2s ease-in-out infinite;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.88rem;
        color: var(--muted);
        text-decoration: none;
        margin-top: 4px;
      }
      .back-link:hover { color: var(--text); }

      .language-wrap {
        position: fixed;
        top: 18px;
        right: 18px;
        z-index: 5;
      }

${languageSwitcherStyles}

      @keyframes enter {
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      @media (max-width: 520px) {
        .card {
          padding: 32px 22px;
          border-radius: 24px;
        }
        h1 { font-size: 2rem; }
      }
    </style>
  </head>
  <body>
    <div class="language-wrap">
      ${langSwitcher}
    </div>
    <main class="page">
      <div class="card">
        <div class="icon">🎮</div>
        <p class="eyebrow">Kokoc Store</p>
        <h1>Скоро</h1>
        <p class="lead">
          Мини-игра уже в разработке — следите за обновлениями!
        </p>
        <div class="status">Следите за обновлениями</div>
        <a class="back-link" href="/">← На главную</a>
      </div>
    </main>
    <script>
      (function () {
        ${languageSwitcherScript}
      })();
    </script>
  </body>
</html>`;
}
