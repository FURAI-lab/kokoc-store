// Admin SPA — все компоненты в одном HTML-файле, без зависимостей.
// Используется vanilla JS + Fetch API. Стиль утилитарный минимализм.
 
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
      --bg: #F7F7F6;
      --surface: #FFFFFF;
      --surface2: #F0F0EF;
      --border: rgba(0,0,0,0.08);
      --text: #111111;
      --muted: #888888;
      --accent: #FF6B9A;
      --success: #22C55E;
      --warning: #F59E0B;
      --danger: #EF4444;
      --info: #3B82F6;
      --font: "Avenir Next", "Segoe UI", Arial, sans-serif;
      --border2: var(--border);
      --accent-dim: rgba(255,107,154,0.12);
      --muted2: #BBBBBB;
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
      color: var(--text);
      font-weight: 700;
    }
    .btn-primary:hover { opacity: 0.85; }
    .btn-danger { color: var(--danger); border-color: var(--danger); }
    .btn-danger:hover { background: var(--danger); color: var(--surface); }
    .btn-sm { padding: 5px 10px; font-size: 10px; }
 
    /* ── Form / Modal ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
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
      background: var(--surface);
      border: 1px solid var(--border);
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
  { id: 'clients',     icon: '◑', label: 'Клиенты',     hash: '#/clients' },
  { id: 'subscribers', icon: '◉', label: 'Подписчики',  hash: '#/subscribers' },
  { id: 'collabs',     icon: '✦', label: 'Collabs',     hash: '#/collabs' },
  { id: 'categories',  icon: '▤', label: 'Категории',   hash: '#/categories' },
  { id: 'brands',      icon: '◐', label: 'Бренды',      hash: '#/brands' },
  { id: 'discounts',   icon: '◷', label: 'Скидки',      hash: '#/discounts' },
  { id: 'settings',    icon: '✿', label: 'Настройки',   hash: '#/settings' },
  { id: 'adidas',      icon: '◆', label: 'Adidas',       hash: '#/adidas' },
  { id: 'crocs',       icon: '◇', label: 'Crocs',        hash: '#/crocs' },
];
 
let currentRoute = 'dashboard';
 
// ─── Sidebar nav ──────────────────────────────────────────────────────────────
 
function renderNav(active) {
  document.getElementById('nav').innerHTML = routes.map(r =>
    \`<div class="nav-item \${r.id === active ? 'active' : ''}" onclick="navigate('\${r.hash}')">\` +
    \`<span class="icon">\${r.icon}</span>\` +
    r.label +
    '</div>'
  ).join('');
}
function setTopbar(title, actionsHtml) {
  var t = document.getElementById('page-title');
  var a = document.getElementById('topbar-actions');
  if (t) t.textContent = title;
  if (a) a.innerHTML = actionsHtml || '';
}
 
function navigate(hash) {
  if (window.location.hash === hash) { onHashChange(); return; }
  window.location.hash = hash;
}
 
async function logout() {
  await fetch('/admin/logout');
  window.location.href = '/admin/login';
}
 
function onHashChange() {
  var hash = window.location.hash || '#/';
  if      (hash.startsWith('#/products'))    showProducts();
  else if (hash.startsWith('#/orders'))      showOrders();
  else if (hash.startsWith('#/subscribers')) showSubscribers();
  else if (hash.startsWith('#/clients'))     showClients();
  else if (hash.startsWith('#/categories'))  showCategories();
  else if (hash.startsWith('#/brands'))      showBrands();
  else if (hash.startsWith('#/discounts'))   showDiscounts();
  else if (hash.startsWith('#/collabs'))     showCollabs();
  else if (hash.startsWith('#/settings'))    showSettings();
  else if (hash.startsWith('#/adidas'))      showAdidas();
  else if (hash.startsWith('#/crocs'))       showCrocs();
  else                                       showDashboard();
}
 
 
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
 
 
// ─── Coming Soon Sections ─────────────────────────────────────────────────────
 
function showComingSoon(key, title) {
  currentRoute = key;
  renderNav(key);
  setTopbar(title);
  setContent(\`
    <div class="pf-card pf-empty">
      <div>
        <div class="pf-label" style="margin-bottom:10px">Coming soon</div>
        <div style="font-size:16px;letter-spacing:-0.02em">\${esc(title)}</div>
        <div class="text-muted" style="font-size:12px;margin-top:6px">Раздел скоро появится в админке.</div>
      </div>
    </div>
  \`);
}
 
// ─── Clients ──────────────────────────────────────────────────────────────────
 
let clientsData = [];
 
async function showClients() {
  currentRoute = 'clients';
  renderNav('clients');
  setTopbar('Клиенты');
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const d = await GET('/clients');
    clientsData = d.clients || [];
    renderClientsList();
  } catch(e) { toast(e.message, 'err'); }
}
 
function renderClientsList() {
  const total = clientsData.length;
  setTopbar('Клиенты', \`<span style="font-size:12px;color:var(--muted)">\${total} клиент\${total===1?'':total>4?'ов':'а'}</span>\`);
 
  if (!clientsData.length) {
    setContent(\`
      <div class="pf-card pf-empty">
        <div>
          <div style="font-size:16px;letter-spacing:-0.02em">Нет клиентов</div>
          <div class="text-muted" style="font-size:12px;margin-top:6px">Клиенты появятся после первых заказов.</div>
        </div>
      </div>
    \`);
    return;
  }
 
  setContent(\`
    <div class="pf-card" style="padding:0;overflow:hidden">
      <table class="data-table" style="width:100%">
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Город</th>
            <th>Заказов</th>
            <th>Сумма</th>
            <th>Последний заказ</th>
          </tr>
        </thead>
        <tbody>
          \${clientsData.map(c => \`
            <tr style="cursor:pointer" onclick="showClientDetail('\${esc(c.email)}')">
              <td>
                <div style="font-size:13px;font-weight:500">\${esc(c.name || '—')}</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">\${esc(c.email)}</div>
                \${c.phone ? \`<div style="font-size:11px;color:var(--muted)">\${esc(c.phone)}</div>\` : ''}
              </td>
              <td style="color:var(--muted);font-size:13px">\${esc(c.city || '—')}</td>
              <td style="font-size:13px;font-weight:500">\${c.order_count}</td>
              <td style="font-size:13px;font-weight:500">\${rub(c.total_minor)}</td>
              <td style="font-size:12px;color:var(--muted)">\${formatDate(c.last_order_at)}</td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>
  \`);
}
 
async function showClientDetail(email) {
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const d = await GET('/orders?limit=200');
    const orders = (d.orders || []).filter(o => o.customer_email === email);
    const client = clientsData.find(c => c.email === email) || {};
 
    const totalSpent = orders.reduce((s, o) => s + (o.total_minor || 0), 0);
 
    document.getElementById('page-title').innerHTML =
      \`<span style="cursor:pointer;opacity:0.5" onclick="showClients()">← Клиенты</span>\`;
 
    setContent(\`
      <div class="pf-layout" style="display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start">
        <div>
          <div class="pf-card">
            <div class="pf-card-title">Заказы клиента</div>
            \${orders.length === 0 ? '<div class="text-muted">Заказов нет</div>' : ''}
            <table class="data-table" style="width:100%">
              <thead>
                <tr>
                  <th>№ Заказа</th>
                  <th>Статус</th>
                  <th>Сумма</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                \${orders.map(o => \`
                  <tr>
                    <td style="font-size:13px;font-weight:500">#\${esc(o.order_number)}</td>
                    <td>\${badge(o.status)}</td>
                    <td style="font-size:13px">\${rub(o.total_minor)}</td>
                    <td style="font-size:12px;color:var(--muted)">\${formatDate(o.created_at)}</td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
 
        <div>
          <div class="pf-card">
            <div class="pf-card-title">Информация</div>
            <div style="display:flex;flex-direction:column;gap:12px">
              \${clientInfoRow('Имя', client.name || '—')}
              \${clientInfoRow('Email', client.email)}
              \${clientInfoRow('Телефон', client.phone || '—')}
              \${clientInfoRow('Город', client.city || '—')}
              \${clientInfoRow('Заказов', String(orders.length))}
              \${clientInfoRow('Потрачено', rub(totalSpent))}
              \${clientInfoRow('Первый заказ', formatDate(client.first_order_at))}
              \${clientInfoRow('Последний заказ', formatDate(client.last_order_at))}
            </div>
          </div>
        </div>
      </div>
    \`);
  } catch(e) { toast(e.message, 'err'); }
}
 
function clientInfoRow(label, value) {
  return \`
    <div style="display:flex;flex-direction:column;gap:2px">
      <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted)">\${label}</div>
      <div style="font-size:13px">\${esc(value)}</div>
    </div>
  \`;
}
async function showSettings() {
  currentRoute = 'settings';
  renderNav('settings');
  setTopbar('Настройки');
  setContent('<div class="loading">Загрузка...</div>');

  let settings = { whatsapp_number: '' };
  try {
    const d = await GET('/settings');
    settings = d.settings || {};
  } catch(e) { /* ignore, show empty form */ }

  setContent(\`
    <div class="pf-card" style="max-width:540px">
      <div class="pf-card-title">Контакты и мессенджеры</div>

      <div class="pf-group">
        <label class="pf-label">Номер WhatsApp</label>
        <input id="settings-wa" value="\${esc(settings.whatsapp_number || '')}"
          placeholder="+79991234567" style="width:100%">
        <div class="slug-preview" style="margin-top:6px">
          Формат: +79991234567 или 79991234567. Используется на странице «О нас» как кнопка «Задать вопрос».
        </div>
      </div>

      <div style="margin-top:20px">
        <button class="btn btn-primary" onclick="saveSettings()">Сохранить</button>
      </div>
    </div>
  \`);
}

async function saveSettings() {
  const whatsapp = document.getElementById('settings-wa')?.value.trim() || '';
  try {
    await fetch('/admin/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp_number: whatsapp })
    });
    toast('Настройки сохранены');
  } catch(e) {
    toast('Ошибка сохранения', 'err');
  }
}
 
// ─── Categories ───────────────────────────────────────────────────────────────
 
let catalogData = { categories: [], brands: [], discounts: [] };
 
async function showCategories() {
  currentRoute = 'categories';
  renderNav('categories');
  setTopbar('Категории', \`<button class="btn btn-primary" onclick="catalogAddItem('categories','Новая категория')">+ Добавить</button>\`);
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const d = await GET('/categories');
    catalogData.categories = d.categories || [];
    renderCatalogList('categories');
  } catch(e) { toast(e.message,'err'); }
}
 
async function showBrands() {
  currentRoute = 'brands';
  renderNav('brands');
  setTopbar('Бренды', \`<button class="btn btn-primary" onclick="catalogAddItem('brands','Новый бренд')">+ Добавить</button>\`);
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const d = await GET('/brands');
    catalogData.brands = d.brands || [];
    renderCatalogList('brands');
  } catch(e) { toast(e.message,'err'); }
}
 
async function showDiscounts() {
  currentRoute = 'discounts';
  renderNav('discounts');
  setTopbar('Скидки', \`<button class="btn btn-primary" onclick="discountAdd()">+ Добавить</button>\`);
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const d = await GET('/discounts');
    catalogData.discounts = d.discounts || [];
    renderDiscountsList();
  } catch(e) { toast(e.message,'err'); }
}
 
function renderCatalogList(key) {
  const titles = { categories: 'Категории', brands: 'Бренды' };
  const items = catalogData[key] || [];
  setContent(\`
    <div class="pf-card">
      <div class="pf-card-title">\${titles[key]}</div>
      \${items.length === 0 ? '<div class="text-muted" style="font-size:13px">Нет элементов. Добавьте первый.</div>' : ''}
      <div id="catalog-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        \${items.map((item, i) => \`
          <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface2);border:1px solid var(--border);">
            <span style="flex:1;font-size:13px">\${esc(item)}</span>
            <button class="btn btn-sm" onclick="catalogEditItem('\${key}',\${i})">✎</button>
            <button class="btn btn-sm" style="color:var(--danger)" onclick="catalogDeleteItem('\${key}',\${i})">×</button>
          </div>
        \`).join('')}
      </div>
    </div>
  \`);
}
 
function catalogAddItem(key, placeholder) {
  showModal(\`Добавить\`, \`
    <div class="pf-group">
      <label class="pf-label">Название</label>
      <input id="catalog-item-input" placeholder="\${esc(placeholder)}" style="width:100%">
    </div>
  \`, async () => {
    const val = document.getElementById('catalog-item-input')?.value.trim();
    if (!val) { toast('Введите название','err'); return; }
    catalogData[key].push(val);
    await catalogSave(key);
    if (key === 'categories') renderCatalogList('categories');
    else renderCatalogList('brands');
    closeModal();
  });
  setTimeout(() => document.getElementById('catalog-item-input')?.focus(), 50);
}
 
function catalogEditItem(key, i) {
  const old = catalogData[key][i];
  showModal('Редактировать', \`
    <div class="pf-group">
      <label class="pf-label">Название</label>
      <input id="catalog-item-input" value="\${esc(old)}" style="width:100%">
    </div>
  \`, async () => {
    const val = document.getElementById('catalog-item-input')?.value.trim();
    if (!val) { toast('Введите название','err'); return; }
    catalogData[key][i] = val;
    await catalogSave(key);
    if (key === 'categories') renderCatalogList('categories');
    else renderCatalogList('brands');
    closeModal();
  });
  setTimeout(() => document.getElementById('catalog-item-input')?.focus(), 50);
}
 
async function catalogDeleteItem(key, i) {
  if (!confirm('Удалить?')) return;
  catalogData[key].splice(i, 1);
  await catalogSave(key);
  if (key === 'categories') renderCatalogList('categories');
  else renderCatalogList('brands');
}
 
async function catalogSave(key) {
  try {
    await fetch('/admin/api/' + key, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: catalogData[key] })
    });
    toast('Сохранено');
  } catch(e) { toast(e.message,'err'); }
}
 
// ─── Discounts ────────────────────────────────────────────────────────────────
 
function renderDiscountsList() {
  const items = catalogData.discounts || [];
  setContent(\`
    <div class="pf-card">
      <div class="pf-card-title">Скидки и промокоды</div>
      \${items.length === 0 ? '<div class="text-muted" style="font-size:13px">Нет скидок. Добавьте первую.</div>' : ''}
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        \${items.map((d, i) => \`
          <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface2);border:1px solid var(--border);">
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;letter-spacing:0.05em">\${esc(d.code)}</div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px">
                \${d.type === 'percent' ? d.value + '%' : d.value + ' ₽'} скидка
                \${d.min_order ? '· от ' + d.min_order + ' ₽' : ''}
                \${d.expires ? '· до ' + d.expires : ''}
              </div>
            </div>
            <span class="badge \${d.active ? 'badge-ok' : 'badge-neutral'}">\${d.active ? 'Активна' : 'Отключена'}</span>
            <button class="btn btn-sm" onclick="discountEdit(\${i})">✎</button>
            <button class="btn btn-sm" style="color:var(--danger)" onclick="discountDelete(\${i})">×</button>
          </div>
        \`).join('')}
      </div>
    </div>
  \`);
}
 
function discountAdd() { discountEdit(null); }
 
function discountEdit(idx) {
  const d = idx !== null ? catalogData.discounts[idx] : { code:'', type:'percent', value:'', min_order:'', expires:'', active:true };
  showModal(idx !== null ? 'Редактировать скидку' : 'Новая скидка', \`
    <div class="pf-group">
      <label class="pf-label">Промокод</label>
      <input id="d-code" value="\${esc(d.code)}" placeholder="SUMMER20" style="width:100%;text-transform:uppercase">
    </div>
    <div class="pf-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="pf-group">
        <label class="pf-label">Тип</label>
        <select id="d-type">
          <option value="percent" \${d.type==='percent'?'selected':''}>% от суммы</option>
          <option value="fixed" \${d.type==='fixed'?'selected':''}>Фиксированная ₽</option>
        </select>
      </div>
      <div class="pf-group">
        <label class="pf-label">Размер скидки</label>
        <input id="d-value" type="number" value="\${esc(String(d.value))}" placeholder="20" style="width:100%">
      </div>
    </div>
    <div class="pf-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="pf-group">
        <label class="pf-label">Мин. сумма заказа (₽)</label>
        <input id="d-min" type="number" value="\${esc(String(d.min_order||''))}" placeholder="0" style="width:100%">
      </div>
      <div class="pf-group">
        <label class="pf-label">Действует до</label>
        <input id="d-expires" type="date" value="\${esc(d.expires||'')}" style="width:100%">
      </div>
    </div>
    <div class="pf-group">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="d-active" \${d.active?'checked':''}>
        <span style="font-size:13px">Скидка активна</span>
      </label>
    </div>
  \`, async () => {
    const code = document.getElementById('d-code')?.value.trim().toUpperCase();
    if (!code) { toast('Введите промокод','err'); return; }
    const val = parseFloat(document.getElementById('d-value')?.value);
    if (!val) { toast('Введите размер скидки','err'); return; }
    const rec = {
      code,
      type: document.getElementById('d-type')?.value,
      value: val,
      min_order: parseFloat(document.getElementById('d-min')?.value)||0,
      expires: document.getElementById('d-expires')?.value || '',
      active: document.getElementById('d-active')?.checked ?? true,
    };
    if (idx !== null) catalogData.discounts[idx] = rec;
    else catalogData.discounts.push(rec);
    await catalogSave('discounts');
    renderDiscountsList();
    closeModal();
  });
  setTimeout(() => document.getElementById('d-code')?.focus(), 50);
}
 
async function discountDelete(i) {
  if (!confirm('Удалить скидку?')) return;
  catalogData.discounts.splice(i, 1);
  await catalogSave('discounts');
  renderDiscountsList();
}
 
// ─── State ────────────────────────────────────────────────────────────────────
 
let products = [];
let orders = [];
let ordersTotal = 0;
let orderFilter = '';
let currentSearchFilter = '';
const orderFilters = [
  { label: 'Все',        value: '' },
  { label: 'Новые',      value: 'pending' },
  { label: 'В работе',   value: 'confirmed' },
  { label: 'Выполнены',  value: 'fulfilled' },
  { label: 'Отменены',   value: 'cancelled' },
];
 
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
    setContent('<div class="empty">No products yet. Create the first one!</div>');
    return;
  }
  setContent(\`
    <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Slug</th>
          <th>Status</th>
          <th>Variants</th>
          <th>Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        \${products.map(p => \`
          <tr>
            <td><strong>\${esc(p.title)}</strong></td>
            <td class="text-muted">\${esc(p.slug)}</td>
            <td>
              <select class=\"inline-status-select\" data-id=\"\${p.id}\" onchange=\"quickUpdateStatus(this)\" style=\"font-size:0.82rem;padding:3px 6px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;\">
                <option value=\"active\" \${p.status==='active'?'selected':''}>Active</option>
                <option value=\"draft\" \${p.status==='draft'?'selected':''}>Draft</option>
                <option value=\"archived\" \${p.status==='archived'?'selected':''}>Archived</option>
              </select>
            </td>
            <td>\${p.variant_count}</td>
            <td class="text-muted">\${formatDate(p.updated_at)}</td>
            <td>
              <div class="flex">
                <button class="btn btn-sm" onclick="openProductPage('\${p.id}')">Open</button>
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
 
async function quickUpdateStatus(sel) {
  const id = sel.dataset.id;
  const status = sel.value;
  try {
    await PATCH('/products/' + id, { status });
    toast('Status updated');
  } catch(e) {
    toast(e.message, 'err');
    await loadProducts(); // revert on error
  }
}
 
async function deleteProduct(id, title) {
  if (!confirm(\`Delete «\${title}»? All variants and images will also be removed.\`)) return;
  try {
    await DEL('/products/' + id);
    toast('Product deleted');
    await loadProducts();
  } catch(e) { toast(e.message, 'err'); }
}
 
// ── Product full-page form (new & edit) ──────────────────────────────────────
 
// State for the product form
let pfCatalog = { brands: ['Crocs', 'Adidas Originals'], categories: [], discounts: [] };
 
let pf = {
  product: null,   // null = new product
  variants: [],
  images: [],
  colors: [],      // array of {name, hex}
  tags: [],        // array of strings
};
 
async function openNewProduct() {
  await loadPfCatalog();
  pf = { product: null, variants: [], images: [], colors: [], tags: [] };
  renderProductForm();
}
 
async function loadPfCatalog() {
  try {
    const [b, c] = await Promise.all([GET('/brands'), GET('/categories')]);
    pfCatalog.brands = b.brands || ['Crocs', 'Adidas Originals'];
    pfCatalog.categories = c.categories || [];
  } catch(e) { /* fallback */ }
}
 
function normalizeImages(imgs) {
  return (imgs || []).map(img => ({
    ...img,
    url: img.url || (img.r2_key ? '/r2/' + img.r2_key : null),
  }));
}

async function openProductPage(id) {
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const [data] = await Promise.all([GET('/products/' + id), loadPfCatalog()]);
    const p = data.product;
    pf = {
      product: p,
      variants: data.variants || [],
      images: normalizeImages(data.images),
      colors: p.colors ? (Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors)) : [],
      tags: p.tags ? (Array.isArray(p.tags) ? p.tags : (p.tags.startsWith("[") ? JSON.parse(p.tags) : p.tags.split(",").map(t => t.trim()).filter(Boolean))) : [],
    };
    renderProductForm();
  } catch(e) {
    toast(e.message, 'err');
    await loadProducts();
  }
}
 
function renderProductForm() {
  const p = pf.product;
  const isNew = !p;
 
  // Topbar
  document.getElementById('page-title').innerHTML =
    \`<span style="cursor:pointer;opacity:0.5" onclick="backToProducts()">← Товары</span>\`;
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn" onclick="backToProducts()">Отмена</button>
    <button class="btn btn-primary" onclick="saveProductFull()" style="gap:8px">
      <span>✓</span> Сохранить товар
    </button>
  \`;
 
  setContent(\`
    <style>
      .pf-layout { display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start; }
      .pf-card { background:var(--surface); border:1px solid var(--border); padding:28px; margin-bottom:20px; }
      .pf-card-title { font-size:13px; font-weight:600; letter-spacing:-0.01em; margin-bottom:20px; }
      .pf-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      .pf-group { margin-bottom:16px; }
      .pf-group:last-child { margin-bottom:0; }
      .pf-label { display:block; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
      .pf-label span { color:var(--danger); }
      .slug-preview { font-size:11px; color:var(--muted); margin-top:5px; }
      .slug-preview a { color:var(--accent); }
 
      /* Status dropdown with dot */
      .status-select-wrap { position:relative; }
      .status-dot { position:absolute; left:12px; top:50%; transform:translateY(-50%); width:8px; height:8px; border-radius:50%; background:var(--success); pointer-events:none; z-index:1; }
      .status-dot.draft { background:var(--muted); }
      .status-dot.archived { background:var(--danger); }
      select.has-dot { padding-left:28px; }
 
      /* Chips (sizes, tags) */
      .chips-wrap { display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:8px 10px; background:var(--surface2); border:1px solid var(--border); min-height:40px; cursor:text; }
      .chip { display:inline-flex; align-items:center; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:4px; padding:2px 8px; font-size:12px; }
      .chip button { background:none; border:none; color:var(--muted); font-size:14px; line-height:1; padding:0 0 0 2px; cursor:pointer; transition:color 0.1s; }
      .chip button:hover { color:var(--danger); }
      .chip-input { border:none; background:none; outline:none; font-size:12px; font-family:var(--font); color:var(--text); min-width:60px; flex:1; padding:0; }
 
      /* Color swatches */
      .color-list { display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
      .color-row { display:flex; align-items:center; gap:10px; padding:8px 12px; background:var(--surface2); border:1px solid var(--border); }
      .color-swatch { width:24px; height:24px; border-radius:50%; border:1px solid rgba(0,0,0,0.1); flex-shrink:0; }
      .color-name { flex:1; font-size:13px; }
      .color-hex { font-size:11px; color:var(--muted); font-family:monospace; }
      .color-remove { background:none; border:none; color:var(--muted); font-size:16px; cursor:pointer; padding:0; transition:color 0.1s; }
      .color-remove:hover { color:var(--danger); }
      .color-add-row { display:flex; gap:8px; align-items:center; }
      .color-add-row input[type=color] { width:36px; height:36px; padding:2px; border:1px solid var(--border); background:var(--surface2); cursor:pointer; }
      .color-add-row input[type=text] { flex:1; }
 
      /* Photo upload */
      .photo-dropzone {
        border:2px dashed var(--border);
        padding:28px 20px;
        text-align:center;
        color:var(--muted);
        cursor:pointer;
        transition:border-color 0.15s, background 0.15s;
        margin-bottom:14px;
        border-radius:2px;
      }
      .photo-dropzone:hover, .photo-dropzone.drag-over { border-color:var(--accent); background:var(--accent-dim); color:var(--text); }
      .photo-dropzone .upload-icon { font-size:28px; margin-bottom:8px; }
      .photo-dropzone .upload-main { font-size:13px; margin-bottom:4px; }
      .photo-dropzone .upload-link { color:var(--accent); cursor:pointer; text-decoration:underline; }
      .photo-dropzone .upload-hint { font-size:11px; color:var(--muted); }
      .photo-gallery { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
      .photo-thumb {
        position:relative; aspect-ratio:1;
        background:var(--surface2); border:2px solid transparent;
        overflow:hidden; border-radius:2px; cursor:pointer;
        transition:border-color 0.15s;
      }
      .photo-thumb.is-primary { border-color:var(--accent); }
      .photo-thumb img { width:100%; height:100%; object-fit:cover; }
      .photo-thumb .thumb-num {
        position:absolute; top:4px; left:4px;
        width:18px; height:18px; border-radius:50%;
        background:var(--accent); color:#fff; font-size:10px;
        display:flex; align-items:center; justify-content:center;
        opacity:0; transition:opacity 0.1s;
      }
      .photo-thumb.is-primary .thumb-num { opacity:1; }
      .photo-thumb .thumb-del {
        position:absolute; top:4px; right:4px;
        background:var(--surface); border:1px solid var(--border);
        color:var(--danger); width:20px; height:20px;
        font-size:11px; display:flex; align-items:center; justify-content:center;
        opacity:0; transition:opacity 0.1s; border-radius:2px;
      }
      .photo-thumb:hover .thumb-del { opacity:1; }
      .photo-thumb .thumb-label {
        position:absolute; bottom:0; left:0; right:0;
        background:rgba(0,0,0,0.55); color:#fff;
        font-size:9px; padding:3px 5px; text-align:center;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      }
      .photo-gallery-hint { font-size:11px; color:var(--muted); margin-top:8px; }
 
      /* Variants table */
      .variants-table { width:100%; border-collapse:collapse; margin-top:4px; }
      .variants-table th { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); padding:8px 10px; border-bottom:1px solid var(--border); text-align:left; }
      .variants-table td { padding:10px 10px; border-bottom:1px solid var(--border); font-size:12px; vertical-align:middle; }
      .variants-table tr:last-child td { border-bottom:none; }
      .variants-table tr:hover td { background:var(--surface2); }
 
      /* Prices */
      .price-input-wrap { position:relative; display:flex; align-items:center; }
      .price-input-wrap input { padding-right:40px; }
      .price-currency {
        position:absolute; right:0; top:0; bottom:0;
        display:flex; align-items:center; justify-content:center;
        width:36px; background:var(--surface2); border-left:1px solid var(--border);
        font-size:12px; color:var(--muted); pointer-events:none;
      }
    </style>
 
    <div style="margin-bottom:20px;display:flex;align-items:center;gap:10px">
      <button class="btn btn-sm" onclick="backToProducts()" style="gap:6px">← Назад</button>
      <h2 style="font-size:22px;font-weight:500;letter-spacing:-0.03em">
        \${isNew ? 'Новый товар' : esc(p.title)}
      </h2>
    </div>
 
    <div class="pf-layout">
 
      <!-- LEFT COLUMN -->
      <div>
 
        <!-- Основная информация -->
        <div class="pf-card">
          <div class="pf-card-title">Основная информация</div>
 
          <div class="pf-row">
            <div class="pf-group">
              <label class="pf-label">Название товара <span>*</span></label>
              <input id="pf-title" value="\${esc(p?.title || '')}" placeholder="Classic Clog"
                oninput="pfAutoSlug()">
            </div>
            <div class="pf-group">
              <label class="pf-label">Slug (URL) <span>*</span></label>
              <input id="pf-slug" value="\${esc(p?.slug || '')}" placeholder="classic-clog"
                oninput="pfSlugTouched=true;pfUpdateSlugPreview()">
              <div class="slug-preview" id="pf-slug-preview">
                kokoc.store/product/<span id="pf-slug-val">\${esc(p?.slug || '')}</span>
                \${p?.slug ? '<a href="https://kokoc.store/product/'+esc(p.slug)+'" target="_blank">↗</a>' : ''}
              </div>
            </div>
          </div>
 
          <div class="pf-row">
            <div class="pf-group">
              <label class="pf-label">Статус</label>
              <div class="status-select-wrap">
                <div class="status-dot \${p?.status === 'draft' ? 'draft' : p?.status === 'archived' ? 'archived' : ''}" id="pf-status-dot"></div>
                <select id="pf-status" class="has-dot" onchange="pfUpdateStatusDot()">
                  <option value="active" \${(!p || p.status==='active')?'selected':''}>Активен</option>
                  <option value="draft" \${p?.status==='draft'?'selected':''}>Черновик</option>
                  <option value="archived" \${p?.status==='archived'?'selected':''}>Архив</option>
                </select>
              </div>
            </div>
            <div class="pf-group">
              <label class="pf-label">Бренд</label>
              <select id="pf-brand">
                \${(p?.brand && !(pfCatalog.brands||[]).includes(p.brand))
                  ? \`<option value="\${esc(p.brand)}" selected>\${esc(p.brand)} (не в списке брендов)</option>\`
                  : ''}
                \${(pfCatalog.brands||['Crocs', 'Adidas Originals']).map(b =>
                  \`<option value="\${esc(b)}" \${p?.brand===b?'selected':''}>\${esc(b)}</option>\`
                ).join('')}
              </select>
            </div>
          </div>
 
          <div class="pf-row">
            <div class="pf-group">
              <label class="pf-label">Категория</label>
              <select id="pf-category">
                <option value="">— не выбрано —</option>
                \${(pfCatalog.categories||[]).map(c =>
                  \`<option value="\${esc(c)}" \${p?.category===c?'selected':''}>\${esc(c)}</option>\`
                ).join('')}
              </select>
            </div>
            <div class="pf-group">
              <label class="pf-label">Артикул (SKU)</label>
              <input id="pf-sku" value="\${esc(p?.sku || '')}" placeholder="CC-BLK-39">
              <div class="slug-preview">Уникальный артикул для учёта товара</div>
            </div>
          </div>
 
          <div class="pf-group">
            <label class="pf-label">Описание</label>
            <textarea id="pf-desc" style="min-height:100px" placeholder="Удобные и стильные сабо для повседневной носки...">\${esc(p?.description || '')}</textarea>
          </div>
        </div>
 
        <!-- Цена и наличие -->
        <!-- Видимость -->
        <div class="pf-card">
          <div class="pf-row">
            <div class="pf-group" style="margin-bottom:0">
              <label class="pf-label">Видимость</label>
              <select id="pf-visibility">
                <option value="visible" \${(!p || p.visibility !== 'hidden')?'selected':''}>Видимый</option>
                <option value="hidden" \${p?.visibility==='hidden'?'selected':''}>Скрытый</option>
              </select>
            </div>
            <div class="pf-group" style="margin-bottom:0">
              <label class="pf-label">Метка (badge)</label>
              <select id="pf-badge">
                <option value="" \${!p?.badge?'selected':''}>— нет —</option>
                <option value="hit" \${p?.badge==='hit'?'selected':''}>🔥 Hit</option>
                <option value="new" \${p?.badge==='new'?'selected':''}>✨ New</option>
                <option value="limited" \${p?.badge==='limited'?'selected':''}>⚡ Limited</option>
              </select>
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:10px">
            Цена, старая цена и остаток задаются в Вариантах. Метка <b>Hit</b> выводит товар первым на лендинге.
          </div>
        </div>
 
 
 
        <!-- Варианты -->
        <div class="pf-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div class="pf-card-title" style="margin-bottom:0">Варианты</div>
            \${!isNew ? \`<button class="btn btn-sm" onclick="openNewVariant()">+ Добавить вариант</button>\` : ''}
          </div>
          \${isNew
            ? \`<div style="font-size:12px;color:var(--muted);padding:16px 0;border-top:1px solid var(--border)">
                Сначала сохраните товар — затем добавьте варианты с размерами, ценой и остатком.
               </div>\`
            : \`<div id="pf-variants-list">\${renderVariantsTable()}</div>\`
          }
        </div>
 
      </div>
 
      <!-- RIGHT COLUMN -->
      <div>
 
        <!-- Фото товара -->
        <div class="pf-card">
          <div class="pf-card-title">Фото товара</div>
          <label class="photo-dropzone" id="pf-dropzone"
            style="\${pf.images.length ? 'display:none' : ''}"
            ondragover="pfDragOver(event)" ondragleave="pfDragLeave(event)" ondrop="pfDrop(event)">
            <input type="file" multiple accept="image/*" style="display:none" id="pf-file-input"
              onchange="pfFilesSelected(this)">
            <div class="upload-icon">↑</div>
            <div class="upload-main">
              Загрузить фото<br>
              <span style="font-size:12px;font-weight:400">Перетащите файлы сюда или </span>
              <span class="upload-link">выберите на компьютере</span>
            </div>
            <div class="upload-hint" style="margin-top:6px">JPG, PNG до 10MB · Рекомендуется 800×800 px, соотношение 1:1</div>
          </label>
          <div class="photo-gallery" id="pf-photo-gallery">
            \${renderPhotoGallery()}
          </div>
          <div id="pf-photo-hint" class="photo-gallery-hint" style="\${pf.images.length ? '' : 'display:none'}">
            Нажмите на фото, чтобы сделать его главным
            <button class="btn btn-sm" style="margin-left:8px;font-size:10px" onclick="document.getElementById('pf-dropzone').style.display='';document.getElementById('pf-dropzone').scrollIntoView({behavior:'smooth'})">+ Ещё фото</button>
          </div>
        </div>
 
        <!-- Цвета -->
        <div class="pf-card">
          <div class="pf-card-title">Цвет</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:12px">Выберите доступные цвета</div>
          <div class="color-list" id="pf-color-list">
            \${renderColorList()}
          </div>
          <div class="color-add-row" id="pf-color-add-row">
            <input type="color" id="pf-color-picker" value="#000000">
            <input type="text" id="pf-color-name" placeholder="Название цвета" style="flex:1"
              onkeydown="if(event.key==='Enter')pfAddColor()">
            <button class="btn btn-sm" onclick="pfAddColor()" style="white-space:nowrap">+ Добавить цвет</button>
          </div>
        </div>
 
        <!-- Теги -->
        <div class="pf-card">
          <div class="pf-card-title">Теги</div>
          <div class="chips-wrap" id="pf-tags-wrap" onclick="document.getElementById('pf-tag-input').focus()">
            \${pf.tags.map((t,i) => \`
              <span class="chip" style="background:var(--accent-dim);border-color:var(--accent);color:var(--text)">
                \${esc(t)}
                <button type="button" onclick="pfRemoveTag(\${i})">×</button>
              </span>
            \`).join('')}
            <input class="chip-input" id="pf-tag-input" placeholder="+ Добавить тег"
              onkeydown="pfTagKeydown(event)">
          </div>
        </div>
 
      </div>
    </div>
  \`);
 
  // Init slug state
  window.pfSlugTouched = !!p?.slug;
  pfUpdateStatusDot();
}
 
function pfUpdateSlugPreview() {
  const v = document.getElementById('pf-slug').value;
  const el = document.getElementById('pf-slug-val');
  if (el) el.textContent = v;
}
 
function pfAutoSlug() {
  if (!window.pfSlugTouched) {
    const title = document.getElementById('pf-title').value;
    const slug = title.toLowerCase()
      .replace(/[аА]/g,'a').replace(/[бБ]/g,'b').replace(/[вВ]/g,'v')
      .replace(/[гГ]/g,'g').replace(/[дД]/g,'d').replace(/[еЕёЁ]/g,'e')
      .replace(/[жЖ]/g,'zh').replace(/[зЗ]/g,'z').replace(/[иИйЙ]/g,'i')
      .replace(/[кК]/g,'k').replace(/[лЛ]/g,'l').replace(/[мМ]/g,'m')
      .replace(/[нН]/g,'n').replace(/[оО]/g,'o').replace(/[пП]/g,'p')
      .replace(/[рР]/g,'r').replace(/[сС]/g,'s').replace(/[тТ]/g,'t')
      .replace(/[уУ]/g,'u').replace(/[фФ]/g,'f').replace(/[хХ]/g,'kh')
      .replace(/[цЦ]/g,'ts').replace(/[чЧ]/g,'ch').replace(/[шШ]/g,'sh')
      .replace(/[щЩ]/g,'shch').replace(/[ыЫ]/g,'y').replace(/[эЭ]/g,'e')
      .replace(/[юЮ]/g,'yu').replace(/[яЯ]/g,'ya')
      .replace(/\\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-');
    document.getElementById('pf-slug').value = slug;
    pfUpdateSlugPreview();
  }
}
 
function pfUpdateStatusDot() {
  const sel = document.getElementById('pf-status');
  const dot = document.getElementById('pf-status-dot');
  if (!sel || !dot) return;
  dot.className = 'status-dot ' + (sel.value === 'draft' ? 'draft' : sel.value === 'archived' ? 'archived' : '');
}
 
function backToProducts() {
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn btn-primary" onclick="openNewProduct()">+ Новый товар</button>
  \`;
  document.getElementById('page-title').textContent = 'Товары';
  loadProducts();
}
 
// ── Tags chip input ──
 
function pfTagKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (val && !pf.tags.includes(val)) {
      pf.tags.push(val);
      pfReTags();
    }
    e.target.value = '';
  } else if (e.key === 'Backspace' && !e.target.value && pf.tags.length) {
    pf.tags.pop();
    pfReTags();
  }
}
 
function pfRemoveTag(i) {
  pf.tags.splice(i, 1);
  pfReTags();
}
 
function pfReTags() {
  const wrap = document.getElementById('pf-tags-wrap');
  const chips = pf.tags.map((t,i) => \`
    <span class="chip" style="background:var(--accent-dim);border-color:var(--accent);color:var(--text)">
      \${esc(t)}
      <button type="button" onclick="pfRemoveTag(\${i})">×</button>
    </span>
  \`).join('');
  wrap.innerHTML = chips + \`<input class="chip-input" id="pf-tag-input" placeholder="+ Добавить тег" onkeydown="pfTagKeydown(event)">\`;
  document.getElementById('pf-tag-input').focus();
}
 
// ── Colors ──
 
function renderColorList() {
  return pf.colors.map((c,i) => \`
    <div class="color-row">
      <div class="color-swatch" style="background:\${esc(c.hex)}"></div>
      <span class="color-name">\${esc(c.name)}</span>
      <span class="color-hex">\${esc(c.hex)}</span>
      <button class="color-remove" onclick="pfRemoveColor(\${i})">×</button>
    </div>
  \`).join('');
}
 
function pfRemoveColor(i) {
  pf.colors.splice(i, 1);
  document.getElementById('pf-color-list').innerHTML = renderColorList();
}
 
function pfAddColor() {
  const nameEl = document.getElementById('pf-color-name');
  const picker = document.getElementById('pf-color-picker');
  const name = nameEl.value.trim();
  const hex  = picker.value;
  if (!name) { toast('Введите название цвета', 'err'); nameEl.focus(); return; }
  pf.colors.push({ name, hex });
  document.getElementById('pf-color-list').innerHTML = renderColorList();
  nameEl.value = '';
  picker.value = '#ff5555';
  nameEl.focus();
}
 
// ── Photo upload ──
 
function renderPhotoGallery() {
  if (!pf.images.length) return '';
  return pf.images.map((img, i) => \`
    <div class="photo-thumb \${i===0?'is-primary':''}" onclick="pfSetPrimary(\${i})">
      \${img.url
        ? \`<img src="\${esc(img.url)}" alt="">\`
        : \`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--muted);padding:4px;text-align:center;word-break:break-all">\${esc(img.name||img.r2_key?.split('/').pop()||'фото')}</div>\`
      }
      <div class="thumb-num">\${i+1}</div>
      <button class="thumb-del" onclick="event.stopPropagation();pfRemoveImage(\${i})">✕</button>
    </div>
  \`).join('');
}
 
function pfSetPrimary(idx) {
  if (idx === 0) return;
  const img = pf.images.splice(idx, 1)[0];
  pf.images.unshift(img);
  pfSyncGallery();
}
 
async function pfRemoveImage(idx) {
  const img = pf.images[idx];
  if (img && img.id) {
    /* Already saved to server — delete via API */
    if (!confirm('Удалить фото?')) return;
    try {
      await DEL('/images/' + img.id);
      const data = await GET('/products/' + pf.product.id);
      pf.images = normalizeImages(data.images);
      pfSyncGallery();
      toast('Фото удалено');
    } catch(e) { toast(e.message, 'err'); }
  } else {
    /* Local unsaved file — just remove from array */
    pf.images.splice(idx, 1);
    pfSyncGallery();
  }
}
 
function pfDragOver(e) {
  e.preventDefault();
  document.getElementById('pf-dropzone').classList.add('drag-over');
}
function pfDragLeave(e) {
  document.getElementById('pf-dropzone').classList.remove('drag-over');
}
function pfDrop(e) {
  e.preventDefault();
  document.getElementById('pf-dropzone').classList.remove('drag-over');
  pfHandleFiles(e.dataTransfer.files);
}
function pfFilesSelected(input) {
  pfHandleFiles(input.files);
}
 
function pfHandleFiles(fileList) {
  Array.from(fileList).forEach(file => {
    const url = URL.createObjectURL(file);
    pf.images.push({ _file: file, url, name: file.name });
  });
  pfSyncGallery();
}
 
function pfSyncGallery() {
  const gallery = document.getElementById('pf-photo-gallery');
  const dropzone = document.getElementById('pf-dropzone');
  const hint = document.getElementById('pf-photo-hint');
  if (gallery) gallery.innerHTML = renderPhotoGallery();
  if (dropzone) dropzone.style.display = pf.images.length ? 'none' : '';
  if (hint) hint.style.display = pf.images.length ? '' : 'none';
}
 
// ── Variants table (edit mode) ──
 
function renderVariantsTable() {
  if (!pf.variants.length) {
    return '<div class="empty" style="padding:16px 0">Вариантов нет. Добавьте первый!</div>';
  }
  return \`<table class="variants-table">
    <thead><tr>
      <th>Название / SKU</th>
      <th>Размер</th>
      <th>Цвет</th>
      <th>Цена</th>
      <th>Остаток</th>
      <th>Статус</th>
      <th></th>
    </tr></thead>
    <tbody>
    \${pf.variants.map(v => \`
      <tr>
        <td>
          <div style="font-weight:500">\${esc(v.title)}</div>
          <div style="font-size:10px;color:var(--muted)">\${esc(v.sku)}</div>
        </td>
        <td>\${esc(v.size_label||'—')}</td>
        <td>\${esc(v.color_label||'—')}</td>
        <td class="price">\${rub(v.price_minor)}</td>
        <td class="\${v.inventory_quantity > 0 ? 'text-success' : 'text-danger'}">\${v.inventory_quantity} шт</td>
        <td>\${badge(v.is_active ? 'active' : 'archived')}</td>
        <td>
          <div class="flex">
            <button class="btn btn-sm" onclick="openEditVariant('\${v.id}')">✎</button>
            <button class="btn btn-sm btn-danger" onclick="deleteVariant('\${v.id}')">✕</button>
          </div>
        </td>
      </tr>
    \`).join('')}
    </tbody>
  </table>\`;
}
 
// ── Save ──
 
async function saveProductFull() {
  const title = document.getElementById('pf-title')?.value.trim();
  const slug  = document.getElementById('pf-slug')?.value.trim();
  if (!title || !slug) { toast('Заполните название и slug', 'err'); return; }
 
  const payload = {
    title, slug,
    status:      document.getElementById('pf-status')?.value,
    brand:       document.getElementById('pf-brand')?.value,
    category:    document.getElementById('pf-category')?.value,
    sku:         document.getElementById('pf-sku')?.value.trim() || null,
    description: document.getElementById('pf-desc')?.value.trim() || null,
    visibility:  document.getElementById('pf-visibility')?.value,
    badge:       document.getElementById('pf-badge')?.value || null,
    colors:      JSON.stringify(pf.colors),
    tags:        pf.tags.join(","),
  };
 
  try {
    const isNew = !pf.product;
    let productId;
    if (pf.product) {
      await PATCH('/products/' + pf.product.id, payload);
      productId = pf.product.id;
      toast('Товар сохранён');
    } else {
      const res = await POST('/products', payload);
      productId = res.id;
      toast('Товар создан — добавьте варианты с размерами и ценой');
    }
 
    // Upload new images
    const newImages = pf.images.filter(img => img._file);
    for (let i = 0; i < newImages.length; i++) {
      const fd = new FormData();
      fd.append('file', newImages[i]._file);
      fd.append('position', String(i));
      await fetch('/admin/api/products/' + productId + '/images', { method: 'POST', body: fd });
    }
 
    if (isNew) {
      // Сразу открываем форму редактирования — чтобы добавить варианты
      await openProductPage(productId);
    } else {
      await loadProducts();
    }
  } catch(e) { toast(e.message, 'err'); }
}
 
// ── Variant modal ──
 
let drawerProduct = null;
let drawerVariants = [];
let drawerImages = [];
 
function openNewVariant() {
  variantModal(null);
}
 
function openEditVariant(vid) {
  const v = pf.variants.find(x => x.id === vid);
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
        await POST('/products/' + pf.product.id + '/variants', payload);
        toast('Вариант добавлен');
      }
      closeModal();
      const data = await GET('/products/' + pf.product.id);
      pf.variants = data.variants;
      const el = document.getElementById('pf-variants-list');
      if (el) el.innerHTML = renderVariantsTable();
    } catch(e) { toast(e.message, 'err'); }
  });
}
 
async function deleteVariant(vid) {
  if (!confirm('Удалить вариант?')) return;
  try {
    await DEL('/variants/' + vid);
    toast('Вариант удалён');
    const data = await GET('/products/' + pf.product.id);
    pf.variants = data.variants;
    const el = document.getElementById('pf-variants-list');
    if (el) el.innerHTML = renderVariantsTable();
  } catch(e) { toast(e.message, 'err'); }
}
 
async function uploadImages(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  toast('Загрузка...');
  for (let i = 0; i < files.length; i++) {
    const fd = new FormData();
    fd.append('file', files[i]);
    fd.append('position', String(pf.images.length + i));
    await fetch('/admin/api/products/' + pf.product.id + '/images', { method: 'POST', body: fd });
  }
  const data = await GET('/products/' + pf.product.id);
  pf.images = normalizeImages(data.images);
  const el = document.getElementById('pf-photo-gallery');
  if (el) el.innerHTML = renderPhotoGallery();
  toast('Фото загружены');
}
 
async function deleteImage(imgId) {
  if (!confirm('Удалить фото?')) return;
  try {
    await DEL('/images/' + imgId);
    const data = await GET('/products/' + pf.product.id);
    pf.images = normalizeImages(data.images);
    const el = document.getElementById('pf-photo-gallery');
    if (el) el.innerHTML = renderPhotoGallery();
    toast('Фото удалено');
  } catch(e) { toast(e.message, 'err'); }
}
 
 
// ─── Orders ─────────────────────────────────────────────────────────────────
 
function orderStatusLabel(status) {
  const labels = {
    pending: 'Новый',
    confirmed: 'В работе',
    fulfilled: 'Выполнен',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
    refunded: 'Возврат',
    awaiting_payment: 'Ожидает оплаты',
    paid: 'Оплачен',
    failed: 'Ошибка',
    unfulfilled: 'Не собран',
  };
  return labels[status] || status || '—';
}
 
function orderDotColor(status) {
  const colors = {
    pending: 'var(--warning)',
    confirmed: 'var(--info)',
    fulfilled: 'var(--accent)',
    shipped: 'var(--info)',
    delivered: 'var(--success)',
    cancelled: 'var(--danger)',
    refunded: 'var(--muted)',
  };
  return colors[status] || 'var(--muted)';
}
 
function orderMatchesFilter(order) {
  if (!orderFilter) return true;
  if (orderFilter === 'fulfilled') {
    return ['fulfilled', 'shipped', 'delivered'].includes(order.fulfillment_status);
  }
  return order.status === orderFilter;
}
 
function orderActionsHtml() {
  return orderFilters.map(f => \`
    <button class="btn btn-sm btn-filter \${orderFilter === f.value ? 'active' : ''}" onclick="filterOrders('\${f.value}')">\${f.label}</button>
  \`).join('');
}
 
async function showOrders() {
  currentRoute = 'orders';
  renderNav('orders');
  setTopbar('Заказы', orderActionsHtml());
  setContent('<div class="loading">Загрузка...</div>');
  try {
    await loadOrders();
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}
 
async function loadOrders() {
  try {
    const data = await GET('/orders?limit=200');
    orders = data.orders || [];
    ordersTotal = data.total || orders.length;
    renderOrdersTable();
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}
 
function renderOrdersTable() {
  const visibleOrders = orders
    .filter(orderMatchesFilter)
    .filter(o => matchesSearch([o.order_number, o.customer_email, o.shipping_name, o.customer_phone]));
 
  setContent(\`
    <div class="pf-card">
      <div class="flex" style="justify-content:space-between;margin-bottom:16px">
        <div class="pf-label" style="margin:0">Заказы · \${visibleOrders.length} из \${ordersTotal}</div>
      </div>
      \${!visibleOrders.length
        ? '<div class="pf-empty">Заказов не найдено</div>'
        : \`<div class="table-wrap card-table"><table>
        <thead>
          <tr>
            <th>№</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          \${visibleOrders.map(o => \`
            <tr class="click-row" onclick="openOrder('\${o.id}')">
              <td class="mono">\${esc(o.order_number)}</td>
              <td><strong>\${esc(o.shipping_name || o.customer_email)}</strong><br><span class="text-muted">\${esc(o.customer_email)}</span></td>
              <td class="price">\${rub(o.total_minor)}</td>
              <td><span class="flex"><span class="status-dot" style="background:\${orderDotColor(o.status)}"></span>\${badge(o.status)}</span></td>
              <td class="text-muted">\${formatDate(o.created_at)}</td>
              <td><button class="btn btn-sm" onclick="event.stopPropagation();openOrder('\${o.id}')">Open</button></td>
            </tr>
          \`).join('')}
        </tbody>
      </table></div>\`}
    </div>
  \`);
}
 
function filterOrders(status) {
  orderFilter = status;
  setTopbar('Заказы', orderActionsHtml());
  renderOrdersTable();
}
 
let subscribers = [];
 
 
// ─── Subscribers ─────────────────────────────────────────────────────────────
 
async function showSubscribers() {
  currentRoute = 'subscribers';
  renderNav('subscribers');
  setTopbar('Подписчики', '<button class="btn" onclick="exportSubscribers()">Экспорт CSV</button>');
  setContent('<div class="loading">Загрузка...</div>');
 
  try {
    const data = await GET('/subscribers');
    subscribers = data.subscribers || [];
    window._subscribers = subscribers;
    renderSubscribersTable();
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}
 
function renderSubscribersTable() {
  const visibleSubscribers = subscribers.filter(s => matchesSearch([s.email]));
  const now = Date.now();
  const last30 = subscribers.filter(s => {
    const t = new Date(s.created_at).getTime();
    return Number.isFinite(t) && now - t <= 30 * 24 * 60 * 60 * 1000;
  }).length;
 
  setContent(\`
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="stat-card accent">
        <div class="stat-label">Всего</div>
        <div class="stat-value">\${subscribers.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">За последние 30 дней</div>
        <div class="stat-value">\${last30}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Активных</div>
        <div class="stat-value">\${subscribers.length}</div>
      </div>
    </div>
    <div class="pf-card">
      \${!visibleSubscribers.length
        ? '<div class="pf-empty">Подписчиков пока нет</div>'
        : \`<div class="table-wrap card-table">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Дата подписки</th>
            <th>Источник</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          \${visibleSubscribers.map(s => \`
            <tr>
              <td>\${esc(s.email)}</td>
              <td class="text-muted">\${formatDate(s.created_at)}</td>
              <td><span class="chip">\${esc(s.source || 'site')}</span></td>
              <td><button class="btn btn-sm btn-danger" onclick="deleteSubscriberUnavailable()">Удалить</button></td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
      </div>\`}
    </div>
  \`);
}
 
function deleteSubscriberUnavailable() {
  toast('Удаление подписчиков пока не подключено', 'err');
}
 
function exportSubscribers() {
  const subs = subscribers.length ? subscribers : (window._subscribers || []);
  if (!subs.length) return;
  const csv = 'email,source,date\\n' +
    subs.map(s => \`\${s.email},\${s.source},\${s.created_at}\`).join('\\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'subscribers.csv';
  a.click();
}
 
// ─── Collabs ─────────────────────────────────────────────────────────────────
 
let collabs = [];
let collabDrawerIdx = null;
 
 
// ─── Collabs ─────────────────────────────────────────────────────────────────
 
async function showCollabs() {
  currentRoute = 'collabs';
  renderNav('collabs');
  setTopbar('Collabs', '<button class="btn btn-primary" onclick="openCollabDrawer(null)">Новый коллаб</button>');
  setContent('<div class="loading">Загрузка...</div>');
 
  try {
    const data = await GET('/collabs');
    collabs = data.collabs || [];
    renderCollabs();
  } catch (e) {
    setContent('<div class="pf-card pf-empty">' + esc(e.message) + '</div>');
  }
}
 
function renderCollabs() {
  if (!collabs.length) {
    setContent(\`
      <div class="pf-card pf-empty">
        <div>
          <div style="margin-bottom:14px">Нет коллабов</div>
          <button class="btn btn-primary" onclick="openCollabDrawer(null)">Добавить первый</button>
        </div>
      </div>
    \`);
    return;
  }
 
  const rows = collabs.map((c, i) => {
    const thumb = c.logoUrl
      ? '<div class="collab-thumb"><img src="' + esc(c.logoUrl) + '" alt=""></div>'
      : '<div class="collab-thumb">нет лого</div>';
 
    return '<div class="collab-row">' +
      thumb +
      '<div>' +
        '<div style="font-size:15px;letter-spacing:-0.02em"><strong>' + esc(c.name) + '</strong></div>' +
        '<div class="text-muted" style="font-size:12px;margin-top:3px">/' + esc(c.slug) + '</div>' +
      '</div>' +
      '<div class="info-list" style="min-width:170px">' +
        '<div><span class="pf-label" style="margin-bottom:4px">Статус</span>' + badge(c.status === 'active' ? 'active' : 'archived') + '</div>' +
        '<div><span class="pf-label" style="margin-bottom:4px">Даты</span><span class="text-muted">' + esc(c.year || '—') + '</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;white-space:nowrap">' +
        '<button class="btn btn-sm" onclick="openCollabDrawer(' + i + ')">Изменить</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteCollab(' + i + ')">Удалить</button>' +
      '</div>' +
    '</div>';
  }).join('');
 
  setContent(\`
    <div class="pf-card">
      <div class="pf-label">Коллабы на сайте</div>
      \${rows}
    </div>
  \`);
}
 
function renderCollabsTable() { renderCollabs(); }
 
function collabPreviewHtml(url, field) {
  const isLogo = field === 'logo';
  if (!url) {
    return '<div style="width:' + (isLogo ? '72px;height:72px' : '140px;height:80px') + ';background:var(--surface2);border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:11px">нет</div>';
  }
  return '<img src="' + esc(url) + '" style="width:' + (isLogo ? '72px;height:72px' : '140px;height:80px') + ';object-fit:' + (isLogo ? 'contain' : 'cover') + ';border-radius:6px;border:1px solid var(--border)" />';
}
 
function openCollabDrawer(idx) {
  collabDrawerIdx = idx;
  const c = idx !== null
    ? collabs[idx]
    : { id: '', name: '', slug: '', description: '', logoUrl: '', bannerUrl: '', status: 'active', year: new Date().getFullYear().toString() };
 
  const deleteButton = idx !== null
    ? '<button class="btn btn-danger" onclick="deleteCollab(' + idx + ');closeCollabDrawer()">Удалить</button>'
    : '';
 
  const drawerHtml =
    '<div class="modal-overlay" id="collab-overlay" onclick="if(event.target===this)closeCollabDrawer()">' +
      '<div class="modal" style="width:600px" onclick="event.stopPropagation()">' +
        '<div class="modal-header">' +
          '<span class="modal-title">' + (idx !== null ? 'Редактировать коллаб' : 'Новый коллаб') + '</span>' +
          '<button class="modal-close" onclick="closeCollabDrawer()">×</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-label">Название *</label>' +
              '<input id="cd-name" value="' + esc(c.name) + '" placeholder="Crocs Classic" oninput="autoSlug()" />' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">Slug *</label>' +
              '<input id="cd-slug" value="' + esc(c.slug) + '" placeholder="crocs-classic" />' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-label">Год</label>' +
              '<input id="cd-year" value="' + esc(c.year || '') + '" placeholder="2025" />' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">Статус</label>' +
              '<select id="cd-status">' +
                '<option value="active" ' + (c.status === 'active' ? 'selected' : '') + '>Активен (показывается на сайте)</option>' +
                '<option value="archive" ' + (c.status === 'archive' ? 'selected' : '') + '>Архив (скрыт)</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Описание (показывается на странице коллаба)</label>' +
            '<textarea id="cd-desc" rows="3">' + esc(c.description) + '</textarea>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Баннер (широкое фото, 16:9 или 2:1)</label>' +
            '<div style="display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:start">' +
              '<div id="cd-banner-preview" style="flex-shrink:0">' + collabPreviewHtml(c.bannerUrl, 'banner') + '</div>' +
              '<div style="flex:1">' +
                '<input id="cd-banner-url" value="' + esc(c.bannerUrl) + '" placeholder="URL или загрузи файл ниже" style="margin-bottom:8px" />' +
                '<label class="photo-dropzone">' +
                  'Загрузить баннер' +
                  \`<input type="file" accept="image/*" style="display:none" onchange="uploadCollabImage(this,'banner')">\` +
                '</label>' +
                '<div id="cd-banner-status" style="margin-top:8px;font-size:11px;color:var(--muted)"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Логотип партнёра (квадрат, PNG с прозрачностью)</label>' +
            '<div style="display:grid;grid-template-columns:90px 1fr;gap:12px;align-items:start">' +
              '<div id="cd-logo-preview" style="flex-shrink:0">' + collabPreviewHtml(c.logoUrl, 'logo') + '</div>' +
              '<div style="flex:1">' +
                '<input id="cd-logo-url" value="' + esc(c.logoUrl) + '" placeholder="URL или загрузи файл ниже" style="margin-bottom:8px" />' +
                '<label class="photo-dropzone">' +
                  'Загрузить логотип' +
                  \`<input type="file" accept="image/*" style="display:none" onchange="uploadCollabImage(this,'logo')">\` +
                '</label>' +
                '<div id="cd-logo-status" style="margin-top:8px;font-size:11px;color:var(--muted)"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer" style="justify-content:space-between">' +
          '<div>' + deleteButton + '</div>' +
          '<div style="display:flex;gap:8px">' +
            '<button class="btn" onclick="closeCollabDrawer()">Отмена</button>' +
            '<button class="btn btn-primary" onclick="saveCollab()">Сохранить</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
 
  document.body.insertAdjacentHTML('beforeend', drawerHtml);
}
 
function closeCollabDrawer() {
  document.getElementById('collab-overlay')?.remove();
}
 
function autoSlug() {
  const name = document.getElementById('cd-name').value;
  const slug = name.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
  document.getElementById('cd-slug').value = slug;
}
 
async function uploadCollabImage(input, field) {
  const file = input.files[0];
  if (!file) return;
  const statusEl = document.getElementById('cd-' + field + '-status');
  statusEl.textContent = 'Загрузка…';
 
  try {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/admin/api/collabs/upload', { method: 'POST', body: fd });
    const data = await r.json();
    if (!data.ok) throw new Error(data.error);
 
    document.getElementById('cd-' + field + '-url').value = data.url;
    document.getElementById('cd-' + field + '-preview').innerHTML = collabPreviewHtml(data.url, field);
    statusEl.textContent = '✓ Загружено';
    statusEl.style.color = 'var(--success)';
  } catch (e) {
    statusEl.textContent = '✗ ' + e.message;
    statusEl.style.color = 'var(--danger)';
  }
}
 
async function saveCollab() {
  const name = document.getElementById('cd-name').value.trim();
  const slug = document.getElementById('cd-slug').value.trim();
  if (!name || !slug) { toast('Заполни название и slug', 'err'); return; }
 
  const entry = {
    id: collabDrawerIdx !== null ? collabs[collabDrawerIdx].id : slug,
    name,
    slug,
    description: document.getElementById('cd-desc').value.trim(),
    year: document.getElementById('cd-year').value.trim(),
    status: document.getElementById('cd-status').value,
    bannerUrl: document.getElementById('cd-banner-url').value.trim(),
    logoUrl: document.getElementById('cd-logo-url').value.trim(),
  };
 
  if (collabDrawerIdx !== null) {
    collabs[collabDrawerIdx] = entry;
  } else {
    collabs.push(entry);
  }
 
  try {
    await api('PUT', '/collabs', { collabs });
    toast('Сохранено');
    closeCollabDrawer();
    renderCollabsTable();
  } catch (e) {
    toast(e.message, 'err');
  }
}
 
async function deleteCollab(idx) {
  if (!confirm('Удалить «' + collabs[idx].name + '»?')) return;
  collabs.splice(idx, 1);
  try {
    await api('PUT', '/collabs', { collabs });
    toast('Удалено');
    renderCollabsTable();
  } catch (e) {
    toast(e.message, 'err');
  }
}
 
async function openOrder(id) {
  try {
    const data = await GET('/orders/' + id);
    const o = data.order;
    const items = data.items;
    currentRoute = 'order-detail';
    renderNav('orders');
    setTopbar('Заказ ' + o.order_number, '<button class="btn" onclick="showOrders()">← Назад к заказам</button>');
    setContent(\`
      <div class="pf-grid">
        <div class="pf-stack">
          <div class="pf-card">
            <div class="pf-card-title">Состав заказа</div>
            <div class="table-wrap card-table">
              <table>
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>SKU</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                    <th>Итого</th>
                  </tr>
                </thead>
                <tbody>
                  \${items.map(i => \`
                    <tr>
                      <td><strong>\${esc(i.product_title)}</strong><br><span class="text-muted">\${esc(i.variant_title)}</span></td>
                      <td class="text-muted">\${esc(i.sku)}</td>
                      <td>\${i.quantity}</td>
                      <td class="price">\${rub(i.price_minor)}</td>
                      <td class="price">\${rub(i.price_minor * i.quantity)}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
 
          <div class="pf-card">
            <div class="pf-card-title">Доставка</div>
            <div class="info-list">
              <div class="info-row"><span class="text-muted">Получатель</span><strong>\${esc(o.shipping_name || '—')}</strong></div>
              <div class="info-row"><span class="text-muted">Город</span><span>\${esc(o.shipping_city || '—')} \${esc(o.shipping_postal_code || '')}</span></div>
              <div class="info-row"><span class="text-muted">Адрес</span><span style="text-align:right">\${esc(o.shipping_address_line1 || '—')} \${esc(o.shipping_address_line2 || '')}</span></div>
            </div>
          </div>
 
          <div class="pf-card">
            <label class="pf-label">Комментарий</label>
            <textarea id="o-notes" placeholder="Комментарий менеджера...">\${esc(o.notes || '')}</textarea>
          </div>
        </div>
 
        <div class="pf-stack">
          <div class="pf-card">
            <div class="pf-card-title">Статус</div>
            <div class="form-group">
              <label class="pf-label">Заказ</label>
              <div class="flex">
                <span class="status-dot" id="o-status-dot" style="background:\${orderDotColor(o.status)}"></span>
                <select id="o-status" onchange="updateOrderStatusDot(this.value)">
                  \${['pending','confirmed','cancelled','refunded'].map(s => \`<option value="\${s}" \${o.status===s?'selected':''}>\${orderStatusLabel(s)}</option>\`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="pf-label">Оплата</label>
              <select id="o-payment">
                \${['awaiting_payment','paid','failed','refunded'].map(s => \`<option value="\${s}" \${o.payment_status===s?'selected':''}>\${orderStatusLabel(s)}</option>\`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="pf-label">Доставка</label>
              <select id="o-fulfillment">
                \${['unfulfilled','fulfilled','shipped','delivered'].map(s => \`<option value="\${s}" \${o.fulfillment_status===s?'selected':''}>\${orderStatusLabel(s)}</option>\`).join('')}
              </select>
            </div>
            <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="saveOrderDetail('\${o.id}')">Сохранить</button>
          </div>
 
          <div class="pf-card">
            <div class="pf-card-title">Клиент</div>
            <div class="info-list">
              <div class="info-row"><span class="text-muted">Email</span><span style="text-align:right">\${esc(o.customer_email)}</span></div>
              <div class="info-row"><span class="text-muted">Телефон</span><span>\${esc(o.customer_phone || '—')}</span></div>
              <div class="info-row"><span class="text-muted">Дата заказа</span><span>\${formatDate(o.created_at)}</span></div>
            </div>
          </div>
 
          <div class="pf-card">
            <div class="pf-card-title">Итого</div>
            <div class="info-list">
              <div class="info-row"><span class="text-muted">Товары</span><span class="price">\${rub(o.subtotal_minor)}</span></div>
              <div class="info-row"><span class="text-muted">Доставка</span><span class="price">\${rub(o.shipping_minor)}</span></div>
              <div class="info-row"><strong>Всего</strong><strong class="price">\${rub(o.total_minor)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    \`);
  } catch(e) { toast(e.message, 'err'); }
}
 
function updateOrderStatusDot(status) {
  const dot = document.getElementById('o-status-dot');
  if (dot) dot.style.background = orderDotColor(status);
}
 
async function saveOrderDetail(id) {
  try {
    await PATCH('/orders/' + id, {
      status: document.getElementById('o-status').value,
      payment_status: document.getElementById('o-payment').value,
      fulfillment_status: document.getElementById('o-fulfillment').value,
      notes: document.getElementById('o-notes').value.trim() || null,
    });
    toast('Заказ обновлён');
    await openOrder(id);
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
 
// ─── Brand sections (Adidas Originals / Crocs) ─────────────────────────────────

const BRAND_SECTIONS = {
  adidas: {
    routeId:        'adidas',
    brandValue:     'Adidas Originals',
    title:          'Adidas Originals',
    apiPath:        '/adidas',
    formPrefix:     'apf',
    titlePlaceholder: 'Adidas Samba OG',
    slugPlaceholder:  'adidas-samba-og',
    descPlaceholder: 'Классические кроссовки Adidas Originals...',
    newLabel:       'Новый товар Adidas',
    emptyLabel:     'Товаров Adidas ещё нет',
    tagsHint:       'Теги: sneakers, apparel, accessories, limited, sale',
  },
  crocs: {
    routeId:        'crocs',
    brandValue:     'Crocs',
    title:          'Crocs',
    apiPath:        '/crocs',
    formPrefix:     'cpf',
    titlePlaceholder: 'Crocs Classic Clog',
    slugPlaceholder:  'crocs-classic-clog',
    descPlaceholder: 'Удобные кроксы из мягкого материала Croslite...',
    newLabel:       'Новый товар Crocs',
    emptyLabel:     'Товаров Crocs ещё нет',
    tagsHint:       'Теги: crocs, jibbitz, limited, sale, kids, unisex',
  },
};

let brandProducts = { adidas: [], crocs: [] };

function showAdidas() { showBrandSection('adidas'); }
function showCrocs()  { showBrandSection('crocs'); }

// ─── Boot ─────────────────────────────────────────────────────────────────────
 
window.addEventListener('hashchange', onHashChange);
onHashChange();
 
function normalizedSearch() {
  const q = currentSearchFilter.trim().toLowerCase();
  return q.length >= 2 ? q : '';
}
 
function matchesSearch(values) {
  const q = normalizedSearch();
  if (!q) return true;
  return values.some(v => String(v || '').toLowerCase().includes(q));
}
 
function resetSearch() {
  currentSearchFilter = '';
  const input = document.getElementById('topbar-search-input');
  if (input) input.value = '';
}
 
function onSearchInput(value) {
  currentSearchFilter = value;
  if (currentRoute === 'products') renderProductsTable();
  if (currentRoute === 'adidas') renderAdidasTable();
  if (currentRoute === 'crocs') renderCrocsTable();
  if (currentRoute === 'orders') renderOrdersTable();
  if (currentRoute === 'subscribers') renderSubscribersTable();
}
 

async function showBrandSection(key) {
  const cfg = BRAND_SECTIONS[key];
  currentRoute = cfg.routeId;
  renderNav(cfg.routeId);
  document.getElementById('page-title').textContent = cfg.title;
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn btn-primary" onclick="openNewBrandProduct('\${key}')">+ Новый товар</button>
  \`;
  setContent('<div class="loading">Загрузка...</div>');
  try {
    await loadBrandProducts(key);
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

async function loadBrandProducts(key) {
  const cfg = BRAND_SECTIONS[key];
  try {
    const data = await GET(cfg.apiPath);
    brandProducts[key] = data.products;
    renderBrandTable(key);
  } catch(e) {
    setContent(\`<div class="loading" style="color:var(--danger)">Ошибка загрузки: \${esc(e.message)}</div>\`);
  }
}

function renderAdidasTable() { renderBrandTable('adidas'); }
function renderCrocsTable()  { renderBrandTable('crocs'); }

function renderBrandTable(key) {
  const cfg = BRAND_SECTIONS[key];
  const q = normalizedSearch();
  const list = brandProducts[key] || [];
  const filtered = q
    ? list.filter(p => matchesSearch([p.title, p.slug, p.brand]))
    : list;

  if (!filtered.length) {
    setContent(\`
      <div class="pf-card pf-empty">
        <div>
          <div style="font-size:16px;letter-spacing:-0.02em">
            \${q ? 'Ничего не найдено' : cfg.emptyLabel}
          </div>
          <div class="text-muted" style="font-size:12px;margin-top:6px">
            \${q ? 'Попробуйте другой запрос.' : 'Создайте первый товар кнопкой «+ Новый товар».'}
          </div>
        </div>
      </div>
    \`);
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
          <th>Варианты</th>
          <th>Обновлён</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        \${filtered.map(p => \`
          <tr>
            <td><strong>\${esc(p.title)}</strong></td>
            <td class="text-muted">\${esc(p.slug)}</td>
            <td>
              <select class="inline-status-select" data-id="\${p.id}" data-brand="\${key}" onchange="brandQuickStatus(this)"
                style="font-size:0.82rem;padding:3px 6px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;">
                <option value="active" \${p.status==='active'?'selected':''}>Active</option>
                <option value="draft"  \${p.status==='draft'?'selected':''}>Draft</option>
                <option value="archived" \${p.status==='archived'?'selected':''}>Archived</option>
              </select>
            </td>
            <td>\${p.variant_count}</td>
            <td class="text-muted">\${formatDate(p.updated_at)}</td>
            <td>
              <div class="flex">
                <button class="btn btn-sm" onclick="openBrandProduct('\${key}','\${p.id}')">Open</button>
                <button class="btn btn-sm btn-danger" onclick="deleteBrandProduct('\${key}','\${p.id}', '\${esc(p.title)}')">✕</button>
              </div>
            </td>
          </tr>
        \`).join('')}
      </tbody>
    </table>
    </div>
  \`);
}

async function brandQuickStatus(sel) {
  const id = sel.dataset.id;
  const key = sel.dataset.brand;
  const status = sel.value;
  try {
    await PATCH('/products/' + id, { status });
    toast('Статус обновлён');
  } catch(e) {
    toast(e.message, 'err');
    await loadBrandProducts(key);
  }
}

async function deleteBrandProduct(key, id, title) {
  if (!confirm(\`Удалить «\${title}»? Все варианты и фото тоже будут удалены.\`)) return;
  try {
    await DEL('/products/' + id);
    toast('Товар удалён');
    await loadBrandProducts(key);
  } catch(e) { toast(e.message, 'err'); }
}

async function openNewBrandProduct(key) {
  await loadPfCatalog();
  pf = { product: null, variants: [], images: [], colors: [], tags: [] };
  renderBrandForm(key);
}

async function openBrandProduct(key, id) {
  setContent('<div class="loading">Загрузка...</div>');
  try {
    const [data] = await Promise.all([GET('/products/' + id), loadPfCatalog()]);
    const p = data.product;
    pf = {
      product: p,
      variants: data.variants || [],
      images: normalizeImages(data.images),
      colors: p.colors ? (Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors)) : [],
      tags: p.tags ? (Array.isArray(p.tags) ? p.tags : (p.tags.startsWith("[") ? JSON.parse(p.tags) : p.tags.split(",").map(t => t.trim()).filter(Boolean))) : [],
    };
    renderBrandForm(key);
  } catch(e) {
    toast(e.message, 'err');
    await loadBrandProducts(key);
  }
}

function renderBrandForm(key) {
  const cfg = BRAND_SECTIONS[key];
  const fp = cfg.formPrefix;
  const p = pf.product;
  const isNew = !p;

  document.getElementById('page-title').innerHTML =
    \`<span style="cursor:pointer;opacity:0.5" onclick="backToBrandSection('\${key}')">← \${cfg.title}</span>\`;
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn" onclick="backToBrandSection('\${key}')">Отмена</button>
    <button class="btn btn-primary" onclick="saveBrandProduct('\${key}')" style="gap:8px">
      <span>✓</span> Сохранить товар
    </button>
  \`;

  // Reuse the existing product form HTML, brand fixed via cfg.brandValue
  setContent(\`
    <style>
      .pf-layout { display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start; }
      .pf-card { background:var(--surface); border:1px solid var(--border); padding:28px; margin-bottom:20px; }
      .pf-card-title { font-size:13px; font-weight:600; letter-spacing:-0.01em; margin-bottom:20px; }
      .pf-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      .pf-group { margin-bottom:16px; }
      .pf-group:last-child { margin-bottom:0; }
      .pf-label { display:block; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
      .pf-label span { color:var(--danger); }
      .slug-preview { font-size:11px; color:var(--muted); margin-top:5px; }
      .slug-preview a { color:var(--accent); }
      .status-select-wrap { position:relative; }
      .status-dot { position:absolute; left:12px; top:50%; transform:translateY(-50%); width:8px; height:8px; border-radius:50%; background:var(--success); pointer-events:none; z-index:1; }
      .status-dot.draft { background:var(--muted); }
      .status-dot.archived { background:var(--danger); }
      select.has-dot { padding-left:28px; }
      .chips-wrap { display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:8px 10px; background:var(--surface2); border:1px solid var(--border); min-height:40px; cursor:text; }
      .chip { display:inline-flex; align-items:center; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:4px; padding:2px 8px; font-size:12px; }
      .chip button { background:none; border:none; color:var(--muted); font-size:14px; line-height:1; padding:0 0 0 2px; cursor:pointer; transition:color 0.1s; }
      .chip button:hover { color:var(--danger); }
      .chip-input { border:none; background:none; outline:none; font-size:12px; font-family:var(--font); color:var(--text); min-width:60px; flex:1; padding:0; }
      .color-list { display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
      .color-row { display:flex; align-items:center; gap:10px; padding:8px 12px; background:var(--surface2); border:1px solid var(--border); }
      .color-swatch { width:24px; height:24px; border-radius:50%; border:1px solid rgba(0,0,0,0.1); flex-shrink:0; }
      .color-name { flex:1; font-size:13px; }
      .color-hex { font-size:11px; color:var(--muted); font-family:monospace; }
      .color-remove { background:none; border:none; color:var(--muted); font-size:16px; cursor:pointer; padding:0; transition:color 0.1s; }
      .color-remove:hover { color:var(--danger); }
      .color-add-row { display:flex; gap:8px; align-items:center; }
      .color-add-row input[type=color] { width:36px; height:36px; padding:2px; border:1px solid var(--border); background:var(--surface2); cursor:pointer; }
      .photo-dropzone { border:2px dashed var(--border); padding:28px 20px; text-align:center; color:var(--muted); cursor:pointer; transition:border-color 0.15s, background 0.15s; margin-bottom:14px; border-radius:2px; }
      .photo-dropzone:hover, .photo-dropzone.drag-over { border-color:var(--accent); background:var(--accent-dim); color:var(--text); }
      .photo-dropzone .upload-icon { font-size:28px; margin-bottom:8px; }
      .photo-dropzone .upload-main { font-size:13px; margin-bottom:4px; }
      .photo-dropzone .upload-link { color:var(--accent); cursor:pointer; text-decoration:underline; }
      .photo-dropzone .upload-hint { font-size:11px; color:var(--muted); }
      .photo-gallery { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
      .photo-thumb { position:relative; aspect-ratio:1; background:var(--surface2); border:2px solid transparent; overflow:hidden; border-radius:2px; cursor:pointer; transition:border-color 0.15s; }
      .photo-thumb.is-primary { border-color:var(--accent); }
      .photo-thumb img { width:100%; height:100%; object-fit:cover; }
      .photo-thumb .thumb-num { position:absolute; top:4px; left:4px; width:18px; height:18px; border-radius:50%; background:var(--accent); color:#fff; font-size:10px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.1s; }
      .photo-thumb.is-primary .thumb-num { opacity:1; }
      .photo-thumb .thumb-del { position:absolute; top:4px; right:4px; background:var(--surface); border:1px solid var(--border); color:var(--danger); width:20px; height:20px; font-size:11px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.1s; border-radius:2px; }
      .photo-thumb:hover .thumb-del { opacity:1; }
      .photo-gallery-hint { font-size:11px; color:var(--muted); margin-top:8px; }
      .variants-table { width:100%; border-collapse:collapse; margin-top:4px; }
      .variants-table th { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); padding:8px 10px; border-bottom:1px solid var(--border); text-align:left; }
      .variants-table td { padding:10px 10px; border-bottom:1px solid var(--border); font-size:12px; vertical-align:middle; }
      .variants-table tr:last-child td { border-bottom:none; }
    </style>

    <div style="margin-bottom:20px;display:flex;align-items:center;gap:10px">
      <button class="btn btn-sm" onclick="backToBrandSection('\${key}')" style="gap:6px">← Назад</button>
      <h2 style="font-size:22px;font-weight:500;letter-spacing:-0.03em">
        \${isNew ? cfg.newLabel : esc(p.title)}
      </h2>
      <span style="font-size:11px;background:rgba(0,0,0,0.06);padding:3px 10px;border-radius:999px;color:var(--muted)">\${esc(cfg.brandValue)}</span>
    </div>

    <div class="pf-layout">
      <div>
        <div class="pf-card">
          <div class="pf-card-title">Основная информация</div>
          <div class="pf-row">
            <div class="pf-group">
              <label class="pf-label">Название товара <span>*</span></label>
              <input id="\${fp}-title" value="\${esc(p?.title || '')}" placeholder="\${esc(cfg.titlePlaceholder)}"
                oninput="bpfAutoSlug('\${key}')">
            </div>
            <div class="pf-group">
              <label class="pf-label">Slug (URL) <span>*</span></label>
              <input id="\${fp}-slug" value="\${esc(p?.slug || '')}" placeholder="\${esc(cfg.slugPlaceholder)}"
                oninput="window['\${fp}SlugTouched']=true;bpfUpdateSlugPreview('\${key}')">
              <div class="slug-preview" id="\${fp}-slug-preview">
                kokoc.store/product/<span id="\${fp}-slug-val">\${esc(p?.slug || '')}</span>
                \${p?.slug ? '<a href="https://kokoc.store/product/'+esc(p.slug)+'" target="_blank">↗</a>' : ''}
              </div>
            </div>
          </div>
          <div class="pf-row">
            <div class="pf-group">
              <label class="pf-label">Статус</label>
              <div class="status-select-wrap">
                <div class="status-dot \${p?.status === 'draft' ? 'draft' : p?.status === 'archived' ? 'archived' : ''}" id="\${fp}-status-dot"></div>
                <select id="\${fp}-status" class="has-dot" onchange="bpfUpdateStatusDot('\${key}')">
                  <option value="active"   \${(!p || p.status==='active')  ?'selected':''}>Активен</option>
                  <option value="draft"    \${p?.status==='draft'          ?'selected':''}>Черновик</option>
                  <option value="archived" \${p?.status==='archived'       ?'selected':''}>Архив</option>
                </select>
              </div>
            </div>
            <div class="pf-group">
              <label class="pf-label">Артикул (SKU)</label>
              <input id="\${fp}-sku" value="\${esc(p?.sku || '')}" placeholder="SKU-001">
            </div>
          </div>
          <div class="pf-group">
            <label class="pf-label">Описание</label>
            <textarea id="\${fp}-desc" style="min-height:100px" placeholder="\${esc(cfg.descPlaceholder)}">\${esc(p?.description || '')}</textarea>
          </div>
        </div>

        <div class="pf-card">
          <div class="pf-row">
            <div class="pf-group" style="margin-bottom:0">
              <label class="pf-label">Видимость</label>
              <select id="\${fp}-visibility">
                <option value="visible" \${(!p || p.visibility !== 'hidden')?'selected':''}>Видимый</option>
                <option value="hidden"  \${p?.visibility==='hidden'        ?'selected':''}>Скрытый</option>
              </select>
            </div>
            <div class="pf-group" style="margin-bottom:0">
              <label class="pf-label">Метка (badge)</label>
              <select id="\${fp}-badge">
                <option value=""        \${!p?.badge            ?'selected':''}>— нет —</option>
                <option value="hit"     \${p?.badge==='hit'     ?'selected':''}>🔥 Hit</option>
                <option value="new"     \${p?.badge==='new'     ?'selected':''}>✨ New</option>
                <option value="limited" \${p?.badge==='limited' ?'selected':''}>⚡ Limited</option>
              </select>
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:10px">
            Бренд зафиксирован: <b>\${esc(cfg.brandValue)}</b>. Метка <b>Hit</b> выводит товар первым на лендинге.
          </div>
        </div>

        <div class="pf-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div class="pf-card-title" style="margin-bottom:0">Варианты</div>
            \${!isNew ? \`<button class="btn btn-sm" onclick="openNewVariant()">+ Добавить вариант</button>\` : ''}
          </div>
          \${isNew
            ? \`<div style="font-size:12px;color:var(--muted);padding:16px 0;border-top:1px solid var(--border)">
                Сначала сохраните товар — затем добавьте варианты с размерами, ценой и остатком.
               </div>\`
            : \`<div id="pf-variants-list">\${renderVariantsTable()}</div>\`
          }
        </div>
      </div>

      <div>
        <div class="pf-card">
          <div class="pf-card-title">Фото товара</div>
          <label class="photo-dropzone" id="pf-dropzone"
            style="\${pf.images.length ? 'display:none' : ''}"
            ondragover="pfDragOver(event)" ondragleave="pfDragLeave(event)" ondrop="pfDrop(event)">
            <input type="file" multiple accept="image/*" style="display:none" id="pf-file-input"
              onchange="pfFilesSelected(this)">
            <div class="upload-icon">↑</div>
            <div class="upload-main">
              Загрузить фото<br>
              <span style="font-size:12px;font-weight:400">Перетащите сюда или </span>
              <span class="upload-link">выберите файлы</span>
            </div>
            <div class="upload-hint" style="margin-top:6px">JPG, PNG до 10MB · 800×800 px, 1:1</div>
          </label>
          <div class="photo-gallery" id="pf-photo-gallery">
            \${renderPhotoGallery()}
          </div>
          <div id="pf-photo-hint" class="photo-gallery-hint" style="\${pf.images.length ? '' : 'display:none'}">
            Нажмите на фото, чтобы сделать его главным
            <button class="btn btn-sm" style="margin-left:8px;font-size:10px"
              onclick="document.getElementById('pf-dropzone').style.display='';document.getElementById('pf-dropzone').scrollIntoView({behavior:'smooth'})">+ Ещё фото</button>
          </div>
        </div>

        <div class="pf-card">
          <div class="pf-card-title">Цвет</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:12px">Доступные цвета</div>
          <div class="color-list" id="pf-color-list">\${renderColorList()}</div>
          <div class="color-add-row" id="pf-color-add-row">
            <input type="color" id="pf-color-picker" value="#000000">
            <input type="text" id="pf-color-name" placeholder="Название цвета" style="flex:1"
              onkeydown="if(event.key==='Enter')pfAddColor()">
            <button class="btn btn-sm" onclick="pfAddColor()" style="white-space:nowrap">+ Добавить</button>
          </div>
        </div>

        <div class="pf-card">
          <div class="pf-card-title">Теги</div>
          <div class="chips-wrap" id="pf-tags-wrap" onclick="document.getElementById('pf-tag-input').focus()">
            \${pf.tags.map((t,i) => \`
              <span class="chip" style="background:var(--accent-dim);border-color:var(--accent);color:var(--text)">
                \${esc(t)}
                <button type="button" onclick="pfRemoveTag(\${i})">×</button>
              </span>
            \`).join('')}
            <input class="chip-input" id="pf-tag-input" placeholder="+ Добавить тег"
              onkeydown="pfTagKeydown(event)">
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:8px">
            \${esc(cfg.tagsHint)}
          </div>
        </div>
      </div>
    </div>
  \`);

  window[fp + 'SlugTouched'] = !!p?.slug;
  bpfUpdateStatusDot(key);
}

function bpfUpdateSlugPreview(key) {
  const fp = BRAND_SECTIONS[key].formPrefix;
  const v = document.getElementById(fp + '-slug').value;
  const el = document.getElementById(fp + '-slug-val');
  if (el) el.textContent = v;
}

function bpfAutoSlug(key) {
  const fp = BRAND_SECTIONS[key].formPrefix;
  if (!window[fp + 'SlugTouched']) {
    const title = document.getElementById(fp + '-title').value;
    const slug = title.toLowerCase()
      .replace(/[аА]/g,'a').replace(/[бБ]/g,'b').replace(/[вВ]/g,'v')
      .replace(/[гГ]/g,'g').replace(/[дД]/g,'d').replace(/[еЕёЁ]/g,'e')
      .replace(/[жЖ]/g,'zh').replace(/[зЗ]/g,'z').replace(/[иИйЙ]/g,'i')
      .replace(/[кК]/g,'k').replace(/[лЛ]/g,'l').replace(/[мМ]/g,'m')
      .replace(/[нН]/g,'n').replace(/[оО]/g,'o').replace(/[пП]/g,'p')
      .replace(/[рР]/g,'r').replace(/[сС]/g,'s').replace(/[тТ]/g,'t')
      .replace(/[уУ]/g,'u').replace(/[фФ]/g,'f').replace(/[хХ]/g,'kh')
      .replace(/[цЦ]/g,'ts').replace(/[чЧ]/g,'ch').replace(/[шШ]/g,'sh')
      .replace(/[щЩ]/g,'shch').replace(/[ыЫ]/g,'y').replace(/[эЭ]/g,'e')
      .replace(/[юЮ]/g,'yu').replace(/[яЯ]/g,'ya')
      .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-');
    document.getElementById(fp + '-slug').value = slug;
    bpfUpdateSlugPreview(key);
  }
}

function bpfUpdateStatusDot(key) {
  const fp = BRAND_SECTIONS[key].formPrefix;
  const sel = document.getElementById(fp + '-status');
  const dot = document.getElementById(fp + '-status-dot');
  if (!sel || !dot) return;
  dot.className = 'status-dot ' + (sel.value === 'draft' ? 'draft' : sel.value === 'archived' ? 'archived' : '');
}

function backToBrandSection(key) {
  document.getElementById('topbar-actions').innerHTML = \`
    <button class="btn btn-primary" onclick="openNewBrandProduct('\${key}')">+ Новый товар</button>
  \`;
  document.getElementById('page-title').textContent = BRAND_SECTIONS[key].title;
  loadBrandProducts(key);
}

async function saveBrandProduct(key) {
  const cfg = BRAND_SECTIONS[key];
  const fp = cfg.formPrefix;
  const title = document.getElementById(fp + '-title')?.value.trim();
  const slug  = document.getElementById(fp + '-slug')?.value.trim();
  if (!title || !slug) { toast('Заполните название и slug', 'err'); return; }

  const payload = {
    title, slug,
    brand:       cfg.brandValue,
    status:      document.getElementById(fp + '-status')?.value,
    sku:         document.getElementById(fp + '-sku')?.value.trim() || null,
    description: document.getElementById(fp + '-desc')?.value.trim() || null,
    visibility:  document.getElementById(fp + '-visibility')?.value,
    badge:       document.getElementById(fp + '-badge')?.value || null,
    colors:      JSON.stringify(pf.colors),
    tags:        pf.tags.join(','),
  };

  try {
    const isNew = !pf.product;
    let productId;
    if (pf.product) {
      await PATCH('/products/' + pf.product.id, payload);
      productId = pf.product.id;
      toast('Товар сохранён');
    } else {
      const res = await POST('/products', payload);
      productId = res.id;
      toast('Товар создан — добавьте варианты с размерами и ценой');
    }

    const newImages = pf.images.filter(img => img._file);
    for (let i = 0; i < newImages.length; i++) {
      const fd = new FormData();
      fd.append('file', newImages[i]._file);
      fd.append('position', String(i));
      await fetch('/admin/api/products/' + productId + '/images', { method: 'POST', body: fd });
    }

    if (isNew) {
      await openBrandProduct(key, productId);
    } else {
      await loadBrandProducts(key);
    }
  } catch(e) { toast(e.message, 'err'); }
}

</script>
</body>
</html>`;
}
