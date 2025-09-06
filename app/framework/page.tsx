'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Space, Tag, Tooltip, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { getBrowserClient } from '@/lib/supabaseClient';

/** -------------------- Types (minimal + tolerant) -------------------- */
type Level = 'pillar' | 'theme' | 'subtheme';

type PillarRow = {
  id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: number | string;
  pillar_id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: number | string;
  theme_id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type UIRowKey = `P:${string | number}` | `T:${string | number}` | `S:${string | number}`;

type UIRow = {
  key: UIRowKey;
  level: Level;
  id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  parentKey?: UIRowKey;
};

/** -------------------- Helpers -------------------- */
const levelTag = (level: Level) => {
  if (level === 'pillar') return <Tag color="#e6f4ff" style={{ color: '#1677ff', borderColor: '#91caff' }}>pillar</Tag>;
  if (level === 'theme') return <Tag color="#f6ffed" style={{ color: '#52c41a', borderColor: '#b7eb8f' }}>theme</Tag>;
  return <Tag color="#fff1f0" style={{ color: '#ff4d4f', borderColor: '#ffa39e' }}>sub-theme</Tag>;
};

const makeKey = (level: Level, id: number | string): UIRowKey =>
  (level === 'pillar' ? `P:${id}` : level === 'theme' ? `T:${id}` : `S:${id}`);

/** Simple CSV (no extra deps) — handles quoted fields */
function parseCSV(text: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(Boolean);
  if (lines.length === 0) return rows;
  const headers = parseCSVLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => (row[h] = vals[idx] ?? ''));
    rows.push(row);
  }
  return rows;
}
function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === ',') {
        out.push(cur);
        cur = '';
      } else if (ch === '"') {
        inQ = true;
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out;
}
function toCSV(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return 'level,code,name,description,sort_order,parent_code\n';
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map(r => headers.map(h => esc((r as any)[h])).join(','))].join('\n');
}

