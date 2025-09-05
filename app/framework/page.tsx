'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Typography, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { createClient } from '@/lib/supabaseClient';

type PillarRow = {
  level: 'pillar';
  id: string;
  code: string;
  name: string;
  description: string | null;
  parent: string | null;
  sort_order: number | null;
};

type ThemeRow = {
  level: 'theme';
  id: string;
  code: string;
  name: string;
  description: string | null;
  parent: string; // pillar code
  sort_order: number | null;
};

type SubthemeRow = {
  level: 'subtheme';
  id: string;
  code: string;
  name: string;
  description: string | null;
  parent: string; // theme code
  sort_order: number | null;
};

type UiRow = {
  key: string;
  level: 'pillar' | 'theme' | 'subtheme';
  nameCode: string;
  description: string;
  parent: string | null;
  sort_order: number | null;
};

const { Text } = Typography;

export default function FrameworkEditorPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UiRow[]>([]);

  const supabase = useMemo(() => createClient(), []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      // PILLARS
      const { data: pillarsData, error: pillarsErr } = await supabase
        .from('pillars')
        .select('id, code, name, description, sort_order')
        .order('sort_order', { ascending: true });

      if (pillarsErr) throw pillarsErr;

      const pillars: PillarRow[] =
        (pillarsData || []).map((p: any) => ({
          level: 'pillar',
          id: String(p.id ?? p.code),
          code: String(p.code ?? ''),
          name: String(p.name ?? ''),
          description: p.description ?? null,
          parent: null,
          sort_order: p.sort_order ?? null,
        })) ?? [];

      // THEMES
      const { data: themesData, error: themesErr } = await supabase
        .from('themes')
        .select('id, code, pillar_code, name, description, sort_order')
        .order('sort_order', { ascending: true });

      if (themesErr) throw themesErr;

      const themes: ThemeRow[] =
        (themesData || []).map((t: any) => ({
          level: 'theme',
          id: String(t.id ?? t.code),
          code: String(t.code ?? ''),
          name: String(t.name ?? ''),
          description: t.description ?? null,
          parent: String(t.pillar_code ?? ''),
          sort_order: t.sort_order ?? null,
        })) ?? [];

      // SUB-THEMES
      const { data: subsData, error: subsErr } = await supabase
        .from('subthemes')
        .select('id, code, theme_code, name, description, sort_order')
        .order('sort_order', { ascending: true });

      if (subsErr) throw subsErr;

      const subthemes: SubthemeRow[] =
        (subsData || []).map((s: any) => ({
          level: 'subtheme',
          id: String(s.id ?? s.code),
          code: String(s.code ?? ''),
          name: String(s.name ?? ''),
          description: s.description ?? null,
          parent: String(s.theme_code ?? ''),
          sort_order: s.sort_order ?? null,
        })) ?? [];

      // Flatten for the table
      const flat: UiRow[] = [
        ...pillars.map((p) => ({
          key: `pillar:${p.code}`,
          level: p.level,
          nameCode: `${p.name} (${p.code})`,
          description: (p.description ?? '') as string,
          parent: null,
          sort_order: p.sort_order ?? null,
        })),
        ...themes.map((t) => ({
          key: `theme:${t.code}`,
          level: t.level,
          nameCode: `${t.name} (${t.code})`,
          description: (t.description ?? '') as string,
          parent: t.parent,
          sort_order: t.sort_order ?? null,
        })),
        ...subthemes.map((s) => ({
          key: `subtheme:${s.code}`,
          level: s.level,
          nameCode: `${s.name} (${s.code})`,
          description: (s.description ?? '') as string,
          parent: s.parent,
          sort_order: s.sort_order ?? null,
        })),
      ];

      setRows(flat);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Failed to load framework data');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<UiRow> = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 140,
      render: (v: UiRow['level']) => {
        if (v === 'pillar') return <Text strong>Pillar</Text>;
        if (v === 'theme') return <Text>Theme</Text>;
        return <Text type="secondary">Sub-theme</Text>;
      },
      sorter: (a, b) => (a.level > b.level ? 1 : -1),
    },
    {
      title: 'Name / Code',
      dataIndex: 'nameCode',
      key: 'nameCode',
      width: 420,
      ellipsis: true,
    },
    {
      title: 'Description / Notes',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
      width: 220,
      render: (parent: string | null, row) => {
        if (!parent) return <Text type="secondary">—</Text>;
        // For convenience, show the parent code with a small label
        return (
          <Text code>
            {row.level === 'theme' ? `Pillar: ${parent}` : `Theme: ${parent}`}
          </Text>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Framework Editor
        </Typography.Title>
        <Typography.Text type="secondary">Read-only snapshot from database.</Typography.Text>
        <Button onClick={fetchAll} loading={loading}>
          Refresh
        </Button>
      </div>

      <Table<UiRow>
        rowKey="key"
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={{ pageSize: 50, showSizeChanger: true }}
        locale={{ emptyText: 'No data' }}
      />
    </div>
  );
}
