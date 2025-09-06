// /app/framework/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Table, Tag, Button, Space, Form, Input, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { getBrowserClient } from '@/lib/supabaseClient';

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
  name: string;
  description: string | null;
  sort_order: number | null;
  pillar_id: string;
};

type SubthemeRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
  theme_id: string;
};

type UIRow = {
  key: string;           // e.g. P:<id>, T:<id>, S:<id>
  level: Level;
  id: string;
  parentId?: string;     // pillar_id for themes, theme_id for subthemes
  code: string;
  name: string;
  description: string;
  sort_order: number;
  children?: UIRow[];
};

const TYPE_COLOR: Record<Level, string> = {
  pillar: 'geekblue',
  theme: 'green',
  subtheme: 'red',
};

const typeTag = (lvl: Level, code?: string) => (
  <Space size={6} style={{ alignItems: 'center' }}>
    <Tag color={TYPE_COLOR[lvl]} style={{ marginRight: 4 }}>{lvl}</Tag>
    {code ? <span style={{ color: '#999', fontSize: 12 }}>[{code}]</span> : null}
  </Space>
);

function caretIcon(expanded: boolean) {
  const style = { fontSize: 14 }; // slightly larger caret per your request
  return expanded ? <CaretDownOutlined style={style} /> : <CaretRightOutlined style={style} />;
}

