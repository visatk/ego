export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Backend: API Route Interception
    if (url.pathname.startsWith("/api/")) {
      return handleApiRequest(request, env);
    }

    // 2. Frontend: Static Asset Proxying (Resolves the 404 SPA breakage)
    try {
      // Fetch the compiled asset dynamically from Cloudflare's static edge cache
      let response = await env.ASSETS.fetch(request);
      
      // Clone response to safely mutate headers (env.ASSETS returns immutable responses)
      response = new Response(response.body, response);
      
      applySecurityHeaders(response.headers);
      
      // Aggressive cache optimization for Vite fingerprinted assets
      if (url.pathname.startsWith("/assets/")) {
        response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        // Force revalidation for non-fingerprinted assets like index.html
        response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      }

      return response;
    } catch (err) {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

function handleApiRequest(request: Request, env: Env): Response {
  // Security Constraint: Reject unauthorized HTTP methods
  if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // TODO: Add your Drizzle routing/logic here
  const response = Response.json({ name: "Cloudflare Secure API" });
  
  applySecurityHeaders(response.headers);
  
  // Security Constraint: APIs should never be cached implicitly
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  
  return response;
}

function applySecurityHeaders(headers: Headers): void {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Baseline restrictive CSP -> Safely tweak 'unsafe-inline' based on React/Vite needs
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self';"
  );
}
