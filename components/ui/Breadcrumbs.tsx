// /lib/breadcrumbs.ts

export type Breadcrumb = {
  label: string;
  href: string;
};

export function makeBreadcrumbs(
  items: { label: string; path: string }[],
  base: string = ""
): Breadcrumb[] {
  return items.map((item, idx) => {
    const href =
      base +
      "/" +
      items
        .slice(1, idx + 1)
        .map((i) => i.path)
        .join("/");
    return { label: item.label, href: href || "/" };
  });
}
