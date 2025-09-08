// app/comprehensive/page.tsx
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchComprehensive() {
  // Build an absolute URL safely in prod/preview/local
  const h = await headers();
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000';
  const proto = (h.get('x-forwarded-proto') ?? 'https').includes('http') ? h.get('x-forwarded-proto')! : 'https';
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/comprehensive/api/list`, {
    cache: 'no-store',
    // make failures explicit instead of throwing in render
    next: { revalidate: 0 },
  });

  let json: any = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  // Some versions of the route return { ok, data: {...} }
  // others may return the payload directly. Handle both.
  return json?.data ?? json;
}

export default async function ComprehensivePage() {
  let data: any = null;
  let errorMsg: string | null = null;

  try {
    data = await fetchComprehensive();
  } catch (e: any) {
    errorMsg = e?.message ?? 'Unknown error fetching data';
  }

  if (!data || errorMsg) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 28 }}>
          Comprehensive Framework (read-only)
        </h1>
        <p>Failed to load comprehensive framework data.</p>
        {errorMsg ? <pre>{errorMsg}</pre> : null}
        <p>
          You can also open <code>/comprehensive/api/list</code> to inspect the
          raw payload.
        </p>
      </main>
    );
  }

  const counts = {
    pillars: Array.isArray(data.pillars) ? data.pillars.length : 0,
    themes: Array.isArray(data.themes) ? data.themes.length : 0,
    subthemes: Array.isArray(data.subthemes) ? data.subthemes.length : 0,
    indicators: Array.isArray(data.indicators) ? data.indicators.length : 0,
    levels: Array.isArray(data.levels) ? data.levels.length : 0,
    criteria: Array.isArray(data.criteria) ? data.criteria.length : 0,
  };

  // Show a tiny sample so we can verify shapes without rendering the whole tree yet.
  const sample = {
    pillar: data.pillars?.[0] ?? null,
    theme: data.themes?.[0] ?? null,
    indicator: data.indicators?.[0] ?? null,
    level: data.levels?.[0] ?? null,
    criterion: data.criteria?.[0] ?? null,
  };

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontWeight: 800, fontSize: 28 }}>
        Comprehensive Framework (read-only)
      </h1>

      <ul style={{ lineHeight: 1.8, marginTop: 12 }}>
        <li>Pillars: {counts.pillars}</li>
        <li>Themes: {counts.themes}</li>
        <li>Sub-themes: {counts.subthemes}</li>
        <li>Indicators: {counts.indicators}</li>
        <li>Levels: {counts.levels}</li>
        <li>Criteria: {counts.criteria}</li>
      </ul>

      <h2 style={{ fontWeight: 700, marginTop: 24 }}>Sample rows</h2>
      <pre style={{ overflowX: 'auto', padding: 12, background: '#f6f6f6', borderRadius: 8 }}>
        {JSON.stringify(sample, null, 2)}
      </pre>

      <p style={{ color: '#666', marginTop: 16 }}>
        Data is fetched from <code>/comprehensive/api/list</code>. Once these
        counts/samples look correct, we’ll layer in the rich UI.
      </p>
    </main>
  );
}
