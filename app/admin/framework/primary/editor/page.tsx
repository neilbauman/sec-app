import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

/**
 * Types mirrored from our UI layer only.
 * We keep these minimal so the page can render without DB wiring.
 */
export type Pillar = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Theme = {
  code: string;
  pillar_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Subtheme = {
  code: string;
  theme_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

/**
 * Try to load real data from our internal API. If it fails for any reason,
 * return null and let the caller fall back to the local mock data.
 */
async function tryFetchFrameworkList(): Promise<FrameworkList | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/framework/api/list`, {
      headers: { "x-ssc-internal": "1" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as FrameworkList;
    if (!data?.pillars || !data?.themes || !data?.subthemes) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Local mock data – used when the API isn’t wired or fails.
 */
const MOCK_DATA: FrameworkList = {
  pillars: [
    {
      code: "P1",
      name: "Safety",
      description: "People have a dwelling.",
      sort_order: 1,
    },
    {
      code: "P2",
      name: "Dignity",
      description: "Privacy, tenure, protection.",
      sort_order: 2,
    },
  ],
  themes: [
    { code: "T1", pillar_code: "P1", name: "Physical safety", description: "Protection from weather & hazards", sort_order: 1 },
    { code: "T2", pillar_code: "P1", name: "Overcrowding & privacy", description: "Space & privacy", sort_order: 2 },
    { code: "T3", pillar_code: "P2", name: "Habitability & health", description: "Ventilation, pests, utilities", sort_order: 1 },
    { code: "T4", pillar_code: "P2", name: "Security of tenure", description: "Perceived stability", sort_order: 2 },
  ],
  subthemes: [
    { code: "S1", theme_code: "T1", name: "Weatherproofing", description: "Roof, walls, floor", sort_order: 1 },
    { code: "S2", theme_code: "T1", name: "Structural integrity", description: "Safe construction", sort_order: 2 },
    { code: "S3", theme_code: "T2", name: "Overcrowding", description: "Persons per room", sort_order: 1 },
    { code: "S4", theme_code: "T3", name: "Ventilation", description: "Air & damp", sort_order: 1 },
    { code: "S5", theme_code: "T4", name: "Perceived tenure", description: "Fear of losing home", sort_order: 1 },
  ],
};

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkEditorPage() {
  // Prefer live data when available; otherwise fall back to mock.
  const live = await tryFetchFrameworkList();
  const data = live ?? MOCK_DATA;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Primary Framework Editor</h1>

      {/* Everything collapsed by default; colors on badges handled inside the cards */}
      <div className="mt-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      </div>
    </main>
  );
}
