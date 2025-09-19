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
          icon: <FileText className="w-6 h-6 text-green-600" />, // match group color
        }}
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configuration', href: '/configuration' },
          { label: 'Primary Framework Editor' },
        ]}
      />

      {loading && <div className="text-sm text-gray-500">Loading framework…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {/* Table and forms remain unchanged */}
    </div>
  );
}
