'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Typography,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// IMPORTANT: we only call this inside the component to avoid SSR issues
import { getBrowserClient } from '@/lib/supabaseClient';

const { Title, Text } = Typography;

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
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type SubthemeRow = {
  id: string;
  code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

// Node used by AntD Table treeData
type UINode = {
  key: string;          // e.g. "P:P1", "T:T1.1", "S:S1.1.1"
  id: string;
  level: Level;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  // parent keys only for forms; AntD uses `children` to render the tree
  pillar_code?: string; // present on themes only
  theme_code?: string;  // present on subthemes only
  children?: UINode[];
};

type EditTarget =
  | { level: 'pillar'; row: UINode }
  | { level: 'theme'; row: UINode }
  | { level: 'subtheme'; row: UINode }
  | null;

export default function FrameworkEditorPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<UINode[]>([]);
  const [editing, setEditing] = useState<EditTarget>(null);
  const [form] = Form.useForm();

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

      const pByCode = new Map<string, PillarRow>();
      (pillars || []).forEach((p) => pByCode.set(p.code, p));

      const tByCode = new Map<string, ThemeRow>();
      (themes || []).forEach((t) => tByCode.set(t.code, t));

      // Pillars -> Themes -> Subthemes
      const tree: UINode[] = (pillars || []).map((p) => {
        const pillarNode: UINode = {
          key: `P:${p.code}`,
          id: p.id,
          level: 'pillar',
          code: p.code,
          name: p.name,
          description: p.description || '',
          sort_order: p.sort_order ?? 1,
          children: [],
        };

        const childrenThemes = (themes || [])
          .filter((t) => t.pillar_code === p.code)
          .map((t) => {
            const themeNode: UINode = {
              key: `T:${t.code}`,
              id: t.id,
              level: 'theme',
              code: t.code,
              name: t.name,
              description: t.description || '',
              sort_order: t.sort_order ?? 1,
              pillar_code: t.pillar_code,
              children: [],
            };

            const subChildren = (subs || [])
              .filter((s) => s.theme_code === t.code)
              .map((s) => {
                const subNode: UINode = {
                  key: `S:${s.code}`,
                  id: s.id,
                  level: 'subtheme',
                  code: s.code,
                  name: s.name,
                  description: s.description || '',
                  sort_order: s.sort_order ?? 1,
                  theme_code: s.theme_code,
                };
                return subNode;
              });

            if (subChildren.length) themeNode.children = subChildren;
            return themeNode;
          });

        if (childrenThemes.length) pillarNode.children = childrenThemes;
        return pillarNode;
      });

      setTreeData(tree);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ---------- CRUD helpers ----------
  const openEdit = (row: UINode) => {
    setEditing({ level: row.level, row });
    form.setFieldsValue({
      name: row.name,
      description: row.description,
      sort_order: row.sort_order,
    });
  };

  const onSave = async () => {
    try {
      const vals = await form.validateFields();
      const target = editing;
      if (!target) return;

      const { row, level } = target;

      let error: any | null = null;
      if (level === 'pillar') {
        const { error: e } = await supabase
          .from('pillars')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          })
          .eq('id', row.id);
        error = e;
      } else if (level === 'theme') {
        const { error: e } = await supabase
          .from('themes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          })
          .eq('id', row.id);
        error = e;
      } else {
        const { error: e } = await supabase
          .from('subthemes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          })
          .eq('id', row.id);
        error = e;
      }

      if (error) throw error;
      message.success('Saved');
      setEditing(null);
      fetchAll();
    } catch (err: any) {
      if (err?.error) {
        message.error(err.error.message || 'Save failed');
      } else if (err?.message) {
        message.error(err.message);
      } else {
        message.error('Save failed');
      }
    }
  };

  const onAdd = async (parent?: UINode) => {
    try {
      if (!parent) {
        // add pillar
        const base: Partial<PillarRow> = {
          code: `PNEW_${Date.now()}`,
          name: 'New Pillar',
          description: '',
          sort_order: 999,
        };
        const { error } = await supabase.from('pillars').insert(base as any);
        if (error) throw error;
      } else if (parent.level === 'pillar') {
        // add theme under pillar
        const base: Partial<ThemeRow> = {
          code: `TNEW_${Date.now()}`,
          pillar_code: parent.code,
          name: 'New Theme',
          description: '',
          sort_order: 999,
        };
        const { error } = await supabase.from('themes').insert(base as any);
        if (error) throw error;
      } else if (parent.level === 'theme') {
        // add subtheme under theme
        const base: Partial<SubthemeRow> = {
          code: `SNEW_${Date.now()}`,
          theme_code: parent.code,
          name: 'New Sub-theme',
          description: '',
          sort_order: 999,
        };
        const { error } = await supabase.from('subthemes').insert(base as any);
        if (error) throw error;
      } else {
        // subtheme has no children
        return;
      }
      await fetchAll();
      message.success('Added');
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Add failed');
    }
  };

  const onDelete = async (row: UINode) => {
    Modal.confirm({
      title: 'Delete this item?',
      content:
        row.level === 'pillar'
          ? 'Deleting a pillar will also remove its themes and sub-themes.'
          : row.level === 'theme'
          ? 'Deleting a theme will also remove its sub-themes.'
          : 'This will delete the sub-theme.',
      okType: 'danger',
      onOk: async () => {
        try {
          if (row.level === 'pillar') {
            const { error } = await supabase.from('pillars').delete().eq('id', row.id);
            if (error) throw error;
          } else if (row.level === 'theme') {
            const { error } = await supabase.from('themes').delete().eq('id', row.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('subthemes').delete().eq('id', row.id);
            if (error) throw error;
          }
          await fetchAll();
          message.success('Deleted');
        } catch (err: any) {
          console.error(err);
          message.error(err.message || 'Delete failed');
        }
      },
    });
  };

  // ---------- Columns ----------
  const levelTag = (level: Level, code: string) => {
    const color =
      level === 'pillar' ? 'geekblue' : level === 'theme' ? 'green' : 'volcano';
    const label =
      level === 'pillar' ? 'Pillar' : level === 'theme' ? 'Theme' : 'Sub-theme';
    return (
      <Space size={6} align="center">
        <Tag color={color} style={{ marginRight: 0 }}>
          {label}
        </Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>
          [{code}]
        </Text>
      </Space>
    );
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: '16%',
      render: (_: any, rec: UINode) => levelTag(rec.level, rec.code),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '26%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '38%',
      ellipsis: true,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: '8%',
      align: 'right' as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, rec: UINode) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(rec)}
          >
            Edit
          </Button>
          {rec.level !== 'subtheme' && (
            <Button
              icon={<PlusOutlined />}
              size="small"
              onClick={() => onAdd(rec)}
            >
              Add
            </Button>
          )}
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => onDelete(rec)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space align="center">
          <Link href="/" prefetch={false}>
            <Button icon={<ArrowLeftOutlined />}>Back to Dashboard</Button>
          </Link>
          <Title level={3} style={{ margin: 0 }}>
            Primary Framework Editor
          </Title>
        </Space>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>
            Refresh
          </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => onAdd()}>
            Add Pillar
          </Button>
        </Space>
      </Space>

      <Divider style={{ margin: '16px 0' }} />

      <Table<UINode>
        dataSource={treeData}
        columns={columns as any}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        expandable={{
          // only pillars and themes may expand
          rowExpandable: (rec) => rec.level !== 'subtheme' && !!rec.children?.length,
          expandIconColumnIndex: 1, // show caret next to Name
        }}
        // Let AntD render nested children; no custom expand logic needed
        style={{ background: '#fff' }}
      />

      <Modal
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={onSave}
        okText="Save"
        destroyOnClose
        title={
          editing
            ? `Edit ${editing.level === 'pillar' ? 'Pillar' : editing.level === 'theme' ? 'Theme' : 'Sub-theme'} (${editing.row.code})`
            : 'Edit'
        }
      >
        <Form layout="vertical" form={form} preserve={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Description" autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item
            label="Sort order"
            name="sort_order"
            rules={[{ type: 'number', min: 0 }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="1" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Caret size + tighter rows */}
      <style jsx global>{`
        .ant-table-row-expand-icon {
          transform: scale(1.25);
        }
        .ant-table-tbody > tr > td {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
        .ant-table-thead > tr > th {
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        }
      `}</style>
    </div>
  );
}
