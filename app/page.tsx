import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>SSC</h1>
      <p><Link href="/admin/framework">Go to Framework Admin →</Link></p>
    </main>
  );
}
