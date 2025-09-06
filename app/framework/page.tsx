'use client';
export const dynamic = 'force-dynamic'; // avoids accidental prerendering

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
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

const { Text } = Typography;

/* -----------------------------------------------------------
   Supabase client (works with any export shape in your helper)
   ----------------------------------------------------------- */
async function resolveBrowserSupabase(): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  try {
    const mod: any = await import('@/lib/supabaseClient');
    const client =
      typeof mod.getBrowserClient === 'function'
        ? mod.getBrowserClient()
        : typeof mod.createClient === 'function'
        ? mod.createClient()
        : typeof mod.default === 'function'
        ? mod.default()
        : null;
    return client ?? null;
  } catch {
    return null;
  }
}

/* -------------------
   Loose row types
   ------------------- */
type PillarRow = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: string;
  code: string;
  pillar_code: string; // FK to pillars.code
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: string;
  code: string;
  pillar_code: string; // redundant but present in your schema
  theme_code: string;  // FK to themes.code
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

/* -----------------------------------------
   Unified UI row used by the AntD <Table />
   ----------------------------------------- */
type Level = 'pillar' | 'theme' | 'subtheme';

type UIRow = {
  key: string;
  level: Level;
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillar_code?: string | null;
  theme_code?: string | null;
  children?: UIRow[];
};

/* -----------------------------
   Helper: small CSV utilities
   ----------------------------- */
