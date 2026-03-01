export function securityHeaders() {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-eval'",
    "connect-src 'self' https:"
  ].join("; ");

  return {
    "Content-Security-Policy": csp,
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
  };
}

export function safeNextPath(input: string | null | undefined) {
  if (!input) return null;
  if (input.startsWith("//")) return null;
  if (input.startsWith("http:")) return null;
  if (input.startsWith("https:")) return null;
  if (!input.startsWith("/")) return null;
  return input;
}
