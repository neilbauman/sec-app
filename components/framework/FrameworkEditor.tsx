"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  FileText,
  Settings,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  Upload,
  Download,
} from "lucide-react";
import {
  getFrameworkTree,
  addPillar,
  addTheme,
  addSubtheme,
} from "@/lib/framework-client";

export default function FrameworkEditor() {
  const [tree, setTree] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const raw = await getFrameworkTree();
    setTree(raw);
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    tree.forEach((pillar) => {
      all[pillar.id] = true;
      pillar.themes.forEach((theme: any) => {
        all[theme.id] = true;
        theme.subthemes.forEach((st: any) => {
          all[st.id] = true;
        });
      });
    });
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        group={{
          name: "Configuration",
          icon: <Settings className="w-5 h-5" />,
          color: "text-green-600",
        }}
        page={{
          title: "Primary Framework Editor",
          description:
            "Define and manage the global SSC framework including pillars, themes, and subthemes.",
          icon: <FileText className="w-6 h-6" />,
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Collapse All
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Upload CSV"
          >
            <Upload className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <AddPillarForm onAdded={refresh} />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-sm text-left">
            <tr>
              <th className="w-[15%] px-2 py-2">Type / Ref Code</th>
              <th className="w-[55%] px-2 py-2">Name / Description</th>
              <th className="w-[10%] px-2 py-2 text-center">Sort Order</th>
              <th className="w-[20%] px-2 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tree.map((pillar, pIdx) => (
              <PillarRow
                key={pillar.id}
                pillar={pillar}
                expanded={expanded}
                toggleExpand={toggleExpand}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- Rows -------------------- */
function PillarRow({ pillar, expanded, toggleExpand }: any) {
  const isOpen = expanded[pillar.id];
  const pillarCode = `P${pillar.sort_order}`;
  return (
    <>
      <tr className="border-t">
        <td className="px-2 py-2 align-top">
          <div className="flex items-center gap-1">
            <button onClick={() => toggleExpand(pillar.id)}>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
              Pillar
            </span>
            <span className="text-xs text-gray-500">{pillarCode}</span>
          </div>
        </td>
        <td className="px-2 py-2 align-top">
          <div>
            <div className="font-medium">{pillar.name}</div>
            <div className="text-sm text-gray-600">{pillar.description}</div>
          </div>
        </td>
        <td className="px-2 py-2 text-center align-top">{pillar.sort_order}</td>
        <td className="px-2 py-2 text-right align-top">
          <div className="flex justify-end gap-2">
            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" title="Add Theme">
              <Plus className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </td>
      </tr>
      {isOpen &&
        pillar.themes.map((theme: any) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            pillarCode={pillarCode}
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        ))}
    </>
  );
}

function ThemeRow({ theme, pillarCode, expanded, toggleExpand }: any) {
  const isOpen = expanded[theme.id];
  const themeCode = `${pillarCode}.${theme.sort_order}`;
  return (
    <>
      <tr className="border-t bg-gray-50">
        <td className="px-2 py-2 pl-6 align-top">
          <div className="flex items-center gap-1">
            <button onClick={() => toggleExpand(theme.id)}>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
              Theme
            </span>
            <span className="text-xs text-gray-500">{themeCode}</span>
          </div>
        </td>
        <td className="px-2 py-2 align-top">
          <div>
            <div className="font-medium">{theme.name}</div>
            <div className="text-sm text-gray-600">{theme.description}</div>
          </div>
        </td>
        <td className="px-2 py-2 text-center align-top">{theme.sort_order}</td>
        <td className="px-2 py-2 text-right align-top">
          <div className="flex justify-end gap-2">
            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              title="Add Subtheme"
            >
              <Plus className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </td>
      </tr>
      {isOpen &&
        theme.subthemes.map((st: any) => (
          <SubthemeRow
            key={st.id}
            subtheme={st}
            themeCode={themeCode}
          />
        ))}
    </>
  );
}

function SubthemeRow({ subtheme, themeCode }: any) {
  const subthemeCode = `${themeCode}.${subtheme.sort_order}`;
  return (
    <tr className="border-t">
      <td className="px-2 py-2 pl-12 align-top">
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">
            Subtheme
          </span>
          <span className="text-xs text-gray-500">{subthemeCode}</span>
        </div>
      </td>
      <td className="px-2 py-2 align-top">
        <div>
          <div className="font-medium">{subtheme.name}</div>
          <div className="text-sm text-gray-600">{subtheme.description}</div>
        </div>
      </td>
      <td className="px-2 py-2 text-center align-top">{subtheme.sort_order}</td>
      <td className="px-2 py-2 text-right align-top">
        <div className="flex justify-end gap-2">
          <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* -------------------- Add Forms -------------------- */
function AddPillarForm({ onAdded }: { onAdded: () => void }) {
  async function handleAdd() {
    await addPillar({ name: "New Pillar", description: "Description" });
    onAdded();
  }
  return (
    <button
      onClick={handleAdd}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
    >
      Add Pillar
    </button>
  );
}
