"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import { ChevronRight, Upload, Download } from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

  const sortByOrder = (arr: any[] = []) =>
    [...arr].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Expand/Collapse controls
  const expandAll = () => {
    const ids = new Set<string>();
    pillars.forEach((p: any) => {
      ids.add(`pillar-${p.id}`);
      p.themes?.forEach((t: any) => {
        ids.add(`theme-${t.id}`);
      });
    });
    setExpanded(ids);
  };

  const collapseAll = () => setExpanded(new Set());

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

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

      <div className="bg-white shadow rounded-lg p-6">
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-x-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Collapse All
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Upload className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm border-collapse table-fixed">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="w-[5%]"></th>
                <th className="w-[20%] py-2 pr-4">Type / Ref Code</th>
                <th className="w-[55%] py-2 pr-4">Name / Description</th>
                <th className="w-[10%] py-2 pr-4 text-center">Sort Order</th>
                <th className="w-[10%] py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortByOrder(pillars).map((pillar: any, pIndex: number) => (
                <PillarRow
                  key={pillar.id}
                  pillar={pillar}
                  index={pillar.sort_order ?? pIndex + 1}
                  expanded={expanded}
                  toggle={toggle}
                  sortByOrder={sortByOrder}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PillarRow({
  pillar,
  index,
  expanded,
  toggle,
  sortByOrder,
}: {
  pillar: any;
  index: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  sortByOrder: (arr: any[]) => any[];
}) {
  const id = `pillar-${pillar.id}`;
  const refCode = `P${index}`;
  const isOpen = expanded.has(id);

  return (
    <>
      <tr className="border-b">
        <td className="py-2 pr-2">
          {pillar.themes?.length > 0 && (
            <button onClick={() => toggle(id)} className="p-1">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </td>
        <td className="py-2 pr-4 whitespace-nowrap">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            Pillar
          </span>
          <span className="ml-2 text-gray-500 text-xs">{refCode}</span>
        </td>
        <td className="py-2 pr-4 font-semibold">{pillar.name}</td>
        <td className="py-2 pr-4 text-center">{pillar.sort_order}</td>
        <td className="py-2 text-right">—</td>
      </tr>

      {isOpen &&
        sortByOrder(pillar.themes).map((theme: any) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            pillarIndex={index}
            expanded={expanded}
            toggle={toggle}
            sortByOrder={sortByOrder}
          />
        ))}
    </>
  );
}

function ThemeRow({
  theme,
  pillarIndex,
  expanded,
  toggle,
  sortByOrder,
}: {
  theme: any;
  pillarIndex: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  sortByOrder: (arr: any[]) => any[];
}) {
  const id = `theme-${theme.id}`;
  const refCode = `T${pillarIndex}.${theme.sort_order}`;
  const isOpen = expanded.has(id);

  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="py-2 pr-2 pl-6">
          {theme.subthemes?.length > 0 && (
            <button onClick={() => toggle(id)} className="p-1">
              <ChevronRight
                className={`h-3 w-3 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </td>
        <td className="py-2 pr-4 whitespace-nowrap pl-6">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            Theme
          </span>
          <span className="ml-2 text-gray-500 text-xs">{refCode}</span>
        </td>
        <td className="py-2 pr-4">{theme.name}</td>
        <td className="py-2 pr-4 text-center">{theme.sort_order}</td>
        <td className="py-2 text-right">—</td>
      </tr>

      {isOpen &&
        sortByOrder(theme.subthemes).map((sub: any) => (
          <SubthemeRow
            key={sub.id}
            sub={sub}
            pillarIndex={pillarIndex}
            themeIndex={theme.sort_order}
          />
        ))}
    </>
  );
}

function SubthemeRow({
  sub,
  pillarIndex,
  themeIndex,
}: {
  sub: any;
  pillarIndex: number;
  themeIndex: number;
}) {
  const refCode = `ST${pillarIndex}.${themeIndex}.${sub.sort_order}`;

  return (
    <tr className="border-b bg-gray-100">
      <td className="py-2 pr-2 pl-12"></td>
      <td className="py-2 pr-4 whitespace-nowrap pl-12">
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
          Subtheme
        </span>
        <span className="ml-2 text-gray-500 text-xs">{refCode}</span>
      </td>
      <td className="py-2 pr-4">{sub.name}</td>
      <td className="py-2 pr-4 text-center">{sub.sort_order}</td>
      <td className="py-2 text-right">—</td>
    </tr>
  );
}
