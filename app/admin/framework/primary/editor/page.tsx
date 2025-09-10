// app/admin/framework/primary/editor/page.tsx
import Link from 'next/link';
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards';
import { fetchFrameworkList } from '@/lib/framework';

export const dynamic = 'force-dynamic';

export default async function Page() {
  try {
    const data = await fetchFrameworkList();

    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">Primary Framework Editor</h1>
        <p className="mt-1 text-slate-600">Manage pillars, themes, and subthemes.</p>

        <div className="mt-6">
          <PrimaryFrameworkCards
            pillars={data.pillars}
            themes={data.themes}
            subthemes={data.subthemes}
          />
        </div>
      </main>
    );
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Primary Framework Editor</h1>

        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Couldn’t load data from Supabase.</p>
          <p className="mt-1 text-sm">
            {String(err?.message ?? err)}
          </p>
        </div>
      </main>
    );
  }
}
