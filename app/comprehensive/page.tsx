'use client';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react';

type ApiShape = {
  ok: boolean;
  totals?: {
    pillars: number;
    themes: number;
    subthemes: number;
    indicators: number;
    levels: number;
  };
  note?: string;
};

export default function ComprehensiveFrameworkPage() {
  const [data, setData] = useState<ApiShape | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/comprehensive/api/list', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ApiShape = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || 'Request failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight">Comprehensive Framework (read-only)</h1>

      <p className="text-sm text-gray-500 mt-2">
        This is a safe, client-only scaffold. No Supabase queries here yet. We’ll layer features on top.
      </p>

      <section className="mt-6 rounded-lg border border-gray-200 p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {err && <div className="text-red-600">Error: {err}</div>}
        {!loading && !err && (
          <div className="space-y-3">
            <div className="text-gray-700">
              API says: <span className="font-medium">{data?.ok ? 'ok' : 'not ok'}</span>
            </div>
            {data?.note && (
              <div className="text-gray-500 text-sm">
                Note: {data.note}
              </div>
            )}
            {data?.totals && (
              <div className="text-sm text-gray-700">
                Current totals (from Primary Framework snapshot):
                <ul className="list-disc ml-5 mt-1">
                  <li>Pillars: {data.totals.pillars}</li>
                  <li>Themes: {data.totals.themes}</li>
                  <li>Sub-themes: {data.totals.subthemes}</li>
                  <li>Indicators: {data.totals.indicators}</li>
                  <li>Levels: {data.totals.levels}</li>
                </ul>
              </div>
            )}
            {!data?.totals && (
              <div className="text-sm text-gray-500">
                No totals yet — this is expected for the first scaffold.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 p-4 bg-gray-50">
        <h2 className="text-base font-semibold">What’s next</h2>
        <ol className="list-decimal ml-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>Wire this API to Supabase (server-only) to return indicators and levels.</li>
          <li>Render a read-only tree: Standard → Indicators → Levels/Criteria.</li>
          <li>Add filters & search (client-only).</li>
          <li>Introduce “SSC Version” snapshots (server API + DB only).</li>
        </ol>
      </section>
    </main>
  );
}
