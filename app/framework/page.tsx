'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, message, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  ReloadOutlined,
  PlusOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { createClient } from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

type PillarRow = {
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type ThemeRow = {
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type SubthemeRow = {
  code: string;
  theme_code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type TreeRow = {
  key: string;
  level: Level;
  code: string;
  parent_code?: string; // theme.pillar_code or subtheme.theme_code
  name: string;
  description: string | null;
  sort_order: number;
  children?: TreeRow[];
};

const COLORS: Record<Level, { bg: string; fg: string; label: string }> = {
  pillar:   { bg: '#e6f4ff', fg: '#0958d9', label: 'Pillar' },
  theme:    { bg: '#f6ffed', fg: '#237804', label: 'Theme' },
  subtheme: { bg: '#fff1f0', fg: '#a8071a', label: 'Sub-theme' },
};

export default function FrameworkPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TreeRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]); // default collapsed
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TreeRow | null>(null);
  const [form] = Form.useForm();

  // ---- fetch + build tree
  async function load() {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] = await Promise.all([
        supabase.from<PillarRow>('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from<ThemeRow>('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from<SubthemeRow>('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);
      if (pe) throw pe;
      if (te) throw te;
      if (se) throw se;

      const themeByPillar: Record<string, ThemeRow[]> = {};
      (themes ?? []).forEach(t => {
        themeByPillar[t.pillar_code] ??= [];
        themeByPillar[t.pillar_code].push(t);
      });

      const subsByTheme: Record<string, SubthemeRow[]> = {};
      (subs ?? []).forEach(s => {
        subsByTheme[s.theme_code] ??= [];
        subsByTheme[s.theme_code].push(s);
      });

      const tree: TreeRow[] = (pillars ?? []).map(p => {
        const pChildren: TreeRow[] = (themeByPillar[p.code] ?? []).map(t => {
          const tChildren: TreeRow[] = (subsByTheme[t.code] ?? []).map(s => ({
            key: `S:${s.code}`,
            level: 'subtheme',
            code: s.code,
            parent_code: s.theme_code,
            name: s.name,
            description: s.description ?? null,
            sort_order: s.sort_order ?? 1,
          }));
          return {
            key: `T:${t.code}`,
            level: 'theme',
            code: t.code,
            parent_code: t.pillar_code,
            name: t.name,
            description: t.description ?? null,
            sort_order: t.sort_order ?? 1,
            children: tChildren,
          };
        });

        return {
          key: `P:${p.code}`,
          level: 'pillar',
          code: p.code,
          name: p.name,
          description: p.description ?? null,
          sort_order: p.sort_order ?? 1,
          children: pChildren,
        };
      });

      setRows(tree);
      // keep default collapsed: do not auto-expand here
      // setExpandedRowKeys([]) already default
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  // ---- editing
  const openEdit = (rec: TreeRow) => {
    setEditing(rec);
    form.setFieldsValue({
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      const values = await form.validateFields();
      const { name, description, sort_order } = values as {
        name: string;
        description: string;
        sort_order: number;
      };

      if (!editing) return;

      if (editing.level === 'pillar') {
        const { error } = await supabase
          .from('pillars')
          .update({ name, description, sort_order } as any)
          .eq('code', editing.code);
        if (error) throw error;
      } else if (editing.level === 'theme') {
        const { error } = await supabase
          .from('themes')
          .update({ name, description, sort_order } as any)
          .eq('code', editing.code);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subthemes')
          .update({ name, description, sort_order } as any)
          .eq('code', editing.code);
        if (error) throw error;
      }

      message.success('Saved');
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      if (e?.errorFields) {
        // form validation error; do nothing
      } else {
        console.error(e);
        message.error(e?.message ?? 'Save failed');
      }
    }
  };

  // ---- columns
  const LevelTag = ({ lvl }: { lvl: Level }) => {
    const c = COLORS[lvl];
    return (
      <Tag color={c.bg} style={{ color: c.fg, borderColor: c.bg, fontWeight: 500, marginRight: 8 }}>
        {c.label}
      </Tag>
    );
  };

  const columns: ColumnsType<TreeRow> = [
    {
      title: 'Item',
      key: 'item',
      render: (_, rec) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LevelTag lvl={rec.level} />
          <span style={{ fontWeight: 500 }}>{rec.name}</span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (val: any) => <span style={{ whiteSpace: 'pre-wrap' }}>{val ?? ''}</span>,
      width: 600,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      sorter: (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, rec) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // custom expand icon (to keep tags aligned nicely)
  const expandIcon = (props: any) => {
    const { expanded, onExpand, record } = props;
    if (record.level === 'subtheme') {
      return <span style={{ width: 16, display: 'inline-block' }} />; // spacer (no icon)
    }
    return (
      <span
        onClick={(e) => onExpand(record, e)}
        style={{ cursor: 'pointer', marginRight: 6, display: 'inline-flex', alignItems: 'center' }}
      >
        {expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
      </span>
    );
  };

  // compact row style
  const rowClassName = () => 'compact-row';

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Framework editor
        </Typography.Title>
        <Button icon={<ReloadOutlined />} onClick={load}>
          Refresh
        </Button>
      </Space>

      <Table<TreeRow>
        size="small"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        expandable={{
          expandIcon,
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
          rowExpandable: (rec) => rec.level !== 'subtheme',
        }}
        rowClassName={rowClassName}
        style={{ background: 'white' }}
      />

      <style jsx global>{`
        .compact-row .ant-table-cell {
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
      `}</style>

      <Modal
        title={editing ? `Edit ${editing.level}` : 'Edit'}
        open={editOpen}
        onOk={saveEdit}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: 120 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
