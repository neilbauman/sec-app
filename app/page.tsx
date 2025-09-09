import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>SSC Editor (Clean)</h1>
      <p><Link href="/dashboard">Go to Dashboard</Link></p>
    </main>
  );
}
