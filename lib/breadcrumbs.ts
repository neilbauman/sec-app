// /lib/breadcrumbs.ts
import type { Breadcrumb } from "@/components/ui/ToolsetHeader";

// Ensures pages can safely pass in objects like { label, href }
export function makeBreadcrumbs(items: Breadcrumb[]): Breadcrumb[] {
  return items;
}
