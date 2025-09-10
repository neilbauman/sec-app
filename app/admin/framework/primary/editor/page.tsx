// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export const dynamic = "force-dynamic";

// Local action types expected by PrimaryFrameworkCards
type Entity = "pillar" | "theme" | "subtheme";
type Actions = {
  updateName: (entity: Entity, code: string, name: string) => Promise<void>;
  updateDescription: (
    entity: Entity,
    code: string,
    description: string
  ) => Promise<void>;
  updateSort: (entity: Entity, code: string, sort: number) => Promise<void>;
  bumpSort: (entity: Entity, code: string, delta: number) => Promise<void>;
};

export default async function Page() {
  // Fetch data (already wired to real DB in your repo)
  const data = await fetchFrameworkList();

  // Normalize types for the component props
  const pillars = (data?.pillars ?? []) as Pillar[];
  const themes = (data?.themes ?? []) as Theme[];
  const subthemes = (data?.subthemes ?? []) as Subtheme[];

  // NO-OP actions (placeholders) – keep builds green, no DB writes yet
  const actions: Actions = {
    updateName: async () => {},
    updateDescription: async () => {},
    updateSort: async () => {},
    bumpSort: async () => {},
  };

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Primary Framework</h1>
          <p className="mt-1 text-sm text-slate-600">
            Edit Pillars, Themes, and Subthemes. (Edits are disabled for now.)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV placeholders (non-functional for now) */}
          <button
            type="button"
            disabled
            className="rounded-md border px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-60"
            title="Coming soon"
          >
            Import CSV
          </button>
          <button
            type="button"
            disabled
            className="rounded-md border px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-60"
            title="Coming soon"
          >
            Export CSV
          </button>

          {/* Back to dashboard */}
          <Link
            href="/dashboard"
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Table header */}
      <div className="mt-6 grid grid-cols-[1fr_110px_120px] items-center gap-2 border-b px-2 pb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <div>Name / Description</div>
        <div className="text-center">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
        actions={actions}
      />
    </main>
  );
}
