import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';
import { getFrameworkList } from '@/lib/framework';

export const dynamic = 'force-dynamic';

export default async function PrimaryFrameworkEditorPage() {
  try {
    const data = await getFrameworkList();
    return (
      <main>
        <p><Link href="/admin/framework">← Back to Dashboard</Link></p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>Primary Framework Editor</h1>
        <div style={{ marginTop: 12 }}>
          <PrimaryFrameworkCards pillars={data.pillars} themes={data.themes} subthemes={data.subthemes} />
        </div>
      </main>
    );
  } catch (err: any) {
    return (
      <main>
        <p><Link href="/admin/framework">← Back to Dashboard</Link></p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>Primary Framework Editor</h1>
        <div style={{ marginTop: 12, padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12 }}>
          <div style={{ color: "#991b1b", fontWeight: 600 }}>Failed to load framework list.</div>
          <div style={{ marginTop: 6, color: "#7f1d1d", whiteSpace: "pre-wrap" }}>{String(err?.message || err)}</div>
        </div>
      </main>
    );
  }
}
