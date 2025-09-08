// lib/absUrl.ts
// Build an absolute URL for server components without using headers() at build time.
export function absUrl(path: string): string {
  // Prefer explicit envs that Vercel sets for previews/production
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL || // e.g. my-app-abc.vercel.app
    '';

  const host =
    vercel ||
    process.env.NEXT_PUBLIC_SITE_URL || // optional manual override
    'localhost:3000';

  const origin = host.startsWith('http') ? host : `https://${host}`;
  // Ensure single slash join
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
