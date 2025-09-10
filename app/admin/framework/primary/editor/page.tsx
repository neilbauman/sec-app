// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";

export const dynamic = "force-dynamic";

export default async function Page() {
  // 1) Load raw data (DB shapes)
  const data = await fetchFrameworkList();

  // 2) Coerce to UI-friendly, defensive defaults (no “id” required in UI)
  const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  const pillars = asArray<{ code: string; name: string; description?: string | null; sort_order?: number | null }>(
    data?.pillars
  ).map((p) => ({
    code: String((p as any)?.code ?? ""),
    name: String((p as any)?.name ?? ""),
    description: (p as any)?.description ?? "",
    sort_order: (p as any)?.sort_order ?? 0,
  }));

  const themes = asArray<{ code: string; name: string; description?: string | null; sort_order?: number | null; pillar_code?: string }>(
    data?.themes
  ).map((t) => ({
    code: String((t as any)?.code ?? ""),
    name: String((t as any)?.name ?? ""),
    description: (t as any)?.description ?? "",
    sort_order: (t as any)?.sort_order ?? 0,
    pillar_code: String((t as any)?.pillar_code ?? ""),
  }));

  const subthemes = asArray<{ code: string; name: string; description?: string | null; sort_order?: number | null; theme_code?: string }>(
    data?.subthemes
  ).map((s) => ({
    code: String((s as any)?.code ?? ""),
    name: String((s as any)?.name ?? ""),
    description: (s as any)?.description ?? "",
    sort_order: (s as any)?.sort_order ?? 0,
    theme_code: String((s as any)?.theme_code ?? ""),
  }));

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Primary Framework</h1>
        <div className="flex items-center gap-3">
          {/* CSV placeholders (non-functional) */}
          <button
            type="button"
            disabled
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500"
            title="CSV Import (coming soon)"
          >
            Import CSV
          </button>
          <button
            type="button"
            disabled
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500"
            title="CSV Export (coming soon)"
          >
            Export CSV
          </button>
          <Link
            href="/"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
        actions={{}} // read-only for now
      />
    </main>
  );
}
