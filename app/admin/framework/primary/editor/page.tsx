// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkEditorPage() {
  // Pull from lib; keep server-only. No auth/roles involved.
  const data = await fetchFrameworkList();

  // Hard guard in case the lib returns unexpected shape during wiring
  const pillars = (data?.pillars ?? []) as Pillar[];
  const themes = (data?.themes ?? []) as Theme[];
  const subthemes = (data?.subthemes ?? []) as Subtheme[];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage pillars, themes, and subthemes. (All collapsed by default)
        </p>
      </header>

      <PrimaryFrameworkCards
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
        defaultOpen={false}
      />
    </main>
  );
}
