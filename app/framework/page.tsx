'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, ExpandOutlined, CompressOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
import { createClient } from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

type Pillar = {
  code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

type Theme = {
  code: string;
  pillar_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

type Subtheme = {
  code: string;
  theme_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

type Indicator = {
  id: string;
  level: Level;
  ref_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

// Row model we render in the table (tree)
type Row = {
  key: string;                 // unique per row
  level: Level;
  code: string;                // code at this level
  parentKey?: string;          // for convenience (not displayed)
  pillar_code?: string | null; // filled for lower levels
  theme_code?: string | null;  // filled for lower levels

  name: string;
  description: string;
  sort_order: number;

  indicator_name: string;
  indicator_description: string;
  indicator_sort_order: number;

  children?: Row[];
};

const tagStyle = (lvl: Level): React.CSSProperties => {
  // Subtle, complementary pastels
  if (lvl === 'pillar') return { background: 'rgba(59,130,246,0.10)', borderColor: 'rgba(59,130,246,0.35)', color: '#1e3a8a' };     // soft blue
  if (lvl === 'theme')  return { background: 'rgba(16,185,129,0.10)', borderColor: 'rgba(16,185,129,0.35)', color: '#065f46' };     // soft green
  return                    { background: 'rgba(244,63,94,0.10)',  borderColor: 'rgba(244,63,94,0.35)',  color: '#7f1d1d' };        // soft red
};

const levelLabel = (lvl: Level) => (lvl === 'pillar' ? 'Pillar' : lvl === 'theme' ? 'Theme' : 'Sub-theme');

export default function FrameworkEditorPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form] = Form.useForm();

  // --------- DATA LOADING ----------
  const load = async () => {
    setLoading(true);

    // fetch pillars, themes, subthemes, indicators in parallel
    const [
      pillarsRes,
      themesRes,
      subthemesRes,
      indicatorsRes
    ] = await Promise.all([
      supabase.from('pillars').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('themes').select('*').order('pillar_code', { ascending: true }).order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('subthemes').select('*').order('theme_code', { ascending: true }).order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('indicators').select('*').order('level', { ascending: true }).order('sort_order', { ascending: true })
    ]);

    const err = pillarsRes.error || themesRes.error || subthemesRes.error || indicatorsRes.error;
    if (err) {
      message.error(`Load failed: ${err.message}`);
      setLoading(false);
      return;
    }

    const pillars = (pillarsRes.data || []) as Pillar[];
    const themes = (themesRes.data || []) as Theme[];
    const subthemes = (subthemesRes.data || []) as Subtheme[];
    const indicators = (indicatorsRes.data || []) as Indicator[];

    // index indicators by level+ref_code
    const indKey = (lvl: Level, ref: string) => `${lvl}::${ref}`;
    const indMap = new Map<string, Indicator>();
    for (const i of indicators) {
      if (i.level && i.ref_code) {
        indMap.set(indKey(i.level, i.ref_code), i);
      }
    }

    // helper to pull indicator fields with defaults
    const pickInd = (lvl: Level, ref: string) => {
      const i = indMap.get(indKey(lvl, ref));
      return {
        indicator_name: i?.name ?? '',
        indicator_description: i?.description ?? '',
        indicator_sort_order: i?.sort_order ?? 1,
      };
    };

    // build rows tree
    const pillarNodes: Row[] = [];
    const pillarIndex = new Map<string, Row>();
    const themeIndex = new Map<string, Row>();

    for (const p of pillars) {
      const base = pickInd('pillar', p.code);
      const node: Row = {
        key: `p:${p.code}`,
        level: 'pillar',
        code: p.code,
        name: p.name ?? '',
        description: p.description ?? '',
        sort_order: p.sort_order ?? 1,
        ...base,
        children: [],
      };
      pillarNodes.push(node);
      pillarIndex.set(p.code, node);
    }

    for (const t of themes) {
      const parent = pillarIndex.get(t.pillar_code);
      if (!parent) continue; // orphan safety
      const base = pickInd('theme', t.code);
      const node: Row = {
        key: `t:${t.pillar_code}:${t.code}`,
        level: 'theme',
        code: t.code,
        pillar_code: t.pillar_code,
        name: t.name ?? '',
        description: t.description ?? '',
        sort_order: t.sort_order ?? 1,
        parentKey: parent.key,
        ...base,
        children: [],
      };
      parent.children!.push(node);
      themeIndex.set(t.code, node);
    }

    for (const s of subthemes) {
      const parent = themeIndex.get(s.theme_code);
      if (!parent) continue; // themes can legitimately have no subthemes
      const base = pickInd('subtheme', s.code);
      const node: Row = {
        key: `s:${parent.pillar_code}:${s.theme_code}:${s.code}`,
        level: 'subtheme',
        code: s.code,
        pillar_code: parent.pillar_code!,
        theme_code: s.theme_code,
        name: s.name ?? '',
        description: s.description ?? '',
        sort_order: s.sort_order ?? 1,
        parentKey: parent.key,
        ...base,
      };
      if (!parent.children) parent.children = [];
      parent.children!.push(node);
    }

    // sort children by sort_order (and fallback name) to ensure deterministic display
    const sortRows = (arr: Row[]) => {
      arr.sort((a, b) => {
        const so = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (so !== 0) return so;
        return a.name.localeCompare(b.name);
      });
      for (const r of arr) {
        if (r.children && r.children.length) sortRows(r.children);
      }
    };
    sortRows(pillarNodes);

    setRows(pillarNodes);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // --------- EXPAND/COLLAPSE ----------
  const expandAll = () => {
    // collect all keys
    const all: Key[] = [];
    const walk = (arr: Row[]) => {
      for (const r of arr) {
        all.push(r.key);
        if (r.children && r.children.length) walk(r.children);
      }
    };
    walk(rows);
    setExpandedRowKeys(all);
  };

  const collapseAll = () => setExpandedRowKeys([]);

  const onRowExpand = (expanded: boolean, record: Row) => {
    setExpandedRowKeys(prev => {
      const set = new Set(prev as string[]);
      if (expanded) set.add(record.key);
      else set.delete(record.key);
      return Array.from(set);
    });
  };

  // --------- EDIT / DELETE ----------
  const openEdit = (rec: Row) => {
    setEditing(rec);
    form.setFieldsValue({
      name: rec.name,
      description: rec.description,
      sort_order: rec.sort_order,
      indicator_name: rec.indicator_name,
      indicator_description: rec.indicator_description,
      indicator_sort_order: rec.indicator_sort_order,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const rec = editing;
    if (!rec) return;
    const vals = await form.validateFields().catch(() => null);
    if (!vals) return;

    setLoading(true);

    // 1) update base record in its table
    let baseErr: string | null = null;
    if (rec.level === 'pillar') {
      const { error } = await supabase.from('pillars')
        .update({
          name: vals.name,
          description: vals.description,
          sort_order: vals.sort_order ?? 1,
        })
        .eq('code', rec.code);
      baseErr = error?.message ?? null;
    } else if (rec.level === 'theme') {
      const { error } = await supabase.from('themes')
        .update({
          name: vals.name,
          description: vals.description,
          sort_order: vals.sort_order ?? 1,
        })
        .eq('code', rec.code);
      baseErr = error?.message ?? null;
    } else {
      const { error } = await supabase.from('subthemes')
        .update({
          name: vals.name,
          description: vals.description,
          sort_order: vals.sort_order ?? 1,
        })
        .eq('code', rec.code);
      baseErr = error?.message ?? null;
    }

    if (baseErr) {
      setLoading(false);
      message.error(`Save failed (base): ${baseErr}`);
      return;
    }

    // 2) upsert indicator for this node
    const { error: indErr } = await supabase.from('indicators').upsert({
      // in your schema the PK is 'id'; to upsert safely, use natural key (level+ref_code) with a unique constraint if present.
      // If there isn't a unique constraint yet, this will insert duplicates. For now we try an "upsert" with the natural key columns:
      // If you have a unique constraint on (level, ref_code), supabase will do the right thing. If not, consider adding it later.
      level: rec.level,
      ref_code: rec.code,
      name: vals.indicator_name ?? '',
      description: vals.indicator_description ?? '',
      sort_order: vals.indicator_sort_order ?? 1,
    } as any, { onConflict: 'level,ref_code' } as any);

    if (indErr) {
      setLoading(false);
      message.error(`Save failed (indicator): ${indErr.message}`);
      return;
    }

    setEditOpen(false);
    setEditing(null);
    await load();
    setLoading(false);
    message.success('Saved');
  };

  const deleteRow = async (rec: Row) => {
    setLoading(true);
    let baseErr: string | null = null;

    if (rec.level === 'pillar') {
      const { error } = await supabase.from('pillars').delete().eq('code', rec.code);
      baseErr = error?.message ?? null;
    } else if (rec.level === 'theme') {
      const { error } = await supabase.from('themes').delete().eq('code', rec.code);
      baseErr = error?.message ?? null;
    } else {
      const { error } = await supabase.from('subthemes').delete().eq('code', rec.code);
      baseErr = error?.message ?? null;
    }

    if (baseErr) {
      setLoading(false);
      message.error(`Delete failed: ${baseErr}`);
      return;
    }

    // remove indicator (optional; harmless if none)
    await supabase.from('indicators').delete().match({ level: rec.level, ref_code: rec.code });

    await load();
    setLoading(false);
    message.success('Deleted');
  };

  // --------- NEW ROWS ----------
  const addRow = async (lvl: Level, parent?: Row) => {
    setLoading(true);

    if (lvl === 'pillar') {
      // create code like P# next
      const nextIndex = (rows.length || 0) + 1;
      const code = `P${nextIndex}`;
      const { error } = await supabase.from('pillars').insert({
        code, name: 'New Pillar', description: '', sort_order: nextIndex,
      });
      if (error) message.error(error.message);
    } else if (lvl === 'theme') {
      if (!parent || parent.level !== 'pillar') {
        message.warning('Select a Pillar to add a Theme under.');
        setLoading(false);
        return;
      }
      const existing = parent.children?.filter(c => c.level === 'theme') ?? [];
      const nextIndex = existing.length + 1;
      const code = `${parent.code}-T${nextIndex}`;
      const { error } = await supabase.from('themes').insert({
        code, pillar_code: parent.code, name: 'New Theme', description: '', sort_order: nextIndex,
      });
      if (error) message.error(error.message);
    } else {
      // subtheme
      if (!parent || parent.level !== 'theme') {
        message.warning('Select a Theme to add a Sub-theme under.');
        setLoading(false);
        return;
      }
      const existing = parent.children?.filter(c => c.level === 'subtheme') ?? [];
      const nextIndex = existing.length + 1;
      const code = `${parent.code}-S${nextIndex}`;
      const { error } = await supabase.from('subthemes').insert({
        code, theme_code: parent.code, name: 'New Sub-theme', description: '', sort_order: nextIndex,
      });
      if (error) message.error(error.message);
    }

    await load();
    setLoading(false);
  };

  // --------- COLUMNS ----------
  const columns: ColumnsType<Row> = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      width: 360,
      render: (_val, rec) => (
        <Space size="small">
          <Tag style={tagStyle(rec.level)}>{levelLabel(rec.level)}</Tag>
          <span style={{ fontWeight: 600 }}>{rec.name || <em>(unnamed)</em>}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v: any) => v || <span style={{ opacity: 0.6 }}>(none)</span>,
    },
    {
      title: 'Indicator (name)',
      dataIndex: 'indicator_name',
      key: 'indicator_name',
      width: 240,
      render: (v: any) => v || <span style={{ opacity: 0.6 }}>(none)</span>,
    },
    {
      title: 'Indicator (description)',
      dataIndex: 'indicator_description',
      key: 'indicator_description',
      ellipsis: true,
      render: (v: any) => v || <span style={{ opacity: 0.6 }}>(none)</span>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      align: 'center' as const,
      render: (v: any) => v ?? '',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right' as const,
      render: (_val, rec) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete this ${levelLabel(rec.level)}?`}
            description="This may remove any children as well."
            okText="Yes"
            onConfirm={() => deleteRow(rec)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --------- RENDER ----------
  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Framework Editor</Typography.Title>
      </Space>

      <Space style={{ marginBottom: 14 }}>
        <Button icon={<ReloadOutlined />} onClick={load} disabled={loading}>Refresh</Button>
        <Button icon={<ExpandOutlined />} onClick={expandAll} disabled={loading}>Expand all</Button>
        <Button icon={<CompressOutlined />} onClick={collapseAll} disabled={loading}>Collapse all</Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => addRow('pillar')} disabled={loading}>
          Add Pillar
        </Button>
      </Space>

      <Table<Row>
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        size="middle"
        rowKey="key"
        expandable={{
          expandedRowKeys,
          onExpand: onRowExpand,
          indentSize: 16,
          expandIconColumnIndex: 0,
        }}
        // tighter rows
        rowClassName={(rec) => `lvl-${rec.level}`}
        style={{ background: '#fff' }}
      />

      <Modal
        title={editing ? `Edit ${levelLabel(editing.level)}: ${editing.name}` : 'Edit'}
        open={editOpen}
        onCancel={() => { setEditOpen(false); setEditing(null); }}
        onOk={saveEdit}
        okText="Save"
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Sort order" name="sort_order" rules={[{ type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Indicator name" name="indicator_name">
            <Input />
          </Form.Item>
          <Form.Item label="Indicator description" name="indicator_description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Indicator sort order" name="indicator_sort_order" rules={[{ type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
