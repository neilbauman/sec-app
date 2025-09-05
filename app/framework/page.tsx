'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, message, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

import { getBrowserClient } from '@/lib/supabaseClient';

type RowLevel = 'pillar' | 'theme' | 'subtheme';

type PillarRow = {
  id: string;
  code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: string;
  pillar_id: string;
  code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: string;
  theme_id: string;
  code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type TreeRow = {
  key: string;
  level: RowLevel;
  id: string;
  parentId?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  code?: string | null;
  children?: TreeRow[];
};

const TYPE_COLORS: Record<RowLevel, string> = {
  pillar: 'geekblue',
  theme: 'green',
  subtheme: 'volcano',
};

const TYPE_LABELS: Record<RowLevel, string> = {
  pillar: 'Pillar',
  theme: 'Theme',
  subtheme: 'Sub-theme',
};

export default function FrameworkEditorPage() {
  const supabase = getBrowserClient();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TreeRow[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TreeRow | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
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

      const pillarsById = new Map((pillars ?? []).map(p => [p.id, p as PillarRow]));
      const themesByPillar = new Map<string, ThemeRow[]>();
      (themes ?? []).forEach(t => {
        const k = (t as ThemeRow).pillar_id;
        const arr = themesByPillar.get(k) ?? [];
        arr.push(t as ThemeRow);
        themesByPillar.set(k, arr);
      });

      const subsByTheme = new Map<string, SubthemeRow[]>();
      (subs ?? []).forEach(s => {
        const k = (s as SubthemeRow).theme_id;
        const arr = subsByTheme.get(k) ?? [];
        arr.push(s as SubthemeRow);
        subsByTheme.set(k, arr);
      });

      // Build tree
      const tree: TreeRow[] = (pillars ?? []).map(p => {
        const pillar = p as PillarRow;
        const pillarNode: TreeRow = {
          key: `p:${pillar.id}`,
          id: pillar.id,
          level: 'pillar',
          name: pillar.name,
          description: pillar.description ?? '',
          sort_order: pillar.sort_order ?? 1,
          code: pillar.code ?? null,
        };

        const tChildren: TreeRow[] = (themesByPillar.get(pillar.id) ?? []).map(t => {
          const theme = t as ThemeRow;
          const themeNode: TreeRow = {
            key: `t:${theme.id}`,
            id: theme.id,
            parentId: pillar.id,
            level: 'theme',
            name: theme.name,
            description: theme.description ?? '',
            sort_order: theme.sort_order ?? 1,
            code: theme.code ?? null,
          };

          const sChildren: TreeRow[] = (subsByTheme.get(theme.id) ?? []).map(s => {
            const sub = s as SubthemeRow;
            const subNode: TreeRow = {
              key: `s:${sub.id}`,
              id: sub.id,
              parentId: theme.id,
              level: 'subtheme',
              name: sub.name,
              description: sub.description ?? '',
              sort_order: sub.sort_order ?? 1,
              code: sub.code ?? null,
            };
            return subNode;
          });

          if (sChildren.length) themeNode.children = sChildren;
          return themeNode;
        });

        if (tChildren.length) pillarNode.children = tChildren;
        return pillarNode;
      });

      setRows(tree);
      // default collapsed all
      setExpanded([]);
    } catch (err: any) {
      console.error(err);
      message.error(err.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEdit = (rec: TreeRow) => {
    setEditTarget(rec);
    form.setFieldsValue({
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const vals = await form.validateFields();
    if (!editTarget) return;
    const { level, id } = editTarget;

    setLoading(true);
    try {
      if (level === 'pillar') {
        const { error } = await supabase
          .from('pillars')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', id);
        if (error) throw error;
      } else if (level === 'theme') {
        const { error } = await supabase
          .from('themes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subthemes')
          .update({
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', id);
        if (error) throw error;
      }

      message.success('Saved');
      setEditOpen(false);
      setEditTarget(null);
      await load();
    } catch (err: any) {
      console.error(err);
      message.error(err.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<TreeRow> = useMemo(() => {
    return [
      {
        title: 'Type',
        dataIndex: 'level',
        key: 'level',
        width: 120,
        render: (_, rec) => (
          <Tag color={TYPE_COLORS[rec.level]} style={{ fontWeight: 600 }}>
            {TYPE_LABELS[rec.level]}
          </Tag>
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, rec) => (
          <Space align="baseline">
            <span style={{ fontWeight: 600 }}>{text}</span>
            {rec.code ? (
              <span style={{ opacity: 0.6, fontSize: 12 }}>(code: {rec.code})</span>
            ) : null}
          </Space>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: any) => (
          <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2, expandable: false }}>
            {text}
          </Typography.Paragraph>
        ),
      },
      {
        title: 'Sort',
        dataIndex: 'sort_order',
        key: 'sort_order',
        width: 80,
        align: 'right',
        render: (n: any) => (n ?? 1),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 110,
        render: (_, rec) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(rec)}>
              Edit
            </Button>
          </Space>
        ),
      },
    ];
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<ReloadOutlined />} onClick={load} disabled={loading}>
          Refresh
        </Button>
        <Button
          onClick={() => setExpanded([])}
          size="small"
        >
          Collapse all
        </Button>
        <Button
          onClick={() => {
            // expand everything
            const allKeys: string[] = [];
            const walk = (nodes: TreeRow[]) => {
              nodes.forEach(n => {
                if (n.children?.length) {
                  allKeys.push(n.key);
                  walk(n.children);
                }
              });
            };
            walk(rows);
            setExpanded(allKeys);
          }}
          size="small"
        >
          Expand all
        </Button>
      </Space>

      <Table<TreeRow>
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowKey="key"
        pagination={false}
        size="small"
        expandIcon={({ expanded, onExpand, record }) => (
          record.children && record.children.length ? (
            <Button
              type="link"
              size="small"
              onClick={(e) => onExpand(record, e)}
              icon={expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
              style={{ paddingInline: 4, height: 24 }}
            />
          ) : (
            <span style={{ display: 'inline-block', width: 16 }} />
          )
        )}
        expandable={{
          expandedRowKeys: expanded,
          onExpand: (exp, rec) => {
            setExpanded((prev) => {
              const k = rec.key;
              if (exp) return [...new Set([...prev, k])];
              return prev.filter(x => x !== k);
            });
          },
        }}
        rowClassName={(rec) => `lvl-${rec.level}`}
        style={{ background: '#fff' }}
      />

      <style>{`
        /* tighter rows */
        .ant-table-wrapper .ant-table-cell {
          padding-top: 6px;
          padding-bottom: 6px;
        }
        /* row tints by type */
        .lvl-pillar .ant-table-cell { background: #eef4ff; }
        .lvl-theme .ant-table-cell { background: #eefaf0; }
        .lvl-subtheme .ant-table-cell { background: #fff3ef; }
      `}</style>

      <Modal
        title={`Edit ${editTarget ? TYPE_LABELS[editTarget.level] : ''}`}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={saveEdit}
        okButtonProps={{ loading }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort order" rules={[{ type: 'number', min: 1 }]}>
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
