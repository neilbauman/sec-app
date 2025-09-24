// lib/framework-client.ts
import {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/types";
import { getFrameworkFromDb } from "@/lib/framework-server";

// Normalize backend data into typed structure
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

/**
 * Framework fetcher used in pages
 * ✅ Calls DB directly instead of fetching /api/framework
 */
export async function fetchFramework(): Promise<NestedPillar[]> {
  return getFrameworkFromDb();
}

// Re-export types for compatibility
export type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/types";
