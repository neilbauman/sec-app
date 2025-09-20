// components/ui/PageHeader.tsx
import { Layers } from "lucide-react";
import { groups, toolkit } from "@/lib/headerConfig";
import type { GroupKey, PageKey } from "@/lib/headerConfig";
import Link from "next/link";

type PageHeaderProps<G extends GroupKey> = {
  group: G;
  page: PageKey<G>;
  breadcrumb: { label: string; href?: string }[];
};

export default function PageHeader<G extends GroupKey>({
  group,
  page,
  breadcrumb,
}: PageHeaderProps<G>) {
  const groupInfo = groups[group];
  const pageInfo = groupInfo.pages[page];

  return (
    <div className="mb-6">
      {/* Toolkit title */}
      <div className="flex items-center gap-2 text-brand-rust mb-2">
        <Layers className="h-5 w-5" />
        <span className="font-semibold">{toolkit.name}</span>
      </div>

      {/* Group title */}
      <div className="flex items-center gap-2 mb-4">
        <groupInfo.icon className={`h-5 w-5 ${groupInfo.color}`} />
        <h2 className={`text-lg font-semibold ${groupInfo.color}`}>
          {groupInfo.name}
        </h2>
      </div>

      {/* Page title + description */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{pageInfo.title}</h1>
        <p className="text-gray-600">{pageInfo.description}</p>
      </div>

      {/* Breadcrumb */}
      <div className="border-y py-2 text-sm text-gray-500 flex gap-2">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {crumb.href ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
            {i < breadcrumb.length - 1 && <span>/</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