export default function PrimaryFrameworkEditorPage() {
  // Create supabase only in the browser:
  const supabase = useMemo(() => getBrowserClient(), []);

  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<UIRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm<Partial<UIRow>>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UIRow | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe) throw pe;
      if (te) throw te;
      if (se) throw se;

      const pillarsById = new Map<string, PillarRow>();
      (pillars || []).forEach((p) => pillarsById.set(p.id, p));

      const themesByPillar = new Map<string, ThemeRow[]>();
      (themes || []).forEach((t) => {
        const list = themesByPillar.get(t.pillar_id) || [];
        list.push(t);
        themesByPillar.set(t.pillar_id, list);
      });

      const subsByTheme = new Map<string, SubthemeRow[]>();
      (subs || []).forEach((s) => {
        const list = subsByTheme.get(s.theme_id) || [];
        list.push(s);
        subsByTheme.set(s.theme_id, list);
      });

      // Build UIRow tree
      const asUI = (p: PillarRow): UIRow => ({
        key: `P:${p.id}`,
        level: 'pillar',
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description || '',
        sort_order: p.sort_order ?? 1,
        children: (themesByPillar.get(p.id) || []).map((t) => ({
          key: `T:${t.id}`,
          level: 'theme',
          id: t.id,
          parentId: t.pillar_id,
          code: t.code,
          name: t.name,
          description: t.description || '',
          sort_order: t.sort_order ?? 1,
          children: (subsByTheme.get(t.id) || []).map((s) => ({
            key: `S:${s.id}`,
            level: 'subtheme',
            id: s.id,
            parentId: s.theme_id,
            code: s.code,
            name: s.name,
            description: s.description || '',
            sort_order: s.sort_order ?? 1,
            // no children for subthemes
          })),
        })),
      });

      const treeData = (pillars || []).map(asUI);
      setTree(treeData);

      // auto-expand only top-level by default
      setExpandedKeys(treeData.map((p) => p.key));
    } catch (err: any) {
      console.error(err);
      message.error(err?.message ?? 'Failed to load framework.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = (parent?: UIRow) => {
    setEditTarget(null);
    if (!parent) {
      // new pillar
      form.setFieldsValue({ level: 'pillar', sort_order: 1 });
    } else if (parent.level === 'pillar') {
      form.setFieldsValue({ level: 'theme', sort_order: 1 });
    } else if (parent.level === 'theme') {
      form.setFieldsValue({ level: 'subtheme', sort_order: 1 });
    }
    setModalOpen(true);
  };

  const openEdit = (row: UIRow) => {
    setEditTarget(row);
    form.setFieldsValue({
      level: row.level,
      name: row.name,
      description: row.description,
      sort_order: row.sort_order,
      code: row.code,
    });
    setModalOpen(true);
  };

  const handleDelete = async (row: UIRow) => {
    Modal.confirm({
      title: `Delete ${row.level}?`,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          if (row.level === 'pillar') {
            await supabase.from('pillars').delete().eq('id', row.id);
          } else if (row.level === 'theme') {
            await supabase.from('themes').delete().eq('id', row.id);
          } else {
            await supabase.from('subthemes').delete().eq('id', row.id);
          }
          await fetchAll();
          message.success('Deleted.');
        } catch (e: any) {
          console.error(e);
          message.error(e?.message ?? 'Delete failed.');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submitModal = async () => {
    const vals = await form.validateFields();
    const level = vals.level as Level;

    setLoading(true);
    try {
      if (editTarget) {
        // UPDATE
        if (level === 'pillar') {
          await supabase.from('pillars').update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
            code: vals.code ?? '',
          }).eq('id', editTarget.id);
        } else if (level === 'theme') {
          await supabase.from('themes').update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
            code: vals.code ?? '',
          }).eq('id', editTarget.id);
        } else {
          await supabase.from('subthemes').update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
            code: vals.code ?? '',
          }).eq('id', editTarget.id);
        }
        message.success('Saved changes.');
      } else {
        // CREATE
        if (level === 'pillar') {
          await supabase.from('pillars').insert({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
            code: vals.code ?? '',
          });
        } else if (level === 'theme') {
          // Need a pillar to attach to
          const firstPillar = tree[0];
          if (!firstPillar) throw new Error('No pillar available to attach the theme. Create a pillar first.');
          await supabase.from('themes').insert({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
            pillar_id: firstPillar.id,
            code: vals.code ?? '',
          });
        } else {
          // Need a theme to attach to
          const someTheme = tree.flatMap(p => p.children || [])[0];
          if (!someTheme) throw new Error('No theme available to attach the subtheme. Create a theme under a pillar first.');
          await supabase.from('subthemes').insert({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
            theme_id: someTheme.id,
            code: vals.code ?? '',
          });
        }
        message.success('Created.');
      }

      setModalOpen(false);
      setEditTarget(null);
      form.resetFields();
      await fetchAll();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  // Columns — preserve your look-and-feel, with requested tweaks:
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: '16%',
      render: (_: any, rec) => typeTag(rec.level, rec.code),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '34%',
      render: (v: string) => v || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort',
      width: '8%',
      render: (v: number) => v ?? '',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, rec) => (
        <Space size="small">
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(rec)}>Edit</Button>
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(rec)}>Delete</Button>
          {rec.level !== 'subtheme' && (
            <Button icon={<PlusOutlined />} size="small" onClick={() => openCreate(rec)}>
              Add {rec.level === 'pillar' ? 'Theme' : 'Subtheme'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <ArrowLeftOutlined /> <span style={{ marginLeft: 6 }}>Dashboard</span>
        </Link>
      </div>

      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Primary Framework Editor</h2>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate()}>
            Add Pillar
          </Button>
          <Button onClick={fetchAll}>Reload</Button>
        </Space>
      </div>

      <Table<UIRow>
        loading={loading}
        columns={columns}
        dataSource={tree}
        rowKey={(rec) => rec.key}
        pagination={false}
        expandable={{
          // subthemes have no children -> no caret for subthemes
          expandIcon: ({ expanded, onExpand, record }) => {
            if (!record.children || record.children.length === 0) {
              return <span style={{ display: 'inline-block', width: 18 }} />; // align without caret
            }
            return (
              <a onClick={(e) => onExpand(record, e)} style={{ marginRight: 6 }}>
                {caretIcon(expanded)}
              </a>
            );
          },
        }}
        onExpand={(exp, rec) => {
          setExpandedKeys((prev) => {
            const key = rec.key;
            return exp ? Array.from(new Set([...prev, key])) : prev.filter((k) => k !== key);
          });
        }}
        expandedRowKeys={expandedKeys}
        size="middle" // tighter rows
      />

      <Modal
        title={editTarget ? `Edit ${editTarget.level}` : 'Create'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditTarget(null); form.resetFields(); }}
        onOk={submitModal}
        okText={editTarget ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="level" label="Type" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="code" label="Code" tooltip="Short code like P1, T1.2, etc.">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort Order">
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