function csvEscape(v: any) {
  const s = v ?? '';
  const needsQuotes = /[",\n]/.test(String(s));
  const t = String(s).replace(/"/g, '""');
  return needsQuotes ? `"${t}"` : t;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* -----------------------------
   Main page component
   ----------------------------- */
export default function FrameworkPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [editLevel, setEditLevel] = useState<Level>('pillar');
  const [form] = Form.useForm();

  // create supabase client only in browser
  useEffect(() => {
    let alive = true;
    (async () => {
      const client = await resolveBrowserSupabase();
      if (alive) setSupabase(client);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // fetch all three tables
  async function fetchAll() {
    if (!supabase) return;
    setLoading(true);
    try {
      const [{ data: p, error: pe }, { data: t, error: te }, { data: s, error: se }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);
      if (pe) throw pe;
      if (te) throw te;
      if (se) throw se;
      setPillars(p ?? []);
      setThemes(t ?? []);
      setSubs(s ?? []);
    } catch (err: any) {
      message.error(err?.message ?? 'Failed to load framework.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (supabase) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  /* ------------------------------------
     Build hierarchical data tree for UI
     ------------------------------------ */
  const dataTree: UIRow[] = useMemo(() => {
    const pByCode = new Map(pillars.map((p) => [p.code, p]));
    const tByPillar = new Map<string, ThemeRow[]>();
    for (const t of themes) {
      const arr = tByPillar.get(t.pillar_code) ?? [];
      arr.push(t);
      tByPillar.set(t.pillar_code, arr);
    }
    const sByTheme = new Map<string, SubthemeRow[]>();
    for (const s of subs) {
      const arr = sByTheme.get(s.theme_code) ?? [];
      arr.push(s);
      sByTheme.set(s.theme_code, arr);
    }

    const tree: UIRow[] = pillars.map((p) => {
      const tChildren = (tByPillar.get(p.code) ?? []).map((t) => {
        const sChildren = (sByTheme.get(t.code) ?? []).map((st) => ({
          key: `S|${st.id}`,
          level: 'subtheme' as const,
          id: st.id,
          code: st.code,
          name: st.name,
          description: st.description ?? '',
          sort_order: st.sort_order ?? 1,
          pillar_code: st.pillar_code,
          theme_code: st.theme_code,
        }));
        return {
          key: `T|${t.id}`,
          level: 'theme' as const,
          id: t.id,
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? 1,
          pillar_code: t.pillar_code,
          theme_code: t.code,
          children: sChildren,
        };
      });

      return {
        key: `P|${p.id}`,
        level: 'pillar' as const,
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? 1,
        children: tChildren,
      };
    });

    return tree;
  }, [pillars, themes, subs]);

  /* --------------------------
     Table columns & rendering
     -------------------------- */
  const levelTag = (row: UIRow) => {
    const color =
      row.level === 'pillar' ? 'geekblue' : row.level === 'theme' ? 'green' : 'volcano';
    const label = row.level === 'pillar' ? 'Pillar' : row.level === 'theme' ? 'Theme' : 'Sub-theme';
    return (
      <Space size={4}>
        <Tag color={color} style={{ marginRight: 4 }}>
          {label}
        </Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>[{row.code}]</Text>
      </Space>
    );
  };

  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type / Code',
      dataIndex: 'level',
      key: 'level',
      width: '18%',
      render: (_: any, row) => levelTag(row),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '28%',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '36%',
      render: (text) => <Text style={{ whiteSpace: 'pre-wrap' }}>{text ?? ''}</Text>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: '6%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, row) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditor(row.level, row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
          {row.level !== 'subtheme' && (
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => openEditor(row.level === 'pillar' ? 'theme' : 'subtheme', {
                // parent scaffold
                id: '',
                key: '',
                level: row.level === 'pillar' ? 'theme' : 'subtheme',
                code: '',
                name: '',
                description: '',
                sort_order: 1,
                pillar_code: row.level === 'pillar' ? (pillars.find(p => p.id === row.id)?.code ?? '') : row.pillar_code ?? '',
                theme_code: row.level === 'pillar' ? undefined : (themes.find(t => t.id === row.id)?.code ?? row.theme_code ?? ''),
              } as UIRow)}
            >
              Add Child
            </Button>
          )}
        </Space>
      ),
    },
  ];

  /* -----------------
     CRUD handlers
     ----------------- */
  function openEditor(level: Level, row?: UIRow | null) {
    setEditLevel(level);
    setEditing(row ?? null);
    // initialize form values
    if (row) {
      form.setFieldsValue({
        code: row.code,
        name: row.name,
        description: row.description ?? '',
        sort_order: row.sort_order ?? 1,
        pillar_code: row.pillar_code ?? '',
        theme_code: row.theme_code ?? '',
      });
    } else {
      form.setFieldsValue({
        code: '',
        name: '',
        description: '',
        sort_order: 1,
        pillar_code: '',
        theme_code: '',
      });
    }
    setEditorOpen(true);
  }

  async function handleSave() {
    if (!supabase) return;
    const vals = await form.validateFields();
    const isEdit = !!editing;

    try {
      setLoading(true);

      if (editLevel === 'pillar') {
        if (isEdit) {
          const { error } = await supabase
            .from('pillars')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', editing!.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('pillars').insert({
            code: vals.code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        }
      } else if (editLevel === 'theme') {
        if (!vals.pillar_code) throw new Error('pillar_code is required for a Theme.');
        if (isEdit) {
          const { error } = await supabase
            .from('themes')
            .update({
              code: vals.code,
              pillar_code: vals.pillar_code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', editing!.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('themes').insert({
            code: vals.code,
            pillar_code: vals.pillar_code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        }
      } else {
        // subtheme
        if (!vals.pillar_code || !vals.theme_code) {
          throw new Error('pillar_code and theme_code are required for a Sub-theme.');
        }
        if (isEdit) {
          const { error } = await supabase
            .from('subthemes')
            .update({
              code: vals.code,
              pillar_code: vals.pillar_code,
              theme_code: vals.theme_code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', editing!.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('subthemes').insert({
            code: vals.code,
            pillar_code: vals.pillar_code,
            theme_code: vals.theme_code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        }
      }

      setEditorOpen(false);
      setEditing(null);
      await fetchAll();
      message.success('Saved.');
    } catch (err: any) {
      message.error(err?.message ?? 'Failed to save.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(row: UIRow) {
    if (!supabase) return;
    Modal.confirm({
      title: 'Confirm delete',
      content:
        row.level === 'pillar'
          ? 'Delete this Pillar and all child Themes/Sub-themes?'
          : row.level === 'theme'
          ? 'Delete this Theme and all child Sub-themes?'
          : 'Delete this Sub-theme?',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          if (row.level === 'pillar') {
            // delete children first (best effort)
            const tcodes = themes.filter((t) => t.pillar_code === row.code).map((t) => t.code);
            if (tcodes.length) {
              await supabase.from('subthemes').delete().in('theme_code', tcodes);
              await supabase.from('themes').delete().in('code', tcodes);
            }
            await supabase.from('pillars').delete().eq('id', row.id);
          } else if (row.level === 'theme') {
            await supabase.from('subthemes').delete().eq('theme_code', row.code);
            await supabase.from('themes').delete().eq('id', row.id);
          } else {
            await supabase.from('subthemes').delete().eq('id', row.id);
          }
          await fetchAll();
          message.success('Deleted.');
        } catch (err: any) {
          message.error(err?.message ?? 'Delete failed.');
        } finally {
          setLoading(false);
        }
      },
    });
  }

  /* ------------------------
     CSV Export / Import
     ------------------------ */
  function handleExportCSV() {
    // one flat CSV: level,code,name,description,sort_order,pillar_code,theme_code
    const header =
      'level,code,name,description,sort_order,pillar_code,theme_code';
    const rows: string[] = [];

    for (const p of pillars) {
      rows.push(
        [
          'pillar',
          csvEscape(p.code),
          csvEscape(p.name),
          csvEscape(p.description ?? ''),
          csvEscape(p.sort_order ?? 1),
          '',
          '',
        ].join(',')
      );
    }
    for (const t of themes) {
      rows.push(
        [
          'theme',
          csvEscape(t.code),
          csvEscape(t.name),
          csvEscape(t.description ?? ''),
          csvEscape(t.sort_order ?? 1),
          csvEscape(t.pillar_code),
          '',
        ].join(',')
      );
    }
    for (const s of subs) {
      rows.push(
        [
          'subtheme',
          csvEscape(s.code),
          csvEscape(s.name),
          csvEscape(s.description ?? ''),
          csvEscape(s.sort_order ?? 1),
          csvEscape(s.pillar_code),
          csvEscape(s.theme_code),
        ].join(',')
      );
    }

    const csv = [header, ...rows].join('\n');
    downloadText('framework_export.csv', csv);
  }

  function parseCSV(text: string): any[] {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    if (!lines.length) return [];
    const header = lines[0].split(',').map((h) => h.trim());
    const out: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i];
      if (!raw.trim()) continue;
      // very small CSV parser (handles quotes & commas)
      const cells: string[] = [];
      let cur = '';
      let inQ = false;
      for (let j = 0; j < raw.length; j++) {
        const ch = raw[j];
        if (inQ) {
          if (ch === '"' && raw[j + 1] === '"') {
            cur += '"';
            j++;
          } else if (ch === '"') {
            inQ = false;
          } else {
            cur += ch;
          }
        } else {
          if (ch === '"') inQ = true;
          else if (ch === ',') {
            cells.push(cur);
            cur = '';
          } else {
            cur += ch;
          }
        }
      }
      cells.push(cur);
      const rec: any = {};
      header.forEach((h, idx) => (rec[h] = (cells[idx] ?? '').trim()));
      out.push(rec);
    }
    return out;
  }

  async function handleImportCSV(file: File) {
    if (!supabase) return;
    try {
      setLoading(true);
      const text = await file.text();
      const rows = parseCSV(text);

      // import in dependency order
      const pRows = rows.filter((r) => r.level === 'pillar');
      const tRows = rows.filter((r) => r.level === 'theme');
      const sRows = rows.filter((r) => r.level === 'subtheme');

      // upsert pillars by code
      for (const r of pRows) {
        const patch = {
          code: r.code,
          name: r.name,
          description: r.description ?? '',
          sort_order: Number(r.sort_order || 1),
        };
        // try update by code
        const { data: exists } = await supabase.from('pillars').select('id').eq('code', r.code).limit(1);
        if (exists && exists.length) {
          const { error } = await supabase.from('pillars').update(patch).eq('code', r.code);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('pillars').insert(patch);
          if (error) throw error;
        }
      }

      // upsert themes
      for (const r of tRows) {
        const patch = {
          code: r.code,
          pillar_code: r.pillar_code,
          name: r.name,
          description: r.description ?? '',
          sort_order: Number(r.sort_order || 1),
        };
        const { data: exists } = await supabase.from('themes').select('id').eq('code', r.code).limit(1);
        if (exists && exists.length) {
          const { error } = await supabase.from('themes').update(patch).eq('code', r.code);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('themes').insert(patch);
          if (error) throw error;
        }
      }

      // upsert subthemes
      for (const r of sRows) {
        const patch = {
          code: r.code,
          pillar_code: r.pillar_code,
          theme_code: r.theme_code,
          name: r.name,
          description: r.description ?? '',
          sort_order: Number(r.sort_order || 1),
        };
        const { data: exists } = await supabase.from('subthemes').select('id').eq('code', r.code).limit(1);
        if (exists && exists.length) {
          const { error } = await supabase.from('subthemes').update(patch).eq('code', r.code);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('subthemes').insert(patch);
          if (error) throw error;
        }
      }

      await fetchAll();
      message.success('CSV import complete.');
    } catch (err: any) {
      message.error(err?.message ?? 'CSV import failed.');
    } finally {
      setLoading(false);
    }
  }

  /* -----------------
     Render
     ----------------- */
  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Link href="/">
            <Button icon={<ArrowLeftOutlined />}>Back to dashboard</Button>
          </Link>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>
            Refresh
          </Button>
        </Space>
        <Space>
          <Upload
            showUploadList={false}
            accept=".csv"
            beforeUpload={async (file) => {
              await handleImportCSV(file);
              return false; // prevent auto upload
            }}
          >
            <Button icon={<UploadOutlined />}>Import CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor('pillar', null)}>
            Add Pillar
          </Button>
        </Space>
      </Space>

      <Table<UIRow>
        dataSource={dataTree}
        columns={columns}
        loading={loading}
        rowKey={(r) => r.key}
        size="small"
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            const key = record.key;
            setExpandedKeys((prev) =>
              expanded ? Array.from(new Set([...prev, key])) : prev.filter((k) => k !== key)
            );
          },
          // sub-themes have no children => disable caret
          rowExpandable: (record) => (record.level !== 'subtheme' ? true : false),
        }}
        style={{ width: '100%' }}
      />

      <Modal
        open={editorOpen}
        onCancel={() => setEditorOpen(false)}
        onOk={handleSave}
        okText="Save"
        title={
          editing
            ? `Edit ${editLevel === 'pillar' ? 'Pillar' : editLevel === 'theme' ? 'Theme' : 'Sub-theme'}`
            : `Add ${editLevel === 'pillar' ? 'Pillar' : editLevel === 'theme' ? 'Theme' : 'Sub-theme'}`
        }
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input placeholder="e.g., P1 or H1.2A" />
          </Form.Item>

          {editLevel !== 'pillar' && (
            <Form.Item
              label="Pillar Code (parent)"
              name="pillar_code"
              rules={[{ required: true, message: 'pillar_code is required' }]}
            >
              <Input placeholder="Must match an existing Pillar code" />
            </Form.Item>
          )}

          {editLevel === 'subtheme' && (
            <Form.Item
              label="Theme Code (parent)"
              name="theme_code"
              rules={[{ required: true, message: 'theme_code is required' }]}
            >
              <Input placeholder="Must match an existing Theme code" />
            </Form.Item>
          )}

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Sort Order" name="sort_order" initialValue={1}>
            <InputNumber min={1} precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
