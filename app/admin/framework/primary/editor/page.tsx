// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '@/lib/internalFetch';
import { getCurrentRole } from '@/lib/role';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';

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

export default async function PrimaryEditorPage() {
  const role = await getCurrentRole();

  if (role !== 'super-admin') {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="inline-flex items-center gap-2 mb-4 text-sm text-slate-600 hover:text-slate-900">← Dashboard</a>
        <h1 className="text-2xl font-bold mb-3">Primary Framework Editor</h1>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          Super Admin access required.
        </div>
      </main>
    );
  }

  // robust fetch + parse
  const res = await internalGet('/framework/api/list'); // this returns a plain object already

  // Defensive checks
  if (!res || typeof res !== 'object' || (res as any).ok !== true) {
    const status = (res as any)?.status ?? 'unknown';
    const message = (res as any)?.message ?? 'Failed to load framework list';
    throw new Error(`framework/api/list failed: status=${status} message=${message}`);
  }

  const data = res as FrameworkList;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a href="/dashboard" className="inline-flex items-center gap-2 mb-4 text-sm text-slate-600 hover:text-slate-900">← Dashboard</a>
      <h1 className="text-2xl font-bold mb-4">Primary Framework Editor</h1>

      {/* Tailwind smoke test */}
      <div className="mb-4 rounded-lg bg-indigo-50 px-4 py-3 text-indigo-900 ring-1 ring-indigo-200">
        Tailwind check: this box should look purple with rounded corners.
      </div>

      <PrimaryFrameworkCards
        roll={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />

      <p className="mt-6 text-slate-500 text-sm">
        Click the chevrons to expand. Actions and CSV import will come next.
      </p>
    </main>
  );
}
