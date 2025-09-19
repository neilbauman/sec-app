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
                <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {pillar.themes?.length ?? 0} themes
                </span>
              </summary>
              {pillar.description && (
                <p className="mt-1 text-gray-600">{pillar.description}</p>
              )}

              <div className="mt-3">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-gray-700 border-b">
                      <th className="py-2 pr-4">Type / Ref Code</th>
                      <th className="py-2 pr-4">Name / Description</th>
                      <th className="py-2 pr-4">Sort Order</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortByOrder(pillar.themes).map((theme: any) => (
                      <tr key={theme.id} className="align-top border-b">
                        <td className="py-2 pr-4">
                          <details className="group">
                            <summary className="flex items-center cursor-pointer font-medium text-gray-800">
                              <ChevronRight className="h-3 w-3 mr-2 transition-transform group-open:rotate-90" />
                              Theme ({theme.ref_code})
                              <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                {theme.subthemes?.length ?? 0} subthemes
                              </span>
                            </summary>
                          </details>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{theme.name}</div>
                          {theme.description && (
                            <div className="text-gray-500 text-xs">
                              {theme.description}
                            </div>
                          )}
                          {/* Subthemes table inside */}
                          <div className="ml-6 mt-2">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="text-left text-gray-600 border-b">
                                  <th className="py-1 pr-2">Type / Ref Code</th>
                                  <th className="py-1 pr-2">Name / Description</th>
                                  <th className="py-1 pr-2">Sort Order</th>
                                  <th className="py-1">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortByOrder(theme.subthemes).map((sub: any) => (
                                  <tr key={sub.id} className="border-b">
                                    <td className="py-1 pr-2">
                                      <span className="font-medium">
                                        Subtheme ({sub.ref_code})
                                      </span>
                                      <span className="ml-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                        leaf
                                      </span>
                                    </td>
                                    <td className="py-1 pr-2">
                                      <div>{sub.name}</div>
                                      {sub.description && (
                                        <div className="text-gray-500">
                                          {sub.description}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-1 pr-2">{sub.sort_order}</td>
                                    <td className="py-1">—</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td className="py-2 pr-4">{theme.sort_order}</td>
                        <td className="py-2">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
      </div>
    </div>
  );
}
