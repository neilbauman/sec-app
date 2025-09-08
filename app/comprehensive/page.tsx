// app/comprehensive/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type ListOk =
  | {
      ok: true;
      mode: string;
      counts: { pillars: number; themes: number; subthemes: number; standards: number };
      standards: Array<{
        pillar_code: string;
        pillar_name: string;
        theme_code: string;
        theme_name: string;
        subtheme_code: string | null;
        subtheme_name: string | null;
      }>;
    }
  | { ok: false; message: string };

async function getData(): Promise<ListOk> {
  const token = process.env.INTERNAL_API_TOKEN ?? '';
  // Use a RELATIVE path so we don’t need to build a host URL.
  const res = await fetch('/comprehensive/api/list', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    // Keep it dynamic at runtime (no prerender).
    next: { revalidate: 0, tags: ['comprehensive-list'] },
  });

  // If the API returns an error page (e.g., 401), surface a readable message.
  if (!res.ok) {
    return { ok: false, message: `API error ${res.status}` };
  }
  return (await res.json()) as ListOk;
}

export default async function ComprehensiveFrameworkPage() {
  const data = await getData();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Comprehensive Framework (read-only)</h1>
      <p className="text-sm text-gray-500 mt-1">Primary standards + (future) indicators & levels</p>

      <div className="mt-4 rounded border p-4 bg-white">
        {data.ok ? (
          <>
            <div className="text-sm text-gray-600 mb-3">
              Mode: <code>{data.mode}</code> · Totals:&nbsp;
              {data.counts.pillars} pillars, {data.counts.themes} themes, {data.counts.subthemes} sub-themes,{' '}
              {data.counts.standards} standards
            </div>

            <div className="space-y-2">
              {data.standards.map((s, i) => (
                <div
                  key={`${s.pillar_code}-${s.theme_code}-${s.subtheme_code ?? i}`}
                  className="rounded border px-3 py-2 text-sm"
                >
                  <div className="font-medium">
                    [{s.pillar_code}] {s.pillar_name}
                  </div>
                  <div className="ml-3">
                    <span className="font-medium">
                      [{s.theme_code}] {s.theme_name}
                    </span>
                    {s.subtheme_code ? (
                      <div className="ml-3">
                        <span className="text-gray-700">
                          [{s.subtheme_code}] {s.subtheme_name}
                        </span>
                      </div>
                    ) : (
                      <div className="ml-3 text-gray-500 italic">No sub-theme (standard ends at theme)</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-red-600 text-sm">
            Failed to load: <code>{data.message}</code>
            <div className="mt-1 text-gray-600">
              Check <code>INTERNAL_API_TOKEN</code> is set identically in this environment and that the API route is
              deployed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
