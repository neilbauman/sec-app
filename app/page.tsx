// No 'use client' needed — this is a simple server component.
// These two lines ensure the route is treated as dynamic at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FrameworkPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        Primary Framework Editor
      </h1>
      <p style={{ color: '#6b7280', marginTop: 8 }}>
        Placeholder view — no data is loaded yet.
      </p>
    </main>
  );
}
