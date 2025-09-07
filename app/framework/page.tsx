'use client';

export const dynamic = 'force-dynamic';
export const revalidate=0;
export const fetchCache = 'force-no-store';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getBrowserClient } from '@/lib/supabaseClient';
import { Table, Tag, Button, Space, Modal, Form, Input, Select, Popconfirm, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Papa from 'papaparse';

type Level = 'pillar' | 'theme' | 'subtheme';

type PillarRow = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null; };
type ThemeRow  = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null; pillar_id: string; };
type SubRow    = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null; theme_id: string; };

type UIRow = {
  key: string;
  level: Level;
  id: string;
  parentId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillarCode?: string;
  themeCode?: string;
};

const LEVEL_TAG: Record<Level, { color: string; text: string }> = {
  pillar:   { color: 'blue',  text: 'Pillar' },
  theme:    { color: 'green', text: 'Theme' },
  subtheme: { color: 'red',   text: 'Sub-theme' },
};

const CARET_SIZE_STYLE = { fontSize: 14 }; // larger carets

export default function FrameworkPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UIRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editLevel, setEditLevel] = useState<Level>('pillar');
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [form] = Form.useForm();

  // --- Fetch all three tables, build a flat + hierarchical map
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

      if (pe) throw pe;
      if (te) throw te;
      if (se) throw se;

      const pArr = (pillars ?? []) as PillarRow[];
      const tArr = (themes ?? []) as ThemeRow[];
      const sArr = (subs ?? []) as SubRow[];

      // Index by id for relationships
      const pillarsById = new Map<string, PillarRow>(pArr.map(p => [p.id, p]));
      const themesById  = new Map<string, ThemeRow>(tArr.map(t => [t.id, t]));

      // Build UI rows
      const ui: UIRow[] = [];

      pArr.forEach(p => {
        ui.push({
          key: `P:${p.id}`,
          id: p.id,
          level: 'pillar',
          code: p.code,
          name: p.name,
          description: p.description ?? '',
          sort_order: p.sort_order ?? null,
        });
      });

      tArr.forEach(t => {
        const parent = pillarsById.get(t.pillar_id);
        if (!parent) return;
        ui.push({
          key: `T:${t.id}`,
          id: t.id,
          level: 'theme',
          parentId: t.pillar_id,
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? null,
          pillarCode: parent.code,
        });
      });

      sArr.forEach(s => {
        const parentT = themesById.get(s.theme_id);
        if (!parentT) return;
        const parentP = pillarsById.get(parentT.pillar_id);
        ui.push({
          key: `S:${s.id}`,
          id: s.id,
          level: 'subtheme',
          parentId: s.theme_id,
          code: s.code,
          name: s.name,
          description: s.description ?? '',
          sort_order: s.sort_order ?? null,
          pillarCode: parentP?.code,
          themeCode: parentT?.code,
        });
      });

      setRows(ui);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Failed to load framework.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Build parent-child maps for expandable table
  const childrenMap = useMemo(() => {
    const byParent: Record<string, UIRow[]> = {};
    rows.forEach(r => {
      if (r.level === 'theme') {
        const key = `P:${r.parentId}`;
        byParent[key] = byParent[key] || [];
        byParent[key].push(r);
      } else if (r.level === 'subtheme') {
        const key = `T:${r.parentId}`;
        byParent[key] = byParent[key] || [];
        byParent[key].push(r);
      }
    });
    return byParent;
  }, [rows]);

  const topLevel = useMemo(() => rows.filter(r => r.level === 'pillar'), [rows]);

  const getChildren = useCallback((rec: UIRow): UIRow[] => {
    if (rec.level === 'pillar') return childrenMap[`P:${rec.id}`] || [];
    if (rec.level === 'theme')  return childrenMap[`T:${rec.id}`] || [];
    return [];
  }, [childrenMap]);

  // ----- CRUD helpers -----
  const openCreate = (level: Level, parent?: UIRow) => {
    setEditLevel(level);
    setEditing(null);
    const initial: any = { level, name: '', description: '', sort_order: 1, code: '' };

    if (level === 'theme' && parent) initial.pillar_id = parent.id;
    if (level === 'subtheme' && parent) initial.theme_id = parent.id;

    form.setFieldsValue(initial);
    setEditOpen(true);
  };

  const openEdit = (rec: UIRow) => {
    setEditLevel(rec.level);
    setEditing(rec);
    const initial: any = {
      level: rec.level,
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
      code: rec.code,
    };
    if (rec.level === 'theme')   initial.pillar_id = rec.parentId;
    if (rec.level === 'subtheme') initial.theme_id  = rec.parentId;
    form.setFieldsValue(initial);
    setEditOpen(true);
  };

  const handleDelete = async (rec: UIRow) => {
    setLoading(true);
    try {
      if (rec.level === 'pillar') {
        const childThemes = getChildren(rec);
        if (childThemes.length) {
          message.warning('Delete themes under this pillar first.');
          return;
        }
        const { error } = await supabase.from('pillars').delete().eq('id', rec.id);
        if (error) throw error;
      } else if (rec.level === 'theme') {
        const childSubs = getChildren(rec);
        if (childSubs.length) {
          message.warning('Delete sub-themes under this theme first.');
          return;
        }
        const { error } = await supabase.from('themes').delete().eq('id', rec.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subthemes').delete().eq('id', rec.id);
        if (error) throw error;
      }
      message.success('Deleted.');
      await fetchAll();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async () => {
    try {
      const vals = await form.validateFields();
      setLoading(true);

      if (!editing) {
        // CREATE
        if (editLevel === 'pillar') {
          const payload = { name: vals.name, description: vals.description ?? '', sort_order: vals.sort_order ?? 1, code: vals.code };
          const { error } = await supabase.from('pillars').insert(payload);
          if (error) throw error;
        } else if (editLevel === 'theme') {
          if (!vals.pillar_id) throw new Error('Please choose a Pillar.');
          const payload = { name: vals.name, description: vals.description ?? '', sort_order: vals.sort_order ?? 1, pillar_id: vals.pillar_id, code: vals.code };
          const { error } = await supabase.from('themes').insert(payload);
          if (error) throw error;
        } else {
          if (!vals.theme_id) throw new Error('Please choose a Theme.');
          const payload = { name: vals.name, description: vals.description ?? '', sort_order: vals.sort_order ?? 1, theme_id: vals.theme_id, code: vals.code };
          const { error } = await supabase.from('subthemes').insert(payload);
          if (error) throw error;
        }
        message.success('Created.');
      } else {
        // UPDATE
        if (editing.level === 'pillar') {
          const { error } = await supabase.from('pillars')
            .update({ name: vals.name, description: vals.description ?? '', sort_order: vals.sort_order ?? 1, code: vals.code })
            .eq('id', editing.id);
          if (error) throw error;
        } else if (editing.level === 'theme') {
          const { error } = await supabase.from('themes')
            .update({
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
              pillar_id: vals.pillar_id || editing.parentId,
              code: vals.code,
            })
            .eq('id', editing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('subthemes')
            .update({
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
              theme_id: vals.theme_id || editing.parentId,
              code: vals.code,
            })
            .eq('id', editing.id);
          if (error) throw error;
        }
        message.success('Saved.');
      }

      setEditOpen(false);
      setEditing(null);
      await fetchAll();
    } catch (err: any) {
      if (err?.errorFields) return; // antd validation
      console.error(err);
      message.error(err?.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  // ----- CSV Export / Import -----
  const exportCSV = () => {
    // export pillars, themes, subthemes as flat CSV with level and parent codes
    const data = rows.map(r => ({
      level: r.level,
      code: r.code,
      name: r.name,
      description: r.description ?? '',
      sort_order: r.sort_order ?? '',
      pillar_code: r.level !== 'pillar' ? (r.pillarCode || '') : '',
      theme_code: r.level === 'subtheme' ? (r.themeCode || '') : '',
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'framework.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = async (file: File) => {
    setLoading(true);
    try {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      if (parsed.errors?.length) {
        console.error(parsed.errors);
        throw new Error('CSV parse error.');
      }

      type RowIn = {
        level: Level;
        code: string;
        name: string;
        description?: string;
        sort_order?: string | number;
        pillar_code?: string;
        theme_code?: string;
      };

      const inRows = (parsed.data as any[]).filter(Boolean) as RowIn[];

      // Fetch current to resolve parents
      const [{ data: pillars }, { data: themes }] = await Promise.all([
        supabase.from('pillars').select('*'),
        supabase.from('themes').select('*'),
      ]);

      const pByCode = new Map<string, any>((pillars || []).map(p => [p.code, p]));
      const tByCode = new Map<string, any>((themes || []).map(t => [t.code, t]));

      // upsert in order: pillars -> themes -> subthemes
      for (const r of inRows) {
        const sort_order = r.sort_order === '' || r.sort_order == null ? 1 : Number(r.sort_order);
        if (r.level === 'pillar') {
          const existing = pByCode.get(r.code);
          if (existing) {
            const { error } = await supabase.from('pillars')
              .update({ name: r.name, description: r.description ?? '', sort_order, code: r.code })
              .eq('id', existing.id);
            if (error) throw error;
          } else {
            const { data, error } = await supabase.from('pillars')
              .insert({ name: r.name, description: r.description ?? '', sort_order, code: r.code })
              .select()
              .single();
            if (error) throw error;
            pByCode.set(r.code, data);
          }
        }
      }

      for (const r of inRows) {
        if (r.level === 'theme') {
          const sort_order = r.sort_order === '' || r.sort_order == null ? 1 : Number(r.sort_order);
          const parent = pByCode.get(r.pillar_code || '');
          if (!parent) throw new Error(`Missing pillar_code for theme ${r.code}`);
          const existing = tByCode.get(r.code);
          if (existing) {
            const { error } = await supabase.from('themes')
              .update({ name: r.name, description: r.description ?? '', sort_order, pillar_id: parent.id, code: r.code })
              .eq('id', existing.id);
            if (error) throw error;
          } else {
            const { data, error } = await supabase.from('themes')
              .insert({ name: r.name, description: r.description ?? '', sort_order, pillar_id: parent.id, code: r.code })
              .select()
              .single();
            if (error) throw error;
            tByCode.set(r.code, data);
          }
        }
      }

      for (const r of inRows) {
        if (r.level === 'subtheme') {
          const sort_order = r.sort_order === '' || r.sort_order == null ? 1 : Number(r.sort_order);
          const parentTheme = tByCode.get(r.theme_code || '');
          if (!parentTheme) throw new Error(`Missing theme_code for subtheme ${r.code}`);
          const { data: existing } = await supabase.from('subthemes').select('*').eq('code', r.code).maybeSingle();
          if (existing) {
            const { error } = await supabase.from('subthemes')
              .update({ name: r.name, description: r.description ?? '', sort_order, theme_id: parentTheme.id, code: r.code })
              .eq('id', existing.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('subthemes')
              .insert({ name: r.name, description: r.description ?? '', sort_order, theme_id: parentTheme.id, code: r.code });
            if (error) throw error;
          }
        }
      }

      message.success('CSV import complete.');
      await fetchAll();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'CSV import failed.');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    accept: '.csv',
    showUploadList: false,
    beforeUpload: async (file: File) => {
      await importCSV(file);
      return false;
    },
  };

  // Form controls (choose parent)
  const pillarOptions = useMemo(
    () => rows.filter(r => r.level === 'pillar').map(r => ({ value: r.id, label: `${r.name} (${r.code})` })),
    [rows]
  );
  const themeOptions = useMemo(
    () => rows.filter(r => r.level === 'theme').map(r => ({ value: r.id, label: `${r.name} (${r.code})` })),
    [rows]
  );

  // Table columns (width in percentages)
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: '12%',
      render: (level: Level, rec) => (
        <Space size="small">
          <Tag color={LEVEL_TAG[level].color} style={{ marginRight: 4 }}>{LEVEL_TAG[level].text}</Tag>
          <span style={{ color: '#888', fontSize: 12 }}>[{rec.code}]</span>
        </Space>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
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
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '17%',
      render: (_: any, rec) => (
        <Space size="small">
          {rec.level !== 'subtheme' && (
            <Button
              size="small"
              type="default"
              onClick={() => openCreate(rec.level === 'pillar' ? 'theme' : 'subtheme', rec)}
              icon={<PlusOutlined />}
            >
              Add {rec.level === 'pillar' ? 'Theme' : 'Sub-theme'}
            </Button>
          )}
          <Button size="small" type="default" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>
          <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(rec)}>
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <ArrowLeftOutlined /> <span style={{ marginLeft: 6 }}>Back to Dashboard</span>
        </Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Primary Framework Editor</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button icon={<PlusOutlined />} onClick={() => openCreate('pillar')}>New Pillar</Button>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>Refresh</Button>
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>Export CSV</Button>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Import CSV</Button>
          </Upload>
        </div>
      </div>

      <Table<UIRow>
        loading={loading}
        dataSource={topLevel}
        columns={columns}
        rowKey={(rec) => rec.key}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            const key = record.key;
            setExpandedKeys((prev) =>
              expanded ? [...prev, key] : prev.filter((k) => k !== key)
            );
          },
          expandedRowRender: (parent) => {
            const kids = getChildren(parent);
            if (!kids.length) return null;
            return (
              <Table<UIRow>
                showHeader={false}
                dataSource={kids}
                columns={columns}
                rowKey={(rec) => rec.key}
                pagination={false}
                expandable={{
                  expandIcon: ({ expanded, onExpand, record }) => (
                    record.level === 'subtheme' ? null : (
                      <span
                        onClick={(e) => onExpand(record, e)}
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        {expanded ? <DownOutlined style={CARET_SIZE_STYLE} /> : <RightOutlined style={CARET_SIZE_STYLE} />}
                      </span>
                    )
                  ),
                  expandedRowKeys: expandedKeys,
                  onExpand: (expanded, record) => {
                    const key = record.key;
                    setExpandedKeys((prev) =>
                      expanded ? [...prev, key] : prev.filter((k) => k !== key)
                    );
                  },
                  expandedRowRender: (theme) => {
                    const subs = getChildren(theme);
                    if (!subs.length) return null;
                    return (
                      <Table<UIRow>
                        showHeader={false}
                        dataSource={subs}
                        columns={columns}
                        rowKey={(rec) => rec.key}
                        pagination={false}
                      />
                    );
                  },
                }}
              />
            );
          },
          expandIcon: ({ expanded, onExpand, record }) =>
            record.level === 'subtheme' ? null : (
              <span
                onClick={(e) => onExpand(record, e)}
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              >
                {expanded ? <DownOutlined style={CARET_SIZE_STYLE} /> : <RightOutlined style={CARET_SIZE_STYLE} />}
              </span>
            ),
        }}
      />

      <Modal
        title={editing ? `Edit ${editLevel}` : `New ${editLevel}`}
        open={editOpen}
        onCancel={() => { setEditOpen(false); setEditing(null); }}
        onOk={submitEdit}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="level" label="Type">
            <Select
              disabled
              options={[
                { label: 'Pillar', value: 'pillar' },
                { label: 'Theme', value: 'theme' },
                { label: 'Sub-theme', value: 'subtheme' },
              ]}
            />
          </Form.Item>

          {editLevel === 'theme' && (
            <Form.Item
              name="pillar_id"
              label="Pillar"
              rules={[{ required: true, message: 'Please choose a Pillar' }]}
            >
              <Select options={pillarOptions} showSearch optionFilterProp="label" />
            </Form.Item>
          )}

          {editLevel === 'subtheme' && (
            <Form.Item
              name="theme_id"
              label="Theme"
              rules={[{ required: true, message: 'Please choose a Theme' }]}
            >
              <Select options={themeOptions} showSearch optionFilterProp="label" />
            </Form.Item>
          )}

          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please enter a code' }]}
          >
            <Input placeholder="e.g. P1, T1.1, S3.2.4" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label="Sort Order"
            rules={[{ required: true, message: 'Please enter sort order (number)' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
