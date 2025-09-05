'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CaretRightOutlined,
  CaretDownOutlined,
  EditOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { getSupabase } from '@/lib/supabaseClient';

// --- Small helpers -----------------------------------------------------------
type Level = 'pillar' | 'theme' | 'subtheme';

type Pillar = { id: string; code: string; name: string; description: string; sort_order: number };
type Theme = {
  id: string; code: string; pillar_code: string; name: string; description: string; sort_order: number;
};
type Subtheme = {
  id: string; code: string; theme_code: string; pillar_code: string; name: string; description: string; sort_order: number;
};

type Row = {
  // table identity
  key: string;
  // db fields
  id: string;
  level: Level;
  code: string;
  pillar_code?: string;
  theme_code?: string;

  name: string;
  description: string;
  sort_order: number;

  // ui
  children?: Row[];
};

const levelColor = (lvl: Level) =>
  lvl === 'pillar' ? '#e8f4ff' : lvl === 'theme' ? '#eef9f1' : '#fdf2f2';
const levelBorder = (lvl: Level) =>
  lvl === 'pillar' ? '#b3d8ff' : lvl === 'theme' ? '#ccefdc' : '#f5c2c2';
const levelLabel = (lvl: Level) =>
  lvl === 'pillar' ? 'Pillar' : lvl === 'theme' ? 'Theme' : 'Sub-theme';

function LevelTag({ lvl }: { lvl: Level }) {
  return (
    <span
      style={{
        background: levelColor(lvl),
        border: `1px solid ${levelBorder(lvl)}`,
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 12,
        lineHeight: '16px',
        display: 'inline-block',
        marginRight: 8,
      }}
    >
      {levelLabel(lvl)}
    </span>
  );
}

// --- Page --------------------------------------------------------------------
export default function FrameworkPage() {
  const supabase = getSupabase();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form] = Form.useForm();

  // build tree data
  const load = async () => {
    setLoading(true);
    try {
      const [pRes, tRes, sRes] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

      if (pRes.error) throw pRes.error;
      if (tRes.error) throw tRes.error;
      if (sRes.error) throw sRes.error;

      const pillars: Pillar[] = pRes.data ?? [];
      const themes: Theme[] = tRes.data ?? [];
      const subs: Subtheme[] = sRes.data ?? [];

      // group themes by pillar
      const themesByPillar = new Map<string, Theme[]>();
      for (const t of themes) {
        if (!themesByPillar.has(t.pillar_code)) themesByPillar.set(t.pillar_code, []);
        themesByPillar.get(t.pillar_code)!.push(t);
      }

      // group subs by theme
      const subsByTheme = new Map<string, Subtheme[]>();
      for (const s of subs) {
        if (!subsByTheme.has(s.theme_code)) subsByTheme.set(s.theme_code, []);
        subsByTheme.get(s.theme_code)!.push(s);
      }

      const tree: Row[] = pillars.map((p) => {
        const pillarRow: Row = {
          key: `pillar:${p.code}`,
          id: p.id,
          level: 'pillar',
          code: p.code,
          name: p.name,
          description: p.description ?? '',
          sort_order: p.sort_order ?? 1,
          children: [],
        };

        const childThemes = (themesByPillar.get(p.code) ?? []).map((t) => {
          const themeRow: Row = {
            key: `theme:${t.code}`,
            id: t.id,
            level: 'theme',
            code: t.code,
            pillar_code: t.pillar_code,
            name: t.name,
            description: t.description ?? '',
            sort_order: t.sort_order ?? 1,
            children: [],
          };

          const childSubs = (subsByTheme.get(t.code) ?? []).map((s) => {
            const subRow: Row = {
              key: `subtheme:${s.code}`,
              id: s.id,
              level: 'subtheme',
              code: s.code,
              pillar_code: s.pillar_code,
              theme_code: s.theme_code,
              name: s.name,
              description: s.description ?? '',
              sort_order: s.sort_order ?? 1,
            };
            return subRow;
          });

          if (childSubs.length) themeRow.children = childSubs;
          return themeRow;
        });

        if (childThemes.length) pillarRow.children = childThemes;
        return pillarRow;
      });

      setRows(tree);

      // default: collapse Pillars & Themes (only show 3 top rows)
      setExpandedKeys([]); // collapsed by default
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<Row> = useMemo(
    () => [
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        width: 120,
        render: (_: any, rec) => <LevelTag lvl={rec.level} />,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: 'Sort',
        dataIndex: 'sort_order',
        key: 'sort_order',
        width: 80,
        align: 'right',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_: any, rec) => (
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(rec);
                form.setFieldsValue({
                  name: rec.name,
                  description: rec.description,
                  sort_order: rec.sort_order ?? 1,
                });
                setEditOpen(true);
              }}
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    [form]
  );

  const onSave = async () => {
    try {
      if (!editing) return;
      const vals = await form.validateFields();
      const { level, id } = editing;

      let err: string | null = null;

      if (level === 'pillar') {
        const { error } = await supabase.from('pillars').update({
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
        } as any).eq('id', id);
        err = error?.message ?? null;
      } else if (level === 'theme') {
        const { error } = await supabase.from('themes').update({
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
        } as any).eq('id', id);
        err = error?.message ?? null;
      } else {
        const { error } = await supabase.from('subthemes').update({
          name: vals.name,
          description: vals.description ?? '',
          sort_order: vals.sort_order ?? 1,
        } as any).eq('id', id);
        err = error?.message ?? null;
      }

      if (err) throw new Error(err);

      message.success('Saved');
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Save failed');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Framework editor (Pillars → Themes → Sub-themes)</h1>
        <Button icon={<ReloadOutlined />} onClick={load}>Reload</Button>
      </Space>

      <Table<Row>
        size="small"
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowKey="key"
        pagination={false}
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
            ),
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys([...keys]),
        }}
        rowClassName={(rec) =>
          rec.level === 'pillar'
            ? 'row-pillar'
            : rec.level === 'theme'
            ? 'row-theme'
            : 'row-sub'
        }
        style={{ background: 'white' }}
      />

      {/* Compact row spacing */}
      <style jsx global>{`
        .ant-table-tbody > tr > td {
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
        .row-pillar td {
          background: ${levelColor('pillar')};
        }
        .row-theme td {
          background: ${levelColor('theme')};
        }
        .row-sub td {
          background: ${levelColor('subtheme')};
        }
      `}</style>

      <Modal
        title={
          editing ? `Edit ${levelLabel(editing.level)}: ${editing.name}` : 'Edit'
        }
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={onSave}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Sort order" name="sort_order" rules={[{ type: 'number' }]}>
            <InputNumber min={0} style={{ width: 140 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
