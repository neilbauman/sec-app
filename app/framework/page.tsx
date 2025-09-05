'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

// IMPORTANT: this assumes your project exposes a named export `createClient` that returns a browser supabase client
// If your helper exports default, change to: import createClient from '@/lib/supabaseClient'
import { createClient } from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

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
  pillar_code: string; // FK
  name: string;
  description: string | null;
  sort_order: number | null;
};

type SubthemeRow = {
  id: string;
  code: string;
  theme_code: string; // FK
  name: string;
  description: string | null;
  sort_order: number | null;
};

type UIRow = {
  key: string;             // P:{code} | T:{code} | S:{code}
  level: Level;
  id: string;
  code: string;
  parentCode?: string;      // pillar_code for theme, theme_code for subtheme
  name: string;
  description: string;
  sort_order: number;
  // for rendering tree
  children?: UIRow[];
};

const levelTagStyle: Record<Level, { color: string; label: string; bg: string }> = {
  pillar:   { color: '#155e75', label: 'Pillar',   bg: 'rgba(13,148,136,0.08)' },   // teal-ish
  theme:    { color: '#1f4d2b', label: 'Theme',    bg: 'rgba(34,197,94,0.08)'  },   // green-ish
  subtheme: { color: '#7c2d12', label: 'Sub-theme',bg: 'rgba(244,63,94,0.08)'  },   // rose-ish
};

function keyOf(level: Level, code: string) {
  return `${level[0].toUpperCase()}:${code}`;
}

function bySort(a?: number | null, b?: number | null) {
  const aa = a ?? 1;
  const bb = b ?? 1;
  return aa - bb;
}

