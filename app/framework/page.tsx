'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { createClient } from '@supabase/supabase-js';

// ----- Minimal browser Supabase client (no dependency on your lib) -----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// -------------------- types --------------------
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
  // pillar_code may or may not exist in your schema; we don’t require it
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Level = 'pillar' | 'theme' | 'subtheme';

type NodeRow = {
  key: string;                 // e.g. "pillar:P1", "theme:T1.1", "subtheme:ST1.1.1"
  level: Level;
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
  parentKey?: string;          // for targeting/adding children
  children?: NodeRow[];
};

// Tag colors you liked previously
const levelColor: Record<Level, string> = {
  pillar: 'geekblue',
  theme: 'green',
  subtheme: 'volcano',
};

// -------------------- page --------------------
export default function FrameworkPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<NodeRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<NodeRow | null>(null);
  const [addContext, setAddContext] = useState<{ parent: NodeRow; childLevel: Level } | null>(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // -------- data load & tree build --------
  const refresh = async () => {
    try {
      setLoading(true);

      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
  await Promise.all([
    supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
    supabase.from('themes').select('*').order('sort_order', { ascending: true }),
    supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
  ]);

// (optional) keep your local types for better IntelliSense:
const pillarsRows = (pillars ?? []) as PillarRow[];
const themeRows   = (themes ?? [])  as ThemeRow[];
const subRows     = (subs ?? [])    as SubthemeRow[];

      if (pe) throw pe;
      if (te) throw te;
      if (se) throw se;

      const themeByPillar = new Map<string, ThemeRow[]>();
      (themes ?? []).forEach(t => {
        const arr = themeByPillar.get(t.pillar_code) ?? [];
        arr.push(t);
        themeByPillar.set(t.pillar_code, arr);
      });

      const subsByTheme = new Map<string, SubthemeRow[]>();
      (subs ?? []).forEach(st => {
        const arr = subsByTheme.get(st.theme_code) ?? [];
        arr.push(st);
        subsByTheme.set(st.theme_code, arr);
      });

      const tree: NodeRow[] = (pillars ?? []).map(p => {
        const pKey = `pillar:${p.code}`;
        const children: NodeRow[] = (themeByPillar.get(p.code) ?? []).map(t => {
          const tKey = `theme:${t.code}`;
          const tChildren: NodeRow[] = (subsByTheme.get(t.code) ?? []).map(su => ({
            key: `subtheme:${su.code}`,
            level: 'subtheme',
            code: su.code,
            name: su.name,
            description: su.description,
            sort_order: su.sort_order,
            parentKey: tKey,
          }));

          return {
            key: tKey,
            level: 'theme',
            code: t.code,
            name: t.name,
            description: t.description,
            sort_order: t.sort_order,
            parentKey: pKey,
            children: tChildren,
          };
        });

        return {
          key: pKey,
          level: 'pillar',
          code: p.code,
          name: p.name,
          description: p.description,
          sort_order: p.sort_order,
          children,
        };
      });

      setRows(tree);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // -------- edit handlers --------
  const onEdit = (rec: NodeRow) => {
    setEditing(rec);
    form.setFieldsValue({
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    const vals = await form.validateFields();
    try {
      setLoading(true);
      if (editing.level === 'pillar') {
        const { error } = await supabase
          .from('pillars')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          })
          .eq('code', editing.code);
        if (error) throw error;
      } else if (editing.level === 'theme') {
        const { error } = await supabase
          .from('themes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          })
          .eq('code', editing.code);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subthemes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          })
          .eq('code', editing.code);
        if (error) throw error;
      }
      message.success('Saved');
      setEditOpen(false);
      setEditing(null);
      await refresh();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  // -------- add handlers --------
  const onAddThemeUnderPillar = (pillar: NodeRow) => {
    setAddContext({ parent: pillar, childLevel: 'theme' });
    addForm.resetFields();
    setAddOpen(true);
  };

  const onAddSubthemeUnderTheme = (theme: NodeRow) => {
    setAddContext({ parent: theme, childLevel: 'subtheme' });
    addForm.resetFields();
    setAddOpen(true);
  };

  const handleAdd = async () => {
    if (!addContext) return;
    const vals = await addForm.validateFields();
    try {
      setLoading(true);
      if (addContext.childLevel === 'theme') {
        // create theme under pillar
        const pillarCode = addContext.parent.code;
        const { error } = await supabase.from('themes').insert({
          code: vals.code,
          pillar_code: pillarCode,
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
        });
        if (error) throw error;
      } else {
        // create subtheme under theme
        const themeCode = addContext.parent.code;
        const { error } = await supabase.from('subthemes').insert({
          code: vals.code,
          theme_code: themeCode,
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
        });
        if (error) throw error;
      }
      message.success('Created');
      setAddOpen(false);
      setAddContext(null);
      await refresh();
      // auto-expand parent so the new row is visible
      setExpandedRowKeys(prev =>
        prev.includes(addContext.parent.key) ? prev : [...prev, addContext.parent.key]
      );
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  // -------- delete (optional, leaves your UI design intact) --------
  const onDelete = async (rec: NodeRow) => {
    try {
      setLoading(true);
      if (rec.level === 'pillar') {
        const { error } = await supabase.from('pillars').delete().eq('code', rec.code);
        if (error) throw error;
      } else if (rec.level === 'theme') {
        const { error } = await supabase.from('themes').delete().eq('code', rec.code);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subthemes').delete().eq('code', rec.code);
        if (error) throw error;
      }
      message.success('Deleted');
      await refresh();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  // -------- columns --------
  const columns: ColumnsType<NodeRow> = useMemo(
    () => [
      {
        title: 'Type',
        dataIndex: 'level',
        width: 110,
        render: (_: any, rec) => (
          <Tag color={levelColor[rec.level]} style={{ fontWeight: 600 }}>
            {rec.level === 'pillar' ? 'Pillar' : rec.level === 'theme' ? 'Theme' : 'Sub-theme'}
          </Tag>
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        render: (_: any, rec) => (
          <Space direction="vertical" size={0} style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>{rec.name}</div>
            <div style={{ color: '#667085', fontSize: 12 }}>(code: {rec.code})</div>
          </Space>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        ellipsis: true,
        render: (val: any) => val ?? '',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 170,
        render: (_: any, rec) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(rec)}>
              Edit
            </Button>
            {rec.level === 'pillar' && (
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => onAddThemeUnderPillar(rec)}
              >
                Theme
              </Button>
            )}
            {rec.level === 'theme' && (
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => onAddSubthemeUnderTheme(rec)}
              >
                Sub-theme
              </Button>
            )}
            <Popconfirm
              title="Delete this item?"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(rec)}
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          Refresh
        </Button>
        <Button onClick={() => setExpandedRowKeys([])}>Collapse all</Button>
        <Button
          onClick={() => {
            // expand all current nodes
            const allKeys: string[] = [];
            const walk = (arr: NodeRow[]) => {
              arr.forEach(r => {
                allKeys.push(r.key);
                if (r.children?.length) walk(r.children);
              });
            };
            walk(rows);
            setExpandedRowKeys(allKeys);
          }}
        >
          Expand all
        </Button>
      </div>

      <Table<NodeRow>
        size="middle"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="key"
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as React.Key[]),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined
                onClick={e => onExpand(record, e)}
                style={{ color: '#667085', marginRight: 8 }}
              />
            ) : (
              <CaretRightOutlined
                onClick={e => onExpand(record, e)}
                style={{ color: '#667085', marginRight: 8 }}
              />
            ),
        }}
        rowClassName="tight-row"
      />

      {/* Edit modal */}
      <Modal
        title={`Edit ${editing?.level ?? ''}`}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add modal */}
      <Modal
        title={
          addContext?.childLevel === 'theme'
            ? 'Add Theme under Pillar'
            : 'Add Sub-theme under Theme'
        }
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onOk={handleAdd}
        okText="Create"
      >
        {addContext && (
          <div style={{ marginBottom: 8, color: '#475467' }}>
            Parent:{' '}
            <Tag color={levelColor[addContext.parent.level]}>{addContext.parent.level}</Tag>{' '}
            <strong>{addContext.parent.name}</strong> (code: {addContext.parent.code})
          </div>
        )}
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Enter a unique code' }]}
          >
            <Input placeholder="e.g. T2.6 or ST2.1.3" />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* tighten row height a bit */}
      <style jsx global>{`
        .tight-row .ant-table-cell {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
      `}</style>
    </div>
  );
}
