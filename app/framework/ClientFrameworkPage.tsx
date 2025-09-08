'use client';

import { useEffect, useState } from 'react';

type ListResponse = {
  ok?: boolean;
  pillars?: Array<Record<string, unknown>>;
  themes?: Array<Record<string, unknown>>;
  subthemes?: Array<Record<string, unknown>>;
  totals?: { pillars: number; themes: number; subthemes: number };
};

export default function ClientFrameworkPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [counts, setCounts] = useState({ pillars: 0, themes: 0, subthemes: 0 });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch('/framework/api/list', {
          method: 'GET',
          headers: { accept: 'application/json' },
          cache: 'no-store',        // <- absolutely disable caching for this call
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json: ListResponse = await res.json();

        const totals = json.totals ?? {
          pillars: json.pillars?.length ?? 0,
          themes: json.themes?.length ?? 0,
          subthemes: json.subthemes?.length ?? 0,
        };

        if (alive) {
          setCounts(totals);
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? 'Unknown error');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main style={{ padding: '24px 20px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -0.5 }}>
        Primary Framework Editor
      </h1>

      <div style={{ marginTop: 16, lineHeight: 1.6 }}>
        <div><strong>Pillars</strong></div>
        <div>{loading ? '…' : counts.pillars}</div>

        <div style={{ marginTop: 8 }}><strong>Themes</strong></div>
        <div>{loading ? '…' : counts.themes}</div>

        <div style={{ marginTop: 8 }}><strong>Sub-themes</strong></div>
        <div>{loading ? '…' : counts.subthemes}</div>
      </div>

      <p style={{ marginTop: 16, color: '#444' }}>
        Read-only scaffold. No Supabase or client hooks here beyond a single fetch; data comes from
        <code> /framework/api/list</code>. We’ll layer interactivity later.
      </p>

      {error && (
        <p style={{ marginTop: 8, color: '#b00020' }}>
          Error loading data: {error}
        </p>
      )}
    </main>
  );
}
