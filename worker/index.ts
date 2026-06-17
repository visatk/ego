export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Routing with Method Constraints
    if (url.pathname.startsWith("/api/")) {
      return handleApiRequest(request);
    }

    // 2. Programmatic Static Asset Resolution & Edge Caching
    try {
      let response = await env.ASSETS.fetch(request);
      
      // Clone the immutable asset response to safely append headers
      response = new Response(response.body, response);
      applySecurityHeaders(response.headers);

      // Aggressive caching for fingerprinted Vite assets; dynamic revalidation for index.html
      if (response.status === 200 && url.pathname.match(/\.[0-9a-f]{8}\.(js|css|woff2?|png|svg)$/i)) {
        response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      }

      return response;
    } catch (error) {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

function handleApiRequest(request: Request): Response {
  // AppSec: Reject unexpected HTTP methods early
  if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const response = Response.json({ name: "Cloudflare Secure Edge API" });
  
  applySecurityHeaders(response.headers);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  
  return response;
}

function applySecurityHeaders(headers: Headers): void {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.egobot.dev;"
  );
}
