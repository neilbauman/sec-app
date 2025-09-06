'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ReloadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

// ---------- Supabase client (robust to export differences) ----------
import * as supa from '@/lib/supabaseClient';
const getSb = () =>
  (supa as any).getBrowserClient?.() ??
  (supa as any).createBrowserClient?.() ??
  (supa as any).createClient?.() ??
  supa;

// ---------- Types (minimal) ----------
type Level = 'pillar' | 'theme' | 'subtheme';

type PillarRow = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: number;
  pillar_id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: number;
  theme_id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type UIRow = {
  key: string;            // e.g. P:1, T:3, S:9
  level: Level;
  id: number;
  parentKey?: string;     // P:1 for T:* ; T:3 for S:*
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  children?: UIRow[];
};

// ---------- Small helpers ----------
const typeTag: Record<Level, { txt: string; color: string }> = {
  pillar: { txt: 'pillar', color: 'blue' },
  theme: { txt: 'theme', color: 'green' },
  subtheme: { txt: 'sub-theme', color: 'red' },
};

const makeKey = (level: Level, id: number) =>
  (level === 'pillar' ? 'P' : level === 'theme' ? 'T' : 'S') + ':' + id;

const codeNode = (code: string) => (
  <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>[{code}]</span>
);

// ---------- Page ----------
export default function FrameworkPage() {
  const supabase = useMemo(() => getSb(), []);
  const { message, modal } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UIRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // modal state
  const [form] = Form.useForm<{
    code: string;
    name: string;
    description?: string;
    sort_order?: number;
  }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add');
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [addUnder, setAddUnder] = useState<UIRow | null>(null); // parent for add

  // -------- Fetch & build tree --------
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars }, { data: themes }, { data: subs }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

      const p: PillarRow[] = Array.isArray(pillars) ? pillars : [];
      const t: ThemeRow[] = Array.isArray(themes) ? themes : [];
      const s: SubthemeRow[] = Array.isArray(subs) ? subs : [];

      // build theme children under each pillar
      const themesByPillar: Record<number, UIRow[]> = {};
      for (const th of t) {
        const node: UIRow = {
          key: makeKey('theme', th.id),
          level: 'theme',
          id: th.id,
          parentKey: makeKey('pillar', th.pillar_id),
          code: th.code,
          name: th.name,
          description: th.description ?? null,
          sort_order: th.sort_order ?? null,
          children: [],
        };
        (themesByPillar[th.pillar_id] ||= []).push(node);
      }

      // build subtheme children under each theme
      const subsByTheme: Record<number, UIRow[]> = {};
      for (const st of s) {
        const node: UIRow = {
          key: makeKey('subtheme', st.id),
          level: 'subtheme',
          id: st.id,
          parentKey: makeKey('theme', st.theme_id),
          code: st.code,
          name: st.name,
          description: st.description ?? null,
          sort_order: st.sort_order ?? null,
        };
        (subsByTheme[st.theme_id] ||= []).push(node);
      }

      // attach subthemes into themes
      for (const list of Object.values(themesByPillar)) {
        for (const th of list) {
          const themeId = th.id;
          const kids = subsByTheme[themeId] || [];
          // sub-themes have no caret if no children (which they never do)
          if (kids.length) th.children = kids;
        }
      }

      // create pillar nodes and attach themes
      const tree: UIRow[] = p.map((pr) => {
        const node: UIRow = {
          key: makeKey('pillar', pr.id),
          level: 'pillar',
          id: pr.id,
          code: pr.code,
          name: pr.name,
          description: pr.description ?? null,
          sort_order: pr.sort_order ?? null,
          children: themesByPillar[pr.id] || [],
        };
        return node;
      });

      setRows(tree);
    } catch (err: any) {
      message.error(err?.message || 'Failed to load framework.');
    } finally {
      setLoading(false);
    }
  }, [supabase, message]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ---------- Actions ----------
  const openAddModal = (parent: UIRow | null) => {
    setAddUnder(parent);
    setEditing(null);
    setModalTitle(parent == null ? 'Add pillar' : parent.level === 'pillar' ? 'Add theme' : 'Add sub-theme');
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (row: UIRow) => {
    setEditing(row);
    setAddUnder(null);
    setModalTitle(`Edit ${row.level}`);
    form.setFieldsValue({
      code: row.code,
      name: row.name,
      description: row.description ?? undefined,
      sort_order: row.sort_order ?? undefined,
    });
    setModalOpen(true);
  };

  const doDelete = (row: UIRow) => {
    modal.confirm({
      title: `Delete ${row.level}`,
      content: `Are you sure you want to delete “${row.name}” (${row.code})?`,
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          let error: any = null;
          if (row.level === 'pillar') {
            ({ error } = await supabase.from('pillars').delete().eq('id', row.id));
          } else if (row.level === 'theme') {
            ({ error } = await supabase.from('themes').delete().eq('id', row.id));
          } else {
            ({ error } = await supabase.from('subthemes').delete().eq('id', row.id));
          }
          if (error) throw error;
          message.success('Deleted');
          await refresh();
        } catch (e: any) {
          message.error(e?.message || 'Delete failed');
        }
      },
    });
  };

  const submitModal = async () => {
    try {
      const vals = await form.validateFields();
      const payload = {
        code: vals.code.trim(),
        name: vals.name.trim(),
        description: vals.description ?? null,
        sort_order: vals.sort_order ?? null,
      };

      let error: any = null;

      if (editing) {
        if (editing.level === 'pillar') {
          ({ error } = await supabase.from('pillars').update(payload).eq('id', editing.id));
        } else if (editing.level === 'theme') {
          ({ error } = await supabase.from('themes').update(payload).eq('id', editing.id));
        } else {
          ({ error } = await supabase.from('subthemes').update(payload).eq('id', editing.id));
        }
      } else {
        // add
        if (!addUnder) {
          // new pillar
          ({ error } = await supabase.from('pillars').insert(payload));
        } else if (addUnder.level === 'pillar') {
          ({ error } = await supabase
            .from('themes')
            .insert({ ...payload, pillar_id: addUnder.id }));
        } else {
          ({ error } = await supabase
            .from('subthemes')
            .insert({ ...payload, theme_id: addUnder.id }));
        }
      }

      if (error) throw error;

      setModalOpen(false);
      setEditing(null);
      setAddUnder(null);
      message.success('Saved');
      await refresh();
    } catch (err: any) {
      if (err?.errorFields) return; // form validation error already shown
      message.error(err?.message || 'Save failed');
    }
  };

  // ---------- Table ----------
  const columns = [
    {
      title: <span style={{ fontWeight: 600 }}>Name</span>,
      dataIndex: 'name',
      key: 'name',
      width: '42%',
      render: (_: any, rec: UIRow) => {
        const t = typeTag[rec.level];
        return (
          <Space size="middle">
            <Tag color={t.color} style={{ textTransform: 'none', marginRight: 0 }}>
              {t.txt}
            </Tag>
            <span style={{ fontSize: 12, color: '#8c8c8c', marginLeft: -4 }}>
              [{rec.code}]
            </span>
            <span style={{ fontWeight: 500 }}>{rec.name}</span>
          </Space>
        );
      },
    },
    {
      title: <span style={{ fontWeight: 600 }}>Description / Notes</span>,
      dataIndex: 'description',
      key: 'description',
      width: '44%',
      render: (val: any) => <span style={{ color: '#4f4f4f' }}>{val || ''}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: '14%',
      align: 'right' as const,
      render: (_: any, rec: UIRow) => {
        const canAddChild = rec.level !== 'subtheme';
        return (
          <Space>
            {canAddChild && (
              <Tooltip title={rec.level === 'pillar' ? 'Add theme' : 'Add sub-theme'}>
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => openAddModal(rec)}
                />
              </Tooltip>
            )}
            <Tooltip title="Edit">
              <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(rec)} />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => doDelete(rec)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // antd expandable config
  const expandable = {
    // only pillars & themes can expand; sub-themes never show a caret
    rowExpandable: (rec: UIRow) => rec.level !== 'subtheme' && (rec.children?.length ?? 0) > 0,
    expandedRowKeys: expandedKeys,
    onExpand: (expanded: boolean, record: UIRow) => {
      setExpandedKeys((prev) =>
        expanded ? [...new Set([...prev, record.key])] : prev.filter((k) => k !== record.key)
      );
    },
  };

  return (
    <App>
      <div style={{ padding: 16 }}>
        <Space size="large" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Link href="/" style={{ color: '#1677ff' }}>
            <ArrowLeftOutlined /> Dashboard
          </Link>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Framework Editor
          </Typography.Title>
          <span style={{ flex: 1 }} />
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Refresh
          </Button>
        </Space>

        <Table<UIRow>
          dataSource={rows}
          columns={columns}
          loading={loading}
          rowKey={(r) => r.key}
          size="middle"
          expandable={expandable}
          pagination={false}
        />

        <Modal
          title={modalTitle}
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
            setAddUnder(null);
          }}
          onOk={submitModal}
          okText="Save"
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: 'Please enter a code' }]}
            >
              <Input placeholder="e.g. P1 / T1.2 / ST2.1.1" />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description / Notes" name="description">
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
            <Form.Item label="Sort order" name="sort_order">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </App>
  );
}
