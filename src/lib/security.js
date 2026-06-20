const securityHeaders = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "upgrade-insecure-requests"
  ].join("; "),
  "permissions-policy": "camera=(), geolocation=(self), microphone=(), payment=(), usb=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY"
};

export function withSecurityHeaders(response, extraHeaders = {}) {
  const headers = new Headers(response.headers);

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  Object.entries(extraHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
