'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { createClient } from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Theme = {
  id: string;
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Subtheme = {
  id: string;
  code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Row = {
  key: string;
  level: Level;
  id: string;
  code: string;
  parent_code?: string; // pillar_code for theme, theme_code for subtheme
  name: string;
  description: string | null;
  sort_order: number | null;
  children?: Row[];
};

const levelTag = (lvl: Level) => {
  switch (lvl) {
    case 'pillar':
      return <Tag color="processing" style={{ background: 'rgb(227,244,255)', borderColor: 'rgb(179,219,255)', color: '#155e75' }}>Pillar</Tag>;
    case 'theme':
      return <Tag color="success" style={{ background: 'rgb(228,250,236)', borderColor: 'rgb(189,238,208)', color: '#166534' }}>Theme</Tag>;
    default:
      return <Tag color="error" style={{ background: 'rgb(255,235,235)', borderColor: 'rgb(255,204,204)', color: '#7f1d1d' }}>Sub-theme</Tag>;
  }
};

export default function FrameworkPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();

  // ---- Load data (pillars, themes, subthemes) and build tree ----
  const load = async () => {
    setLoading(true);
    try {
      const [pillarsRes, themesRes, subsRes] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      ]);
      if (pillarsRes.error) throw pillarsRes.error;
      if (themesRes.error) throw themesRes.error;
      if (subsRes.error) throw subsRes.error;

      const pillars = (pillarsRes.data ?? []) as Pillar[];
      const themes = (themesRes.data ?? []) as Theme[];
      const subs = (subsRes.data ?? []) as Subtheme[];

      // map themes by pillar_code
      const themesByPillar = new Map<string, Theme[]>();
      for (const t of themes) {
        const arr = themesByPillar.get(t.pillar_code) ?? [];
        arr.push(t);
        themesByPillar.set(t.pillar_code, arr);
      }

      // map subthemes by theme_code
      const subsByTheme = new Map<string, Subtheme[]>();
      for (const s of subs) {
        const arr = subsByTheme.get(s.theme_code) ?? [];
        arr.push(s);
        subsByTheme.set(s.theme_code, arr);
      }

      const tree: Row[] = pillars.map((p) => {
        const tChildren = (themesByPillar.get(p.code) ?? []).map((t) => {
          const sChildren = (subsByTheme.get(t.code) ?? []).map((s) => ({
            key: `S:${s.code}`,
            level: 'subtheme' as const,
            id: s.id,
            code: s.code,
            parent_code: s.theme_code,
            name: s.name,
            description: s.description,
            sort_order: s.sort_order,
          }));
          return {
            key: `T:${t.code}`,
            level: 'theme' as const,
            id: t.id,
            code: t.code,
            parent_code: t.pillar_code,
            name: t.name,
            description: t.description,
            sort_order: t.sort_order,
            children: sChildren,
          } as Row;
        });
        return {
          key: `P:${p.code}`,
          level: 'pillar' as const,
          id: p.id,
          code: p.code,
          name: p.name,
          description: p.description,
          sort_order: p.sort_order,
          children: tChildren,
        } as Row;
      });

      setRows(tree);
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  // ---- Editing helpers ----
  const isEditing = (record: Row) => editingKey === record.key;

  const startEdit = (record: Row) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      name: record.name,
      description: record.description ?? '',
      sort_order: record.sort_order ?? 1,
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    form.resetFields();
  };

  const saveEdit = async (record: Row) => {
    try {
      const vals = await form.validateFields();
      let err: string | null = null;

      if (record.level === 'pillar') {
        const { error } = await supabase
          .from('pillars')
          // cast to any so TS doesn’t complain about Partial/never
          .update({ name: vals.name, description: vals.description, sort_order: vals.sort_order ?? 1 } as any)
          .eq('id', record.id);
        err = error?.message ?? null;
      } else if (record.level === 'theme') {
        const { error } = await supabase
          .from('themes')
          .update({ name: vals.name, description: vals.description, sort_order: vals.sort_order ?? 1 } as any)
          .eq('id', record.id);
        err = error?.message ?? null;
      } else {
        const { error } = await supabase
          .from('subthemes')
          .update({ name: vals.name, description: vals.description, sort_order: vals.sort_order ?? 1 } as any)
          .eq('id', record.id);
        err = error?.message ?? null;
      }

      if (err) {
        message.error(err);
        return;
      }
      message.success('Saved');
      setEditingKey(null);
      form.resetFields();
      await load();
    } catch (e: any) {
      message.error(e.message || 'Save failed');
    }
  };

  const addChild = async (parent: Row) => {
    try {
      if (parent.level === 'pillar') {
        // add Theme under this Pillar
        const nextCode = `${parent.code}.${((parent.children?.length ?? 0) + 1)}`;
        const payload = {
          code: nextCode,
          pillar_code: parent.code,
          name: 'New Theme',
          description: '',
          sort_order: (parent.children?.length ?? 0) + 1,
        };
        const { error } = await supabase.from('themes').insert(payload as any);
        if (error) throw error;
      } else if (parent.level === 'theme') {
        // add Sub-theme under this Theme
        const nextCode = `${parent.code}.${((parent.children?.length ?? 0) + 1)}`;
        const payload = {
          code: nextCode,
          theme_code: parent.code,
          name: 'New Sub-theme',
          description: '',
          sort_order: (parent.children?.length ?? 0) + 1,
        };
        const { error } = await supabase.from('subthemes').insert(payload as any);
        if (error) throw error;
      } else {
        message.info('Sub-themes cannot have children.');
        return;
      }
      message.success('Added');
      await load();
      setExpandedRowKeys((prev) => Array.from(new Set([...prev, parent.key])));
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Add failed');
    }
  };

  const addPillar = async () => {
    try {
      const nextIdx = (rows?.length ?? 0) + 1;
      const payload = {
        code: `${nextIdx}`,
        name: 'New Pillar',
        description: '',
        sort_order: nextIdx,
      };
      const { error } = await supabase.from('pillars').insert(payload as any);
      if (error) throw error;
      message.success('Pillar added');
      await load();
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Add failed');
    }
  };

  const deleteRow = async (record: Row) => {
    try {
      if (record.level === 'pillar') {
        const { error } = await supabase.from('pillars').delete().eq('id', record.id);
        if (error) throw error;
      } else if (record.level === 'theme') {
        const { error } = await supabase.from('themes').delete().eq('id', record.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subthemes').delete().eq('id', record.id);
        if (error) throw error;
      }
      message.success('Deleted');
      await load();
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Delete failed');
    }
  };

  // ---- Flatten tree for controlled expansion keys check (keep stable keys) ----
  const allKeys = useMemo(() => {
    const k: string[] = [];
    const walk = (arr: Row[]) => {
      for (const r of arr) {
        k.push(r.key);
        if (r.children?.length) walk(r.children);
      }
    };
    walk(rows);
    return new Set(k);
  }, [rows]);

  // Remove any stale expanded keys when data reloads
  useEffect(() => {
    setExpandedRowKeys((prev) => prev.filter((k) => allKeys.has(String(k))));
  }, [allKeys]);

  // ---- Columns ----
  const columns: ColumnsType<Row> = [
    {
      title: '',
      dataIndex: 'level',
      width: 110,
      render: (_, rec) => levelTag(rec.level),
    },
    {
      title: 'Label',
      dataIndex: 'name',
      ellipsis: true,
      render: (_, rec) =>
        isEditing(rec) ? (
          <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input size="small" />
          </Form.Item>
        ) : (
          <span>{rec.name}</span>
        ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
      render: (_, rec) =>
        isEditing(rec) ? (
          <Form.Item name="description" style={{ margin: 0 }}>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} />
          </Form.Item>
        ) : (
          <span style={{ opacity: 0.9 }}>{rec.description}</span>
        ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      width: 90,
      align: 'center',
      render: (_, rec) =>
        isEditing(rec) ? (
          <Form.Item name="sort_order" style={{ margin: 0 }} rules={[{ type: 'number', min: 0 }]}>
            <InputNumber size="small" style={{ width: 70 }} />
          </Form.Item>
        ) : (
          <span>{rec.sort_order ?? ''}</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, rec) => {
        const editing = isEditing(rec);
        return (
          <Space size="small" wrap>
            {!editing && (
              <Button size="small" icon={<EditOutlined />} onClick={() => startEdit(rec)}>
                Edit
              </Button>
            )}
            {editing && (
              <>
                <Button size="small" type="primary" icon={<SaveOutlined />} onClick={() => saveEdit(rec)}>
                  Save
                </Button>
                <Button size="small" icon={<CloseOutlined />} onClick={cancelEdit}>
                  Cancel
                </Button>
              </>
            )}
            {!editing && (
              <Button size="small" icon={<PlusOutlined />} onClick={() => addChild(rec)} disabled={rec.level === 'subtheme'}>
                Add child
              </Button>
            )}
            {!editing && (
              <Popconfirm title="Delete this row?" onConfirm={() => deleteRow(rec)}>
                <Button size="small" danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Framework Editor</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={addPillar}>
            Add Pillar
          </Button>
          <Button onClick={() => setExpandedRowKeys([])}>Collapse all</Button>
          <Button onClick={() => setExpandedRowKeys(Array.from(allKeys))}>Expand all</Button>
        </Space>
      </div>

      <Form form={form} component={false}>
        <Table<Row>
          size="small"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={false}
          rowKey="key"
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, rec) => {
              setExpandedRowKeys((prev) => {
                const key = rec.key;
                if (expanded) return Array.from(new Set([...prev, key]));
                return prev.filter((k) => k !== key);
              });
            },
            expandIcon: ({ expanded, onExpand, record }) => (
              <span
                onClick={(e) => onExpand(record as any, e)}
                style={{ cursor: 'pointer', paddingRight: 6, display: 'inline-flex', alignItems: 'center' }}
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {record.children && record.children.length > 0 ? (
                  expanded ? <DownOutlined /> : <RightOutlined />
                ) : (
                  <span style={{ width: 12, display: 'inline-block' }} />
                )}
              </span>
            ),
            indentSize: 16,
          }}
          rowClassName={(rec) => {
            if (rec.level === 'pillar') return 'row-pillar';
            if (rec.level === 'theme') return 'row-theme';
            return 'row-sub';
          }}
        />
      </Form>

      {/* Subtle row tinting */}
      <style jsx global>{`
        .row-pillar td {
          background: #f8fbff !important;
        }
        .row-theme td {
          background: #f8fff9 !important;
        }
        .row-sub td {
          background: #fff8f8 !important;
        }
        /* tighten row height a bit */
        .ant-table .ant-table-tbody > tr > td {
          padding-top: 6px;
          padding-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
