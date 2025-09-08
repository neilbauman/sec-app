// app/comprehensive/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import Link from 'next/link';

export default async function ComprehensivePage() {
  // Use relative fetch; Vercel will handle host.
  const res = await fetch('/comprehensive/api/list', {
    cache: 'no-store', // belt & suspenders
    next: { revalidate: 0 },
  });

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    payload = { ok: false, message: 'Invalid JSON from /comprehensive/api/list' };
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
        Comprehensive Framework (read-only)
      </h1>
      {!payload?.ok ? (
        <pre
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            padding: 12,
            borderRadius: 8,
            whiteSpace: 'pre-wrap',
          }}
        >
{JSON.stringify(payload, null, 2)}
        </pre>
      ) : (
        <>
          <p style={{ opacity: 0.8, marginBottom: 8 }}>
            totals: pillars {payload?.totals?.pillars ?? 0} • themes {payload?.totals?.themes ?? 0} •
            subthemes {payload?.totals?.subthemes ?? 0} • indicators {payload?.totals?.indicators ?? 0}
          </p>
          <Link href="/framework" style={{ textDecoration: 'underline' }}>
            ← Back to Primary Framework
          </Link>
        </>
      )}
    </main>
  );
}
