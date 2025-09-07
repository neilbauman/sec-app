// app/framework/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Table, Tag, Button, Space, Input, Modal, Form, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { getBrowserClient } from '@/lib/supabaseClient';
import './styles.css'; // optional, see note below

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
  pillar_id: string;
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
  key: string; // `${level}:${id}`
  level: Level;
  id: string;
  parentId?: string; // pillar_id for themes, theme_id for subthemes
  code: string;
  name: string;
  description: string;
  sort_order: number;
  children?: UIRow[];
};

const TYPE_COLORS: Record<Level, string> = {
  pillar: 'blue',
  theme: 'green',
  subtheme: 'red',
};

function levelToTable(level: Level): 'pillars' | 'themes' | 'subthemes' {
  if (level === 'pillar') return 'pillars';
  if (level === 'theme') return 'themes';
  return 'subthemes';
}

export default function FrameworkEditorPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UIRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<Partial<UIRow>>();

  // --------- fetch all ----------
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

      const pillarsSafe = (pillars || []) as PillarRow[];
      const themesSafe = (themes || []) as ThemeRow[];
      const subsSafe = (subs || []) as SubthemeRow[];

      // build maps
      const tByPillar = new Map<string, UIRow[]>();
      const sByTheme = new Map<string, UIRow[]>();

      for (const th of themesSafe) {
        const ui: UIRow = {
          key: `theme:${th.id}`,
          id: th.id,
          parentId: th.pillar_id,
          level: 'theme',
          code: th.code || '',
          name: th.name || '',
          description: th.description || '',
          sort_order: th.sort_order ?? 1,
          children: [], // will fill with subthemes
        };
        if (!tByPillar.has(th.pillar_id)) tByPillar.set(th.pillar_id, []);
        tByPillar.get(th.pillar_id)!.push(ui);
      }

      for (const st of subsSafe) {
        const ui: UIRow = {
          key: `subtheme:${st.id}`,
          id: st.id,
          parentId: st.theme_id,
          level: 'subtheme',
          code: st.code || '',
          name: st.name || '',
          description: st.description || '',
          sort_order: st.sort_order ?? 1,
        };
        if (!sByTheme.has(st.theme_id)) sByTheme.set(st.theme_id, []);
        sByTheme.get(st.theme_id)!.push(ui);
      }

      // attach subthemes to themes
      for (const [, list] of tByPillar) {
        for (const th of list) {
          th.children = (sByTheme.get(th.id) || []).sort((a, b) => a.sort_order - b.sort_order);
        }
      }

      // top-level pillars with nested themes
      const tree: UIRow[] = pillarsSafe.map((p) => ({
        key: `pillar:${p.id}`,
        id: p.id,
        level: 'pillar',
        code: p.code || '',
        name: p.name || '',
        description: p.description || '',
        sort_order: p.sort_order ?? 1,
        children: (tByPillar.get(p.id) || []).sort((a, b) => a.sort_order - b.sort_order),
      }));

      // sort pillars
      tree.sort((a, b) => a.sort_order - b.sort_order);
      setData(tree);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // --------- helpers ----------
  const openEdit = (row: UIRow) => {
    setEditing(row);
    form.setFieldsValue({
      name: row.name,
      description: row.description,
      code: row.code,
      sort_order: row.sort_order,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const saveEdit = async () => {
    try {
      const vals = await form.validateFields();
      if (!editing) return;
      const table = levelToTable(editing.level);
      const patch: any = {
        name: vals.name ?? '',
        description: vals.description ?? '',
        code: vals.code ?? '',
        sort_order: Number(vals.sort_order ?? editing.sort_order ?? 1),
      };
      const { error } = await supabase.from(table).update(patch).eq('id', editing.id);
      if (error) throw error;
      message.success('Saved');
      closeModal();
      fetchAll();
    } catch (err: any) {
      if (err?.errorFields) return; // form validation error, already shown
      console.error(err);
      message.error(err?.message || 'Failed to save');
    }
  };

  const deleteRow = async (row: UIRow) => {
    try {
      const table = levelToTable(row.level);
      // If deleting a pillar or theme, you may want to enforce cascade in DB or block when children exist.
      const { error } = await supabase.from(table).delete().eq('id', row.id);
      if (error) throw error;
      message.success('Deleted');
      fetchAll();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Failed to delete');
    }
  };

  const addChild = async (parent: UIRow) => {
    try {
      if (parent.level === 'subtheme') {
        message.info('Subthemes cannot have children.');
        return;
      }
      const nextLevel: Level = parent.level === 'pillar' ? 'theme' : 'subtheme';
      const table = levelToTable(nextLevel);

      const payload: any = {
        code: '',
        name: nextLevel === 'theme' ? 'New Theme' : 'New Subtheme',
        description: '',
        sort_order: 9999,
      };
      if (nextLevel === 'theme') payload.pillar_id = parent.id;
      if (nextLevel === 'subtheme') payload.theme_id = parent.id;

      const { data: rows, error } = await supabase.from(table).insert(payload).select('*').single();
      if (error) throw error;

      // expand the parent so the new item is visible
      setExpandedRowKeys((prev) => Array.from(new Set([...prev, parent.key])));
      message.success('Added');
      fetchAll();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Failed to add');
    }
  };

  // --------- columns ----------
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '28%',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '42%',
      render: (text) => <span style={{ color: '#555' }}>{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'level',
      width: '12%',
      render: (_, row) => (
        <Space size={6}>
          <Tag color={TYPE_COLORS[row.level]} style={{ fontWeight: 500 }}>
            {row.level === 'pillar' ? 'Pillar' : row.level === 'theme' ? 'Theme' : 'Subtheme'}
          </Tag>
          {/* small grey code, in brackets, right next to Type tag */}
          <span style={{ color: '#999', fontSize: 12 }}>[{row.code || '—'}]</span>
        </Space>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: '18%',
      render: (_, row) => (
        <Space size="small" wrap>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(row)}>
            Edit
          </Button>
          {row.level !== 'subtheme' && (
            <Button icon={<PlusOutlined />} size="small" onClick={() => addChild(row)}>
              Add
            </Button>
          )}
          <Popconfirm
            title="Delete this row?"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteRow(row)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // only allow expand when row has children
  const rowExpandable = (row: UIRow) => Array.isArray(row.children) && row.children.length > 0;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Link href="/" style={{ marginRight: 12 }}>
          <Button icon={<ArrowLeftOutlined />}>Back to Dashboard</Button>
        </Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Primary Framework Editor</h1>
        <div style={{ marginLeft: 'auto' }}>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table<UIRow>
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        expandable={{
          defaultExpandAllRows: false,
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
          rowExpandable,
          // slightly larger caret
          expandIcon: (props) => {
            const { expanded, onExpand, record } = props;
            if (!rowExpandable(record)) {
              // render spacer to align rows that can't expand
              return <span style={{ display: 'inline-block', width: 16 }} />;
            }
            return (
              <span
                onClick={(e) => onExpand(record, e)}
                style={{
                  display: 'inline-flex',
                  width: 18,
                  height: 18,
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                  cursor: 'pointer',
                  background: '#fff',
                }}
              >
                {expanded ? '−' : '+'}
              </span>
            );
          },
        }}
        pagination={false}
        // responsive widths — the column widths above are % based, this keeps it fluid
        scroll={{ x: true }}
      />

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        title={`Edit ${editing?.level ?? ''}`}
        onCancel={closeModal}
        onOk={saveEdit}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name required' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Description" autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item name="code" label="Code">
            <Input placeholder="Short code (optional)" />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort Order">
            <Input type="number" placeholder="1" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
