"use client";

import { useEffect, useState } from "react";
import {
  fetchFramework,
  Pillar,
  Theme,
  Subtheme,
} from "@/lib/framework-client";
import {
  addPillar,
  // addTheme, addSubtheme will be wired later
} from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash,
  Upload,
  Download,
  X,
} from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [showAddPillarModal, setShowAddPillarModal] = useState(false);
  const [pillarName, setPillarName] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadFramework();
  }, []);

  async function loadFramework() {
    try {
      setLoading(true);
      const data = await fetchFramework();
      setPillars(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load framework data.");
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    pillars.forEach((p) => {
      allIds.add(p.id);
      p.themes.forEach((t) => {
        allIds.add(t.id);
        t.subthemes.forEach((s) => allIds.add(s.id));
      });
    });
    setExpanded(allIds);
  };

  const collapseAll = () => setExpanded(new Set());

  // Handle pillar creation
  const handleSavePillar = async () => {
    setSaving(true);
    setModalError(null);
    try {
      await addPillar({
        name: pillarName.trim(),
        description: pillarDesc.trim(),
      });
      setShowAddPillarModal(false);
      setPillarName("");
      setPillarDesc("");
      await loadFramework(); // reload to see new pillar
    } catch (err: any) {
      console.error("Error adding pillar:", err);
      setModalError(err.message || "Failed to add pillar.");
    } finally {
      setSaving(false);
    }
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

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
              onClick={expandAll}
            >
              Expand All
            </button>
            <button
              className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
              onClick={collapseAll}
            >
              Collapse All
            </button>
            {editMode && (
              <button
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setShowAddPillarModal(true)}
              >
                + Add Pillar
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Upload className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Download className="h-4 w-4" />
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-orange-200 text-orange-800 hover:bg-orange-300"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-[20%] text-left py-2 px-4">Type / Ref Code</th>
                <th className="w-[55%] text-left py-2 px-4">
                  Name / Description
                </th>
                <th className="w-[10%] text-center py-2 px-4">Sort Order</th>
                <th className="w-[15%] text-right py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar) => (
                <PillarRow
                  key={pillar.id}
                  pillar={pillar}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  editMode={editMode}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Pillar Modal */}
      {showAddPillarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddPillarModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Pillar</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={pillarName}
                  onChange={(e) => setPillarName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={pillarDesc}
                  onChange={(e) => setPillarDesc(e.target.value)}
                />
              </div>
              {modalError && (
                <p className="text-red-600 text-sm">{modalError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => setShowAddPillarModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSavePillar}
                  disabled={!pillarName.trim() || saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//
// ─── CHILD ROW COMPONENTS ─────────────────────────────────
//
function PillarRow({
  pillar,
  expanded,
  toggleExpand,
  editMode,
}: {
  pillar: Pillar;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
}) {
  const isOpen = expanded.has(pillar.id);

  return (
    <>
      <tr className="border-b">
        <td className="py-2 pl-4 pr-2">
          <div className="flex items-center gap-2">
            {pillar.themes.length > 0 && (
              <button onClick={() => toggleExpand(pillar.id)}>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}
            <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
              Pillar
            </span>
            <span className="text-sm text-gray-700">{pillar.ref_code}</span>
          </div>
        </td>
        <td className="py-2 px-2">
          <div>
            <div className="font-medium">{pillar.name}</div>
            <div className="text-sm text-gray-500">{pillar.description}</div>
          </div>
        </td>
        <td className="py-2 text-center">{pillar.sort_order}</td>
        <td className="py-2 text-right space-x-2">
          {editMode && (
            <>
              <button className="text-blue-600 hover:text-blue-800">
                <Edit className="h-4 w-4 inline" />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <Trash className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>
      {isOpen &&
        pillar.themes.map((theme) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            expanded={expanded}
            toggleExpand={toggleExpand}
            editMode={editMode}
          />
        ))}
    </>
  );
}

function ThemeRow({
  theme,
  expanded,
  toggleExpand,
  editMode,
}: {
  theme: Theme;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
}) {
  const isOpen = expanded.has(theme.id);

  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="py-2 pl-8 pr-2">
          <div className="flex items-center gap-2">
            {theme.subthemes.length > 0 && (
              <button onClick={() => toggleExpand(theme.id)}>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}
            <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
              Theme
            </span>
            <span className="text-sm text-gray-700">{theme.ref_code}</span>
          </div>
        </td>
        <td className="py-2 px-2">
          <div>
            <div className="font-medium">{theme.name}</div>
            <div className="text-sm text-gray-500">{theme.description}</div>
          </div>
        </td>
        <td className="py-2 text-center">{theme.sort_order}</td>
        <td className="py-2 text-right space-x-2">
          {editMode && (
            <>
              <button className="text-blue-600 hover:text-blue-800">
                <Edit className="h-4 w-4 inline" />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <Trash className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>
      {isOpen &&
        theme.subthemes.map((sub) => (
          <SubthemeRow key={sub.id} sub={sub} editMode={editMode} />
        ))}
    </>
  );
}

function SubthemeRow({ sub, editMode }: { sub: Subtheme; editMode: boolean }) {
  return (
    <tr className="border-b">
      <td className="py-2 pl-12 pr-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
            Subtheme
          </span>
          <span className="text-sm text-gray-700">{sub.ref_code}</span>
        </div>
      </td>
      <td className="py-2 px-2">
        <div>
          <div className="font-medium">{sub.name}</div>
          <div className="text-sm text-gray-500">{sub.description}</div>
        </div>
      </td>
      <td className="py-2 text-center">{sub.sort_order}</td>
      <td className="py-2 text-right space-x-2">
        {editMode && (
          <>
            <button className="text-blue-600 hover:text-blue-800">
              <Edit className="h-4 w-4 inline" />
            </button>
            <button className="text-red-600 hover:text-red-800">
              <Trash className="h-4 w-4 inline" />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
