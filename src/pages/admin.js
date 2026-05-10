// Admin SPA — все компоненты в одном HTML-файле, без зависимостей.
// Используется vanilla JS + Fetch API. Стиль: утилитарный минимализм.

export function renderAdminPage({ page }) {
  if (page === "login") return loginPage();
  return appPage();
}

// ─── Login ────────────────────────────────────────────────────────────────────

function loginPage() {
  return /* html */`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kokoc Admin</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #e89be8;
      --surface: #F4EDE4;
      --border: #181717;
      --accent: #F4EDE4;
      --text: #181717;
      --muted: #666;
      --danger: #ff4757;
      --font: 'DM Mono', 'Courier New', monospace;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-box {
      width: 340px;
    }
    .login-logo {
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 40px;
    }
    .login-logo span {
      color: var(--accent);
    }
    h1 {
      font-size: 28px;
      font-weight: 400;
      letter-spacing: -0.03em;
      margin-bottom: 32px;
    }
    input[type="password"] {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: var(--font);
      font-size: 16px;
      padding: 14px 16px;
      outline: none;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
      transition: border-color 0.15s;
    }
    input[type="password"]:focus { border-color: var(--accent); }
    button {
      width: 100%;
      background: var(--accent);
      color: #000;
      border: none;
      font-family: var(--font);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 14px;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    button:hover { opacity: 0.85; }
    .error {
      color: var(--danger);
      font-size: 12px;
      margin-top: 10px;
      min-height: 18px;
    }
  </style>
</head>
<body>
  <div class="login-box">
    <div class="login-logo"><span>KOKOC</span> / ADMIN</div>
    <h1>Вход</h1>
    <input type="password" id="pwd" placeholder="Пароль" autofocus>
    <button id="btn">Войти</button>
    <div class="error" id="err"></div>
  </div>
  <script>
    const btn = document.getElementById('btn');
    const pwd = document.getElementById('pwd');
    const err = document.getElementById('err');

    async function login() {
      err.textContent = '';
      btn.disabled = true;
      try {
        const r = await fetch('/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd.value })
        });
        if (r.ok) { window.location.href = '/admin'; return; }
        err.textContent = 'Неверный пароль';
      } catch {
        err.textContent = 'Ошибка сети';
      }
      btn.disabled = false;
    }

    btn.addEventListener('click', login);
    pwd.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
  </script>
</body>
</html>`;
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function appPage() {
  return /* html */`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kokoc Admin</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0f0f;
      --surface: #161616;
      --surface2: #1e1e1e;
      --border: #252525;
      --border2: #333;
      --accent: #F4EDE4;
      --accent-dim: rgba(232,255,71,0.12);
      --text: #efefef;
      --muted: #666;
      --muted2: #444;
      --danger: #ff4757;
      --success: #2ed573;
      --warning: #ffa502;
      --info: #70a1ff;
      --font: 'DM Mono', 'Courier New', monospace;
      --sidebar: 220px;
    }

    /* ── Reset & base ── */
    body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 13px; line-height: 1.5; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: var(--font); }
    input, textarea, select {
      font-family: var(--font);
      font-size: 13px;
      background: var(--surface2);
      border: 1px solid var(--border2);
      color: var(--text);
      outline: none;
      padding: 9px 12px;
      width: 100%;
      transition: border-color 0.15s;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--accent); }
    textarea { resize: vertical; min-height: 80px; }

    /* ── Layout ── */
    #app { display: flex; min-height: 100vh; }

    /* ── Sidebar ── */
    #sidebar {
      width: var(--sidebar);
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: fixed;
      top: 0; left: 0; bottom: 0;
    }
    .sidebar-logo {
      padding: 20px 20px 18px;
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .sidebar-logo span { color: var(--accent); }
    nav { flex: 1; padding: 12px 0; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      color: var(--muted);
      font-size: 12px;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: color 0.12s, background 0.12s;
      user-select: none;
    }
    .nav-item:hover { color: var(--text); background: var(--surface2); }
    .nav-item.active { color: var(--accent); background: var(--accent-dim); }
    .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }
    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
    }
    .logout-btn {
      background: none;
      border: 1px solid var(--border2);
      color: var(--muted);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 7px 12px;
      width: 100%;
      transition: all 0.12s;
    }
    .logout-btn:hover { border-color: var(--danger); color: var(--danger); }

    /* ── Main ── */
    #main {
      flex: 1;
      margin-left: var(--sidebar);
      display: flex;
      flex-direction: column;
    }
    .topbar {
      padding: 18px 28px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--surface);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .topbar-title {
      font-size: 15px;
      letter-spacing: -0.02em;
    }
    .content { padding: 28px; flex: 1; }

    /* ── Stats ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 20px 24px;
    }
    .stat-label {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 10px;
    }
    .stat-value {
      font-size: 28px;
      letter-spacing: -0.04em;
    }
    .stat-card.accent .stat-value { color: var(--accent); }

    /* ── Table ── */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    tr:hover td { background: var(--surface2); }
    .mono { font-family: var(--font); }

    /* ── Badge ── */
    .badge {
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 8px;
      border: 1px solid currentColor;
    }
    .badge-active { color: var(--success); }
    .badge-draft { color: var(--muted); }
    .badge-archived { color: var(--danger); }
    .badge-paid { color: var(--success); }
    .badge-pending { color: var(--warning); }
    .badge-fulfilled { color: var(--accent); }
    .badge-shipped { color: var(--info); }
    .badge-cancelled { color: var(--danger); }

    /* ── Buttons ── */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--border2);
      background: none;
      color: var(--text);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 8px 14px;
      transition: all 0.12s;
    }
    .btn:hover { border-color: var(--text); }
    .btn-primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #000;
      font-weight: 700;
    }
    .btn-primary:hover { opacity: 0.85; }
    .btn-danger { color: var(--danger); border-color: var(--danger); }
    .btn-danger:hover { background: var(--danger); color: #fff; }
    .btn-sm { padding: 5px 10px; font-size: 10px; }

    /* ── Form / Modal ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 100;
    }
    .modal {
      background: var(--surface);
      border: 1px solid var(--border2);
      width: 540px;
      max-width: 95vw;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      background: var(--surface);
      z-index: 1;
    }
    .modal-title { font-size: 14px; letter-spacing: -0.02em; }
    .modal-close {
      background: none;
      border: none;
      color: var(--muted);
      font-size: 20px;
      line-height: 1;
      transition: color 0.12s;
    }
    .modal-close:hover { color: var(--text); }
    .modal-body { padding: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-label {
      display: block;
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    /* ── Drawer (product detail) ── */
    .drawer-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 90;
    }
    .drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: 700px;
      max-width: 95vw;
      background: var(--surface);
      border-left: 1px solid var(--border2);
      overflow-y: auto;
      z-index: 91;
    }
    .drawer-header {
      padding: 20px 28px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      background: var(--surface);
    }
    .drawer-body { padding: 24px 28px; }
    .section-title {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 14px;
      margin-top: 28px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    .section-title:first-child { margin-top: 0; }

    /* ── Variants inline ── */
    .variant-row {
      display: grid;
      grid-template-columns: 1fr 80px 80px 70px 60px auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
    .variant-row:last-child { border-bottom: none; }
    .variant-inp {
      background: var(--surface2);
      border: 1px solid transparent;
      padding: 6px 8px;
      color: var(--text);
      font-family: var(--font);
      font-size: 12px;
      width: 100%;
    }
    .variant-inp:focus { border-color: var(--accent); outline: none; }

    /* ── Upload ── */
    .upload-zone {
      border: 1px dashed var(--border2);
      padding: 20px;
      text-align: center;
      color: var(--muted);
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
    }
    .upload-zone:hover { border-color: var(--accent); color: var(--text); }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 12px;
    }
    .image-thumb {
      position: relative;
      aspect-ratio: 1;
      background: var(--surface2);
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .image-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .image-thumb button {
      position: absolute;
      top: 4px; right: 4px;
      background: rgba(0,0,0,0.7);
      border: none;
      color: var(--danger);
      width: 22px; height: 22px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Misc ── */
    .empty { color: var(--muted); padding: 40px; text-align: center; font-size: 12px; }
    .loading { color: var(--muted); padding: 20px; text-align: center; }
    .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .toolbar-spacer { flex: 1; }
    .price { font-variant-numeric: tabular-nums; }
    .text-muted { color: var(--muted); }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
    .flex { display: flex; align-items: center; gap: 8px; }
    .toast {
      position: fixed;
      bottom: 24px; right: 24px;
      background: var(--surface2);
      border: 1px solid var(--border2);
      padding: 12px 18px;
      font-size: 12px;
      z-index: 200;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.2s;
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.ok { border-color: var(--success); color: var(--success); }
    .toast.err { border-color: var(--danger); color: var(--danger); }

    select { appearance: none; }
    .filter-select {
      width: auto;
      padding: 7px 30px 7px 12px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
    }
  </style>
</head>
<body>
<div id="app">
  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="sidebar-logo"><span>KOKOC</span> / ADMIN</div>
    <nav id="nav"></nav>
    <div class="sidebar-footer">
      <button class="logout-btn" onclick="logout()">Выйти</button>
    </div>
  </aside>

  <!-- Main -->
  <div id="main">
    <div class="topbar">
      <div class="topbar-title" id="page-title">Загрузка...</div>
      <div id="topbar-actions"></div>
    </div>
    <div class="content" id="content">
      <div class="loading">Загрузка...</div>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
// ─── State & Router ───────────────────────────────────────────────────────────

const routes = [
  { id: 'dashboard',   icon: '◈', label: 'Дашборд',    hash: '#/' },
  { id: 'products',    icon: '▦', label: 'Товары',      hash: '#/products' },
  { id: 'orders',      icon: '◎', label: 'Заказы',      hash: '#/orders' },
  { id: 'subscribers', icon: '◉', label: 'Подписчики', hash: '#/subscribers' },
];

let currentRoute = 'dashboard';

// ─── API helpers ──────────────────────────────────────────────────────────────

async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch('/admin/api' + path, opts);
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || 'Ошибка');
  return data;
}

const GET  = p      => api('GET', p);
const POST = (p, b) => api('POST', p, b);
const PATCH= (p, b) => api('PATCH', p, b);
const DEL  = p      => api('DELETE', p);

// ─── Toast ────────────────────────────────────────────────────────────────────

let toastTimer;
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function rub(minor) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })
    .format(minor / 100);
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function badge(status) {
  const map = {
    active: ['active', 'Активен'],
    draft: ['draft', 'Черновик'],
    archived: ['archived', 'Архив'],
    paid: ['paid', 'Оплачен'],
    awaiting_payment: ['pending', 'Ожидание'],
    pending: ['pending', 'Новый'],
    confirmed: ['active', 'Подтверждён'],
    fulfilled: ['fulfilled', 'Выполнен'],
    shipped: ['shipped', 'Отправлен'],
    delivered: ['active', 'Доставлен'],
    cancelled: ['cancelled', 'Отменён'],
  };
  const [cls, label] = map[status] || ['draft', status];
  return \`<span class="badge badge-\${cls}">\${label}</span>\`;
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function renderNav(active) {
  document.getElementById('nav').innerHTML = routes.map(r => \`
    <div class="nav-item \${r.id === active ? 'active' : ''}" onclick="navigate('\${r.hash}')">
      <span class="icon">\${r.icon}</span>
      \${r.label}
    </div>
  \`).join('');
}

function navigate(hash) {
  window.location.hash = hash;
}

async function logout() {
  await fetch('/admin/logout');
  window.location.href = '/admin/login';
}

// ─── Router ───────────────────────────────────────────────────────────────────

function onHashChange() {
  const hash = window.location.hash || '#/';
  if (hash.startsWith('#/products')) {
    showProducts();
  } else if (hash.startsWith('#/orders')) {
    showOrders();
  } else if (hash.startsWith('#/subscribers')) {
    showSubscribers();
  } else {
    showDashboard();
  }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function showDashboard() {
  currentRoute = 'dashboard';
  renderNav('dashboard');
  document.getElementById('page-title').textContent = 'Дашборд';
  document.getElementById('topbar-actions').innerHTML = '';
  setContent('<div class="loading">Загрузка...</div>');

  try {
    const s = await GET('/stats');
    setContent(\`
      <div class="stats-grid">
        <div class="stat-card accent">
          <div class="stat-label">Активных товаров</div>
          <div class="stat-value">\${s.activeProducts}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Всего заказов</div>
          <div class="stat-value">\${s.totalOrders}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ожидают обработки</div>
          <div class="stat-value \${s.pendingOrders > 0 ? 'text-danger' : 'text-muted'}">\${s.pendingOrders}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Выручка (оплачено)</div>
          <div class="stat-value">\${rub(s.revenueMinor)}</div>
        </div>
      </div>
      <div class="text-muted" style="font-size:11px;margin-top:8px">
        Быстрые ссылки: &nbsp;
        <span style="cursor:pointer;text-decoration:underline" onclick="navigate('#/products')">Товары →</span>
        &nbsp;&nbsp;
        <span style="cursor:pointer;text-decoration:underline" onclick="navigate('#/orders')">Заказы →</span>
      </div>
    \`);
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

let products = [];

async function showProducts() {
  currentRoute = 'products';
  renderNav('products');
  document.getElementById('page-title').textContent = 'Товары';
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn btn-primary" onclick="openNewProduct()">+ Новый товар</button>
  \`;
  setContent('<div class="loading">Загрузка...</div>');
  try {
    await loadProducts();
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

async function loadProducts() {
  try {
    const data = await GET('/products');
    products = data.products;
    renderProductsTable();
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

function renderProductsTable() {
  if (!products.length) {
    setContent('<div class="empty">Товаров ещё нет. Создайте первый!</div>');
    return;
  }

  setContent(\`
    <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Slug</th>
          <th>Статус</th>
          <th>Вариантов</th>
          <th>Обновлён</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        \${products.map(p => \`
          <tr>
            <td><strong>\${esc(p.title)}</strong></td>
            <td class="text-muted">\${esc(p.slug)}</td>
            <td>\${badge(p.status)}</td>
            <td>\${p.variant_count}</td>
            <td class="text-muted">\${formatDate(p.updated_at)}</td>
            <td>
              <div class="flex">
                <button class="btn btn-sm" onclick="openProduct('\${p.id}')">Открыть</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('\${p.id}', '\${esc(p.title)}')">✕</button>
              </div>
            </td>
          </tr>
        \`).join('')}
      </tbody>
    </table>
    </div>
  \`);
}

// ── New product modal ──

function openNewProduct() {
  showModal('Новый товар', \`
    <div class="form-group">
      <label class="form-label">Название *</label>
      <input id="f-title" placeholder="Classic Clog">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Slug * (URL)</label>
        <input id="f-slug" placeholder="classic-clog">
      </div>
      <div class="form-group">
        <label class="form-label">Статус</label>
        <select id="f-status">
          <option value="draft">Черновик</option>
          <option value="active">Активен</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Бренд</label>
      <input id="f-brand" value="Kokoc Store">
    </div>
    <div class="form-group">
      <label class="form-label">Описание</label>
      <textarea id="f-desc" placeholder="Описание товара..."></textarea>
    </div>
  \`, async () => {
    const title = document.getElementById('f-title').value.trim();
    const slug  = document.getElementById('f-slug').value.trim();
    if (!title || !slug) { toast('Заполните название и slug', 'err'); return; }

    try {
      await POST('/products', {
        title, slug,
        description: document.getElementById('f-desc').value.trim() || null,
        brand: document.getElementById('f-brand').value.trim(),
        status: document.getElementById('f-status').value
      });
      closeModal();
      toast('Товар создан');
      await loadProducts();
    } catch(e) { toast(e.message, 'err'); }
  });

  // Auto-slug from title
  document.getElementById('f-title').addEventListener('input', e => {
    const slugField = document.getElementById('f-slug');
    if (!slugField._touched) {
      slugField.value = e.target.value.toLowerCase()
        .replace(/[аА]/g,'a').replace(/[бБ]/g,'b').replace(/[вВ]/g,'v')
        .replace(/\\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    }
  });
  document.getElementById('f-slug').addEventListener('input', () => {
    document.getElementById('f-slug')._touched = true;
  });
}

async function deleteProduct(id, title) {
  if (!confirm(\`Удалить «\${title}»? Все варианты и изображения тоже удалятся.\`)) return;
  try {
    await DEL('/products/' + id);
    toast('Товар удалён');
    await loadProducts();
  } catch(e) { toast(e.message, 'err'); }
}

// ── Product drawer ──

let drawerProduct = null;
let drawerVariants = [];
let drawerImages = [];

async function openProduct(id) {
  showDrawer('<div class="loading">Загрузка...</div>');
  try {
    const data = await GET('/products/' + id);
    drawerProduct = data.product;
    drawerVariants = data.variants;
    drawerImages = data.images;
    renderDrawer();
  } catch(e) {
    closeDrawer();
    toast(e.message, 'err');
  }
}

function renderDrawer() {
  const p = drawerProduct;
  setDrawerContent(\`
    <div class="drawer-header">
      <div>
        <div style="font-size:16px;letter-spacing:-0.02em">\${esc(p.title)}</div>
        <div class="text-muted" style="font-size:11px;margin-top:2px">/\${esc(p.slug)}</div>
      </div>
      <button class="modal-close" onclick="closeDrawer()">×</button>
    </div>
    <div class="drawer-body">

      <!-- Basic info -->
      <div class="section-title">Основное</div>
      <div class="form-row" style="margin-bottom:12px">
        <div class="form-group">
          <label class="form-label">Название</label>
          <input id="d-title" value="\${esc(p.title)}">
        </div>
        <div class="form-group">
          <label class="form-label">Статус</label>
          <select id="d-status">
            <option value="draft" \${p.status==='draft'?'selected':''}>Черновик</option>
            <option value="active" \${p.status==='active'?'selected':''}>Активен</option>
            <option value="archived" \${p.status==='archived'?'selected':''}>Архив</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Описание</label>
        <textarea id="d-desc">\${esc(p.description || '')}</textarea>
      </div>
      <div style="display:flex;gap:10px;margin-top:4px">
        <button class="btn btn-primary btn-sm" onclick="saveProductBasic()">Сохранить</button>
      </div>

      <!-- Variants -->
      <div class="section-title" style="margin-top:28px">
        Варианты (размеры / цвета)
        <button class="btn btn-sm" style="float:right;margin-top:-4px" onclick="openNewVariant()">+ Добавить</button>
      </div>
      <div id="variants-list">
        \${renderVariantsList()}
      </div>

      <!-- Images -->
      <div class="section-title">
        Фотографии
        <label class="btn btn-sm" style="float:right;margin-top:-4px;cursor:pointer">
          + Загрузить
          <input type="file" multiple accept="image/*" style="display:none" onchange="uploadImages(this)">
        </label>
      </div>
      <div id="images-grid">
        \${renderImageGrid()}
      </div>

    </div>
  \`);
}

function renderVariantsList() {
  if (!drawerVariants.length) {
    return '<div class="empty" style="padding:20px 0">Вариантов нет</div>';
  }
  return drawerVariants.map(v => \`
    <div class="variant-row" id="var-\${v.id}">
      <span class="text-muted" style="font-size:11px">\${esc(v.title)}<br><span style="font-size:10px;color:#444">\${esc(v.sku)}</span></span>
      <span>\${v.size_label || '—'}</span>
      <span class="price">\${rub(v.price_minor)}</span>
      <span class="\${v.inventory_quantity > 0 ? 'text-success' : 'text-danger'}">\${v.inventory_quantity} шт</span>
      <span>\${badge(v.is_active ? 'active' : 'archived')}</span>
      <div class="flex">
        <button class="btn btn-sm" onclick="openEditVariant('\${v.id}')">✎</button>
        <button class="btn btn-sm btn-danger" onclick="deleteVariant('\${v.id}')">✕</button>
      </div>
    </div>
  \`).join('');
}

function renderImageGrid() {
  if (!drawerImages.length) {
    return '<div class="text-muted" style="font-size:11px;padding:12px 0">Изображений нет</div>';
  }
  return \`<div class="image-grid">
    \${drawerImages.map(img => \`
      <div class="image-thumb">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);padding:6px;text-align:center">
          \${esc(img.r2_key.split('/').pop())}
        </div>
        <button onclick="deleteImage('\${img.id}')">✕</button>
      </div>
    \`).join('')}
  </div>\`;
}

async function saveProductBasic() {
  try {
    await PATCH('/products/' + drawerProduct.id, {
      title: document.getElementById('d-title').value.trim(),
      description: document.getElementById('d-desc').value.trim() || null,
      status: document.getElementById('d-status').value,
    });
    toast('Сохранено');
    await loadProducts();
  } catch(e) { toast(e.message, 'err'); }
}

// ── Variant modal ──

function openNewVariant() {
  variantModal(null);
}

function openEditVariant(vid) {
  const v = drawerVariants.find(x => x.id === vid);
  variantModal(v);
}

function variantModal(v) {
  showModal(v ? 'Изменить вариант' : 'Новый вариант', \`
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Название *</label>
        <input id="v-title" value="\${esc(v?.title || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">SKU *</label>
        <input id="v-sku" value="\${esc(v?.sku || '')}" \${v ? 'readonly style="opacity:0.5"' : ''}>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Размер</label>
        <input id="v-size" placeholder="M / 42 / S-M" value="\${esc(v?.size_label || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Цвет</label>
        <input id="v-color" placeholder="Чёрный" value="\${esc(v?.color_label || '')}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Цена (₽) *</label>
        <input id="v-price" type="number" placeholder="2990" value="\${v ? v.price_minor/100 : ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Старая цена (₽)</label>
        <input id="v-compare" type="number" placeholder="3990" value="\${v?.compare_at_minor ? v.compare_at_minor/100 : ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Остаток (шт)</label>
        <input id="v-stock" type="number" value="\${v?.inventory_quantity ?? 0}">
      </div>
      <div class="form-group">
        <label class="form-label">Активен</label>
        <select id="v-active">
          <option value="1" \${v?.is_active !== 0 ? 'selected' : ''}>Да</option>
          <option value="0" \${v?.is_active === 0 ? 'selected' : ''}>Нет</option>
        </select>
      </div>
    </div>
  \`, async () => {
    const price = parseFloat(document.getElementById('v-price').value);
    const compare = parseFloat(document.getElementById('v-compare').value);
    if (!document.getElementById('v-title').value.trim() || isNaN(price)) {
      toast('Заполните название и цену', 'err'); return;
    }
    try {
      const payload = {
        title: document.getElementById('v-title').value.trim(),
        size_label: document.getElementById('v-size').value.trim() || null,
        color_label: document.getElementById('v-color').value.trim() || null,
        price_minor: Math.round(price * 100),
        compare_at_minor: isNaN(compare) ? null : Math.round(compare * 100),
        inventory_quantity: parseInt(document.getElementById('v-stock').value, 10) || 0,
        is_active: parseInt(document.getElementById('v-active').value, 10),
      };
      if (v) {
        await PATCH('/variants/' + v.id, payload);
        toast('Вариант обновлён');
      } else {
        payload.sku = document.getElementById('v-sku').value.trim();
        await POST('/products/' + drawerProduct.id + '/variants', payload);
        toast('Вариант добавлен');
      }
      closeModal();
      const data = await GET('/products/' + drawerProduct.id);
      drawerVariants = data.variants;
      document.getElementById('variants-list').innerHTML = renderVariantsList();
    } catch(e) { toast(e.message, 'err'); }
  });
}

async function deleteVariant(vid) {
  if (!confirm('Удалить вариант?')) return;
  try {
    await DEL('/variants/' + vid);
    toast('Вариант удалён');
    const data = await GET('/products/' + drawerProduct.id);
    drawerVariants = data.variants;
    document.getElementById('variants-list').innerHTML = renderVariantsList();
  } catch(e) { toast(e.message, 'err'); }
}

async function uploadImages(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  toast('Загрузка...');
  for (let i = 0; i < files.length; i++) {
    const fd = new FormData();
    fd.append('file', files[i]);
    fd.append('position', String(drawerImages.length + i));
    await fetch('/admin/api/products/' + drawerProduct.id + '/images', { method: 'POST', body: fd });
  }
  const data = await GET('/products/' + drawerProduct.id);
  drawerImages = data.images;
  document.getElementById('images-grid').innerHTML = renderImageGrid();
  toast('Фото загружены');
}

async function deleteImage(imgId) {
  if (!confirm('Удалить фото?')) return;
  try {
    await DEL('/images/' + imgId);
    const data = await GET('/products/' + drawerProduct.id);
    drawerImages = data.images;
    document.getElementById('images-grid').innerHTML = renderImageGrid();
    toast('Фото удалено');
  } catch(e) { toast(e.message, 'err'); }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

let orderFilter = '';

async function showOrders() {
  currentRoute = 'orders';
  renderNav('orders');
  document.getElementById('page-title').textContent = 'Заказы';
  document.getElementById('topbar-actions').innerHTML = '';
  setContent('<div class="loading">Загрузка...</div>');
  try {
    await loadOrders();
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

async function loadOrders() {
  try {
    const qs = orderFilter ? '?status=' + orderFilter : '';
    const data = await GET('/orders' + qs);
    renderOrdersTable(data.orders, data.total);
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

function renderOrdersTable(orders, total) {
  setContent(\`
    <div class="toolbar">
      <select class="filter-select" onchange="filterOrders(this.value)">
        <option value="" \${orderFilter===''?'selected':''}>Все заказы (\${total})</option>
        <option value="pending" \${orderFilter==='pending'?'selected':''}>Новые</option>
        <option value="confirmed" \${orderFilter==='confirmed'?'selected':''}>Подтверждённые</option>
        <option value="cancelled" \${orderFilter==='cancelled'?'selected':''}>Отменённые</option>
      </select>
    </div>
    \${!orders.length
      ? '<div class="empty">Заказов пока нет</div>'
      : \`<div class="table-wrap"><table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Покупатель</th>
            <th>Город</th>
            <th>Статус</th>
            <th>Оплата</th>
            <th>Доставка</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          \${orders.map(o => \`
            <tr>
              <td class="mono">\${esc(o.order_number)}</td>
              <td>\${esc(o.customer_email)}<br><span class="text-muted">\${esc(o.customer_phone||'')}</span></td>
              <td class="text-muted">\${esc(o.shipping_city||'—')}</td>
              <td>\${badge(o.status)}</td>
              <td>\${badge(o.payment_status)}</td>
              <td>\${badge(o.fulfillment_status)}</td>
              <td class="price">\${rub(o.total_minor)}</td>
              <td class="text-muted">\${formatDate(o.created_at)}</td>
              <td><button class="btn btn-sm" onclick="openOrder('\${o.id}')">Открыть</button></td>
            </tr>
          \`).join('')}
        </tbody>
      </table></div>\`
    }
  \`);
}

function filterOrders(status) {
  orderFilter = status;
  loadOrders();
}

async function showSubscribers() {
  currentRoute = 'subscribers';
  renderNav('subscribers');
  document.getElementById('page-title').textContent = 'Подписчики';
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn" onclick="exportSubscribers()">↓ CSV</button>
  \`;
  setContent('<div class="loading">Загрузка...</div>');

  try {
    const data = await GET('/subscribers');
    if (!data.subscribers.length) {
      setContent('<div class="empty">Подписчиков пока нет</div>');
      return;
    }
    setContent(\`
      <div class="toolbar">
        <span class="text-muted">Всего: \${data.total}</span>
      </div>
      <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Источник</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          \${data.subscribers.map(s => \`
            <tr>
              <td>\${esc(s.email)}</td>
              <td class="text-muted">\${esc(s.source)}</td>
              <td class="text-muted">\${formatDate(s.created_at)}</td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
      </div>
    \`);
    window._subscribers = data.subscribers;
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

function exportSubscribers() {
  const subs = window._subscribers || [];
  if (!subs.length) return;
  const csv = 'email,source,date\\n' +
    subs.map(s => \`\${s.email},\${s.source},\${s.created_at}\`).join('\\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'subscribers.csv';
  a.click();
}

async function openOrder(id) {
  try {
    const data = await GET('/orders/' + id);
    const o = data.order;
    const items = data.items;
    showModal('Заказ ' + o.order_number, \`
      <div class="form-row" style="margin-bottom:12px">
        <div class="form-group">
          <label class="form-label">Статус заказа</label>
          <select id="o-status">
            \${['pending','confirmed','cancelled','refunded'].map(s => \`<option value="\${s}" \${o.status===s?'selected':''}>\${s}</option>\`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Оплата</label>
          <select id="o-payment">
            \${['awaiting_payment','paid','failed','refunded'].map(s => \`<option value="\${s}" \${o.payment_status===s?'selected':''}>\${s}</option>\`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Доставка</label>
        <select id="o-fulfillment">
          \${['unfulfilled','fulfilled','shipped','delivered'].map(s => \`<option value="\${s}" \${o.fulfillment_status===s?'selected':''}>\${s}</option>\`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Адрес</label>
        <div style="padding:10px;background:var(--surface2);color:var(--muted);font-size:12px;line-height:1.7">
          \${esc(o.shipping_name||'')} &nbsp;·&nbsp; \${esc(o.shipping_city||'')} \${esc(o.shipping_postal_code||'')}<br>
          \${esc(o.shipping_address_line1||'')} \${esc(o.shipping_address_line2||'')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Состав заказа</label>
        <div style="padding:10px;background:var(--surface2)">
          \${items.map(i => \`
            <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid var(--border)">
              <span>\${esc(i.product_title)} / \${esc(i.variant_title)} × \${i.quantity}</span>
              <span class="price">\${rub(i.price_minor * i.quantity)}</span>
            </div>
          \`).join('')}
          <div style="text-align:right;margin-top:8px;font-weight:700">\${rub(o.total_minor)}</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Примечание</label>
        <textarea id="o-notes" placeholder="Комментарий менеджера...">\${esc(o.notes||'')}</textarea>
      </div>
    \`, async () => {
      try {
        await PATCH('/orders/' + o.id, {
          status: document.getElementById('o-status').value,
          payment_status: document.getElementById('o-payment').value,
          fulfillment_status: document.getElementById('o-fulfillment').value,
          notes: document.getElementById('o-notes').value.trim() || null,
        });
        toast('Заказ обновлён');
        closeModal();
        await loadOrders();
      } catch(e) { toast(e.message, 'err'); }
    });
  } catch(e) { toast(e.message, 'err'); }
}

// ─── Modal / Drawer helpers ───────────────────────────────────────────────────

let modalSaveCallback = null;

function showModal(title, bodyHtml, onSave) {
  modalSaveCallback = onSave;
  document.body.insertAdjacentHTML('beforeend', \`
    <div class="modal-overlay" id="modal-overlay" onclick="onOverlayClick(event)">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">\${esc(title)}</div>
          <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">\${bodyHtml}</div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Отмена</button>
          <button class="btn btn-primary" onclick="saveModal()">Сохранить</button>
        </div>
      </div>
    </div>
  \`);
}

function onOverlayClick(e) {
  if (e.target.id === 'modal-overlay') closeModal();
}

function closeModal() {
  const el = document.getElementById('modal-overlay');
  if (el) el.remove();
  modalSaveCallback = null;
}

async function saveModal() {
  if (modalSaveCallback) await modalSaveCallback();
}

let drawerEl = null;

function showDrawer(html) {
  closeDrawer();
  document.body.insertAdjacentHTML('beforeend', \`
    <div class="drawer-overlay" id="drawer-overlay" onclick="closeDrawer()"></div>
    <div class="drawer" id="drawer">\${html}</div>
  \`);
}

function setDrawerContent(html) {
  const el = document.getElementById('drawer');
  if (el) el.innerHTML = html;
  else showDrawer(html);
}

function closeDrawer() {
  document.getElementById('drawer-overlay')?.remove();
  document.getElementById('drawer')?.remove();
}

// ─── Content helper ───────────────────────────────────────────────────────────

function setContent(html) {
  document.getElementById('content').innerHTML = html;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

window.addEventListener('hashchange', onHashChange);
onHashChange();
</script>
</body>
</html>`;
}
