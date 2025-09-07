'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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

type PillarRow = { id: string; code: string; name: string; };
type ThemeRow  = { id: string; code: string; pillar_id: string; name: string; };
type SubRow    = { id: string; code: string; theme_id: string; name: string; };

type IndicatorRow = {
  id: string;
  level: Level;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillar_id?: string | null;
  theme_id?: string | null;
  subtheme_id?: string | null;
};

type UIRow = {
  key: string;
  id: string;
  level: Level;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  parentId?: string | null;
  pillarCode?: string;
  themeCode?: string;
};

const LEVEL_TAG: Record<Level, { color: string; text: string }> = {
  pillar:   { color: 'blue',  text: 'Pillar' },
  theme:    { color: 'green', text: 'Theme' },
  subtheme: { color: 'red',   text: 'Sub-theme' },
};

const CARET_SIZE_STYLE = { fontSize: 14 };

export default function IndicatorsPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UIRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [form] = Form.useForm();

  // For parent resolution
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: p }, { data: t }, { data: s },
        { data: inds, error: ie },
      ] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        supabase.from('indicators').select('*').order('sort_order', { ascending: true }),
      ]);
      if (ie) throw ie;

      const pillarsById = new Map<string, PillarRow>((p ?? []) as PillarRow[] ? (p as PillarRow[]).map(x => [x.id, x]) : []);
      const themesById  = new Map<string, ThemeRow>((t ?? []) as ThemeRow[] ? (t as ThemeRow[]).map(x => [x.id, x]) : []);

      setPillars(((p ?? []) as PillarRow[]));
      setThemes(((t ?? []) as ThemeRow[]));
      setSubs(((s ?? []) as SubRow[]));

      const ui: UIRow[] = ((inds ?? []) as IndicatorRow[]).map(ind => {
        let parentId: string | undefined;
        let pillarCode: string | undefined;
        let themeCode: string | undefined;

        if (ind.level === 'theme' && ind.pillar_id) {
          parentId = ind.pillar_id;
          pillarCode = pillarsById.get(ind.pillar_id)?.code;
        }
        if (ind.level === 'subtheme') {
          parentId = ind.theme_id || undefined;
          if (ind.theme_id) {
            const tRow = themesById.get(ind.theme_id);
            themeCode = tRow?.code;
            pillarCode = tRow ? pillarsById.get(tRow.pillar_id)?.code : undefined;
          }
        }

        return {
          key: `I:${ind.id}`,
          id: ind.id,
          level: ind.level,
          code: ind.code,
          name: ind.name,
          description: ind.description ?? '',
          sort_order: ind.sort_order ?? null,
          parentId,
          pillarCode,
          themeCode,
        };
      });

      setRows(ui);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Failed to load indicators.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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

  const openCreate = (parent?: UIRow) => {
    setEditing(null);
    const initial: any = {
      level: parent ? (parent.level === 'pillar' ? 'theme' : 'subtheme') : 'pillar',
      name: '',
      description: '',
      sort_order: 1,
      code: '',
    };

    if (parent?.level === 'pillar') initial.pillar_id = parent.id;
    if (parent?.level === 'theme')  initial.theme_id  = parent.id;

    form.setFieldsValue(initial);
    setEditOpen(true);
  };

  const openEdit = (rec: UIRow) => {
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
      const { error } = await supabase.from('indicators').delete().eq('id', rec.id);
      if (error) throw error;
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
      const payload: any = {
        level: vals.level as Level,
        name: vals.name,
        description: vals.description ?? '',
        sort_order: vals.sort_order ?? 1,
        code: vals.code,
        pillar_id: null,
        theme_id: null,
        subtheme_id: null,
      };

      if (payload.level === 'theme') {
        if (!vals.pillar_id) throw new Error('Choose a Pillar for a theme-level indicator.');
        payload.pillar_id = vals.pillar_id;
      }
      if (payload.level === 'subtheme') {
        if (!vals.theme_id) throw new Error('Choose a Theme for a subtheme-level indicator.');
        payload.theme_id = vals.theme_id;
      }

      if (!editing) {
        const { error } = await supabase.from('indicators').insert(payload);
        if (error) throw error;
        message.success('Created.');
      } else {
        const { error } = await supabase.from('indicators').update(payload).eq('id', editing.id);
        if (error) throw error;
        message.success('Saved.');
      }
      setEditOpen(false);
      setEditing(null);
      await fetchAll();
    } catch (err: any) {
      if (err?.errorFields) return;
      console.error(err);
      message.error(err?.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  // CSV Export / Import for indicators
  const exportCSV = () => {
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
    a.download = 'indicators.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = async (file: File) => {
    setLoading(true);
    try {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      if (parsed.errors?.length) throw new Error('CSV parse error.');

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

      // look up parents by code
      const pByCode = new Map<string, PillarRow>(pillars.map(p => [p.code, p]));
      const tByCode = new Map<string, ThemeRow>(themes.map(t => [t.code, t]));

      for (const r of inRows) {
        const sort_order = r.sort_order === '' || r.sort_order == null ? 1 : Number(r.sort_order);
        const payload: any = {
          level: r.level,
          code: r.code,
          name: r.name,
          description: r.description ?? '',
          sort_order,
          pillar_id: null,
          theme_id: null,
          subtheme_id: null,
        };

        if (r.level === 'theme') {
          const parent = pByCode.get(r.pillar_code || '');
          if (!parent) throw new Error(`Missing pillar_code for theme indicator ${r.code}`);
          payload.pillar_id = parent.id;
        }
        if (r.level === 'subtheme') {
          const parentT = tByCode.get(r.theme_code || '');
          if (!parentT) throw new Error(`Missing theme_code for subtheme indicator ${r.code}`);
          payload.theme_id = parentT.id;
        }

        // upsert by code
        const { data: existing } = await supabase.from('indicators').select('*').eq('code', r.code).maybeSingle();
        if (existing) {
          const { error } = await supabase.from('indicators').update(payload).eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('indicators').insert(payload);
          if (error) throw error;
        }
      }

      message.success('Indicators CSV import complete.');
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

  const pillarOptions = useMemo(
    () => pillars.map(r => ({ value: r.id, label: `${r.name} (${r.code})` })),
    [pillars]
  );
  const themeOptions = useMemo(
    () => themes.map(r => ({ value: r.id, label: `${r.name} (${r.code})` })),
    [themes]
  );

  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: '12%',
      render: (level: Level, rec) => (
        <Space size="small">
          <Tag color={LEVEL_TAG[level].color}>{LEVEL_TAG[level].text}</Tag>
          <span style={{ color: '#888', fontSize: 12 }}>[{rec.code}]</span>
        </Space>
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name', width: '25%' },
    { title: 'Description', dataIndex: 'description', key: 'description', width: '38%', ellipsis: true },
    { title: 'Sort', dataIndex: 'sort_order', key: 'sort_order', width: '8%' },
    {
      title: 'Actions',
      key: 'actions',
      width: '17%',
      render: (_: any, rec) => (
        <Space size="small">
          {rec.level !== 'subtheme' && (
            <Button
              size="small"
              onClick={() => openCreate(rec)}
              icon={<PlusOutlined />}
            >
              Add {rec.level === 'pillar' ? 'Theme' : 'Sub-theme'}
            </Button>
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>Edit</Button>
          <Popconfirm title="Delete this indicator?" onConfirm={() => handleDelete(rec)}>
            <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
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
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Indicators</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button icon={<PlusOutlined />} onClick={() => openCreate()}>New</Button>
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
            setExpandedKeys(prev => expanded ? [...prev, key] : prev.filter(k => k !== key));
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
                      <span onClick={(e) => onExpand(record, e)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                        {expanded ? <DownOutlined style={CARET_SIZE_STYLE} /> : <RightOutlined style={CARET_SIZE_STYLE} />}
                      </span>
                    )
                  ),
                  expandedRowKeys: expandedKeys,
                  onExpand: (expanded, record) => {
                    const key = record.key;
                    setExpandedKeys(prev => expanded ? [...prev, key] : prev.filter(k => k !== key));
                  },
                }}
              />
            );
          },
          expandIcon: ({ expanded, onExpand, record }) =>
            record.level === 'subtheme' ? null : (
              <span onClick={(e) => onExpand(record, e)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                {expanded ? <DownOutlined style={CARET_SIZE_STYLE} /> : <RightOutlined style={CARET_SIZE_STYLE} />}
              </span>
            ),
        }}
      />

      <Modal
        title={editing ? 'Edit Indicator' : 'New Indicator'}
        open={editOpen}
        onCancel={() => { setEditOpen(false); setEditing(null); }}
        onOk={submitEdit}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="level"
            label="Type"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: 'Pillar', value: 'pillar' },
                { label: 'Theme', value: 'theme' },
                { label: 'Sub-theme', value: 'subtheme' },
              ]}
            />
          </Form.Item>

          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input placeholder="Unique code" />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="sort_order" label="Sort Order" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          {/* Parent selectors */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.level !== cur.level}
          >
            {({ getFieldValue }) => {
              const level = getFieldValue('level') as Level;
              if (level === 'theme') {
                return (
                  <Form.Item
                    name="pillar_id"
                    label="Pillar"
                    rules={[{ required: true, message: 'Choose a Pillar' }]}
                  >
                    <Select options={pillars.map(p => ({ value: p.id, label: `${p.name} (${p.code})` }))} showSearch optionFilterProp="label" />
                  </Form.Item>
                );
              }
              if (level === 'subtheme') {
                return (
                  <Form.Item
                    name="theme_id"
                    label="Theme"
                    rules={[{ required: true, message: 'Choose a Theme' }]}
                  >
                    <Select options={themes.map(t => ({ value: t.id, label: `${t.name} (${t.code})` }))} showSearch optionFilterProp="label" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