export default function FrameworkEditorPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // raw tables
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);

  // expand/collapse (manual, not Table expandable)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // inline edit
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // modal for add-child
  const [addOpen, setAddOpen] = useState(false);
  const [addParent, setAddParent] = useState<UIRow | null>(null);
  const [addLevel, setAddLevel] = useState<Level | null>(null);
  const [addForm] = Form.useForm();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, tRes, sRes] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

      if (pRes.error) throw pRes.error;
      if (tRes.error) throw tRes.error;
      if (sRes.error) throw sRes.error;

      setPillars((pRes.data || []) as any);
      setThemes((tRes.data || []) as any);
      setSubs((sRes.data || []) as any);
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Build full tree
  const tree: UIRow[] = useMemo(() => {
    const pMap: Record<string, UIRow> = {};
    const tByP: Record<string, UIRow[]> = {};
    const sByT: Record<string, UIRow[]> = {};

    const pSorted = [...pillars].sort((a, b) => bySort(a.sort_order, b.sort_order));
    const tSorted = [...themes].sort((a, b) => bySort(a.sort_order, b.sort_order));
    const sSorted = [...subs].sort((a, b) => bySort(a.sort_order, b.sort_order));

    // subthemes grouped by theme_code
    for (const s of sSorted) {
      const node: UIRow = {
        key: keyOf('subtheme', s.code),
        level: 'subtheme',
        id: s.id,
        code: s.code,
        parentCode: s.theme_code,
        name: s.name,
        description: s.description ?? '',
        sort_order: s.sort_order ?? 1,
      };
      if (!sByT[s.theme_code]) sByT[s.theme_code] = [];
      sByT[s.theme_code].push(node);
    }

    // themes grouped by pillar_code; attach subthemes
    for (const t of tSorted) {
      const node: UIRow = {
        key: keyOf('theme', t.code),
        level: 'theme',
        id: t.id,
        code: t.code,
        parentCode: t.pillar_code,
        name: t.name,
        description: t.description ?? '',
        sort_order: t.sort_order ?? 1,
        children: sByT[t.code] || [],
      };
      if (!tByP[t.pillar_code]) tByP[t.pillar_code] = [];
      tByP[t.pillar_code].push(node);
    }

    // pillars; attach themes
    for (const p of pSorted) {
      pMap[p.code] = {
        key: keyOf('pillar', p.code),
        level: 'pillar',
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? 1,
        children: tByP[p.code] || [],
      };
    }

    return Object.values(pMap);
  }, [pillars, themes, subs]);

  // Flatten by expanded dictionary (manual tree)
  const flatData: UIRow[] = useMemo(() => {
    const out: UIRow[] = [];
    const pushNode = (n: UIRow, depth = 0) => {
      out.push({ ...n, sort_order: n.sort_order });
      if (expanded[n.key] && n.children?.length) {
        for (const c of n.children) pushNode(c, depth + 1);
      }
    };
    for (const p of tree) pushNode(p, 0);
    return out;
  }, [tree, expanded]);

  const isEditing = (key: string) => editingKey === key;

  function startEdit(rec: UIRow) {
    setEditingKey(rec.key);
    form.setFieldsValue({
      name: rec.name,
      description: rec.description,
      sort_order: rec.sort_order ?? 1,
    });
  }

  async function saveEdit(rec: UIRow) {
    try {
      const vals = await form.validateFields();
      let err: string | null = null;

      if (rec.level === 'pillar') {
        const { error } = await supabase
          .from('pillars')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', rec.id);
        err = error?.message ?? null;
      } else if (rec.level === 'theme') {
        const { error } = await supabase
          .from('themes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', rec.id);
        err = error?.message ?? null;
      } else {
        const { error } = await supabase
          .from('subthemes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', rec.id);
        err = error?.message ?? null;
      }

      if (err) throw new Error(err);
      setEditingKey(null);
      await fetchAll();
      message.success('Saved');
    } catch (e: any) {
      message.error(e?.message ?? 'Save failed');
    }
  }

  function cancelEdit() {
    setEditingKey(null);
  }

  async function deleteRow(rec: UIRow) {
    try {
      let err: string | null = null;
      if (rec.level === 'pillar') {
        const { error } = await supabase.from('pillars').delete().eq('id', rec.id);
        err = error?.message ?? null;
      } else if (rec.level === 'theme') {
        const { error } = await supabase.from('themes').delete().eq('id', rec.id);
        err = error?.message ?? null;
      } else {
        const { error } = await supabase.from('subthemes').delete().eq('id', rec.id);
        err = error?.message ?? null;
      }
      if (err) throw new Error(err);
      message.success('Deleted');
      await fetchAll();
    } catch (e: any) {
      message.error(e?.message ?? 'Delete failed');
    }
  }

  function openAddChild(parent: UIRow) {
    const nextLevel: Level =
      parent.level === 'pillar' ? 'theme' : 'subtheme';
    setAddParent(parent);
    setAddLevel(nextLevel);
    addForm.resetFields();
    addForm.setFieldsValue({
      sort_order: 1,
    });
    setAddOpen(true);
  }

  async function submitAdd() {
    try {
      const vals = await addForm.validateFields();
      if (!addParent || !addLevel) return;

      let err: string | null = null;
      if (addLevel === 'theme') {
        // parent is a pillar; use parent.code as pillar_code
        const payload = {
          code: vals.code,
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
          pillar_code: addParent.code,
        };
        const { error } = await supabase.from('themes').insert(payload as any);
        err = error?.message ?? null;
      } else {
        // subtheme; parent is a theme; use parent.code as theme_code
        const payload = {
          code: vals.code,
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
          theme_code: addParent.code,
        };
        const { error } = await supabase.from('subthemes').insert(payload as any);
        err = error?.message ?? null;
      }
      if (err) throw new Error(err);
      setAddOpen(false);
      message.success('Added');
      await fetchAll();
      // auto-expand parent so the new child is visible
      setExpanded((e) => ({ ...e, [addParent.key]: true }));
    } catch (e: any) {
      message.error(e?.message ?? 'Create failed');
    }
  }

  function toggleExpand(k: string) {
    setExpanded((e) => ({ ...e, [k]: !e[k] }));
  }

  const renderType = (rec: UIRow) => {
    const meta = levelTagStyle[rec.level];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* caret */}
        {rec.children && rec.children.length > 0 ? (
          <span
            onClick={() => toggleExpand(rec.key)}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            aria-label={expanded[rec.key] ? 'Collapse' : 'Expand'}
          >
            {expanded[rec.key] ? <CaretDownOutlined /> : <CaretRightOutlined />}
          </span>
        ) : (
          <span style={{ width: 14 }} /> // spacer to align
        )}

        {/* tag to the RIGHT of caret */}
        <Tag
          style={{
            borderRadius: 8,
            background: meta.bg,
            color: meta.color,
            marginRight: 0,
          }}
        >
          {meta.label}
        </Tag>

        {/* code in small, grey next to the tag */}
        <span style={{ fontSize: 12, color: '#6b7280' }}>({rec.code})</span>
      </div>
    );
  };

  const editable = (rec: UIRow) => isEditing(rec.key);

  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: 220,
      render: (_: any, rec) => renderType(rec),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'cell-tight',
      render: (_: any, rec) =>
        editable(rec) ? (
          <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
        ) : (
          <Typography.Text>{rec.name}</Typography.Text>
        ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      className: 'cell-tight',
      render: (_: any, rec) =>
        editable(rec) ? (
          <Form.Item name="description" style={{ margin: 0 }}>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
          </Form.Item>
        ) : (
          <Typography.Text type="secondary">{rec.description}</Typography.Text>
        ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      align: 'center',
      render: (_: any, rec) =>
        editable(rec) ? (
          <Form.Item name="sort_order" style={{ margin: 0 }} rules={[{ type: 'number', min: 1 }]}>
            <InputNumber min={1} />
          </Form.Item>
        ) : (
          <Typography.Text>{rec.sort_order ?? ''}</Typography.Text>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: any, rec) => {
        if (editable(rec)) {
          return (
            <Space size="small">
              <Button type="primary" size="small" onClick={() => saveEdit(rec)}>
                Save
              </Button>
              <Button size="small" onClick={cancelEdit}>
                Cancel
              </Button>
            </Space>
          );
        }
        return (
          <Space size="small">
            <Button icon={<EditOutlined />} size="small" onClick={() => startEdit(rec)}>
              Edit
            </Button>

            {/* Add child only for pillar/theme */}
            {(rec.level === 'pillar' || rec.level === 'theme') && (
              <Button
                icon={<PlusOutlined />}
                size="small"
                onClick={() => openAddChild(rec)}
              >
                Add {rec.level === 'pillar' ? 'Theme' : 'Sub-theme'}
              </Button>
            )}

            <Popconfirm
              title="Delete this row?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => deleteRow(rec)}
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeftOutlined />
          Dashboard
        </Link>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Framework Editor
        </Typography.Title>
        <div style={{ flex: 1 }} />
        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
          Refresh
        </Button>
      </div>

      {/* Compact density */}
      <style>{`
        :where(.ant-table) .ant-table-tbody > tr > td,
        :where(.ant-table) .ant-table-thead > tr > th {
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
      `}</style>

      {/* Inline edit form wrapper */}
      <Form form={form} component={false}>
        <Table<UIRow>
          dataSource={flatData}
          columns={columns}
          loading={loading}
          rowKey={(rec) => rec.key}
          pagination={false}
          size="small"
        />
      </Form>

      {/* Add child modal */}
      <Modal
        title={addLevel === 'theme' ? 'Add Theme' : 'Add Sub-theme'}
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onOk={submitAdd}
        okText="Create"
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
          Parent: <strong>{addParent?.name}</strong> ({addParent?.code}) — {addParent?.level}
        </Typography.Paragraph>
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input placeholder="e.g., THEME-XYZ or ST-001" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order" initialValue={1}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
