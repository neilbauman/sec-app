'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Typography, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { createClient } from '@/lib/supabaseClient';

type Pillar = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Theme = {
  id: number;
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type SubTheme = {
  id: number;
  code: string;
  pillar_code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Level = 'pillar' | 'theme' | 'subtheme';

type Row = {
  key: string;
  level: Level;
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillar_code?: string;
  theme_code?: string;
  children?: Row[];
};

const pastel = {
  pillar: { bg: '#e6f4ff', border: '#bae0ff', text: '#0958d9' },    // light blue
  theme: { bg: '#f6ffed', border: '#b7eb8f', text: '#389e0d' },     // light green
  subtheme: { bg: '#fff1f0', border: '#ffa39e', text: '#cf1322' },  // light red
};

export default function FrameworkPage() {
  const supabase = useMemo(() => createClient(), []);
  // Cast to any to avoid TS generic inference issues on Vercel
  const s = supabase as any;

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [createParent, setCreateParent] = useState<Row | null>(null);
  const [createLevel, setCreateLevel] = useState<Level>('pillar');
  const [form] = Form.useForm<{ name: string; description?: string; code: string; sort_order: number }>();

  // --------- Data load ----------
  async function loadAll() {
    setLoading(true);

    const [pRes, tRes, sRes] = await Promise.all([
      s.from('pillars').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      s.from('themes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      s.from('subthemes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
    ]);

    if (pRes.error) { setLoading(false); message.error(pRes.error.message); return; }
    if (tRes.error) { setLoading(false); message.error(tRes.error.message); return; }
    if (sRes.error) { setLoading(false); message.error(sRes.error.message); return; }

    const pillars: Pillar[] = pRes.data ?? [];
    const themes: Theme[] = tRes.data ?? [];
    const subs: SubTheme[] = sRes.data ?? [];

    // Map by code for fast linking
    const themesByPillar = new Map<string, Theme[]>();
    themes.forEach(t => {
      const arr = themesByPillar.get(t.pillar_code) ?? [];
      arr.push(t);
      themesByPillar.set(t.pillar_code, arr);
    });

    const subsByTheme = new Map<string, SubTheme[]>();
    subs.forEach(st => {
      const arr = subsByTheme.get(st.theme_code) ?? [];
      arr.push(st);
      subsByTheme.set(st.theme_code, arr);
    });

    // Build tree
    const tree: Row[] = pillars.map(p => {
      const pRow: Row = {
        key: `p:${p.id}`,
        level: 'pillar',
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        sort_order: p.sort_order,
        children: [],
      };
      const pThemes = themesByPillar.get(p.code) ?? [];
      pRow.children = pThemes.map(t => {
        const tRow: Row = {
          key: `t:${t.id}`,
          level: 'theme',
          id: t.id,
          code: t.code,
          name: t.name,
          description: t.description,
          sort_order: t.sort_order,
          pillar_code: t.pillar_code,
          children: [],
        };
        const tSubs = subsByTheme.get(t.code) ?? [];
        tRow.children = tSubs.map(st => ({
          key: `s:${st.id}`,
          level: 'subtheme',
          id: st.id,
          code: st.code,
          name: st.name,
          description: st.description,
          sort_order: st.sort_order,
          pillar_code: st.pillar_code,
          theme_code: st.theme_code,
        }));
        return tRow;
      });
      return pRow;
    });

    setRows(tree);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  // --------- Helpers ----------
  function levelTag(lvl: Level) {
    const c = pastel[lvl];
    const label = lvl === 'pillar' ? 'Pillar' : lvl === 'theme' ? 'Theme' : 'Sub-theme';
    return <Tag style={{ background: c.bg, borderColor: c.border, color: c.text }}>{label}</Tag>;
  }

  function openCreate(level: Level, parent?: Row) {
    setEditing(null);
    setCreateParent(parent ?? null);
    setCreateLevel(level);
    // default code suggestion: use parent code as prefix if any
    const baseCode =
      level === 'pillar' ? '' :
      level === 'theme' && parent ? `${parent.code}.` :
      level === 'subtheme' && parent ? `${parent.code}.` :
      '';
    form.setFieldsValue({ name: '', description: '', code: baseCode, sort_order: 1 });
    setModalOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setCreateParent(null);
    setCreateLevel(row.level);
    form.setFieldsValue({
      name: row.name ?? '',
      description: row.description ?? '',
      code: row.code ?? '',
      sort_order: row.sort_order ?? 1,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    const vals = await form.validateFields();
    const payload = {
      name: vals.name.trim(),
      description: (vals.description ?? '').toString(),
      code: vals.code.trim(),
      sort_order: Number(vals.sort_order ?? 1),
    };

    let err: string | null = null;

    if (editing) {
      // UPDATE
      if (editing.level === 'pillar') {
        const { error } = await s.from('pillars').update(payload).eq('id', editing.id);
        err = error?.message ?? null;
      } else if (editing.level === 'theme') {
        const { error } = await s.from('themes').update(payload).eq('id', editing.id);
        err = error?.message ?? null;
      } else {
        const { error } = await s.from('subthemes').update(payload).eq('id', editing.id);
        err = error?.message ?? null;
      }
    } else {
      // INSERT
      if (createLevel === 'pillar') {
        const { error } = await s.from('pillars').insert(payload);
        err = error?.message ?? null;
      } else if (createLevel === 'theme') {
        if (!createParent || createParent.level !== 'pillar') {
          message.error('Please create a Theme under a Pillar.');
          return;
        }
        const { error } = await s.from('themes').insert({
          ...payload,
          pillar_code: createParent.code,
        });
        err = error?.message ?? null;
      } else {
        if (!createParent || createParent.level !== 'theme') {
          message.error('Please create a Sub-theme under a Theme.');
          return;
        }
        const { error } = await s.from('subthemes').insert({
          ...payload,
          theme_code: createParent.code,
          pillar_code: createParent.pillar_code ?? extractPillarCode(createParent.code),
        });
        err = error?.message ?? null;
      }
    }

    if (err) {
      message.error(err);
      return;
    }

    setModalOpen(false);
    setEditing(null);
    setCreateParent(null);
    message.success('Saved');
    await loadAll();
  }

  function extractPillarCode(themeCode: string) {
    // If your theme codes look like "P1.T2" or "1.2", adjust accordingly.
    // As a fallback, take the first segment before a dot.
    const seg = themeCode.split('.')[0];
    return seg;
  }

  async function tryDelete(row: Row) {
    // Basic guard: block deletes if children exist (to avoid FK errors)
    if (row.level !== 'subtheme' && row.children && row.children.length > 0) {
      message.warning('Please delete or move child rows first.');
      return;
    }
    let err: string | null = null;

    if (row.level === 'pillar') {
      // double-check children exist in DB
      const { data: kids, error } = await s.from('themes').select('id').eq('pillar_code', row.code).limit(1);
      if (error) { message.error(error.message); return; }
      if ((kids ?? []).length > 0) { message.warning('This pillar has themes. Delete/move them first.'); return; }
      const { error: delErr } = await s.from('pillars').delete().eq('id', row.id);
      err = delErr?.message ?? null;
    } else if (row.level === 'theme') {
      const { data: kids, error } = await s.from('subthemes').select('id').eq('theme_code', row.code).limit(1);
      if (error) { message.error(error.message); return; }
      if ((kids ?? []).length > 0) { message.warning('This theme has sub-themes. Delete/move them first.'); return; }
      const { error: delErr } = await s.from('themes').delete().eq('id', row.id);
      err = delErr?.message ?? null;
    } else {
      const { error: delErr } = await s.from('subthemes').delete().eq('id', row.id);
      err = delErr?.message ?? null;
    }

    if (err) { message.error(err); return; }
    message.success('Deleted');
    await loadAll();
  }

  // --------- Columns ----------
  const columns: ColumnsType<Row> = [
    {
      title: '',
      dataIndex: 'level',
      width: 110,
      render: (_: any, r) => levelTag(r.level),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 140,
      render: (t: string) => <Typography.Text code>{t}</Typography.Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      ellipsis: true,
      render: (t: string) => <Typography.Text>{t}</Typography.Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
      render: (t?: string | null) => t ?? '',
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      width: 90,
      sorter: (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      render: (n?: number | null) => n ?? '',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      fixed: 'right',
      render: (_: any, row) => (
        <Space wrap>
          {row.level === 'pillar' && (
            <Button size="small" onClick={() => openCreate('theme', row)}>
              Add Theme
            </Button>
          )}
          {row.level === 'theme' && (
            <Button size="small" onClick={() => openCreate('subtheme', row)}>
              Add Sub-theme
            </Button>
          )}
          <Button size="small" onClick={() => openEdit(row)}>Edit</Button>
          <Popconfirm
            title="Delete this row?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => tryDelete(row)}
          >
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Framework Editor
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate('pillar')}>
          Add Pillar
        </Button>
        <Button onClick={() => loadAll()}>Refresh</Button>
      </Space>

      <Table<Row>
        rowKey="key"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys(keys as React.Key[]),
        }}
      />

      <Modal
        open={modalOpen}
        title={editing ? `Edit ${editing.level === 'pillar' ? 'Pillar' : editing.level === 'theme' ? 'Theme' : 'Sub-theme'}`
                      : createLevel === 'pillar' ? 'Add Pillar' : createLevel === 'theme' ? 'Add Theme' : 'Add Sub-theme'}
        onCancel={() => { setModalOpen(false); setEditing(null); setCreateParent(null); }}
        onOk={handleSave}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ sort_order: 1 }}>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Code is required' }]}
            tooltip={createLevel === 'theme' ? 'Consider prefixing with the pillar code (e.g., P1.T1)' :
                    createLevel === 'subtheme' ? 'Consider prefixing with the theme code (e.g., T1.ST1)' : ''}
          >
            <Input placeholder="e.g., P1 / T1.2 / ST3.1" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label="Sort Order"
            rules={[{ required: true, message: 'Sort order is required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
