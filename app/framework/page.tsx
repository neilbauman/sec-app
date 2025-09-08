// app/framework/page.tsx (server component)
export const dynamic = 'force-dynamic';

function getBaseUrl() {
  // Works for Vercel preview/prod and local dev
  const v = process.env.VERCEL_URL;
  if (v) return `https://${v}`;
  return 'http://localhost:3000';
}

export default async function FrameworkPage() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/framework/api/list`, {
    method: 'GET',
    headers: {
      // This never reaches the browser; it’s used server-to-server.
      'x-internal-token': process.env.INTERNAL_API_TOKEN || '',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Primary Framework (read-only)</h1>
        <p className="mt-4">Failed to load primary framework data.</p>
        <p className="mt-2 text-sm text-gray-500">HTTP {res.status}</p>
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Primary Framework (read-only)</h1>
      <ul className="list-disc list-inside">
        <li>Pillars: {data?.counts?.pillars ?? 0}</li>
        <li>Themes: {data?.counts?.themes ?? 0}</li>
        <li>Sub-themes: {data?.counts?.subthemes ?? 0}</li>
      </ul>
      <p className="text-sm text-gray-500">
        Data is fetched from <code>/framework/api/list</code> using a private
        header.
      </p>
    </div>
  );
}
