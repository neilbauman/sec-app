// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>SSC Framework Admin</h1>
      <p style={{ opacity: 0.8 }}>
        Use the links below to build and export your SSC framework.
      </p>

      <nav style={{ marginTop: 16 }}>
        <ul style={{ lineHeight: 1.9 }}>
          <li>
            <Link href="/framework">Open Framework Editor (Pillars → Themes → Sub-themes → Standards → Indicators)</Link>
          </li>
          <li>
            <a href="/api/export">Download current framework (CSV)</a>
          </li>
        </ul>
      </nav>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Getting started</h2>
        <ol style={{ lineHeight: 1.9, paddingLeft: 20 }}>
          <li>Go to <Link href="/framework">Framework Editor</Link>.</li>
          <li>Add or edit Pillars, Themes, Sub-themes, Standards and Indicators inline.</li>
          <li>Return here and click “Download current framework (CSV)” to export a one-sheet view.</li>
        </ol>
      </section>

      <footer style={{ marginTop: 32, opacity: 0.6, fontSize: 12 }}>
        Powered by Next.js + Supabase + Vercel
      </footer>
    </main>
  );
}
