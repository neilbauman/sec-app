'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FrameworkPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
        Primary Framework Editor
      </h1>
      <p style={{ color: '#6b7280', marginTop: 8 }}>
        (placeholder view — no data yet)
      </p>
    </main>
  );
}
