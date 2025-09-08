// app/framework/page.tsx
// Server Component
export const dynamic = 'force-dynamic';

import { internalGet } from '@/lib/internalFetch';

export default async function FrameworkPage() {
  const res = await internalGet('/framework/api/list');
  if (!res.ok) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Primary Framework Editor</h1>
        <p className="text-red-600">Failed to load framework data.</p>
        <p className="mt-2 text-sm text-gray-500">HTTP {res.status}</p>
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Primary Framework Editor</h1>
      <div className="space-y-2">
        <div>Pillars: {data?.totals?.pillars ?? 0}</div>
        <div>Themes: {data?.totals?.themes ?? 0}</div>
        <div>Sub-themes: {data?.totals?.subthemes ?? 0}</div>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Data is fetched from <code>/framework/api/list</code>.
      </p>
    </div>
  );
}
