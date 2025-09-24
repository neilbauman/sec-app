import { NestedPillar } from "@/lib/types";

// Example: normalize raw data to include type field
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

// Example fetcher (adjust as per your API)
export async function getPillarsFromApi(): Promise<NestedPillar[]> {
  const res = await fetch("/api/framework"); // adjust API path
  const raw = await res.json();
  return normalizePillars(raw);
}
