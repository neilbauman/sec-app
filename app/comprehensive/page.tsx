// app/comprehensive/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic"; // do not prerender
export const revalidate = false;

type FallbackRow = {
  pillar_code: string;
  pillar_name: string;
  theme_code: string;
  theme_name: string;
  subtheme_code: string | null;
  subtheme_name: string | null;
};

type ApiOkFull = {
  ok: true;
  mode: "full";
  counts: {
    pillars: number;
    themes: number;
    subthemes: number;
    indicators: number;
    levels: number;
    criteria: number;
  };
  rows: Array<{
    pillar: { code: string; name: string };
    theme: { code: string; name: string };
    subtheme?: { code: string | null; name: string | null } | null;
    indicator: { id: string; code?: string | null; name: string };
    level?: { id: string; sort_order?: number | null; name?: string | null } | null;
    criterion?: { id: string; sort_order?: number | null; name?: string | null } | null;
  }>;
};

type ApiOkFallback = {
  ok: true;
  mode: "fallback-primary-only";
  counts: { pillars: number; themes: number; subthemes: number; standards: number };
  standards: FallbackRow[];
};

type ApiError = { ok: false; message?: string; stage?: string };

type ApiResponse = ApiOkFull | ApiOkFallback | ApiError;

async function fetchData(): Promise<ApiResponse> {
  const base =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Always call via absolute URL to be safe in Vercel preview
  const res = await fetch(`${base}/comprehensive/api/list`, {
    cache: "no-store",
  });

  // In case the route fails hard
  if (!res.ok) {
    return { ok: false, message: `HTTP ${res.status}` };
  }
  return (await res.json()) as ApiResponse;
}

export default async function ComprehensivePage() {
  const data = await fetchData();

  if (!data.ok) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Comprehensive Framework (read-only)</h1>
        <p className="text-red-600">Failed to load comprehensive framework data.</p>
        {("message" in data && data.message) ? (
          <pre className="mt-4 rounded bg-gray-100 p-3 text-sm">{data.message}</pre>
        ) : null}
        <p className="mt-6 text-sm text-gray-500">
          You can also inspect the raw endpoint at <code>/comprehensive/api/list</code>.
        </p>
      </main>
    );
  }

  // FULL MODE: show real comprehensive rows
  if (data.mode === "full") {
    const { counts, rows } = data;
    return (
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Comprehensive Framework (read-only)</h1>
        <ul className="list-disc ml-6">
          <li>Pillars: {counts.pillars}</li>
          <li>Themes: {counts.themes}</li>
          <li>Sub-themes: {counts.subthemes}</li>
          <li>Indicators: {counts.indicators}</li>
          <li>Levels: {counts.levels}</li>
          <li>Criteria: {counts.criteria}</li>
        </ul>

        <div className="rounded border p-4 bg-amber-50 text-amber-900">
          This is the <strong>real comprehensive</strong> dataset. Once the admin UI is in place,
          super admins will maintain indicators, levels and criteria here.
        </div>

        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Pillar</th>
                <th className="px-3 py-2 text-left">Theme</th>
                <th className="px-3 py-2 text-left">Sub-theme</th>
                <th className="px-3 py-2 text-left">Indicator</th>
                <th className="px-3 py-2 text-left">Level</th>
                <th className="px-3 py-2 text-left">Criterion</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2">{r.pillar.code} — {r.pillar.name}</td>
                  <td className="px-3 py-2">{r.theme.code} — {r.theme.name}</td>
                  <td className="px-3 py-2">
                    {r.subtheme?.code ?? "—"}{r.subtheme?.name ? ` — ${r.subtheme.name}` : ""}
                  </td>
                  <td className="px-3 py-2">{r.indicator.code ? `[${r.indicator.code}] ` : ""}{r.indicator.name}</td>
                  <td className="px-3 py-2">{r.level?.sort_order ?? "—"}{r.level?.name ? ` — ${r.level.name}` : ""}</td>
                  <td className="px-3 py-2">{r.criterion?.sort_order ?? "—"}{r.criterion?.name ? ` — ${r.criterion.name}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500">Showing up to 50 sample rows.</p>
        <Link href="/framework" className="inline-block mt-4 underline">Back to primary framework</Link>
      </main>
    );
  }

  // FALLBACK MODE: you don’t have any comprehensive rows yet; show primary-only summary
  const { counts, standards } = data;
  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Comprehensive Framework (read-only)</h1>

      <div className="rounded border p-4 bg-amber-50 text-amber-900">
        <p className="font-medium">No comprehensive entries found yet.</p>
        <p className="mt-1">
          We’re showing a <strong>primary-only fallback</strong> (pillars/themes/sub-themes).
          Once you migrate or add indicators, levels, and criteria, this page will render the full comprehensive dataset.
        </p>
      </div>

      <ul className="list-disc ml-6">
        <li>Pillars: {counts.pillars}</li>
        <li>Themes: {counts.themes}</li>
        <li>Sub-themes: {counts.subthemes}</li>
        <li>Standards (theme or sub-theme rows): {counts.standards}</li>
      </ul>

      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Pillar</th>
              <th className="px-3 py-2 text-left">Theme</th>
              <th className="px-3 py-2 text-left">Sub-theme (if any)</th>
            </tr>
          </thead>
          <tbody>
            {standards.slice(0, 50).map((s, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2">{s.pillar_code} — {s.pillar_name}</td>
                <td className="px-3 py-2">{s.theme_code} — {s.theme_name}</td>
                <td className="px-3 py-2">
                  {s.subtheme_code ? `${s.subtheme_code} — ${s.subtheme_name ?? ""}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">Showing up to 50 sample standards.</p>
      <Link href="/framework" className="inline-block mt-4 underline">Back to primary framework</Link>
    </main>
  );
}
