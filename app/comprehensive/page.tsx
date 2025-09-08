export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Pillar = { code: string; name: string; description: string; sort_order: number };
type Theme = { code: string; pillar_code: string; name: string; description: string; sort_order: number };
type Subtheme = { code: string; theme_code: string; name: string; description: string; sort_order: number };

type ListResponse = {
  ok: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  totals?: { pillars: number; themes: number; subthemes: number };
};

function getOrigin() {
  // Prefer explicit base URL if you set it in Vercel / .env.local
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  // Vercel environment domain
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local dev fallback
  return 'http://localhost:3000';
}

async function getData(): Promise<ListResponse> {
  const origin = getOrigin();
  const res = await fetch(`${origin}/comprehensive/api/list`, {
    // prevent any static optimization / ISR
    cache: 'no-store',
    // and be explicit for Next
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    // keep page rendering even if API fails
    return { ok: false, pillars: [], themes: [], subthemes: [] };
  }
  return res.json();
}

export default async function ComprehensiveFrameworkPage() {
  const data = await getData();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Comprehensive Framework (read-only)</h1>

      {!data.ok ? (
        <div className="text-red-600">Failed to load comprehensive framework data.</div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Totals:&nbsp;
            <span>Pillars: {data.totals?.pillars ?? data.pillars.length}</span>,&nbsp;
            <span>Themes: {data.totals?.themes ?? data.themes.length}</span>,&nbsp;
            <span>Sub-themes: {data.totals?.subthemes ?? data.subthemes.length}</span>
          </div>

          <div className="rounded border p-4 bg-white">
            <p className="text-sm text-gray-700">
              Data is loading from <code>/comprehensive/api/list</code>. This page is intentionally simple and read-only for now.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
