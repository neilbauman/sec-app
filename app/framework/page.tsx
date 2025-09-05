'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Input,
  InputNumber,
  Modal,
  Form,
  Popconfirm,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// IMPORTANT: supabaseClient must DEFAULT export a function returning a browser client
// e.g. export default function getBrowserClient() { return createBrowserClient(...); }
import getSupabaseClient from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

type PillarRow = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null };
type ThemeRow  = { id: string; code: string; pillar_code: string; name: string; description?: string | null; sort_order?: number | null };
type SubRow    = { id: string; code: string; theme_code: string; name: string; description?: string | null; sort_order?: number | null };

type UIRow = {
  key: string;
  id: string;
  level: Level;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  parentKey?: string;
  children?: UIRow[];
};

const typeTag = (lvl: Level, code: string) => {
  const color = lvl === 'pillar' ? 'blue' : lvl === 'theme' ? 'green' : 'red';
  return (
    <Space size={6}>
      <Tag color={color} style={{ marginRight: 0 }}>{lvl}</Tag>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>[{code}]</Typography.Text>
    </Space>
  );
};

function makeKey(level: Level, id: string) {
  return `${level}:${id}`;
}

export default function FrameworkEditorPage() {
  const supabase = useMemo(() => (getSupabaseClient as any)(), []);
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<UIRow[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe || te || se) {
        const errMsg = pe?.message || te?.message || se?.message;
        message.error(errMsg || 'Failed to load framework data');
        setTree([]);
        return;
      }

      const themeByPillar: Record<string, ThemeRow[]> = {};
      (themes || []).forEach((t: any) => {
        if (!themeByPillar[t.pillar_code]) themeByPillar[t.pillar_code] = [];
        themeByPillar[t.pillar_code].push(t);
      });

      const subByTheme: Record<string, SubRow[]> = {};
      (subs || []).forEach((s: any) => {
        if (!subByTheme[s.theme_code]) subByTheme[s.theme_code] = [];
        subByTheme[s.theme_code].push(s);
      });

      const built: UIRow[] = (pillars || []).map((p: PillarRow) => {
        const pKey = makeKey('pillar', p.id);
        const pChildren = (themeByPillar[p.code] || []).map((t: ThemeRow) => {
          const tKey = makeKey('theme', t.id);
          const tChildren = (subByTheme[t.code] || []).map((s: SubRow) => ({
            key: makeKey('subtheme', s.id),
            id: s.id,
            level: 'subtheme' as const,
            code: s.code,
            name: s.name,
            description: s.description ?? '',
            sort_order: Number(s.sort_order ?? 1),
            parentKey: tKey,
          }));
          return {
            key: tKey,
            id: t.id,
            level: 'theme' as const,
            code: t.code,
            name: t.name,
            description: t.description ?? '',
            sort_order: Number(t.sort_order ?? 1),
            parentKey: pKey,
            children: tChildren,
          };
        });

        return {
          key: pKey,
          id: p.id,
          level: 'pillar' as const,
          code: p.code,
          name: p.name,
          description: p.description ?? '',
          sort_order: Number(p.sort_order ?? 1),
          children: pChildren,
        };
      });

      setTree(built);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ------- CRUD helpers -------
  const saveEdits = async () => {
    try {
      const vals = await form.validateFields();
      if (!editing) return;

      let table: 'pillars' | 'themes' | 'subthemes' =
        editing.level === 'pillar' ? 'pillars' : editing.level === 'theme' ? 'themes' : 'subthemes';

      const payload: any = {
        name: vals.name,
        description: vals.description ?? '',
        sort_order: Number(vals.sort_order ?? 1),
      };

      const { error } = await supabase.from(table).update(payload).eq('id', editing.id);
      if (error) {
        message.error(error.message);
      } else {
        message.success('Saved');
        setEditing(null);
        form.resetFields();
        loadData();
      }
    } catch {
      // validation errors already shown by antd
    }
  };

  const addChild = async (parent: UIRow) => {
    if (parent.level === 'subtheme') return;

    const nowCode = Math.random().toString(36).slice(-6).toUpperCase(); // human-ish temp code
    if (parent.level === 'pillar') {
      // add new THEME
      const siblingCount = (parent.children || []).length;
      const payload = {
        code: `${parent.code}-${nowCode}`,
        pillar_code: parent.code,
        name: 'New Theme',
        description: '',
        sort_order: siblingCount + 1,
      };
      const { error } = await supabase.from('themes').insert(payload);
      if (error) return message.error(error.message);
      message.success('Theme added');
      await loadData();
      setExpandedRowKeys((prev) => Array.from(new Set([...prev, parent.key]))); // ensure parent open
    } else if (parent.level === 'theme') {
      // add new SUBTHEME
      const siblingCount = (parent.children || []).length;
      const payload = {
        code: `${parent.code}-${nowCode}`,
        theme_code: parent.code,
        name: 'New Sub-theme',
        description: '',
        sort_order: siblingCount + 1,
      };
      const { error } = await supabase.from('subthemes').insert(payload);
      if (error) return message.error(error.message);
      message.success('Sub-theme added');
      await loadData();
      setExpandedRowKeys((prev) => Array.from(new Set([...prev, parent.key]))); // ensure parent open
    }
  };

  const deleteRow = async (rec: UIRow) => {
    let table: 'pillars' | 'themes' | 'subthemes' =
      rec.level === 'pillar' ? 'pillars' : rec.level === 'theme' ? 'themes' : 'subthemes';

    const { error } = await supabase.from(table).delete().eq('id', rec.id);
    if (error) {
      message.error(error.message);
    } else {
      message.success('Deleted');
      loadData();
    }
  };

  // ------- columns -------
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 420,
      render: (_: any, rec) => (
        <Space size={8} wrap>
          {typeTag(rec.level, rec.code)}
          <Typography.Text>{rec.name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Description / Notes',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (val: any) => <Typography.Text>{val}</Typography.Text>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 90,
      align: 'right' as const,
      render: (v: any) => <Typography.Text>{Number(v ?? 1)}</Typography.Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      render: (_: any, rec) => (
        <Space size={8} wrap>
          {/* Add child where applicable */}
          {rec.level !== 'subtheme' && (
            <Button size="small" icon={<PlusOutlined />} onClick={() => addChild(rec)}>
              {rec.level === 'pillar' ? 'Add Theme' : 'Add Sub-theme'}
            </Button>
          )}
          {/* Edit */}
          <Button
            size="small"
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(rec);
              form.setFieldsValue({
                name: rec.name,
                description: rec.description,
                sort_order: rec.sort_order,
              });
            }}
          >
            Edit
          </Button>
          {/* Delete */}
          <Popconfirm
            title="Delete this row?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteRow(rec)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Flatten for Table.tree data usage? AntD supports nested via children directly.
  // We pass `treeData` by providing `children` and control expansion with expandedRowKeys.
  const dataSource = tree;

  return (
    <div style={{ padding: 16 }}>
      <Space align="center" style={{ marginBottom: 12 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeftOutlined />
          Dashboard
        </Link>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Framework Editor
        </Typography.Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadData}
          loading={loading}
          style={{ marginLeft: 8 }}
        >
          Refresh
        </Button>
      </Space>

      <Table<UIRow>
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys((prev) => {
              const key = record.key;
              if (expanded) return Array.from(new Set([...prev, key]));
              return prev.filter((k) => k !== key);
            });
          },
          indentSize: 16,
        }}
      />

      <Modal
        title={editing ? `Edit ${editing.level}` : 'Edit'}
        open={!!editing}
        onCancel={() => {
          setEditing(null);
          form.resetFields();
        }}
        onOk={saveEdits}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description / Notes" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order" rules={[{ type: 'number', min: 1 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
