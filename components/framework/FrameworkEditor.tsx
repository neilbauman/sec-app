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
      const coded = withRefCodes(raw);
      setTree(coded);
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
          icon: <FileText className="w-6 h-6 text-green-600" />,
        }}
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configuration', href: '/configuration' },
          { label: 'Primary Framework Editor' },
        ]}
      />

      {loading && <div className="text-sm text-gray-500">Loading framework…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

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
  const isExpanded = expanded[pillar.id];
  return (
    <>
      <tr className="border-b">
        <td className="p-2 align-top">
          <button onClick={() => toggleExpand(pillar.id)} className="mr-1">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 inline" />
            ) : (
              <ChevronRight className="w-4 h-4 inline" />
            )}
          </button>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
            Pillar
          </span>
          <span className="ml-2 text-xs text-gray-500">{pillar.ref_code}</span>
        </td>
        <td className="p-2">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-sm text-gray-500 italic">{pillar.description}</div>
        </td>
        <td className="p-2 text-center">{pillar.sort_order}</td>
        <td className="p-2 text-right flex gap-2 justify-end">
          <Pencil className="w-4 h-4 cursor-pointer" />
          <Trash2 className="w-4 h-4 cursor-pointer text-red-600" />
          <AddThemeForm pillarId={pillar.id} onAdded={onChanged} />
        </td>
      </tr>
      {isExpanded &&
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
  const isExpanded = expanded[theme.id];
  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="p-2 pl-4 align-top">
          <button onClick={() => toggleExpand(theme.id)} className="mr-1">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 inline" />
            ) : (
              <ChevronRight className="w-4 h-4 inline" />
            )}
          </button>
          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
            Theme
          </span>
          <span className="ml-2 text-xs text-gray-500">{theme.ref_code}</span>
        </td>
        <td className="p-2 pl-4">
          <div className="font-medium">{theme.name}</div>
          <div className="text-sm text-gray-500 italic">{theme.description}</div>
        </td>
        <td className="p-2 text-center">{theme.sort_order}</td>
        <td className="p-2 text-right flex gap-2 justify-end">
          <Pencil className="w-4 h-4 cursor-pointer" />
          <Trash2 className="w-4 h-4 cursor-pointer text-red-600" />
          <AddSubthemeForm themeId={theme.id} onAdded={onChanged} />
        </td>
      </tr>
      {isExpanded &&
        (theme.subthemes ?? []).map((subtheme) => (
          <SubthemeRow key={subtheme.id} subtheme={subtheme} />
        ))}
    </>
  );
}

function SubthemeRow({ subtheme }: { subtheme: Subtheme }) {
  return (
    <tr className="border-b">
      <td className="p-2 pl-8 align-top">
        <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">
          Subtheme
        </span>
        <span className="ml-2 text-xs text-gray-500">{subtheme.ref_code}</span>
      </td>
      <td className="p-2 pl-8">
        <div className="font-medium">{subtheme.name}</div>
        <div className="text-sm text-gray-500 italic">{subtheme.description}</div>
      </td>
      <td className="p-2 text-center">{subtheme.sort_order}</td>
      <td className="p-2 text-right flex gap-2 justify-end">
        <Pencil className="w-4 h-4 cursor-pointer" />
        <Trash2 className="w-4 h-4 cursor-pointer text-red-600" />
      </td>
    </tr>
  );
}

function AddPillarForm({ onAdded }: { onAdded: () => void }) {
  async function handleAdd() {
    await addPillar({ name: 'New Pillar', description: 'Description' });
    onAdded();
  }
  return (
    <button
      onClick={handleAdd}
      className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50"
    >
      + Add Pillar
    </button>
  );
}

function AddThemeForm({
  pillarId,
  onAdded,
}: {
  pillarId: string;
  onAdded: () => void;
}) {
  async function handleAdd() {
    await addTheme(pillarId, { name: 'New Theme', description: 'Description' });
    onAdded();
  }
  return (
    <button onClick={handleAdd}>
      <Plus className="w-4 h-4 text-green-600" />
    </button>
  );
}

function AddSubthemeForm({
  themeId,
  onAdded,
}: {
  themeId: string;
  onAdded: () => void;
}) {
  async function handleAdd() {
    await addSubtheme(themeId, {
      name: 'New Subtheme',
      description: 'Description',
    });
    onAdded();
  }
  return (
    <button onClick={handleAdd}>
      <Plus className="w-4 h-4 text-red-600" />
    </button>
  );
}
