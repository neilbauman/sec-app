"use client";

import { useEffect, useMemo, useState } from "react";
import type { Pillar } from "@/types/framework";
import { getFrameworkClient } from "@/lib/framework-client";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

type Props = {
  framework?: Pillar[]; // ✅ now optional
};

interface NodeState {
  [id: string]: boolean;
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [data, setData] = useState<Pillar[]>(framework ?? []);
  const [loading, setLoading] = useState<boolean>(!framework);
  const [error, setError] = useState<string | null>(null);

  // expand/collapse state
  const [open, setOpen] = useState<NodeState>({});

  // If no data was provided, fetch on the client as a safe fallback
  useEffect(() => {
    if (framework) return; // SSR-provided data — nothing to do
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const result = await getFrameworkClient();
        if (mounted) setData(result);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load framework.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [framework]);

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />

      {/* Top actions */}
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Pillar
          </Button>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Theme
          </Button>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Sub-theme
          </Button>
        </div>
      </div>

      {/* Content states */}
      {loading && (
        <div className="text-sm text-gray-500">Loading framework…</div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="text-sm text-gray-500">
          No framework found. Add your first pillar to get started.
        </div>
      )}

      {!loading && !error && hasData && (
        <div className="space-y-3">
          {data
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((pillar) => {
              const isOpen = !!open[pillar.id];
              return (
                <div
                  key={pillar.id}
                  className="rounded-xl border bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between p-4">
                    <div className="flex items-start gap-3">
                      <button
                        className="mt-1"
                        onClick={() =>
                          setOpen((s) => ({ ...s, [pillar.id]: !s[pillar.id] }))
                        }
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      <div>
                        <div className="font-medium">
                          {pillar.ref_code ? `${pillar.ref_code} — ` : ""}
                          {pillar.name}
                        </div>
                        {pillar.description && (
                          <div className="text-sm text-gray-600">
                            {pillar.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-4 space-y-3">
                      {pillar.themes
                        ?.sort((a, b) => a.sort_order - b.sort_order)
                        .map((theme) => {
                          const themeOpen = !!open[theme.id];
                          return (
                            <div
                              key={theme.id}
                              className="rounded-lg border bg-white"
                            >
                              <div className="flex items-start justify-between p-3">
                                <div className="flex items-start gap-3">
                                  <button
                                    className="mt-0.5"
                                    onClick={() =>
                                      setOpen((s) => ({
                                        ...s,
                                        [theme.id]: !s[theme.id],
                                      }))
                                    }
                                    aria-label={
                                      themeOpen ? "Collapse" : "Expand"
                                    }
                                  >
                                    {themeOpen ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </button>
                                  <div>
                                    <div className="font-medium">
                                      {theme.ref_code
                                        ? `${theme.ref_code} — `
                                        : ""}
                                      {theme.name}
                                    </div>
                                    {theme.description && (
                                      <div className="text-sm text-gray-600">
                                        {theme.description}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {themeOpen && (
                                <div className="px-6 pb-3">
                                  {theme.subthemes &&
                                  theme.subthemes.length > 0 ? (
                                    <ul className="space-y-2">
                                      {theme.subthemes
                                        .sort(
                                          (a, b) => a.sort_order - b.sort_order
                                        )
                                        .map((st) => (
                                          <li
                                            key={st.id}
                                            className="flex items-start justify-between rounded-md border p-3"
                                          >
                                            <div>
                                              <div className="font-medium">
                                                {st.ref_code
                                                  ? `${st.ref_code} — `
                                                  : ""}
                                                {st.name}
                                              </div>
                                              {st.description && (
                                                <div className="text-sm text-gray-600">
                                                  {st.description}
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                              >
                                                <Trash className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      No sub-themes.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
