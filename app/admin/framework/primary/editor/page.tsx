// app/admin/framework/primary/editor/page.tsx
import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';
import { getFrameworkList } from '@/lib/framework';

export const dynamic = 'force-dynamic';

export default async function PrimaryFrameworkEditorPage() {
  // Load the complete framework directly from Supabase
  let data: Awaited<ReturnType<typeof getFrameworkList>> | null = null;

  try {
    data = await getFrameworkList();
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>

        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <p className="font-medium">Couldn&apos;t load data from Supabase.</p>
          <p className="text-sm mt-1">
            {err?.message ?? 'Unknown error'} — check your environment variables
            (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY), table names,
            and RLS policies.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="text-sm text-slate-600 mt-1">
          {data.counts.pillars} pillars · {data.counts.themes} themes ·{' '}
          {data.counts.subthemes} subthemes
        </p>
      </header>

      {/* No role/auth props — just the data */}
      <PrimaryFrameworkCards
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  );
}
