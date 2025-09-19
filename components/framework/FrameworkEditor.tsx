'use client';

import { useEffect, useState } from 'react';
import {
  getFrameworkTree,
  addPillar,
  addTheme,
  addSubtheme,
} from '@/lib/hooks/useFramework';
import { withRefCodes } from '@/lib/refCodes';
import type { FrameworkTree, Pillar, Theme, Subtheme } from '@/types/framework';
import {
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  Upload,
  Download,
  Settings,
  FileText,
} from 'lucide-react';

import PageHeader from '@/components/ui/PageHeader';

export default function FrameworkEditor() {
  const [tree, setTree] = useState<FrameworkTree>({ pillars: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const raw = await getFrameworkTree();
      setTree(withRefCodes(raw));
      setExpanded({});
    } catch (e: any) {
      setError(e.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAll() {
    const all: { [key: string]: boolean } = {};
    tree.pillars.forEach((p) => {
      all[p.id] = true;
      (p.themes ?? []).forEach((t) => {
        all[t.id] = true;
      });
    });
    setExpanded(all);
  }

  function collapseAll() {
    setExpanded({});
  }

  return (
    <div className="space-y-4">
      <PageHeader
        toolkitTitle="Shelter and Settlement Severity Classification Toolset"
        group={{
          name: 'SSC Configuration',
          icon: <Settings className="w-5 h-5 text-green-600" />,
          color: 'text-green-600',
        }}
        page={{
          title: 'Primary Framework Editor',
          description:
            'Define and manage the global SSC framework including pillars, themes, and subthemes.',
          icon: <FileText className="w-6 h-6 text-gray-700" />,
        }}
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configuration', href: '/configuration' },
          { label: 'Primary Framework Editor' },
        ]}
      />

      {loading && <div className="text-sm text-gray-500">Loading framework…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Collapse All
          </button>
        </div>
        <div className="flex gap-2">
          <AddPillarForm onAdded={refresh} />
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Upload CSV"
            onClick={() => alert('TODO: Upload CSV')}
          >
            <Upload className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Download CSV"
            onClick={() => alert('TODO: Download CSV')}
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-gray-700">
            <th className="p-2 w-[15%]">Type / Ref Code</th>
            <th className="p-2 w-[55%]">Name / Description</th>
            <th className="p-2 w-[10%] text-center">Sort Order</th>
            <th className="p-2 w-[15%] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tree.pillars.map((pillar) => (
            <PillarRow
              key={pillar.id}
              pillar={pillar}
              expanded={expanded}
              toggleExpand={toggleExpand}
              onChanged={refresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Pillar Row ---------------- */
function PillarRow({
  pillar,
  expanded,
  toggleExpand,
  onChanged,
}: {
  pillar: Pillar;
  expanded: { [key: string]: boolean };
  toggleExpand: (id: string) => void;
  onChanged: () => void;
}) {
  return (
    <>
      <tr className="border-b">
        <td className="p-2 align-top">
          <button onClick={() => toggleExpand(pillar.id)} className="mr-1">
            {expanded[pillar.id] ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <span className="inline-flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Pillar
            </span>
            <span className="text-xs text-gray-500">{pillar.ref_code}</span>
          </span>
        </td>
        <td className="p-2 align-top">
          <div className="font-medium">{pillar.name}</div>
          {pillar.description && (
            <div className="text-sm text-gray-600 italic">{pillar.description}</div>
          )}
        </td>
        <td className="p-2 text-center align-top">{pillar.sort_order}</td>
        <td className="p-2 align-top">
          <div className="flex justify-end gap-2">
            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
            <AddThemeForm pillarId={pillar.id} onAdded={onChanged} />
          </div>
        </td>
      </tr>
      {expanded[pillar.id] &&
        (pillar.themes ?? []).map((theme) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            expanded={expanded}
            toggleExpand={toggleExpand}
            onChanged={onChanged}
          />
        ))}
    </>
  );
}

/* ---------------- Theme Row ---------------- */
function ThemeRow({
  theme,
  expanded,
  toggleExpand,
  onChanged,
}: {
  theme: Theme;
  expanded: { [key: string]: boolean };
  toggleExpand: (id: string) => void;
  onChanged: () => void;
}) {
  return (
    <>
      <tr className="border-b">
        <td className="p-2 pl-4 align-top">
          <button onClick={() => toggleExpand(theme.id)} className="mr-1">
            {expanded[theme.id] ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <span className="inline-flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Theme
            </span>
            <span className="text-xs text-gray-500">{theme.ref_code}</span>
          </span>
        </td>
        <td className="p-2 pl-4 align-top">
          <div className="font-medium">{theme.name}</div>
          {theme.description && (
            <div className="text-sm text-gray-600 italic">{theme.description}</div>
          )}
        </td>
        <td className="p-2 text-center align-top">{theme.sort_order}</td>
        <td className="p-2 align-top">
          <div className="flex justify-end gap-2">
            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
            <AddSubthemeForm themeId={theme.id} onAdded={onChanged} />
          </div>
        </td>
      </tr>
      {expanded[theme.id] &&
        (theme.subthemes ?? []).map((sub) => (
          <SubthemeRow key={sub.id} subtheme={sub} onChanged={onChanged} />
        ))}
    </>
  );
}

/* ---------------- Subtheme Row ---------------- */
function SubthemeRow({
  subtheme,
  onChanged,
}: {
  subtheme: Subtheme;
  onChanged: () => void;
}) {
  return (
    <tr className="border-b">
      <td className="p-2 pl-12 align-top">
        <span className="inline-flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Subtheme
          </span>
          <span className="text-xs text-gray-500">{subtheme.ref_code}</span>
        </span>
      </td>
      <td className="p-2 pl-12 align-top">
        <div className="font-medium">{subtheme.name}</div>
        {subtheme.description && (
          <div className="text-sm text-gray-600 italic">{subtheme.description}</div>
        )}
      </td>
      <td className="p-2 text-center align-top">{subtheme.sort_order}</td>
      <td className="p-2 align-top">
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

/* ---------------- Add Forms ---------------- */
function AddPillarForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addPillar({ name, description });
      setOpen(false);
      setName('');
      setDescription('');
      onAdded();
    } catch (e: any) {
      alert(e.message ?? 'Failed to add pillar');
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        className="px-2 py-1 text-sm rounded-md bg-black text-white"
        onClick={() => setOpen(true)}
      >
        + Add Pillar
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="Pillar name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1 text-sm min-w-[240px]"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="px-2 py-1 text-sm rounded-md bg-black text-white disabled:opacity-50"
        disabled={busy || !name.trim()}
        onClick={submit}
      >
        Save
      </button>
      <button
        className="px-2 py-1 text-sm rounded-md border"
        onClick={() => setOpen(false)}
      >
        Cancel
      </button>
    </div>
  );
}

function AddThemeForm({
  pillarId,
  onAdded,
}: {
  pillarId: string;
  onAdded: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addTheme(pillarId, { name, description });
      setAdding(false);
      setName('');
      setDescription('');
      onAdded();
    } catch (e: any) {
      alert(e.message ?? 'Failed to add theme');
    } finally {
      setBusy(false);
    }
  }

  if (!adding) {
    return (
      <button
        className="p-1 hover:bg-gray-100 rounded"
        title="Add Theme"
        onClick={() => setAdding(true)}
      >
        <Plus className="w-4 h-4 text-green-600" />
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="Theme name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="px-2 py-1 text-sm rounded bg-black text-white disabled:opacity-50"
        disabled={busy || !name.trim()}
        onClick={submit}
      >
        Save
      </button>
      <button
        className="px-2 py-1 text-sm rounded border"
        onClick={() => setAdding(false)}
      >
        Cancel
      </button>
    </div>
  );
}

function AddSubthemeForm({
  themeId,
  onAdded,
}: {
  themeId: string;
  onAdded: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addSubtheme(themeId, { name, description });
      setAdding(false);
      setName('');
      setDescription('');
      onAdded();
    } catch (e: any) {
      alert(e.message ?? 'Failed to add subtheme');
    } finally {
      setBusy(false);
    }
  }

  if (!adding) {
    return (
      <button
        className="p-1 hover:bg-gray-100 rounded"
        title="Add Subtheme"
        onClick={() => setAdding(true)}
      >
        <Plus className="w-4 h-4 text-green-600" />
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="Subtheme name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="px-2 py-1 text-sm rounded bg-black text-white disabled:opacity-50"
        disabled={busy || !name.trim()}
        onClick={submit}
      >
        Save
      </button>
      <button
        className="px-2 py-1 text-sm rounded border"
        onClick={() => setAdding(false)}
      >
        Cancel
      </button>
    </div>
  );
}
