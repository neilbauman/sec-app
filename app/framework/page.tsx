'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table,
  Typography,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  App,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

// IMPORTANT: this matches the client helper we standardized earlier
// lib/supabaseClient.ts should export default getBrowserClient()
import getBrowserClient from '@/lib/supabaseClient';

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
  pillar_id: string;   // NOTE: we use *_id foreign keys in the UI (schema is already deployed)
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type SubthemeRow = {
  id: string;
  theme_id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type UIRow = {
  key: string;
  level: Level;
  id: string;
  parent_id: string | null;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  children?: UIRow[];
};

const levelMeta: Record<
  Level,
  { color: string; label: string }
> = {
  pillar:   { color: '#e6f4ff', label: 'Pillar'    }, // light blue
  theme:    { color: '#e9fbe6', label: 'Theme'     }, // light green
  subtheme: { color: '#fdecec', label: 'Sub-theme' }, // light red
};

export default function FrameworkPage() {
  const { message, modal } = App.useApp?.() ?? { message: { success: () => {}, error: () => {}, warning: () => {} }, modal: Modal };
  const supabase = getBrowserClient();

  const [rows, setRows] = useState<UIRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Form / editing
  const [form] = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [createContext, setCreateContext] = useState<{ parent?: UIRow | null; level?: Level } | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
        await Promise.all([
          supabase.from<PillarRow>('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from<ThemeRow>('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from<SubthemeRow>('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe || te || se) {
        throw new Error(pe?.message || te?.message || se?.message || 'Load error');
      }

      const byPillar: Record<string, UIRow[]> = {};
      (themes ?? []).forEach(t => {
        const node: UIRow = {
          key: `t:${t.id}`,
          id: t.id,
          parent_id: t.pillar_id,
          level: 'theme',
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? 0,
          children: [],
        };
        if (!byPillar[t.pillar_id]) byPillar[t.pillar_id] = [];
        byPillar[t.pillar_id].push(node);
      });

      const byTheme: Record<string, UIRow[]> = {};
      (subs ?? []).forEach(s => {
        const node: UIRow = {
          key: `s:${s.id}`,
          id: s.id,
          parent_id: s.theme_id,
          level: 'subtheme',
          code: s.code,
          name: s.name,
          description: s.description ?? '',
          sort_order: s.sort_order ?? 0,
        };
        if (!byTheme[s.theme_id]) byTheme[s.theme_id] = [];
        byTheme[s.theme_id].push(node);
      });

      // attach subthemes under their themes (if any)
      Object.values(byPillar).forEach(themeNodes => {
        themeNodes.forEach(t => {
          t.children = (byTheme[t.id] ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        });
      });

      const tree: UIRow[] = (pillars ?? []).map(p => ({
        key: `p:${p.id}`,
        id: p.id,
        parent_id: null,
        level: 'pillar',
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? 0,
        children: (byPillar[p.id] ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      }));

      setRows(tree.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    } catch (err: any) {
      console.error(err);
      message.error?.(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [supabase, message]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ---------- Helpers ----------
  const openCreate = (level: Level, parent?: UIRow | null) => {
    setCreateContext({ level, parent: parent ?? null });
    setEditing(null);
    form.setFieldsValue({
      name: '',
      description: '',
      sort_order: 1,
      code: '',
    });
    setEditOpen(true);
  };

  const openEdit = (rec: UIRow) => {
    setCreateContext(null);
    setEditing(rec);
    form.setFieldsValue({
      name: rec.name,
      description: rec.description,
      sort_order: rec.sort_order ?? 1,
      code: rec.code,
    });
    setEditOpen(true);
  };

  const removeRow = async (rec: UIRow) => {
    const doDelete = async () => {
      let errorMsg: string | null = null;
      if (rec.level === 'pillar') {
        const { error } = await supabase.from('pillars').delete().eq('id', rec.id);
        errorMsg = error?.message ?? null;
      } else if (rec.level === 'theme') {
        const { error } = await supabase.from('themes').delete().eq('id', rec.id);
        errorMsg = error?.message ?? null;
      } else {
        const { error } = await supabase.from('subthemes').delete().eq('id', rec.id);
        errorMsg = error?.message ?? null;
      }
      if (errorMsg) {
        message.error?.(errorMsg);
      } else {
        message.success?.('Deleted');
        fetchAll();
      }
    };

    Modal.confirm({
      title: `Delete this ${rec.level}?`,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: doDelete,
    });
  };

  const saveForm = async () => {
    const vals = await form.validateFields();
    let errorMsg: string | null = null;

    if (editing) {
      // update
      if (editing.level === 'pillar') {
        const { error } = await supabase
          .from('pillars')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            code: vals.code,
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', editing.id);
        errorMsg = error?.message ?? null;
      } else if (editing.level === 'theme') {
        const { error } = await supabase
          .from('themes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            code: vals.code,
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', editing.id);
        errorMsg = error?.message ?? null;
      } else {
        const { error } = await supabase
          .from('subthemes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            code: vals.code,
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', editing.id);
        errorMsg = error?.message ?? null;
      }
    } else if (createContext?.level) {
      // create
      if (createContext.level === 'pillar') {
        const { error } = await supabase.from('pillars').insert({
          name: vals.name,
          description: vals.description ?? '',
          code: vals.code,
          sort_order: vals.sort_order ?? 1,
        } as any);
        errorMsg = error?.message ?? null;
      } else if (createContext.level === 'theme') {
        if (!createContext.parent) {
          errorMsg = 'Missing parent pillar for theme';
        } else {
          const { error } = await supabase.from('themes').insert({
            pillar_id: createContext.parent.id,
            name: vals.name,
            description: vals.description ?? '',
            code: vals.code,
            sort_order: vals.sort_order ?? 1,
          } as any);
          errorMsg = error?.message ?? null;
        }
      } else {
        if (!createContext.parent) {
          errorMsg = 'Missing parent theme for sub-theme';
        } else {
          const { error } = await supabase.from('subthemes').insert({
            theme_id: createContext.parent.id,
            name: vals.name,
            description: vals.description ?? '',
            code: vals.code,
            sort_order: vals.sort_order ?? 1,
          } as any);
          errorMsg = error?.message ?? null;
        }
      }
    }

    if (errorMsg) {
      message.error?.(errorMsg);
    } else {
      setEditOpen(false);
      setEditing(null);
      setCreateContext(null);
      message.success?.('Saved');
      fetchAll();
    }
  };

  const flatData = useMemo(() => rows, [rows]);

  // ---------- Columns ----------
  const columns: ColumnsType<UIRow> = [
    {
      title: (
        <Space align="center" style={{ fontWeight: 600 }}>
          <Button
            type="link"
            href="/"
            icon={<ArrowLeftOutlined />}
            style={{ paddingInline: 0 }}
          >
            Back to Dashboard
          </Button>
          <span style={{ marginLeft: 12 }}>Framework Editor</span>
        </Space>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 520,
      render: (_: any, rec) => {
        const meta = levelMeta[rec.level];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Type Tag + code (small grey), kept inline to the RIGHT of the caret since AntD renders caret before this cell */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  background: meta.color,
                  border: '1px solid rgba(0,0,0,0.08)',
                  padding: '1px 8px',
                  borderRadius: 999,
                  fontSize: 12,
                  lineHeight: '18px',
                }}
              >
                {meta.label}
              </span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>{rec.code}</span>
            </span>

            {/* Name */}
            <span style={{ fontSize: 14, fontWeight: 600 }}>{rec.name}</span>

            {/* Description to the RIGHT of Name (as requested) */}
            {rec.description ? (
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 13,
                  color: '#595959',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 420,
                }}
                title={rec.description}
              >
                {rec.description}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Sort order',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 120,
      sorter: (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      render: (v: any) => <span>{v ?? ''}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_: any, rec) => {
        const canAddChild = rec.level !== 'subtheme';
        const nextLevel: Level = rec.level === 'pillar' ? 'theme' : 'subtheme';
        return (
          <Space size="small">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(rec)}
            >
              Edit
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeRow(rec)}
            >
              Delete
            </Button>
            {canAddChild && (
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openCreate(nextLevel, rec)}
              >
                Add {nextLevel === 'theme' ? 'Theme' : 'Sub-theme'}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 12,
          gap: 8,
        }}
      >
        <Button href="/" icon={<ArrowLeftOutlined />}>
          Back to Dashboard
        </Button>
        <Typography.Title
          level={4}
          style={{ margin: 0, fontWeight: 700, letterSpacing: 0.2 }}
        >
          Framework Editor
        </Typography.Title>
        <Space style={{ marginLeft: 'auto' }}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => openCreate('pillar', null)}
          >
            Add Pillar
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>
            Refresh
          </Button>
        </Space>
      </div>

      <Table<UIRow>
        dataSource={flatData}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        size="small"
        // tighten up vertical density as requested
        style={{ background: 'white' }}
        expandable={{
          defaultExpandAllRows: false,
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys([...(keys as string[])]),
        }}
      />

      <Modal
        title={
          editing
            ? `Edit ${levelMeta[editing.level].label}`
            : createContext?.level
            ? `Add ${levelMeta[createContext.level].label}${
                createContext?.parent ? ` under ${createContext.parent.name}` : ''
              }`
            : 'Edit'
        }
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
          setCreateContext(null);
        }}
        onOk={saveForm}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ sort_order: 1 }}
          preserve={false}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please enter a unique code' }]}
          >
            <Input placeholder="e.g., P1, T1.2, ST1.2.3" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Short description"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order">
            <InputNumber min={0} style={{ width: 120 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
