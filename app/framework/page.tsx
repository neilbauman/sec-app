'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Space, Table, Tag, Typography, App, Flex } from 'antd';
import {
  CaretRightOutlined,
  CaretDownOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';

type PillarRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};
type ThemeRow = {
  id: string;
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};
type SubthemeRow = {
  id: string;
  code: string;
  pillar_code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Level = 'pillar' | 'theme' | 'subtheme';

type Row = {
  key: string;         // stable react key
  level: Level;
  id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  parentKey?: string;  // for tree
};

const { Text } = Typography;

export default function FrameworkPage() {
  const supabase = createClient(); // ✅ fixed
  const { message } = App.useApp();

  const [rows, setRows] = useState<Row[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Row>>({});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe || te || se) throw new Error(pe?.message || te?.message || se?.message);

      const byPillar: Record<string, string> = {}; // pillar_code -> pillar row key
      const flat: Row[] = [];

      // Pillars
      (pillars ?? []).forEach((p: PillarRow) => {
        const key = `pillar:${p.code}`;
        byPillar[p.code] = key;
        flat.push({
          key,
          level: 'pillar',
          id: p.id,
          code: p.code,
          name: p.name,
          description: p.description ?? '',
          sort_order: p.sort_order ?? 1,
        });
      });

      // Themes
      const byTheme: Record<string, string> = {};
      (themes ?? []).forEach((t: ThemeRow) => {
        const key = `theme:${t.code}`;
        byTheme[t.code] = key;
        flat.push({
          key,
          level: 'theme',
          id: t.id,
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? 1,
          parentKey: byPillar[t.pillar_code], // ensures correct pillar parent
        });
      });

      // Subthemes
      (subs ?? []).forEach((s: SubthemeRow) => {
        const key = `subtheme:${s.code}`;
        flat.push({
          key,
          level: 'subtheme',
          id: s.id,
          code: s.code,
          name: s.name,
          description: s.description ?? '',
          sort_order: s.sort_order ?? 1,
          parentKey: byTheme[s.theme_code], // ensures correct theme parent
        });
      });

      setRows(flat);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }, [supabase, message]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const treeData = useMemo(() => {
    // build tree from flat rows using parentKey
    const byKey: Record<string, any> = {};
    const roots: any[] = [];

    rows.forEach((r) => {
      byKey[r.key] = { ...r, children: [] };
    });

    rows.forEach((r) => {
      if (r.parentKey && byKey[r.parentKey]) {
        byKey[r.parentKey].children.push(byKey[r.key]);
      } else {
        roots.push(byKey[r.key]);
      }
    });

    // sort children by sort_order within each level
    const sortChildren = (nodes: any[]) => {
      nodes.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      nodes.forEach((n) => sortChildren(n.children));
    };
    sortChildren(roots);

    return roots;
  }, [rows]);

  const levelTag = (lvl: Level) => {
    if (lvl === 'pillar') return <Tag color="blue">Pillar</Tag>;
    if (lvl === 'theme') return <Tag color="green">Theme</Tag>;
    return <Tag color="red">Sub-theme</Tag>;
  };

  const onExpand = (expandedKeys: React.Key[]) => {
    // Ant Table in tree mode controls expand by keys
    const map: Record<string, boolean> = {};
    expandedKeys.forEach((k) => (map[String(k)] = true));
    setExpanded(map);
  };

  const expandedRowKeys = useMemo(
    () => Object.keys(expanded).filter((k) => expanded[k]),
    [expanded],
  );

  const startEdit = (r: Row) => {
    setEditing(r);
    setEditDraft({
      name: r.name,
      description: r.description,
      sort_order: r.sort_order,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;

    const vals = {
      name: (editDraft.name ?? '').toString().trim(),
      description: (editDraft.description ?? '').toString(),
      sort_order: Number(editDraft.sort_order ?? editing.sort_order ?? 1),
    };

    try {
      if (editing.level === 'pillar') {
        const { error } = await supabase.from('pillars').update(vals as any).eq('id', editing.id);
        if (error) throw error;
      } else if (editing.level === 'theme') {
        const { error } = await supabase.from('themes').update(vals as any).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subthemes').update(vals as any).eq('id', editing.id);
        if (error) throw error;
      }
      message.success('Saved');
      setEditing(null);
      setEditDraft({});
      fetchAll();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Save failed');
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: 110,
      render: (_: any, r: Row) => levelTag(r.level),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, r: Row) => {
        const codeFrag = <Text type="secondary">(code: {r.code})</Text>;
        if (editing?.key === r.key) {
          return (
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <input
                className="antd-input"
                style={{ width: '100%' }}
                defaultValue={editDraft.name?.toString() ?? r.name}
                onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
              />
              {codeFrag}
            </Space>
          );
        }
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{r.name}</Text>
            {codeFrag}
          </Space>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_: any, r: Row) =>
        editing?.key === r.key ? (
          <textarea
            className="antd-input"
            style={{ width: '100%' }}
            rows={2}
            defaultValue={editDraft.description?.toString() ?? r.description}
            onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
          />
        ) : (
          <Text>{r.description}</Text>
        ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 90,
      render: (_: any, r: Row) =>
        editing?.key === r.key ? (
          <input
            type="number"
            className="antd-input"
            style={{ width: 70 }}
            defaultValue={Number(editDraft.sort_order ?? r.sort_order)}
            onChange={(e) =>
              setEditDraft((d) => ({ ...d, sort_order: Number(e.target.value || 0) }))
            }
          />
        ) : (
          <Text>{r.sort_order}</Text>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_: any, r: Row) => (
        <Space>
          {editing?.key === r.key ? (
            <>
              <Button type="primary" size="small" onClick={saveEdit}>
                Save
              </Button>
              <Button size="small" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="small" onClick={() => startEdit(r)}>
                Edit
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <App>
      <div style={{ padding: 16 }}>
        <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
          <Space>
            <Link href="/">
              <Button icon={<ArrowLeftOutlined />}>&nbsp;Dashboard</Button>
            </Link>
            <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>
              Refresh
            </Button>
            <Button onClick={() => setExpanded({})}>Collapse all</Button>
            <Button
              onClick={() => {
                const all: Record<string, boolean> = {};
                rows.forEach((r) => (all[r.key] = true));
                setExpanded(all);
              }}
            >
              Expand all
            </Button>
          </Space>
        </Flex>

        <Table
          loading={loading}
          rowKey="key"
          dataSource={treeData}
          columns={columns as any}
          pagination={false}
          size="middle"
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: (keys) => {
              const map: Record<string, boolean> = {};
              (keys as React.Key[]).forEach((k) => (map[String(k)] = true));
              setExpanded(map);
            },
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined onClick={(e) => onExpand(record as any, e)} />
              ) : (
                <CaretRightOutlined onClick={(e) => onExpand(record as any, e)} />
              ),
          }}
        />
      </div>
    </App>
  );
}
