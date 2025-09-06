'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Input,
  InputNumber,
  Modal,
  Form,
  message,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import Papa from 'papaparse';
import { getBrowserClient } from '@/lib/supabaseClient';

type AnyObj = Record<string, any>;

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
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Level = 'pillar' | 'theme' | 'subtheme';

type UIRow = {
  key: string;        // e.g. P:P1  / T:T1.2 / S:S1.2.1
  level: Level;
  id: string;
  code: string;
  parentKey?: string; // the key of the parent
  pillar_code?: string;
  theme_code?: string;
  name: string;
  description: string;
  sort_order: number;
};

const { Title, Text } = Typography;

function typeTag(level: Level) {
  if (level === 'pillar') return <Tag color="blue">Pillar</Tag>;
  if (level === 'theme') return <Tag color="green">Theme</Tag>;
  return <Tag color="red">Sub-theme</Tag>;
}

export default function FrameworkPage() {
  const supabaseRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  // raw tables
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);

  // UI state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [addParent, setAddParent] = useState<UIRow | null>(null);

  // init supabase only in browser
  useEffect(() => {
    try {
      supabaseRef.current = getBrowserClient();
    } catch {
      // no-op: component renders nothing until hydration
    }
  }, []);

  // fetch everything AFTER supabase ready
  async function fetchAll() {
    if (!supabaseRef.current) return;
    setLoading(true);
    const sb = supabaseRef.current;

    const [{ data: p, error: pe }, { data: t, error: te }, { data: s, error: se }] = await Promise.all([
      sb.from('pillars').select('*').order('sort_order', { ascending: true }),
      sb.from('themes').select('*').order('sort_order', { ascending: true }),
      sb.from('subthemes').select('*').order('sort_order', { ascending: true }),
    ]);

    if (pe) message.error(`Pillars: ${pe.message}`);
    if (te) message.error(`Themes: ${te.message}`);
    if (se) message.error(`Sub-themes: ${se.message}`);

    setPillars((p ?? []) as any);
    setThemes((t ?? []) as any);
    setSubs((s ?? []) as any);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseRef.current) fetchAll();
  }, [supabaseRef.current]);

  // build flat tree each render from raw tables
  const flatData: UIRow[] = useMemo(() => {
    const pRows: UIRow[] = pillars.map((p) => ({
      key: `P:${p.code}`,
      level: 'pillar',
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description ?? '',
      sort_order: p.sort_order ?? 1,
    }));

    const tRows: UIRow[] = themes.map((t) => ({
      key: `T:${t.code}`,
      level: 'theme',
      id: t.id,
      code: t.code,
      parentKey: `P:${t.pillar_code}`,
      pillar_code: t.pillar_code,
      name: t.name,
      description: t.description ?? '',
      sort_order: t.sort_order ?? 1,
    }));

    const sRows: UIRow[] = subs.map((s) => ({
      key: `S:${s.code}`,
      level: 'subtheme',
      id: s.id,
      code: s.code,
      parentKey: `T:${s.theme_code}`,
      pillar_code: s.pillar_code,
      theme_code: s.theme_code,
      name: s.name,
      description: s.description ?? '',
      sort_order: s.sort_order ?? 1,
    }));

    // Respect expand/collapse by filtering children in place
    const pSet = new Set(pRows.map((r) => r.key));
    const tByP: Record<string, UIRow[]> = {};
    tRows.forEach((t) => {
      if (!tByP[t.parentKey!]) tByP[t.parentKey!] = [];
      tByP[t.parentKey!].push(t);
    });
    const sByT: Record<string, UIRow[]> = {};
    sRows.forEach((s) => {
      if (!sByT[s.parentKey!]) sByT[s.parentKey!] = [];
      sByT[s.parentKey!].push(s);
    });

    const out: UIRow[] = [];
    for (const p of pRows) {
      out.push(p);
      if (expanded[p.key]) {
        const themesUnder = tByP[p.key] ?? [];
        for (const t of themesUnder) {
          out.push(t);
          if (expanded[t.key]) {
            const subsUnder = sByT[t.key] ?? [];
            for (const s of subsUnder) {
              out.push(s);
            }
          }
        }
      }
    }
    return out;
  }, [pillars, themes, subs, expanded]);

  function toggleExpand(row: UIRow) {
    setExpanded((prev) => ({ ...prev, [row.key]: !prev[row.key] }));
  }

  // CRUD helpers
  async function handleSave(values: { name: string; description?: string; sort_order?: number }) {
    if (!editing || !supabaseRef.current) return;
    const sb = supabaseRef.current;
    const payload: AnyObj = {
      name: values.name,
      description: values.description ?? '',
      sort_order: values.sort_order ?? 1,
    };

    let res;
    if (editing.level === 'pillar') {
      res = await sb.from('pillars').update(payload as any).eq('id', editing.id);
    } else if (editing.level === 'theme') {
      res = await sb.from('themes').update(payload as any).eq('id', editing.id);
    } else {
      res = await sb.from('subthemes').update(payload as any).eq('id', editing.id);
    }

    if (res.error) {
      message.error(res.error.message);
    } else {
      message.success('Saved');
      setEditing(null);
      fetchAll();
    }
  }

  async function handleAdd(level: Level, parent?: UIRow | null) {
    if (!supabaseRef.current) return;
    const sb = supabaseRef.current;

    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    if (level === 'pillar') {
      const code = `P${(pillars.length + 1).toString()}`;
      const { error } = await sb.from('pillars').insert({
        code,
        name: `New Pillar ${rand}`,
        description: '',
        sort_order: (pillars.length + 1) * 10,
      } as any);
      if (error) message.error(error.message);
    } else if (level === 'theme' && parent) {
      if (parent.level !== 'pillar') return;
      const code = `T${rand}`;
      const { error } = await sb.from('themes').insert({
        code,
        pillar_code: parent.code,
        name: `New Theme ${rand}`,
        description: '',
        sort_order: 10,
      } as any);
      if (error) message.error(error.message);
      setExpanded((e) => ({ ...e, [parent.key]: true }));
    } else if (level === 'subtheme' && parent) {
      if (parent.level !== 'theme') return;
      const code = `S${rand}`;
      const { error } = await sb.from('subthemes').insert({
        code,
        pillar_code: parent.pillar_code,
        theme_code: parent.code,
        name: `New Sub-theme ${rand}`,
        description: '',
        sort_order: 10,
      } as any);
      if (error) message.error(error.message);
      setExpanded((e) => ({ ...e, [parent.key]: true }));
    }
    fetchAll();
  }

  async function handleDelete(row: UIRow) {
    if (!supabaseRef.current) return;
    const sb = supabaseRef.current;
    if (row.level === 'pillar') {
      // prevent orphaning – delete children first
      const tChildren = themes.filter((t) => t.pillar_code === row.code);
      const sChildren = subs.filter((s) => s.pillar_code === row.code);
      if (sChildren.length) {
        await sb.from('subthemes').delete().in('id', sChildren.map((s) => s.id));
      }
      if (tChildren.length) {
        await sb.from('themes').delete().in('id', tChildren.map((t) => t.id));
      }
      const { error } = await sb.from('pillars').delete().eq('id', row.id);
      if (error) return message.error(error.message);
    } else if (row.level === 'theme') {
      const sChildren = subs.filter((s) => s.theme_code === row.code);
      if (sChildren.length) {
        await supabaseRef.current.from('subthemes').delete().in('id', sChildren.map((s) => s.id));
      }
      const { error } = await sb.from('themes').delete().eq('id', row.id);
      if (error) return message.error(error.message);
    } else {
      const { error } = await sb.from('subthemes').delete().eq('id', row.id);
      if (error) return message.error(error.message);
    }
    message.success('Deleted');
    fetchAll();
  }

  // CSV export
  function exportCSV() {
    const p = Papa.unparse(
      pillars.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        description: r.description ?? '',
        sort_order: r.sort_order ?? '',
      })),
    );
    const t = Papa.unparse(
      themes.map((r) => ({
        id: r.id,
        code: r.code,
        pillar_code: r.pillar_code,
        name: r.name,
        description: r.description ?? '',
        sort_order: r.sort_order ?? '',
      })),
    );
    const s = Papa.unparse(
      subs.map((r) => ({
        id: r.id,
        code: r.code,
        pillar_code: r.pillar_code,
        theme_code: r.theme_code,
        name: r.name,
        description: r.description ?? '',
        sort_order: r.sort_order ?? '',
      })),
    );
    downloadText('pillars.csv', p);
    downloadText('themes.csv', t);
    downloadText('subthemes.csv', s);
  }

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // CSV import (single table at a time — user chooses which)
  async function importCSV(file: File, target: 'pillars' | 'themes' | 'subthemes') {
    if (!supabaseRef.current) return;
    const sb = supabaseRef.current;

    const parse = await new Promise<any[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => resolve(res.data as any[]),
        error: reject,
      });
    });

    // Upsert by code (safer for human edits)
    for (const row of parse) {
      const patch: AnyObj = {
        code: (row.code ?? '').trim(),
        name: (row.name ?? '').trim(),
        description: row.description ?? '',
        sort_order: row.sort_order ? Number(row.sort_order) : 1,
      };
      if (!patch.code) continue;

      if (target === 'pillars') {
        const { data } = await sb.from('pillars').select('id').eq('code', patch.code).maybeSingle();
        if (data?.id) {
          await sb.from('pillars').update(patch as any).eq('id', data.id);
        } else {
          await sb.from('pillars').insert(patch as any);
        }
      } else if (target === 'themes') {
        patch.pillar_code = (row.pillar_code ?? '').trim();
        if (!patch.pillar_code) continue;
        const { data } = await sb.from('themes').select('id').eq('code', patch.code).maybeSingle();
        if (data?.id) {
          await sb.from('themes').update(patch as any).eq('id', data.id);
        } else {
          await sb.from('themes').insert(patch as any);
        }
      } else {
        patch.pillar_code = (row.pillar_code ?? '').trim();
        patch.theme_code = (row.theme_code ?? '').trim();
        if (!patch.pillar_code || !patch.theme_code) continue;
        const { data } = await sb.from('subthemes').select('id').eq('code', patch.code).maybeSingle();
        if (data?.id) {
          await sb.from('subthemes').update(patch as any).eq('id', data.id);
        } else {
          await sb.from('subthemes').insert(patch as any);
        }
      }
    }
    message.success('Import complete');
    fetchAll();
  }

  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type / Code',
      dataIndex: 'level',
      width: '20%',
      render: (_: any, rec) => (
        <Space size="small">
          {/* Expand control only when children exist */}
          {rec.level !== 'subtheme' ? (
            <a onClick={() => toggleExpand(rec)} aria-label="toggle">
              {expanded[rec.key] ? '▾' : '▸'}
            </a>
          ) : (
            <span style={{ width: 12 }} />
          )}
          {typeTag(rec.level)}
          <Text type="secondary" style={{ fontSize: 12 }}>
            {rec.code}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '28%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '32%',
      ellipsis: true,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      width: '8%',
      render: (v: any) => v ?? '',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, rec) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => setEditing(rec)}
          />
          {rec.level !== 'subtheme' && (
            <Button
              icon={<PlusOutlined />}
              size="small"
              onClick={() => setAddParent(rec)}
              title={rec.level === 'pillar' ? 'Add Theme' : 'Add Sub-theme'}
            />
          )}
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(rec)}
          />
        </Space>
      ),
    },
  ];

  // Simple inline editor modal
  const [form] = Form.useForm<{ name: string; description?: string; sort_order?: number }>();
  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        description: editing.description,
        sort_order: editing.sort_order ?? 1,
      });
    } else {
      form.resetFields();
    }
  }, [editing]);

  // Add modal
  const [addForm] = Form.useForm<{ name: string; description?: string; sort_order?: number }>();
  useEffect(() => {
    if (addParent) {
      addForm.setFieldsValue({
        name: '',
        description: '',
        sort_order: 10,
      });
    } else {
      addForm.resetFields();
    }
  }, [addParent]);

  // Guard render until client
  if (!supabaseRef.current) {
    return null;
  }

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12 }}>
        <Link href="/" prefetch={false}>
          <Button icon={<ArrowLeftOutlined />}>Back to Dashboard</Button>
        </Link>
        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
          Refresh
        </Button>

        {/* Export buttons */}
        <Button icon={<DownloadOutlined />} onClick={exportCSV}>
          Export CSVs
        </Button>

        {/* Importers (one file at a time) */}
        <Upload
          accept=".csv"
          maxCount={1}
          beforeUpload={(file) => {
            importCSV(file, 'pillars');
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Import Pillars CSV</Button>
        </Upload>

        <Upload
          accept=".csv"
          maxCount={1}
          beforeUpload={(file) => {
            importCSV(file, 'themes');
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Import Themes CSV</Button>
        </Upload>

        <Upload
          accept=".csv"
          maxCount={1}
          beforeUpload={(file) => {
            importCSV(file, 'subthemes');
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Import Sub-themes CSV</Button>
        </Upload>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd('pillar')}
        >
          Add Pillar
        </Button>
      </Space>

      <Table<UIRow>
        dataSource={flatData}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        size="small"
        // tighter rows
        style={{ lineHeight: 1.1 }}
      />

      {/* Edit modal */}
      <Modal
        open={!!editing}
        title={
          editing ? (
            <>
              Edit {editing.level}{' '}
              <Text type="secondary" style={{ fontSize: 12 }}>
                {editing.code}
              </Text>
            </>
          ) : (
            ''
          )
        }
        onCancel={() => setEditing(null)}
        onOk={() => {
          form
            .validateFields()
            .then(handleSave)
            .catch(() => {});
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort order">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add child modal */}
      <Modal
        open={!!addParent}
        title={
          addParent ? (
            <>
              {addParent.level === 'pillar' ? 'Add Theme under' : 'Add Sub-theme under'}{' '}
              {addParent.name}{' '}
              <Text type="secondary" style={{ fontSize: 12 }}>
                {addParent.code}
              </Text>
            </>
          ) : (
            ''
          )
        }
        onCancel={() => setAddParent(null)}
        onOk={() => {
          addForm
            .validateFields()
            .then(async (vals) => {
              if (!addParent) return;
              if (addParent.level === 'pillar') {
                // add theme
                const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
                const code = `T${rand}`;
                const { error } = await supabaseRef.current
                  .from('themes')
                  .insert({
                    code,
                    pillar_code: addParent.code,
                    name: vals.name,
                    description: vals.description ?? '',
                    sort_order: vals.sort_order ?? 10,
                  } as any);
                if (error) message.error(error.message);
              } else {
                // add subtheme
                const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
                const code = `S${rand}`;
                const { error } = await supabaseRef.current
                  .from('subthemes')
                  .insert({
                    code,
                    pillar_code: addParent.pillar_code,
                    theme_code: addParent.code,
                    name: vals.name,
                    description: vals.description ?? '',
                    sort_order: vals.sort_order ?? 10,
                  } as any);
                if (error) message.error(error.message);
              }
              setAddParent(null);
              fetchAll();
            })
            .catch(() => {});
        }}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort order">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
