// components/AppHeader.tsx
import Link from "next/link";

type Crumb = { href?: string; label: string };

export default function AppHeader({
  title,
  breadcrumbs = [],
}: {
  title: string;
  breadcrumbs?: Crumb[];
}) {
  // Breadcrumbs: last item is current page (no link)
  const last = breadcrumbs[breadcrumbs.length - 1]?.label;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-1">
          {/* Product name */}
          <div className="text-xs font-semibold tracking-wide text-gray-500">
            Shelter and Settlements Vulnerability Index
          </div>

          {/* Page title */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

            {/* Right-aligned utility spot if you need it later */}
            <div className="flex items-center gap-2"></div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mt-1">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                {breadcrumbs.map((c, i) => {
                  const isLast = i === breadcrumbs.length - 1;
                  return (
                    <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                      {!isLast && c.href ? (
                        <>
                          <Link
                            href={c.href}
                            className="hover:text-gray-700 hover:underline"
                          >
                            {c.label}
                          </Link>
                          <span aria-hidden="true">/</span>
                        </>
                      ) : (
                        <span className="text-gray-700 font-medium">{last}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
