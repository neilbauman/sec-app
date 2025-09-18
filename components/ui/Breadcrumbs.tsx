// /lib/breadcrumbs.ts

export type Breadcrumb = {
  label: string;
  href?: string;
};

/**
 * Utility to create a breadcrumb array.
 *
 * Example:
 *   makeBreadcrumbs([
 *     { label: "Dashboard", href: "/" },
 *     { label: "Configuration", href: "/configuration" },
 *     { label: "Primary Framework Editor" },
 *   ]);
 */
export function makeBreadcrumbs(items: Breadcrumb[]): Breadcrumb[] {
  return items;
}
