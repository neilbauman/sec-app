import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export const dynamic = "force-dynamic";

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
function toInt(n: unknown, d = 0) {
  const x = typeof n === "number" ? n : Number(n);
  return Number.isFinite(x) ? x : d;
}

export default async function Page() {
  let pillars: Pillar[] = [];
  let themes: Theme[] = [];
  let subthemes: Subtheme[] = [];
  let softError: string | null = null;

  try {
    const data = await fetchFrameworkList();

    // Defensive coercion + stable defaults so accidental nulls don’t blow up SSR.
    pillars = asArray<Pillar>(data?.pillars).map((p) => ({
      code: String((p as any)?.code ?? ""),
      name: String((p as any)?.name ?? ""),
      description: String((p as any)?.description ?? ""),
      sort_order: toInt((p as any)?.sort_order, 0),
    }));

    themes = asArray<Theme>(data?.themes).map((t) => ({
      code: String((t as any)?.code ?? ""),
      pillar_code: String((t as any)?.pillar_code ?? (t as any)?.pillarCode ?? ""),
      name: String((t as any)?.name ?? ""),
      description: String((t as any)?.description ?? ""),
      sort_order: toInt((t as any)?.sort_order, 0),
    }));

    subthemes = asArray<Subtheme>(data?.subthemes).map((s) => ({
      code: String((s as any)?.code ?? ""),
      theme_code: String((s as any)?.theme_code ?? (s as any)?.themeCode ?? ""),
      name: String((s as any)?.name ?? ""),
      description: String((s as any)?.description ?? ""),
      sort_order: toInt((s as any)?.sort_order, 0),
    }));
  } catch (err) {
    // Do not rethrow: render a helpful message + keep the page alive.
    const msg =
      err instanceof Error ? err.message : "Unknown error fetching framework.";
    softError = msg;
    // Also log to server logs for visibility.
    // eslint-disable-next-line no-console
    console.error("fetchFrameworkList failed:", err);
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4">
        <Link href="/admin" className="text-sm text-slate-500 underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-semibold">Primary Framework Editor</h1>

      {/* CSV placeholders (non-functional) */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-md border px-3 py-1.5 text-sm text-slate-500"
          title="CSV export (coming soon)"
        >
          Export CSV
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-md border px-3 py-1.5 text-sm text-slate-500"
          title="CSV import (coming soon)"
        >
          Import CSV
        </button>
      </div>

      {softError ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Couldn’t load framework data</p>
          <p className="mt-1">{softError}</p>
          <p className="mt-2 text-xs text-red-500">
            Check your Vercel Function logs for a stack trace.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <PrimaryFrameworkCards
            defaultOpen={false}
            pillars={pillars}
            themes={themes}
            subthemes={subthemes}
            actions={{}} // read-only for now; prevents type errors if actions are optional
          />
        </div>
      )}
    </main>
  );
}
