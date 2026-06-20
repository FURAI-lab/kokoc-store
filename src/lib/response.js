export function htmlResponse(html, init = {}) {
  return new Response(html, {
    ...init,
    headers: {
      "content-type": "text/html; charset=UTF-8",
      ...(init.headers || {})
    }
  });
}

export function xmlResponse(xml, init = {}) {
  return new Response(xml, {
    ...init,
    headers: {
      "content-type": "application/xml; charset=UTF-8",
      ...(init.headers || {})
    }
  });
}

export function textResponse(text, init = {}) {
  return new Response(text, {
    ...init,
    headers: {
      "content-type": "text/plain; charset=UTF-8",
      ...(init.headers || {})
    }
  });
}

export function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      ...(init.headers || {})
    }
  });
}

export function methodNotAllowedResponse(allowedMethods) {
  return jsonResponse(
    {
      ok: false,
      error: "Method not allowed",
      allowedMethods
    },
    {
      status: 405,
      headers: {
        allow: allowedMethods.join(", ")
      }
    }
  );
}

export function notFoundResponse(details = {}) {
  return jsonResponse(
    {
      ok: false,
      error: "Not found",
      ...details
    },
    {
      status: 404
    }
  );
}

