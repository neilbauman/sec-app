"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import { ChevronRight } from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFramework();
        setPillars(data ?? []);
      } catch (err: any) {
        console.error("Framework load error:", err);
        setError(err.message || "Failed to load framework data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // sort helper
  const sortByOrder = (arr: any[] = []) =>
    [...arr].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="space-y-6">
      <PageHeader
        group={group}
        page={page}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading &&
          !error &&
          sortByOrder(pillars).map((pillar: any, pIndex: number) => (
            <details
              key={pillar.id}
              open={pIndex === 0}
              className="group border rounded-lg p-4"
            >
              <summary className="flex items-center cursor-pointer font-semibold text-brand-green">
                <ChevronRight className="h-4 w-4 mr-2 transition-transform group-open:rotate-90" />
                {`Pillar ${pIndex + 1}: ${pillar.name}`}
              </summary>
              {pillar.description && (
                <p className="mt-1 text-gray-600">{pillar.description}</p>
              )}

              <div className="mt-2 space-y-3">
                {sortByOrder(pillar.themes).map((theme: any) => (
                  <details
                    key={theme.id}
                    className="group ml-4 border-l pl-4 py-1"
                  >
                    <summary className="flex items-center cursor-pointer font-medium text-gray-800">
                      <ChevronRight className="h-3 w-3 mr-2 transition-transform group-open:rotate-90" />
                      {theme.name}
                    </summary>
                    {theme.description && (
                      <p className="ml-5 mt-1 text-gray-500 text-sm">
                        {theme.description}
                      </p>
                    )}
                    <ul className="ml-7 mt-2 list-disc text-gray-700">
                      {sortByOrder(theme.subthemes).map((sub: any) => (
                        <li key={sub.id}>
                          {sub.name}
                          {sub.description && (
                            <span className="ml-2 text-gray-500 text-sm">
                              {sub.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </details>
          ))}
      </div>
    </div>
  );
}
