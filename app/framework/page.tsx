export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SERVER COMPONENT: do not add "use client" here

type Totals = { pillars: number; themes: number; subthemes: number };
type ListResponse =
  | { ok: true; totals: Totals }
  | { ok: false; error?: string };

async function getTotals(): Promise<Totals> {
  try {
    // Use a relative path; on the server this hits the route handler directly.
    const res = await fetch('/framework/api/list', { cache: 'no-store' });
    if (!res.ok) return { pillars: 0, themes: 0, subthemes: 0 };
    const json = (await res.json()) as ListResponse & { totals?: Totals };
    return (json as any)?.totals ?? { pillars: 0, themes: 0, subthemes: 0 };
  } catch {
    return { pillars: 0, themes: 0, subthemes: 0 };
  }
}

export default async function FrameworkPage() {
  const totals = await getTotals();

  return (
    <main style={{ padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>
        Primary Framework Editor
      </h1>

      <section style={{ lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, marginTop: 8 }}>Pillars</div>
        <div>{totals.pillars}</div>

        <div style={{ fontWeight: 700, marginTop: 16 }}>Themes</div>
        <div>{totals.themes}</div>

        <div style={{ fontWeight: 700, marginTop: 16 }}>Sub-themes</div>
        <div>{totals.subthemes}</div>

        <p style={{ marginTop: 24, color: '#555' }}>
          Read-only scaffold. No Supabase or client hooks here beyond a single fetch;
          data comes from <code>/framework/api/list</code>. We’ll layer interactivity later.
        </p>
      </section>
    </main>
  );
}
