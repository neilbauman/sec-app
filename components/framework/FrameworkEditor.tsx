'use client';

import { useEffect, useState } from 'react';
import {
  getFrameworkTree,
  addPillar,
  addTheme,
  addSubtheme,
} from '@/lib/hooks/useFramework';
// import { withRefCodes } from '@/lib/refCodes'; // temporarily skip
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
      console.log('Raw framework tree:', raw);

      // 🚨 TEMP: skip withRefCodes, just use raw
      setTree(raw);

      // If you want to test with refCodes after confirming raw has data:
      // const coded = withRefCodes(raw);
      // console.log('With ref codes:', coded);
      // setTree(coded);

      setExpanded({});
    } catch (e: any) {
      console.error('Error loading framework:', e);
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

/* ---------------- Row + Form components (unchanged) ---------------- */
// Keep your existing PillarRow, ThemeRow, SubthemeRow, AddPillarForm, AddThemeForm, AddSubthemeForm here
