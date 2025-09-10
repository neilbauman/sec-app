// /app/admin/framework/primary/editor/page.tsx
import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';
import { fetchFrameworkList, updateName, updateDescription, updateSort, bumpSort } from '@/lib/framework';
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework';

export const dynamic = 'force-dynamic';

// ---- Server Actions (no auth) ----
export async function actionUpdateName(entity: 'pillar' | 'theme' | 'subtheme', code: string, name: string) {
  'use server';
  await updateName(entity, code, name);
}

export async function actionUpdateDescription(entity: 'pillar' | 'theme' | 'subtheme', code: string, description: string) {
  'use server';
  await updateDescription(entity, code, description || null);
}

export async function actionUpdateSort(entity: 'pillar' | 'theme' | 'subtheme', code: string, sort: number) {
  'use server';
  await updateSort(entity, code, sort);
}

export async function actionBumpSort(entity: 'pillar' | 'theme' | 'subtheme', code: string, delta: number) {
  'use server';
  await bumpSort(entity, code, delta);
}

export default async function Page() {
  let data: FrameworkList | null = null;
  try {
    data = await fetchFrameworkList();
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <div className="rounded-lg border bg-red-50 p-4 text-sm text-red-700">
          Error loading framework: {e?.message ?? 'unknown error'}
        </div>
      </main>
    );
  }

  const pillars = (data?.pillars ?? []) as Pillar[];
  const themes = (data?.themes ?? []) as Theme[];
  const subthemes = (data?.subthemes ?? []) as Subtheme[];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
          <p className="mt-1 text-sm text-slate-600">
            Rename and re-order items. CSV import/export buttons are placeholders for bulk edits (coming soon).
          </p>
        </div>

        {/* CSV placeholders */}
        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm text-slate-500 opacity-60"
            title="Coming soon"
            disabled
          >
            Export CSV
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm text-slate-500 opacity-60"
            title="Coming soon"
            disabled
          >
            Import CSV
          </button>
        </div>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
        actions={{
          updateName: actionUpdateName,
          updateDescription: actionUpdateDescription,
          updateSort: actionUpdateSort,
          bumpSort: actionBumpSort,
        }}
      />
    </main>
  );
}
