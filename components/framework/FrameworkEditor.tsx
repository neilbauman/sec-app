"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";

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
      } catch (err) {
        console.error(err);
        setError("Failed to load framework data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          pillars.map((pillar: any, pIndex: number) => (
            <details
              key={pillar.id}
              open={pIndex === 0}
              className="border rounded-lg p-4"
            >
              <summary className="font-semibold text-brand-green">
                {`Pillar ${pIndex + 1}: ${pillar.name}`}
              </summary>
              {pillar.description && (
                <p className="mt-1 text-gray-600">{pillar.description}</p>
              )}

              <div className="mt-2 space-y-3">
                {(pillar.themes ?? []).map((theme: any) => (
                  <details
                    key={theme.id}
                    className="ml-4 border-l pl-4 py-1"
                  >
                    <summary className="font-medium text-gray-800">
                      {theme.name}
                    </summary>
                    {theme.description && (
                      <p className="ml-4 mt-1 text-gray-500 text-sm">
                        {theme.description}
                      </p>
                    )}
                    <ul className="ml-6 mt-2 list-disc text-gray-700">
                      {(theme.subthemes ?? []).map((sub: any) => (
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
