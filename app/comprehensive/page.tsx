// app/comprehensive/page.tsx (server component)
export const dynamic = 'force-dynamic';

function getBaseUrl() {
  const v = process.env.VERCEL_URL;
  if (v) return `https://${v}`;
  return 'http://localhost:3000';
}

export default async function ComprehensivePage() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/comprehensive/api/list`, {
    method: 'GET',
    headers: {
      'x-internal-token': process.env.INTERNAL_API_TOKEN || '',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Comprehensive Framework (read-only)</h1>
        <p className="mt-4">Failed to load comprehensive framework data.</p>
        <p className="mt-2 text-sm text-gray-500">HTTP {res.status}</p>
        <p className="mt-6 text-sm">
          You can also inspect the raw endpoint at{' '}
          <code>/comprehensive/api/list</code>.
        </p>
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Comprehensive Framework (read-only)</h1>

      {data.mode === 'fallback-primary-only' ? (
        <>
          <p className="text-sm">
            Comprehensive tables not found yet. Showing fallback based on the
            Primary framework.
          </p>
          <ul className="list-disc list-inside">
            <li>Pillars: {data?.counts?.pillars ?? 0}</li>
            <li>Themes: {data?.counts?.themes ?? 0}</li>
            <li>Sub-themes: {data?.counts?.subthemes ?? 0}</li>
            <li>Standards (P/T/ST combos): {data?.counts?.standards ?? 0}</li>
          </ul>
        </>
      ) : (
        <>
          <ul className="list-disc list-inside">
            <li>Pillars: {data?.counts?.pillars ?? 0}</li>
            <li>Themes: {data?.counts?.themes ?? 0}</li>
            <li>Sub-themes: {data?.counts?.subthemes ?? 0}</li>
            <li>Indicators: {data?.counts?.indicators ?? 0}</li>
            <li>Levels: {data?.counts?.levels ?? 0}</li>
            <li>Criteria: {data?.counts?.criteria ?? 0}</li>
          </ul>
        </>
      )}

      <p className="text-sm text-gray-500">
        Data is fetched from <code>/comprehensive/api/list</code> using a
        private header.
      </p>
    </div>
  );
}
