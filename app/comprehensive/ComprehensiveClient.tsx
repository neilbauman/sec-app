// app/comprehensive/ComprehensiveClient.tsx
'use client';

import { useEffect, useState } from 'react';

type ListResponse = {
  ok: boolean;
  totals?: Record<string, number>;
  pillars?: any[];
  themes?: any[];
  subthemes?: any[];
  indicators?: any[];
  [k: string]: any;
};

export default function ComprehensiveClient({ baseUrl }: { baseUrl: string }) {
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // If you already created /app/comprehensive/api/list/route.ts this will hit it.
        // If not, temporarily point to /framework/api/list to verify wiring.
        const res = await fetch(`${baseUrl}/comprehensive/api/list`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ListResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Comprehensive Framework (read-only)</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {data && (
        <div className="space-y-3">
          <div className="text-sm">
            <strong>Counts</strong>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-[40vh]">
{JSON.stringify({
  totals: data.totals,
  pillars: data.pillars?.length ?? 0,
  themes: data.themes?.length ?? 0,
  subthemes: data.subthemes?.length ?? 0,
  indicators: data.indicators?.length ?? 0
}, null, 2)}
            </pre>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer">Raw payload</summary>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-[40vh]">
{JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
