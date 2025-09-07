// app/framework/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FrameworkPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Primary Framework Editor</h1>
      <p>Read-only scaffold (no Supabase calls yet). We’ll add data next.</p>
    </main>
  );
}
