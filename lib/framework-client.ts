import { NestedPillar } from "@/lib/types";

// Normalize backend data to ensure "type" field exists
export function normalizePillars(raw: any[]): NestedPillar[] {
  return raw.map((p: any) => ({
    ...p,
    type: "Pillar",
    children: p.children?.map((t: any) => ({
      ...t,
      type: "Theme",
      children: t.children?.map((s: any) => ({
        ...s,
        type: "Subtheme",
      })),
    })),
  }));
}

// Fetcher used by pages (alias kept as fetchFramework for compatibility)
export async function fetchFramework(): Promise<NestedPillar[]> {
  const res = await fetch("/api/framework"); // adjust endpoint if needed
  const raw = await res.json();
  return normalizePillars(raw);
}

// ✅ Re-export type here for backward compatibility
export type { NestedPillar } from "@/lib/types";
