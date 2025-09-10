// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
// If you need types, import them from your canonical source:
import type { Pillar, Theme, Subtheme } from "@/types/framework";
export const dynamic = "force-dynamic";

export default async function Page() {
  // Fetch raw data from Supabase via your existing helper
  const data = await fetchFrameworkList();

  // Helpers to coerce possibly-null inputs into arrays of the exact shapes our UI wants.
  const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  // Pillars
  const pillars: UIPillar[] = asArray<any>(data?.pillars).map((p) => ({
    // PrimaryFrameworkCards expects an `id`; we derive a stable one from code.
    id: String(p?.id ?? p?.code ?? ""),
    code: String(p?.code ?? ""),
    name: String(p?.name ?? ""),
    description: String(p?.description ?? ""),
    sort_order: Number(p?.sort_order ?? 0),
  }));

  // Themes
  const themes: UITheme[] = asArray<any>(data?.themes).map((t) => ({
    id: String(t?.id ?? t?.code ?? ""),
    code: String(t?.code ?? ""),
    name: String(t?.name ?? ""),
    description: String(t?.description ?? ""),
    sort_order: Number(t?.sort_order ?? 0),
    // match the snake_case the component uses for grouping
    pillar_code: String(t?.pillar_code ?? t?.parent_code ?? ""),
  }));

  // Subthemes
  const subthemes: UISubtheme[] = asArray<any>(data?.subthemes).map((s) => ({
    id: String(s?.id ?? s?.code ?? ""),
    code: String(s?.code ?? ""),
    name: String(s?.name ?? ""),
    description: String(s?.description ?? ""),
    sort_order: Number(s?.sort_order ?? 0),
    // match the snake_case the component uses for grouping
    theme_code: String(s?.theme_code ?? s?.parent_code ?? ""),
    pillar_code: String(s?.pillar_code ?? ""),
  }));

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Primary Framework</h1>
        <div className="flex items-center gap-3">
          {/* CSV placeholders (non-functional, per your request) */}
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            aria-disabled="true"
            title="CSV Import (coming soon)"
          >
            Import CSV
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            aria-disabled="true"
            title="CSV Export (coming soon)"
          >
            Export CSV
          </button>
          <Link
            href="/dashboard"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
        // no `actions` prop: read-only for now
      />
    </main>
  );
}
