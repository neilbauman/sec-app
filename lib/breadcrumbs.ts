// /lib/breadcrumbs.ts

export type Breadcrumb = {
  label: string;
  href?: string; // optional for the current page
};

/**
 * Generate a breadcrumb trail.
 * - Each item is { label, href }.
 * - The last item (current page) may omit href.
 */
export function buildBreadcrumbs(items: Breadcrumb[]): Breadcrumb[] {
  return items;
}
