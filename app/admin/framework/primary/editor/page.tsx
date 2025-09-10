// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export const dynamic = "force-dynamic";

/**
 * Server actions MUST return void | Promise<void>.
 * These are placeholders (no-ops) for now.
 */
async function actionImportCsv(_formData: FormData): Promise<void> {
  "use server";
  // TODO: implement CSV import later
}

async function actionExportCsv(_formData: FormData): Promise<void> {
  "use server";
  // TODO: implement CSV export later
}

export default async function Page() {
  const data = await fetchFrameworkList();

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

      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>

        {/* CSV placeholders (not wired yet) */}
        <div className="flex items-center gap-2">
          {/* Import CSV (no-op) */}
          <form action={actionImportCsv}>
            <input
              id="csvFile"
              type="file"
              name="csv"
              accept=".csv"
              className="hidden"
            />
            <label
              htmlFor="csvFile"
              className="cursor-pointer rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Import CSV
            </label>
          </form>

          {/* Export CSV (no-op) */}
          <form action={actionExportCsv}>
            <button
              type="submit"
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Export CSV
            </button>
          </form>
        </div>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
      />
    </main>
  );
}
