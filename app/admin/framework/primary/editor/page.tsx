// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework"; // existing helper

export const dynamic = "force-dynamic";

export default async function Page() {
  // 1) fetch raw data
  const data = await fetchFrameworkList();

  // 2) coerce to arrays; keep snake_case to align with DB
  const pillars = Array.isArray(data?.pillars) ? data!.pillars : [];
  const themes = Array.isArray(data?.themes) ? data!.themes : [];
  const subthemes = Array.isArray(data?.subthemes) ? data!.subthemes : [];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back to Dashboard
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">Primary Framework Editor</h1>

      {/* toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>Pillars: {pillars.length}</span>
          <span>•</span>
          <span>Themes: {themes.length}</span>
          <span>•</span>
          <span>Subthemes: {subthemes.length}</span>
        </div>

        {/* CSV placeholders (non-functional) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
            title="Bulk import CSV (placeholder)"
            disabled
          >
            Import CSV
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
            title="Bulk export CSV (placeholder)"
            disabled
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* cards */}
      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars as any}
        themes={themes as any}
        subthemes={subthemes as any}
        // actions omitted → read-only, keeps build green
      />
    </main>
  );
}
