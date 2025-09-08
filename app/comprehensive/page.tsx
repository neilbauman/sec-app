// app/comprehensive/page.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // avoid prerender issues

export default async function ComprehensivePage() {
  const h = await headers();

  // Build absolute base URL for Vercel / localhost
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.VERCEL_URL ??
    "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : `${proto}://${host}`;

  const token = process.env.INTERNAL_API_TOKEN ?? "";

  const res = await fetch(`${baseUrl}/comprehensive/api/list`, {
    cache: "no-store",
    headers: { "x-internal-token": token },
  });

  if (!res.ok) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Comprehensive Framework (read-only)</h1>
        <p>Failed to load comprehensive framework data.</p>
        <p className="text-sm mt-2">HTTP {res.status}</p>
        <p className="text-sm mt-2">
          You can also inspect the raw endpoint at <code>/comprehensive/api/list</code>.
        </p>
      </main>
    );
  }

  const data = await res.json();

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-3xl font-bold">Comprehensive Framework (read-only)</h1>
      <ul className="list-disc pl-6">
        <li>Pillars: {data?.counts?.pillars ?? 0}</li>
        <li>Themes: {data?.counts?.themes ?? 0}</li>
        <li>Sub-themes: {data?.counts?.subthemes ?? 0}</li>
        <li>Indicators: {data?.counts?.indicators ?? 0}</li>
        <li>Levels: {data?.counts?.levels ?? 0}</li>
        <li>Criteria: {data?.counts?.criteria ?? 0}</li>
      </ul>

      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
        {JSON.stringify(data?.sample?.[0] ?? data?.standards?.[0] ?? {}, null, 2)}
      </pre>

      <p className="text-sm text-gray-500">
        Data is fetched from <code>/comprehensive/api/list</code>. (Uses <code>x-internal-token</code>
        .)
      </p>
    </main>
  );
}
