// /app/admin/framework/primary/editor/page.tsx

import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';
import { fetchFrameworkList } from '@/lib/framework';
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let data: FrameworkList | null = null;
  try {
    data = await fetchFrameworkList();
  } catch (err: any) {
    // Render a friendly error, but do not crash build
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-xl border bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Couldn’t load framework data</p>
          <p className="mt-1 break-all">
            {err?.message || 'Unknown error. Check Supabase URL/key and RLS.'}
          </p>
        </div>
      </main>
    );
  }

  const pillars: Pillar[] = data?.pillars ?? [];
  const themes: Theme[] = data?.themes ?? [];
  const subthemes: Subtheme[] = data?.subthemes ?? [];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse and edit pillars, themes, and subthemes.
        </p>
      </div>

      <PrimaryFrameworkCards
        // (As requested earlier) default collapsed view:
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
      />
    </main>
  );
}
