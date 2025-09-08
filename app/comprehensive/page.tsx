// app/comprehensive/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ApiOk = {
  ok: true;
  standards: any[];
  indicators: any[];
  levels: any[];
  totals?: { standards?: number; indicators?: number; levels?: number };
};

type ApiErr = {
  ok: false;
  stage?: string;
  message?: string;
  note?: string;
};

async function getData(): Promise<ApiOk | ApiErr> {
  // Relative URL so we don’t need to build a host; force runtime request.
  const res = await fetch('/comprehensive/api/list', { cache: 'no-store' });
  // If the route threw, show status for easier debugging
  if (!res.ok) {
    return { ok: false, message: `HTTP ${res.status} from /comprehensive/api/list` };
  }
  return res.json();
}

export default async function ComprehensivePage() {
  const result = await getData();

  if (!result.ok) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-3">Comprehensive Framework (read-only)</h1>
        <p className="text-red-600">Failed to load comprehensive framework data.</p>
        {('message' in result || 'stage' in result) && (
          <pre className="mt-3 rounded bg-neutral-100 p-3 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  const { totals, standards, indicators, levels } = result;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Comprehensive Framework (read-only)</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-neutral-500">Standards</div>
          <div className="text-3xl font-semibold">{totals?.standards ?? standards.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-neutral-500">Indicators</div>
          <div className="text-3xl font-semibold">{totals?.indicators ?? indicators.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase text-neutral-500">Levels</div>
          <div className="text-3xl font-semibold">{totals?.levels ?? levels.length}</div>
        </div>
      </div>

      {/* Minimal preview table – we’ll replace with real grid later */}
      <div className="rounded-lg border">
        <div className="px-4 py-3 border-b font-medium bg-neutral-50">Sample of Indicators</div>
        <ul className="divide-y">
          {(indicators ?? []).slice(0, 10).map((it: any) => (
            <li key={it.id ?? `${it.pillar_code}-${it.theme_code}-${it.subtheme_code ?? '—'}-${it.code ?? it.name ?? Math.random()}`}
                className="px-4 py-3">
              <div className="text-sm font-medium">
                {it.code ? `[${it.code}] ` : ''}{it.name ?? it.title ?? 'Untitled indicator'}
              </div>
              <div className="text-xs text-neutral-500">
                {[
                  it.pillar_code,
                  it.theme_code,
                  it.subtheme_code ?? '—',
                ].filter(Boolean).join(' • ')}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
