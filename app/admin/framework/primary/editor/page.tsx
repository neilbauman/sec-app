// app/admin/framework/primary/editor/page.tsx
// Server component; no role prop, no auth, pulls from /framework/api/list

import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';

export const dynamic = 'force-dynamic';

type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  id: string;
  code: string;
  pillar_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  id: string;
  code: string;
  theme_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type FrameworkList = {
  ok: true;
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

async function fetchList(): Promise<FrameworkList> {
  const res = await fetch('/framework/api/list', { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET /framework/api/list failed: ${res.status} ${text}`);
  }
  return (await res.json()) as FrameworkList;
}

export default async function Page() {
  let data: FrameworkList | null = null;

  try {
    data = await fetchList();
  } catch (e: any) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="mt-2 text-red-600">Failed to load framework list.</p>
        <pre className="mt-3 rounded bg-slate-50 p-3 text-xs text-slate-700 overflow-auto">
          {String(e?.message ?? e)}
        </pre>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <p className="mt-1 text-sm text-slate-600">
        Manage pillars, themes, and subthemes. (Auth/roles are disabled for now.)
      </p>

      <div className="mt-6">
        <PrimaryFrameworkCards
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      </div>
    </main>
  );
}
