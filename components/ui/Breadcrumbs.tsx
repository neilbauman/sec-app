// components/ui/Breadcrumbs.tsx
"use client";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav className="text-sm mt-2">
      <ol className="flex space-x-1 text-[#b7410e]">
        {breadcrumbs.map((bc, idx) => (
          <li key={idx} className="flex items-center">
            {bc.href && idx < breadcrumbs.length - 1 ? (
              <a href={bc.href} className="hover:underline">
                {bc.label}
              </a>
            ) : (
              <span className="font-semibold">{bc.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
