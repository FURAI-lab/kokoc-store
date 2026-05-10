import { jsonResponse } from "../../lib/response.js";

const VALID_STATUSES = ["pending", "confirmed", "cancelled", "refunded"];
const VALID_FULFILLMENT = ["unfulfilled", "fulfilled", "shipped", "delivered"];
const VALID_PAYMENT = ["awaiting_payment", "paid", "failed", "refunded"];

export async function listOrders(env, url) {
  const status = url.searchParams.get("status");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let query = `SELECT * FROM orders`;
  const binds = [];
  if (status) {
    query += ` WHERE status = ?`;
    binds.push(status);
  }
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  binds.push(limit, offset);

  const { results } = await env.DB.prepare(query).bind(...binds).all();

  // total count
  let countQuery = `SELECT COUNT(*) as total FROM orders`;
  const countBinds = [];
  if (status) {
    countQuery += ` WHERE status = ?`;
    countBinds.push(status);
  }
  const { total } = await env.DB.prepare(countQuery).bind(...countBinds).first();

  return jsonResponse({ ok: true, orders: results, total, limit, offset });
}

export async function getOrder(env, orderId) {
  const order = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(orderId).first();
  if (!order) return jsonResponse({ ok: false, error: "Not found" }, { status: 404 });

  const { results: items } = await env.DB.prepare(
    `SELECT * FROM order_items WHERE order_id = ?`
  ).bind(orderId).all();

  return jsonResponse({ ok: true, order, items });
}

export async function updateOrderStatus(env, orderId, body) {
  const { status, fulfillment_status, payment_status, notes } = body;

  if (status && !VALID_STATUSES.includes(status)) {
    return jsonResponse({ ok: false, error: `Invalid status. Valid: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }
  if (fulfillment_status && !VALID_FULFILLMENT.includes(fulfillment_status)) {
    return jsonResponse({ ok: false, error: `Invalid fulfillment_status. Valid: ${VALID_FULFILLMENT.join(", ")}` }, { status: 400 });
  }
  if (payment_status && !VALID_PAYMENT.includes(payment_status)) {
    return jsonResponse({ ok: false, error: `Invalid payment_status. Valid: ${VALID_PAYMENT.join(", ")}` }, { status: 400 });
  }

  await env.DB.prepare(`
    UPDATE orders SET
      status = COALESCE(?, status),
      fulfillment_status = COALESCE(?, fulfillment_status),
      payment_status = COALESCE(?, payment_status),
      notes = COALESCE(?, notes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(status ?? null, fulfillment_status ?? null, payment_status ?? null, notes ?? null, orderId).run();

  return jsonResponse({ ok: true });
}
