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

      <div className="bg-white shadow rounded-lg p-6">
        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="py-2 pr-4 w-8"></th>
                <th className="py-2 pr-4">Type / Ref Code</th>
                <th className="py-2 pr-4">Name / Description</th>
                <th className="py-2 pr-4">Sort Order</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortByOrder(pillars).map((pillar: any, pIndex: number) => (
                <PillarRow
                  key={pillar.id}
                  pillar={pillar}
                  index={pIndex}
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
  sortByOrder,
}: {
  pillar: any;
  index: number;
  sortByOrder: (arr: any[]) => any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-b">
        <td className="py-2 pr-2">
          <button onClick={() => setOpen(!open)} className="p-1">
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          </button>
        </td>
        <td className="py-2 pr-4 font-semibold text-brand-green">
          Pillar ({pillar.ref_code})
        </td>
        <td className="py-2 pr-4">
          <div>{pillar.name}</div>
          {pillar.description && (
            <div className="text-gray-500 text-xs">{pillar.description}</div>
          )}
          <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            {pillar.themes?.length ?? 0} themes
          </span>
        </td>
        <td className="py-2 pr-4">{pillar.sort_order}</td>
        <td className="py-2">—</td>
      </tr>

      {open &&
        sortByOrder(pillar.themes).map((theme: any) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            sortByOrder={sortByOrder}
          />
        ))}
    </>
  );
}

function ThemeRow({
  theme,
  sortByOrder,
}: {
  theme: any;
  sortByOrder: (arr: any[]) => any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="py-2 pr-2 pl-6">
          <button onClick={() => setOpen(!open)} className="p-1">
            <ChevronRight
              className={`h-3 w-3 transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          </button>
        </td>
        <td className="py-2 pr-4 font-medium text-gray-800">
          Theme ({theme.ref_code})
        </td>
        <td className="py-2 pr-4">
          <div>{theme.name}</div>
          {theme.description && (
            <div className="text-gray-500 text-xs">{theme.description}</div>
          )}
          <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            {theme.subthemes?.length ?? 0} subthemes
          </span>
        </td>
        <td className="py-2 pr-4">{theme.sort_order}</td>
        <td className="py-2">—</td>
      </tr>

      {open &&
        sortByOrder(theme.subthemes).map((sub: any) => (
          <SubthemeRow key={sub.id} sub={sub} />
        ))}
    </>
  );
}

function SubthemeRow({ sub }: { sub: any }) {
  return (
    <tr className="border-b bg-gray-100">
      <td className="py-2 pr-2 pl-12"></td>
      <td className="py-2 pr-4 text-gray-700">
        Subtheme ({sub.ref_code})
      </td>
      <td className="py-2 pr-4">
        <div>{sub.name}</div>
        {sub.description && (
          <div className="text-gray-500 text-xs">{sub.description}</div>
        )}
        <span className="ml-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
          leaf
        </span>
      </td>
      <td className="py-2 pr-4">{sub.sort_order}</td>
      <td className="py-2">—</td>
    </tr>
  );
}
