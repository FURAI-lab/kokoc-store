import { jsonResponse, methodNotAllowedResponse, notFoundResponse } from "../../lib/response.js";
import { handleSubscribe } from "./subscribe.js";

function buildBindingStatus(env) {
  return {
    assets: Boolean(env.ASSETS),
    database: Boolean(env.DB),
    cache: Boolean(env.CACHE)
  };
}

function handleHealth(request, env, appConfig) {
  if (request.method !== "GET") {
    return methodNotAllowedResponse(["GET"]);
  }

  return jsonResponse({
    ok: true,
    service: appConfig.serviceName,
    domain: appConfig.domain,
    version: appConfig.apiVersion,
    storeStatus: appConfig.storeStatus,
    timestamp: new Date().toISOString(),
    bindings: buildBindingStatus(env)
  });
}

function handleCatalogProducts(request) {
  if (request.method !== "GET") {
    return methodNotAllowedResponse(["GET"]);
  }

  return jsonResponse({
    ok: true,
    items: [],
    pagination: {
      total: 0,
      limit: 24,
      offset: 0
    },
    message: "Catalog foundation is ready. Product reads will be wired to D1 next."
  });
}

function handleCart(request) {
  if (request.method !== "GET") {
    return methodNotAllowedResponse(["GET"]);
  }

  return jsonResponse({
    ok: true,
    cart: {
      id: null,
      currency: "RUB",
      items: [],
      totals: {
        subtotal: 0,
        total: 0
      }
    },
    message: "Cart endpoint scaffolded. Session persistence will be wired after D1 bindings are created."
  });
}

export async function handleApiRequest(request, env, appConfig, ctx) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return handleHealth(request, env, appConfig);
  }

  if (url.pathname === "/api/catalog/products") {
    return handleCatalogProducts(request, env);
  }

  if (url.pathname === "/api/cart") {
    return handleCart(request, env);
  }

  if (url.pathname === "/api/subscribe") {
    return handleSubscribe(request, env, ctx);
  }

  return notFoundResponse({
    message: "API route not found",
    pathname: url.pathname
  });
}
