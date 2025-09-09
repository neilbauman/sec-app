import Link from "next/link";

export default function Dashboard() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>SSC Dashboard</h1>
      <p style={{ color: "#4b5563", marginTop: 4 }}>Clean build, no authentication. Use the links below.</p>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <Link href="/admin/framework" style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          Framework Admin
        </Link>
        <Link href="/admin/framework/primary/editor" style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          Primary Framework Editor
        </Link>
      </div>
    </main>
  );
}
