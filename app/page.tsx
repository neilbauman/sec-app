// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>SSC App</h1>
      <p style={{ opacity: 0.8, marginTop: 4 }}>
        Start building your framework or round-trip with Excel.
      </p>

      <ul style={{ lineHeight: 2, marginTop: 16 }}>
        <li>
          <Link href="/framework">Open Framework Editor</Link>
        </li>
        <li>
          <a href="/api/import?download=1">Download current framework (Excel)</a>
        </li>
        // app/page.tsx (snippet)
<li><a href="/api/export">Download current framework (CSV)</a></li>
        <li>
          <Link href="/upload">Upload Excel (admin)</Link>
        </li>
      </ul>
    </main>
  );
}
