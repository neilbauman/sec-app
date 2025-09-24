import {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/types";

// Normalize raw data into typed structure
export function normalizePillars(raw: any[]): NestedPillar[] {
  return raw.map((p: any) => ({
    ...p,
    type: "Pillar" as const,
    children: p.children?.map((t: any) => ({
      ...t,
      type: "Theme" as const,
      children: t.children?.map((s: any) => ({
        ...s,
        type: "Subtheme" as const,
      })),
    })),
  }));
}

// Fetch framework from API
export async function fetchFramework(): Promise<NestedPillar[]> {
  const res = await fetch("/api/framework"); // adjust endpoint if needed
  const raw = await res.json();
  return normalizePillars(raw);
}

// ✅ Re-export for compatibility with older imports
export type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/types";
