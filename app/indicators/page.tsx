'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';

export default function IndicatorsPlaceholder() {
  // Temporary, just to unblock builds while we align Indicators to the new API pattern
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: 14 }}>← Back to Dashboard</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Indicators (Coming Soon)</h1>
      </div>
      <p style={{ maxWidth: 720, lineHeight: 1.6 }}>
        This page is temporarily disabled while we migrate it to the same stable pattern used by the
        Primary Framework Editor (client-only UI calling Next.js API routes).
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>No server/client import mismatches.</li>
        <li>Will use <code>fetch('/api/indicators/...')</code> instead of direct Supabase calls.</li>
      </ul>
      <p>
        If you need to work right now, please use the <Link href="/framework">Primary Framework Editor</Link>.
      </p>
    </div>
  );
}
