'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, message, Tag, Typography, Space } from 'antd';
import {
  CaretRightOutlined,
  CaretDownOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  VerticalAlignTopOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { createClient } from '@/lib/supabaseClient';

type Row = {
  id: string;
  level: 'pillar' | 'theme' | 'subtheme';
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
  // hierarchy links:
  pillar_code?: string | null;
  theme_code?: string | null;
};

const levelStyle: Record<Row['level'], { tag: React.ReactNode; bg: string }> = {
  pillar:   { tag: <Tag color="blue">Pillar</Tag>,    bg: 'bg-[#eef5ff]' },
  theme:    { tag: <Tag color="green">Theme</Tag>,     bg: 'bg-[#eefaf0]' },
  subtheme: { tag: <Tag color="red">Sub-theme</Tag>,   bg: 'bg-[#fff0f0]' },
};

export default function FrameworkPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe || te || se) {
        message.error(pe?.message || te?.message || se?.message || 'Failed to load framework');
        setRows([]);
        return;
      }

      const pRows: Row[] =
        (pillars || []).map((p: any) => ({
          id: `pillar:${p.code}`,
          level: 'pillar',
          code: p.code,
          name: p.name,
          description: p.description ?? null,
          sort_order: p.sort_order ?? null,
        }));

      const tRows: Row[] =
        (themes || []).map((t: any) => ({
          id: `theme:${t.code}`,
          level: 'theme',
          code: t.code,
          name: t.name,
          description: t.description ?? null,
          sort_order: t.sort_order ?? null,
          pillar_code: t.pillar_code ?? null,
        }));

      const sRows: Row[] =
        (subs || []).map((s: any) => ({
          id: `subtheme:${s.code}`,
          level: 'subtheme',
          code: s.code,
          name: s.name,
          description: s.description ?? null,
          sort_order: s.sort_order ?? null,
          pillar_code: s.pillar_code ?? null,
          theme_code: s.theme_code ?? null,
        }));

      // Flattened list for “All” view; expansion logic will decide visibility.
      setRows([...pRows, ...tRows, ...sRows]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Build child relationships for expansion toggles
  const byLevel = useMemo(() => {
    const pillars = rows.filter(r => r.level === 'pillar');
    const themes  = rows.filter(r => r.level === 'theme');
    const subs    = rows.filter(r => r.level === 'subtheme');

    const themesByPillar = new Map<string, Row[]>();
    const subsByTheme    = new Map<string, Row[]>();

    themes.forEach(t => {
      if (!t.pillar_code) return;
      const list = themesByPillar.get(t.pillar_code) || [];
      list.push(t);
      themesByPillar.set(t.pillar_code, list);
    });

    subs.forEach(s => {
      if (!s.theme_code) return;
      const list = subsByTheme.get(s.theme_code) || [];
      list.push(s);
      subsByTheme.set(s.theme_code, list);
    });

    // sort each group by sort_order then code as tie-breaker
    const sortFn = (a: Row, b: Row) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.code.localeCompare(b.code);

    themesByPillar.forEach(list => list.sort(sortFn));
    subsByTheme.forEach(list => list.sort(sortFn));

    pillars.sort(sortFn);

    return { pillars, themesByPillar, subsByTheme };
  }, [rows]);

  const toggleExpand = (row: Row) => {
    setExpanded(prev => ({ ...prev, [row.id]: !prev[row.id] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    rows.forEach(r => { if (r.level !== 'subtheme') next[r.id] = true; });
    setExpanded(next);
  };

  const collapseAll = () => setExpanded({});

  // Visible list based on expanded toggles
  const visible = useMemo(() => {
    const out: Row[] = [];
    byLevel.pillars.forEach(p => {
      out.push(p);
      const pOpen = expanded[p.id];
      if (!pOpen) return;
      const tList = byLevel.themesByPillar.get(p.code) || [];
      tList.forEach(t => {
        out.push(t);
        const tOpen = expanded[t.id];
        if (!tOpen) return;
        const sList = byLevel.subsByTheme.get(t.code) || [];
        sList.forEach(s => out.push(s));
      });
    });
    return out;
  }, [byLevel, expanded]);

  const caret = (row: Row) => {
    const hasChildren =
      (row.level === 'pillar' && (byLevel.themesByPillar.get(row.code) || []).length > 0) ||
      (row.level === 'theme'  && (byLevel.subsByTheme.get(row.code) || []).length > 0);

    if (!hasChildren) {
      // spacer to align with rows that have a caret
      return <span style={{ width: 18, display: 'inline-block' }} />;
    }

    const open = !!expanded[row.id];
    const Icon = open ? CaretDownOutlined : CaretRightOutlined;
    return (
      <button
        aria-label={open ? 'Collapse' : 'Expand'}
        onClick={() => toggleExpand(row)}
        className="mr-2 text-gray-600 hover:text-gray-900"
        style={{ width: 18 }}
      >
        <Icon />
      </button>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Space size="middle" wrap>
          <Link href="/" className="inline-flex items-center">
            <Button icon={<ArrowLeftOutlined />}>Dashboard</Button>
          </Link>
          <Typography.Title level={2} className="!mb-0">
            Framework Editor
          </Typography.Title>
          <Typography.Text type="secondary">Read-only snapshot from database.</Typography.Text>
        </Space>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>
            Refresh
          </Button>
          <Button icon={<VerticalAlignTopOutlined />} onClick={collapseAll}>
            Collapse all
          </Button>
          <Button icon={<UnorderedListOutlined />} onClick={expandAll}>
            Expand all
          </Button>
        </Space>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[260px,1fr,1.2fr] border-b border-gray-200 px-2 pb-2 text-sm font-medium text-gray-500">
        <div>Type</div>
        <div>Name</div>
        <div>Description</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {visible.map((r) => {
          const styles = levelStyle[r.level];
          const indent =
            r.level === 'pillar' ? 'pl-0' :
            r.level === 'theme' ? 'pl-8' : 'pl-16';

          return (
            <div key={r.id} className={`grid grid-cols-[260px,1fr,1.2fr] items-center py-3 px-2 ${styles.bg}`}>
              {/* Type column: caret + tag (tag RIGHT of caret as requested) */}
              <div className="flex items-center">
                {caret(r)}
                <div className="ml-1">{styles.tag}</div>
              </div>

              {/* Name + code */}
              <div className={`flex flex-col ${indent}`}>
                <div className="font-medium text-gray-900">{r.name}</div>
                <div className="text-sm text-gray-500">(code: {r.code})</div>
              </div>

              {/* Description */}
              <div className="text-gray-800">
                {r.description || <span className="text-gray-400 italic">No description</span>}
              </div>
            </div>
          );
        })}

        {!loading && visible.length === 0 && (
          <div className="text-center text-gray-400 py-8">No data</div>
        )}
      </div>
    </div>
  );
}
