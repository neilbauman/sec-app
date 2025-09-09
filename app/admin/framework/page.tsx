// app/admin/framework/page.tsx
import Link from 'next/link';
import { internalGet } from '../../../lib/internalFetch';

type Pillar = { code: string; name: string; description?: string; sort_order: number };
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number };
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number };

type FrameworkList = {
  ok: boolean;
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export const dynamic = 'force-dynamic';

export default async function FrameworkHome() {
  // use the generic: internalGet<FrameworkList>
  let data: FrameworkList | null = null;
  try {
    data = await internalGet<FrameworkList>('/framework/api/list');
  } catch (err: any) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Framework Admin</h1>
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          Could not load framework list ({err?.status ?? 'error'}). {String(err?.message ?? '')}
        </p>
        <div className="mt-4">
          <Link href="/dashboard" className="underline">Back to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Framework Admin</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/framework/primary" className="block rounded-xl border p-4 hover:shadow-sm">
          <div className="text-lg font-semibold">Primary SSC Framework</div>
          <div className="text-sm text-slate-600">Pillars, Themes, Sub-themes</div>
          {data?.ok && (
            <div className="mt-2 text-xs text-slate-500">
              {data.counts.pillars} pillars · {data.counts.themes} themes · {data.counts.subthemes} sub-themes
            </div>
          )}
        </Link>

        <Link href="/admin/framework/comprehensive" className="block rounded-xl border p-4 opacity-60 pointer-events-none">
          <div className="text-lg font-semibold">Comprehensive SSC Framework</div>
          <div className="text-sm text-slate-600">Indicators, levels, default scoring (coming next)</div>
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="underline">Back to Dashboard</Link>
      </div>
    </main>
  );
}
