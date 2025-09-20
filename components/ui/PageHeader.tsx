// components/ui/PageHeader.tsx
import { Layers } from "lucide-react";
import { groups, GroupKey, PageKey, toolkit } from "@/lib/headerConfig";
import Link from "next/link";

export type PageHeaderProps<G extends GroupKey = GroupKey> = {
  group: G;
  page: PageKey<G>;
  breadcrumb?: { label: string; href?: string }[]; // optional override
};

export default function PageHeader<G extends GroupKey>({
  group,
  page,
  breadcrumb,
}: PageHeaderProps<G>) {
  const cfg = groups[group];
  const pageInfo = cfg.pages[page];

  // Always prepend Dashboard unless overridden
  const crumbs =
    breadcrumb ??
    [
      { label: "Dashboard", href: "/" },
      ...(page === "index"
        ? [{ label: cfg.name }]
        : [
            { label: cfg.name, href: `/${group}` },
            { label: pageInfo.title },
          ]),
    ];

  return (
    <header className="space-y-4">
      {/* Toolkit title */}
      <div className="flex items-center space-x-2">
        <Layers className="w-6 h-6 text-brand-rust" />
        <h1 className="text-2xl font-bold text-brand-rust">
          {toolkit.name}
        </h1>
      </div>

      {/* Group & Page */}
      <div className="flex items-center space-x-2">
        <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
        <h2 className={`text-xl font-semibold ${cfg.color}`}>{cfg.name}</h2>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {pageInfo.title}
        </h3>
        <p className="text-gray-600">{pageInfo.description}</p>
      </div>

      {/* Breadcrumb */}
      <div className="border-y py-2">
        <nav className="text-sm">
          <ol className="flex flex-wrap items-center space-x-2 text-gray-500">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center">
                {c.href ? (
                  <Link
                    href={c.href}
                    className={`hover:underline ${
                      i === crumbs.length - 1
                        ? "font-semibold text-gray-900"
                        : cfg.color
                    }`}
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    className={
                      i === crumbs.length - 1
                        ? "font-semibold text-gray-900"
                        : cfg.color
                    }
                  >
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <span className="mx-1">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
