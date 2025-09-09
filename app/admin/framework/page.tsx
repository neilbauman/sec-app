import Link from 'next/link';

export default async function FrameworkDashboard() {
  return (
    <main>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>SSC Dashboard</h1>
      <div style={{ marginTop: 16 }}>
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            <Link href="/admin/framework/primary/editor">Primary Framework Editor</Link>
          </h2>
          <p style={{ marginTop: 8, color: "#374151" }}>Manage pillars, themes, and subthemes</p>
        </div>
      </div>
    </main>
  );
}
