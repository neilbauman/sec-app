import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { FrameworkList } from "@/types/framework";

export const dynamic = "force-dynamic";

export default async function Page() {
  let data: FrameworkList | null = null;

  try {
    data = await fetchFrameworkList();
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Couldn’t load framework data</p>
          <p className="mt-1 text-sm">{String(err?.message || err)}</p>
        </div>
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

      <h1 className="text-3xl font-bold">Primary Framework Editor</h1>

      <div className="mt-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={data?.pillars ?? []}
          themes={data?.themes ?? []}
          subthemes={data?.subthemes ?? []}
        />
      </div>
    </main>
  );
}
