// /lib/breadcrumbs.ts

export type Breadcrumb = {
  label: string;
  href?: string;
};

// Ensures pages can safely pass in objects like { label, href }
export function makeBreadcrumbs(items: Breadcrumb[]): Breadcrumb[] {
  return items;
}
