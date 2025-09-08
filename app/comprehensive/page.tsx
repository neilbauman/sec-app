// app/comprehensive/page.tsx
export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';

type ApiOk = {
  ok: true;
  meta?: Record<string, unknown>;
  pillars?: any[];
  themes?: any[];
  subthemes?: any[];
  indicators?: any[];
  levels?: any[];
};

type ApiErr = { ok: false; message?: string; stage?: string };

function getOrigin() {
  const h = headers();
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000';
  const proto = (h.get('x-forwarded-proto') ?? 'https') + '://';
  return host.startsWith('http') ? host : proto + host;
}

async function getData(): Promise<ApiOk | ApiErr> {
  const origin = getOrigin();
  const res = await fetch(`${origin}/comprehensive/api/list`, {
    cache: 'no-store',
    // keep it simple: api is same-origin
  }).catch((e) => {
    return new Response(JSON.stringify({ ok: false, message: String(e) }), {
      headers: { 'content-type': 'application/json' },
      status: 500,
    });
  });

  try {
    return (await res.json()) as ApiOk | ApiErr;
  } catch {
    return { ok: false, message: 'Invalid JSON from /comprehensive/api/list' };
  }
}

export default async function ComprehensiveReadOnly() {
  const payload = await getData();

  if (!payload.ok) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-3xl font-extrabold">
          Comprehensive Framework (read-only)
        </h1>
        <p className="text-red-600">
          Failed to load comprehensive framework data
          {payload.message ? `: ${payload.message}` : '.'}
          {payload['stage'] ? ` (stage: ${payload['stage']})` : ''}
        </p>
        <p className="text-sm text-gray-500">
          Tip: open <code>/comprehensive/api/list</code> in a new tab to see the raw JSON.
        </p>
      </main>
    );
  }

  const pillars = payload.pillars ?? [];
  const themes = payload.themes ?? [];
  const subthemes = payload.subthemes ?? [];
  const indicators = payload.indicators ?? [];
  const levels = payload.levels ?? [];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold">
        Comprehensive Framework (read-only)
      </h1>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Pillars" value={pillars.length} />
        <Stat label="Themes" value={themes.length} />
        <Stat label="Sub-themes" value={subthemes.length} />
        <Stat label="Indicators" value={indicators.length} />
        <Stat label="Levels" value={levels.length} />
      </section>

      {/* Tiny debug table so we can see at a glance what fields exist without crashing */}
      {!!indicators.length && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Sample indicators (first 10)</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>id</Th>
                  <Th>name</Th>
                  <Th>theme_code</Th>
                  <Th>subtheme_code</Th>
                  <Th>label</Th>
                  <Th>unit</Th>
                </tr>
              </thead>
              <tbody>
                {indicators.slice(0, 10).map((it: any, i: number) => (
                  <tr key={i} className="border-t">
                    <Td>{safe(it?.id)}</Td>
                    <Td>{safe(it?.name ?? it?.indicator_name)}</Td>
                    <Td>{safe(it?.theme_code)}</Td>
                    <Td>{safe(it?.subtheme_code)}</Td>
                    <Td>{safe(it?.label)}</Td>
                    <Td>{safe(it?.unit)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            Fields are printed via optional chaining to avoid server render crashes while we align the API shape.
          </p>
        </section>
      )}
    </main>
  );
}

function safe(v: unknown) {
  if (v === null || v === undefined) return '';
  return String(v);
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-left font-medium text-gray-700">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2">{children}</td>;
}
