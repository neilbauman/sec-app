// app/framework/page.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // don't prerender; always run on the server

export default async function FrameworkPage() {
  const h = await headers();

  // Build an absolute base URL that works on Vercel + localhost
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.VERCEL_URL ??
    "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : `${proto}://${host}`;

  const res = await fetch(`${baseUrl}/framework/api/list`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Primary Framework (read-only)</h1>
        <p>Failed to load primary framework data.</p>
        <p className="text-sm mt-2">HTTP {res.status}</p>
      </main>
    );
  }

  const data = await res.json();

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-3xl font-bold">Primary Framework (read-only)</h1>
      <ul className="list-disc pl-6">
        <li>Pillars: {data?.totals?.pillars ?? data?.pillars?.length ?? 0}</li>
        <li>Themes: {data?.totals?.themes ?? data?.themes?.length ?? 0}</li>
        <li>Sub-themes: {data?.totals?.subthemes ?? data?.subthemes?.length ?? 0}</li>
      </ul>
      <p className="text-sm text-gray-500">
        Data is fetched from <code>/framework/api/list</code>.
      </p>
    </main>
  );
}
