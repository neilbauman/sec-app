// app/framework/page.tsx
'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react';

type ApiPayload = {
  ok: boolean;
  errors?: string[];
  pillars: any[];
  themes: any[];
  subthemes: any[];
};

export default function FrameworkPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ApiPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch('/framework/api/list', {
          method: 'GET',
          cache: 'no-store',
        });
        if (!res.ok && res.status !== 207) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as ApiPayload;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Failed to load framework data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Primary Framework Editor (Read-only)
      </h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        This page reads data via <code>/framework/api/list</code>. No editing yet.
      </p>

      {loading && <div>Loading…</div>}

      {!loading && err && (
        <div
          style={{
            background: '#fff3f3',
            border: '1px solid #ffd6d6',
            color: '#9a0000',
            padding: '12px 14px',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          Error: {err}
        </div>
      )}

      {!loading && data && (
        <>
          {data.errors && data.errors.length > 0 && (
            <div
              style={{
                background: '#fff8e1',
                border: '1px solid #ffe0a3',
                color: '#6a5200',
                padding: '12px 14px',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <strong>Warnings from API:</strong>
              <ul style={{ marginTop: 8 }}>
                {data.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={cardStyle}>
              <div style={cardTitle}>Pillars</div>
              <div style={bigNum}>{data.pillars.length}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardTitle}>Themes</div>
              <div style={bigNum}>{data.themes.length}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardTitle}>Sub-themes</div>
              <div style={bigNum}>{data.subthemes.length}</div>
            </div>
          </div>

          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              Raw preview (for debugging)
            </summary>
            <pre
              style={{
                marginTop: 12,
                padding: 12,
                background: '#0b1020',
                color: '#d6deff',
                borderRadius: 8,
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: 12,
  padding: '16px 18px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

const cardTitle: React.CSSProperties = {
  color: '#666',
  fontSize: 13,
  marginBottom: 6,
  fontWeight: 600,
  letterSpacing: 0.2,
  textTransform: 'uppercase',
};

const bigNum: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
};
