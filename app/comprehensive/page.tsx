// app/comprehensive/page.tsx
// Server Component
export const dynamic = 'force-dynamic';

import { internalGet } from '@/lib/internalFetch';

export default async function ComprehensivePage() {
  const res = await internalGet('/comprehensive/api/list');
  if (!res.ok) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Comprehensive Framework (read-only)</h1>
        <p className="text-red-600">Failed to load comprehensive framework data.</p>
        <p className="mt-2 text-sm text-gray-500">HTTP {res.status}</p>
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Comprehensive Framework (read-only)</h1>
      <ul className="space-y-1">
        <li>Pillars: {data?.counts?.pillars ?? 0}</li>
        <li>Themes: {data?.counts?.themes ?? 0}</li>
        <li>Sub-themes: {data?.counts?.subthemes ?? 0}</li>
        <li>Indicators: {data?.counts?.indicators ?? 0}</li>
        <li>Levels: {data?.counts?.levels ?? 0}</li>
        <li>Criteria: {data?.counts?.criteria ?? 0}</li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">
        Data is fetched from <code>/comprehensive/api/list</code>.
      </p>
    </div>
  );
}
