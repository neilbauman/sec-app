// app/admin/framework/primary/editor/page.tsx
import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';
import { internalGet } from '@/lib/internalFetch';

// Match the shape returned by /framework/api/list
type Pillar = { code: string; name: string; description?: string | null };
type Theme = { code: string; name: string; pillar_code: string };
type Subtheme = { code: string; name: string; theme_code: string };

type FrameworkList = {
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Public fetch of the internal API; roles/auth have been removed for now.
  // internalGet<T> should return parsed JSON (T), not Response.
  let data: FrameworkList | null = null;

  try {
    data = await internalGet<FrameworkList>('/framework/api/list');
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="mt-2 text-sm text-rose-700">
          Failed to load framework list: {String(err?.message ?? err)}
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="mt-2 text-sm text-gray-600">No data returned.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
          <p className="mt-2 text-sm text-slate-600">
            Pillars: <span className="font-medium">{data.counts.pillars}</span> · Themes:{' '}
            <span className="font-medium">{data.counts.themes}</span> · Subthemes:{' '}
            <span className="font-medium">{data.counts.subthemes}</span>
          </p>
        </div>

        <div className="text-right text-xs text-slate-500">
          <div>Roles/auth temporarily disabled</div>
          <div>All editor actions assume public access</div>
        </div>
      </div>

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
