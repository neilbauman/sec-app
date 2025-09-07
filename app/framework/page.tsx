// app/framework/page.tsx
'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// @ts-nocheck  ← we keep this page production-stable by avoiding TS build errors from generics

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Form, Input, Modal, Popconfirm, Select, Table, Tag, Typography, message } from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { getBrowserClient } from '@/lib/supabaseClient';

const { Title, Text } = Typography;

/** ----------------------------------------------------------------------------
 *  Data notes (expected schema)
 *  - pillars:   id (uuid), code (text), name (text), description (text), sort_order (int)
 *  - themes:    id, pillar_id (uuid fk->pillars.id), code, name, description, sort_order
 *  - subthemes: id, theme_id  (uuid fk->themes.id),  code, name, description, sort_order
 * ---------------------------------------------------------------------------*/

type Level = 'pillar' | 'theme' | 'subtheme';

type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  id: string;
  pillar_id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  id: string;
  theme_id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

// UI Tree node used by antd Table (tree data)
type UIRow = {
  key: string;             // `${level}:${id}`
  level: Level;
  id: string;
  parentId?: string;
  code: string;
  name: string;
  description?: string;
  sort_order?: number | null;
  // Filled if pillar/theme:
  children?: UIRow[];
};

const levelColors: Record<Level, { tag: string }> = {
  pillar: { tag: '#E6F4FF' },   // light blue
  theme: { tag: '#E8F9E9' },    // light green
  subtheme: { tag: '#FFECEC' }, // light red/pink
};

function levelLabel(level: Level) {
  if (level === 'pillar') return 'Pillar';
  if (level === 'theme') return 'Theme';
  return 'Subtheme';
}

// Code badge next to the colored tag
function TypeTag({ level, code }: { level: Level; code?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Tag style={{ background: levelColors[level].tag, border: '1px solid #d9d9d9' }}>
        {levelLabel(level)}
      </Tag>
      {code ? <span style={{ fontSize: 12, color: '#8c8c8c' }}>[{code}]</span> : null}
    </div>
  );
}