/** -------------------- Page -------------------- */
export default function FrameworkPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);

  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);

  // Expanded row-keys: store actual UIRowKey strings
  const [expanded, setExpanded] = useState<Set<UIRowKey>>(new Set());

  // Editing modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [form] = Form.useForm<{
    code: string;
    name: string;
    description?: string;
    sort_order?: number;
  }>();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: p, error: pe }, { data: t, error: te }, { data: s, error: se }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);
      if (pe || te || se) {
        throw new Error(pe?.message || te?.message || se?.message || 'Load failed');
      }
      setPillars((p ?? []) as any);
      setThemes((t ?? []) as any);
      setSubs((s ?? []) as any);
    } catch (err: any) {
      message.error(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Build flat UI rows honoring current expansion */
  const flatData: UIRow[] = useMemo(() => {
    const out: UIRow[] = [];
    const themeByPillar = new Map<string | number, ThemeRow[]>();
    themes.forEach(t => {
      const list = themeByPillar.get(t.pillar_id) ?? [];
      list.push(t);
      themeByPillar.set(t.pillar_id, list);
    });
    const subByTheme = new Map<string | number, SubthemeRow[]>();
    subs.forEach(s => {
      const list = subByTheme.get(s.theme_id) ?? [];
      list.push(s);
      subByTheme.set(s.theme_id, list);
    });

    pillars.forEach(p => {
      const pKey = makeKey('pillar', p.id);
      out.push({
        key: pKey,
        level: 'pillar',
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? null,
      });

      if (expanded.has(pKey)) {
        const childThemes = (themeByPillar.get(p.id) ?? []).sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        );
        childThemes.forEach(t => {
          const tKey = makeKey('theme', t.id);
          out.push({
            key: tKey,
            parentKey: pKey,
            level: 'theme',
            id: t.id,
            code: t.code,
            name: t.name,
            description: t.description ?? '',
            sort_order: t.sort_order ?? null,
          });

          if (expanded.has(tKey)) {
            const childSubs = (subByTheme.get(t.id) ?? []).sort(
              (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
            );
            childSubs.forEach(su => {
              const sKey = makeKey('subtheme', su.id);
              out.push({
                key: sKey,
                parentKey: tKey,
                level: 'subtheme',
                id: su.id,
                code: su.code,
                name: su.name,
                description: su.description ?? '',
                sort_order: su.sort_order ?? null,
              });
            });
          }
        });
      }
    });

    return out;
  }, [pillars, themes, subs, expanded]);

  /** Expand/collapse click */
  const toggleExpand = (row: UIRow) => {
    const hasChildren =
      row.level === 'pillar'
        ? themes.some(t => t.pillar_id === row.id)
        : row.level === 'theme'
        ? subs.some(su => su.theme_id === row.id)
        : false;
    if (!hasChildren) return; // subthemes have no caret
    const next = new Set(expanded);
    if (next.has(row.key)) next.delete(row.key);
    else next.add(row.key);
    setExpanded(next);
  };

  /** -------------------- CRUD -------------------- */
  const openAdd = (parent: UIRow | null) => {
    const level: Level = parent == null ? 'pillar' : parent.level === 'pillar' ? 'theme' : 'subtheme';
    setEditing({
      key: makeKey(level, 'new'),
      id: 'new',
      level,
      code: '',
      name: '',
      description: '',
      sort_order: 1,
      parentKey: parent?.key,
    } as any);
    form.setFieldsValue({ code: '', name: '', description: '', sort_order: 1 });
    setModalOpen(true);
  };

  const openEdit = (row: UIRow) => {
    setEditing(row);
    form.setFieldsValue({
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      sort_order: row.sort_order ?? undefined,
    });
    setModalOpen(true);
  };

  const doDelete = async (row: UIRow) => {
    // prevent deleting nodes with children
    if (row.level === 'pillar' && themes.some(t => t.pillar_id === row.id)) {
      message.warning('Delete themes first. Pillar has children.');
      return;
    }
    if (row.level === 'theme' && subs.some(su => su.theme_id === row.id)) {
      message.warning('Delete sub-themes first. Theme has children.');
      return;
    }

    const table = row.level === 'pillar' ? 'pillars' : row.level === 'theme' ? 'themes' : 'subthemes';
    const { error } = await supabase.from(table).delete().eq('id', row.id);
    if (error) return message.error(error.message);
    message.success('Deleted');
    refresh();
  };

  const saveModal = async () => {
    try {
      const vals = await form.validateFields();
      if (!editing) return;

      const isNew = editing.id === 'new';
      if (editing.level === 'pillar') {
        if (isNew) {
          const { error } = await supabase.from('pillars').insert({
            code: vals.code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) return message.error(error.message);
        } else {
          const { error } = await supabase
            .from('pillars')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? null,
            })
            .eq('id', editing.id);
          if (error) return message.error(error.message);
        }
      } else if (editing.level === 'theme') {
        const parentId =
          editing.parentKey && String(editing.parentKey).startsWith('P:')
            ? String(editing.parentKey).slice(2)
            : (themes.find(t => t.id === editing.id)?.pillar_id as any);
        if (isNew) {
          const { error } = await supabase.from('themes').insert({
            pillar_id: parentId,
            code: vals.code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) return message.error(error.message);
        } else {
          const { error } = await supabase
            .from('themes')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? null,
            })
            .eq('id', editing.id);
          if (error) return message.error(error.message);
        }
      } else {
        const parentId =
          editing.parentKey && String(editing.parentKey).startsWith('T:')
            ? String(editing.parentKey).slice(2)
            : (subs.find(su => su.id === editing.id)?.theme_id as any);
        if (isNew) {
          const { error } = await supabase.from('subthemes').insert({
            theme_id: parentId,
            code: vals.code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) return message.error(error.message);
        } else {
          const { error } = await supabase
            .from('subthemes')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? null,
            })
            .eq('id', editing.id);
          if (error) return message.error(error.message);
        }
      }

      setModalOpen(false);
      setEditing(null);
      await refresh();
      message.success('Saved');
    } catch {
      /* no-op - form errors are shown inline */
    }
  };

  /** -------------------- CSV export/import -------------------- */
  const exportCSV = () => {
    // Single sheet with `level,code,name,description,sort_order,parent_code`
    const byCodeP = new Map(pillars.map(p => [p.code, p] as const));
    const byCodeT = new Map(themes.map(t => [t.code, t] as const));
    const rows: Record<string, unknown>[] = [];

    pillars.forEach(p => {
      rows.push({
        level: 'pillar',
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? '',
        parent_code: '',
      });
    });
    themes.forEach(t => {
      const parent = pillars.find(p => p.id === t.pillar_id);
      rows.push({
        level: 'theme',
        code: t.code,
        name: t.name,
        description: t.description ?? '',
        sort_order: t.sort_order ?? '',
        parent_code: parent?.code ?? '',
      });
    });
    subs.forEach(su => {
      const parent = themes.find(t => t.id === su.theme_id);
      rows.push({
        level: 'subtheme',
        code: su.code,
        name: su.name,
        description: su.description ?? '',
        sort_order: su.sort_order ?? '',
        parent_code: parent?.code ?? '',
      });
    });

    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'framework.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Import policy: update by code; creates only if parent_code exists and we can resolve it.
  const handleCSVText = async (text: string) => {
    const rows = parseCSV(text);
    if (!rows.length) return message.info('No rows found in CSV.');

    // Build code -> id maps
    const pByCode = new Map(pillars.map(p => [p.code, p]));
    const tByCode = new Map(themes.map(t => [t.code, t]));
    const ops: Promise<any>[] = [];

    rows.forEach(r => {
      const level = (r.level || '').toLowerCase().trim() as Level;
      const code = r.code?.trim();
      if (!level || !code) return;

      const patch = {
        name: r.name ?? '',
        description: r.description ?? '',
        sort_order: r.sort_order ? Number(r.sort_order) : null,
      } as any;

      if (level === 'pillar') {
        const existing = pByCode.get(code);
        if (existing) {
          ops.push(supabase.from('pillars').update({ code, ...patch }).eq('id', existing.id));
        } else {
          ops.push(supabase.from('pillars').insert({ code, ...patch }));
        }
      } else if (level === 'theme') {
        const parent = r.parent_code ? pByCode.get(r.parent_code) : undefined;
        const existing = tByCode.get(code);
        if (existing) {
          ops.push(supabase.from('themes').update({ code, ...patch }).eq('id', existing.id));
        } else if (parent) {
          ops.push(supabase.from('themes').insert({ pillar_id: parent.id, code, ...patch }));
        }
      } else if (level === 'subtheme') {
        const parent = r.parent_code ? tByCode.get(r.parent_code) : undefined;
        const existing = subs.find(su => su.code === code);
        if (existing) {
          ops.push(supabase.from('subthemes').update({ code, ...patch }).eq('id', existing.id));
        } else if (parent) {
          ops.push(supabase.from('subthemes').insert({ theme_id: parent.id, code, ...patch }));
        }
      }
    });

    setLoading(true);
    try {
      const results = await Promise.all(ops);
      const err = results.find(r => r?.error)?.error;
      if (err) throw err;
      message.success('CSV processed');
      await refresh();
    } catch (e: any) {
      message.error(e.message || 'CSV import failed');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    accept: '.csv,text/csv',
    showUploadList: false,
    beforeUpload: async (file) => {
      const text = await file.text();
      await handleCSVText(text);
      return false; // prevent real upload
    },
  };

  /** -------------------- Render -------------------- */
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Link href="/" style={{ color: '#1677ff' }}>
          <ArrowLeftOutlined /> Dashboard
        </Link>
        <h1 style={{ margin: 0, fontSize: 22 }}>Framework Editor</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button icon={<ReloadOutlined />} onClick={refresh} loading={loading}>
            Refresh
          </Button>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Import CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openAdd(null)}>
            Add Pillar
          </Button>
        </div>
      </div>

      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%', // responsive width split
          padding: '10px 16px',
          borderTop: '1px solid #f0f0f0',
          borderBottom: '1px solid #f0f0f0',
          color: '#888',
          fontWeight: 600,
        }}
      >
        <div>Name</div>
        <div>Description / Notes</div>
      </div>

      {/* Rows */}
      <div role="table" aria-label="framework-table">
        {flatData.map((row) => {
          const hasChildren =
            row.level === 'pillar'
              ? themes.some(t => t.pillar_id === row.id)
              : row.level === 'theme'
              ? subs.some(su => su.theme_id === row.id)
              : false;

          return (
            <div
              key={row.key}
              style={{
                display: 'grid',
                gridTemplateColumns: '60% 40%',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #f5f5f5',
              }}
            >
              {/* Name + type tag + code + caret */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* caret (hidden for subtheme / or when no children) */}
                <button
                  aria-label="expand"
                  onClick={() => toggleExpand(row)}
                  disabled={!hasChildren}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                    cursor: hasChildren ? 'pointer' : 'default',
                    rotate: expanded.has(row.key) ? '90deg' : '0deg',
                    display: row.level === 'subtheme' ? 'none' : 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 12, lineHeight: 1, opacity: hasChildren ? 1 : 0.4 }}>▶</span>
                </button>

                {/* Tag + code */}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {levelTag(row.level)}
                  <span style={{ color: '#999' }}>[{row.code}]</span>
                </span>

                {/* Name text */}
                <span style={{ fontWeight: 600 }}>{row.name}</span>
              </div>

              {/* Description + actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ color: '#555' }}>{row.description}</div>

                <Space size="small">
                  {/* Add child (only pillar/theme) */}
                  {(row.level === 'pillar' || row.level === 'theme') && (
                    <Tooltip title={`Add ${row.level === 'pillar' ? 'Theme' : 'Sub-theme'}`}>
                      <Button size="small" icon={<PlusOutlined />} onClick={() => openAdd(row)} />
                    </Tooltip>
                  )}
                  <Tooltip title="Edit">
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => doDelete(row)}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add modal */}
      <Modal
        title={editing ? (editing.id === 'new' ? `Add ${editing.level}` : `Edit ${editing.level}`) : 'Edit'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveModal}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input placeholder={editing?.level === 'pillar' ? 'P1' : editing?.level === 'theme' ? 'T1.1' : 'ST1.1.1'} />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description / Notes">
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
