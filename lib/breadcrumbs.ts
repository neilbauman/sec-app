// /lib/breadcrumbs.ts

export type Breadcrumb = {
  label: string;
  href?: string; // optional for the current page
};

// Simple passthrough helper, allows consistent typing
export function makeBreadcrumbs(items: Breadcrumb[]): Breadcrumb[] {
  return items;
}