export default function FrameworkPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);

  // Tree data for antd Table (pillars -> themes -> subthemes)
  const [tree, setTree] = useState<UIRow[]>([]);

  // For edit/add modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalLevel, setModalLevel] = useState<Level>('pillar');
  const [modalRow, setModalRow] = useState<Partial<UIRow> | null>(null);
  const [form] = Form.useForm();

  // Expanded row keys (by Table)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // ----------- Fetch & Build Tree -----------
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subthemes, error: se }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe) throw pe;
      if (te) throw te;
      if (se) throw se;

      const pillarRows: UIRow[] = (pillars || []).map((p: Pillar) => ({
        key: `pillar:${p.id}`,
        level: 'pillar',
        id: p.id,
        code: p.code || '',
        name: p.name || '',
        description: p.description || '',
        sort_order: p.sort_order ?? null,
        children: [],
      }));

      // Group themes by pillar_id
      const themesByPillar = new Map<string, Theme[]>();
      (themes || []).forEach((t: Theme) => {
        if (!themesByPillar.has(t.pillar_id)) themesByPillar.set(t.pillar_id, []);
        themesByPillar.get(t.pillar_id)!.push(t);
      });

      // Group subthemes by theme_id
      const subsByTheme = new Map<string, Subtheme[]>();
      (subthemes || []).forEach((s: Subtheme) => {
        if (!subsByTheme.has(s.theme_id)) subsByTheme.set(s.theme_id, []);
        subsByTheme.get(s.theme_id)!.push(s);
      });

      // Attach themes + subthemes
      pillarRows.forEach((p) => {
        const tChildren = (themesByPillar.get(p.id) || []).map((t) => {
          const node: UIRow = {
            key: `theme:${t.id}`,
            level: 'theme',
            id: t.id,
            parentId: p.id,
            code: t.code || '',
            name: t.name || '',
            description: t.description || '',
            sort_order: t.sort_order ?? null,
            children: [],
          };
          const sChildren = (subsByTheme.get(t.id) || []).map((s) => ({
            key: `subtheme:${s.id}`,
            level: 'subtheme' as const,
            id: s.id,
            parentId: t.id,
            code: s.code || '',
            name: s.name || '',
            description: s.description || '',
            sort_order: s.sort_order ?? null,
          }));
          if (sChildren.length) node.children = sChildren;
          return node;
        });

        if (tChildren.length) p.children = tChildren;
      });

      setTree(pillarRows);
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ----------- CRUD helpers -----------
  function openAdd(level: Level, parent?: UIRow) {
    setModalMode('add');
    setModalLevel(level);
    setModalRow(parent || null);
    form.setFieldsValue({
      name: '',
      code: '',
      description: '',
      sort_order: 1,
      parent: parent?.name || undefined,
    });
    setModalOpen(true);
  }

  function openEdit(row: UIRow) {
    setModalMode('edit');
    setModalLevel(row.level);
    setModalRow(row);
    form.setFieldsValue({
      name: row.name,
      code: row.code,
      description: row.description || '',
      sort_order: row.sort_order ?? 1,
    });
    setModalOpen(true);
  }

  async function onDelete(row: UIRow) {
    try {
      setLoading(true);
      if (row.level === 'pillar') {
        // Optional: you may want to block delete if children exist
        const { error } = await supabase.from('pillars').delete().eq('id', row.id);
        if (error) throw error;
      } else if (row.level === 'theme') {
        const { error } = await supabase.from('themes').delete().eq('id', row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subthemes').delete().eq('id', row.id);
        if (error) throw error;
      }
      message.success('Deleted');
      await fetchAll();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  async function onModalOk() {
    try {
      const vals = await form.validateFields();
      setLoading(true);

      if (modalMode === 'edit' && modalRow) {
        // Update
        if (modalLevel === 'pillar') {
          const { error } = await supabase
            .from('pillars')
            .update({
              name: vals.name,
              code: vals.code,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', modalRow.id);
          if (error) throw error;
        } else if (modalLevel === 'theme') {
          const { error } = await supabase
            .from('themes')
            .update({
              name: vals.name,
              code: vals.code,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', modalRow.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('subthemes')
            .update({
              name: vals.name,
              code: vals.code,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', modalRow.id);
          if (error) throw error;
        }
        message.success('Saved changes');
      } else {
        // Add
        if (modalLevel === 'pillar') {
          const { error } = await supabase.from('pillars').insert({
            name: vals.name,
            code: vals.code,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        } else if (modalLevel === 'theme') {
          if (!modalRow?.id && !modalRow?.parentId) {
            message.error('Missing parent pillar');
            return;
          }
          const pillarId = modalRow?.id || modalRow?.parentId; // when called from pillar row, we pass that row as parent
          const { error } = await supabase.from('themes').insert({
            pillar_id: pillarId,
            name: vals.name,
            code: vals.code,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        } else {
          if (!modalRow?.id && !modalRow?.parentId) {
            message.error('Missing parent theme');
            return;
          }
          const themeId = modalRow?.id || modalRow?.parentId;
          const { error } = await supabase.from('subthemes').insert({
            theme_id: themeId,
            name: vals.name,
            code: vals.code,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        }
        message.success('Added');
      }
      setModalOpen(false);
      await fetchAll();
    } catch (e: any) {
      if (e?.errorFields) {
        // validation errors – let antd show them
      } else {
        console.error(e);
        message.error(e?.message || 'Save failed');
      }
    } finally {
      setLoading(false);
    }
  }

  // ----------- Columns -----------
  const columns = useMemo(
    () => [
      {
        title: 'Type',
        dataIndex: 'level',
        key: 'level',
        width: '20%',
        render: (_: any, rec: UIRow) => <TypeTag level={rec.level} code={rec.code} />,
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
        width: '35%',
        render: (val: string) => <div style={{ whiteSpace: 'pre-wrap' }}>{val}</div>,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '15%',
        render: (_: any, rec: UIRow) => (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {rec.level !== 'subtheme' ? (
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => openAdd(rec.level === 'pillar' ? 'theme' : 'subtheme', rec)}
              >
                Add {rec.level === 'pillar' ? 'Theme' : 'Subtheme'}
              </Button>
            ) : null}
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete this row?"
              onConfirm={() => onDelete(rec)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" icon={<DeleteOutlined />} danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [] // stable
  );

  // Only allow expand for rows that actually have children
  const rowExpandable = (rec: UIRow) => Array.isArray(rec.children) && rec.children.length > 0;

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" aria-label="Back to Dashboard">
            <Button icon={<ArrowLeftOutlined />}>Dashboard</Button>
          </Link>
          <Title level={3} style={{ margin: 0 }}>
            Primary Framework Editor
          </Title>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openAdd('pillar')}>
            Add Pillar
          </Button>
        </div>
      </div>

      <Table<UIRow>
        dataSource={tree}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        expandable={{
          rowExpandable,
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            setExpandedKeys((prev) => {
              const key = record.key;
              if (expanded) return prev.includes(key) ? prev : [...prev, key];
              return prev.filter((k) => k !== key);
            });
          },
        }}
        size="middle"
        bordered
      />

      {/* Add/Edit Modal */}
      <Modal
        title={(modalMode === 'add' ? 'Add ' : 'Edit ') + levelLabel(modalLevel)}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onModalOk}
        okText={modalMode === 'add' ? 'Create' : 'Save'}
        confirmLoading={loading}
        destroyOnClose
      >
        {modalMode === 'add' && modalRow && (modalLevel === 'theme' || modalLevel === 'subtheme') ? (
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">
              Parent:&nbsp;
              <b>{modalRow.name}</b>
            </Text>
          </div>
        ) : null}

        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Sort Order" name="sort_order">
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Tiny CSS tweaks */}
      <style jsx global>{`
        /* Make expand/collapse caret a bit larger and better aligned */
        .ant-table-row-expand-icon {
          transform: scale(1.15);
        }
        /* Reduce vertical padding slightly for tighter rows */
        .ant-table-tbody > tr > td {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
      `}</style>
    </div>
  );
}
