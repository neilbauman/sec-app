// app/admin/framework/primary/editor/page.tsx
import Link from 'next/link';
import { internalGet } from '../../../../../lib/internalFetch';
import PrimaryFrameworkCards from '../../../../../components/PrimaryFrameworkCards';

type AppRole = 'super-admin' | 'country-admin' | 'public';

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
  // DEV MODE: force role to super-admin (we’ll wire real auth later)
  const role: AppRole = 'super-admin';

  let data: FrameworkList | null = null;
  try {
    data = await internalGet<FrameworkList>('/framework/api/list');
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-2">Primary Framework Editor</h1>
        <div className="border rounded-xl p-4 bg-red-50 border-red-200 text-red-800">
          Could not load framework ({err?.status ?? 'error'}). {String(err?.message ?? '')}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <div className="text-xs text-slate-500">Role: <span className="font-medium">{role}</span></div>
      </div>

      <h1 className="text-2xl font-bold mb-1">Primary Framework Editor</h1>
      <p className="text-sm text-slate-600 mb-6">
        Manage Pillars, Themes, and Sub-themes. CSV import/export and actions coming next.
      </p>

      <PrimaryFrameworkCards
        role={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  );
}
