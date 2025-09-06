'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0; // never cache/SSG this page

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// ---- Supabase client (robust to export name changes) -----------------------
// keep your other imports
import * as sb from '@/lib/supabaseClient';

// Helper that works with any export shape: getBrowserClient, createClient, default, etc.
const makeBrowserClient = () => {
  // @ts-ignore – allow either default or named exports
  const f =
    (sb as any).getBrowserClient ??
    (sb as any).createBrowserClient ??
    (sb as any).createClient ??
    (sb as any).default;

  if (!f) throw new Error('No browser Supabase client export found in lib/supabaseClient');
  return f();
};

// ---- inside your component:
const supabase = React.useMemo(() => {
  if (typeof window === 'undefined') return null; // avoid during build/SSR
  return makeBrowserClient();
}, []);

if (!supabase) {
  // Optional: a tiny skeleton to avoid flashing during hydration
  return null;
}

// ---- Types (loose to keep Vercel happy) ------------------------------------
type Level = 'pillar' | 'theme' | 'subtheme';

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
  pillar_code: string; // authoritative pointer to pillar
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: string;
  code: string;
  theme_code: string; // authoritative pointer to theme
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

// unified UI row (tree)
type UIRow = {
  key: string; // P:code, T:code, S:code
  level: Level;
  code: string;
  parent_code?: string; // for theme/subtheme
  name: string;
  description?: string | null;
  sort_order?: number | null;
  children?: UIRow[];
};

// ---- Helpers ----------------------------------------------------------------
const levelTag = (lvl: Level, code: string) => {
  const color =
    lvl === 'pillar' ? 'blue' : lvl === 'theme' ? 'green' : 'red';
  const label =
    lvl === 'pillar' ? 'Pillar' : lvl === 'theme' ? 'Theme' : 'Sub-theme';
  return (
    <Space size={4} align="center">
      <Tag color={color} style={{ marginRight: 8 }}>
        {label}
      </Tag>
      <span style={{ color: '#999', fontSize: 12 }}>[{code}]</span>
    </Space>
  );
};

const buildTree = (
  pillars: PillarRow[],
  themes: ThemeRow[],
  subs: SubthemeRow[]
): UIRow[] => {
  const tByP = new Map<string, ThemeRow[]>();
  const sByT = new Map<string, SubthemeRow[]>();

  themes.forEach((t) => {
    if (!tByP.has(t.pillar_code)) tByP.set(t.pillar_code, []);
    tByP.get(t.pillar_code)!.push(t);
  });
  subs.forEach((s) => {
    if (!sByT.has(s.theme_code)) sByT.set(s.theme_code, []);
    sByT.get(s.theme_code)!.push(s);
  });

  return pillars.map<UIRow>((p) => {
    const kidsT =
      (tByP.get(p.code) || []).map<UIRow>((t) => {
        const kidsS =
          (sByT.get(t.code) || []).map<UIRow>((s) => ({
            key: `S:${s.code}`,
            level: 'subtheme',
            code: s.code,
            parent_code: t.code,
            name: s.name,
            description: s.description ?? '',
            sort_order: s.sort_order ?? 1,
            children: undefined, // no deeper children -> caret will not render
          }));

        return {
          key: `T:${t.code}`,
          level: 'theme',
          code: t.code,
          parent_code: p.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? 1,
          children: kidsS.length ? kidsS : undefined,
        };
      }) ?? [];

    return {
      key: `P:${p.code}`,
      level: 'pillar',
      code: p.code,
      name: p.name,
      description: p.description ?? '',
      sort_order: p.sort_order ?? 1,
      children: kidsT.length ? kidsT : undefined,
    };
  });
};

const flatten = (rows: UIRow[]): UIRow[] => {
  const out: UIRow[] = [];
  const walk = (r: UIRow) => {
    out.push({ ...r, children: r.children }); // Table uses children for tree
    (r.children || []).forEach(walk);
  };
  rows.forEach(walk);
  return out;
};

// ---- Page -------------------------------------------------------------------
export default function FrameworkPage() {
  const supabase = useMemo(() => getSb(), []);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<UIRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // editing modal
  const [form] = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [editContext, setEditContext] = useState<
    | { mode: 'edit' | 'add'; level: Level; parent_code?: string; code?: string }
    | null
  >(null);

  // fetch all
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, tr, sr] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

      if (pr.error) throw pr.error;
      if (tr.error) throw tr.error;
      if (sr.error) throw sr.error;

      const tree = buildTree(pr.data || [], tr.data || [], sr.data || []);
      setData(tree);

      // default: expand all pillars only
      setExpandedKeys((tree || []).map((p) => p.key));
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ----- CRUD ---------------------------------------------------------------
  const openAdd = (level: Level, parent?: UIRow) => {
    setEditContext({
      mode: 'add',
      level,
      parent_code: parent?.code,
    });
    form.setFieldsValue({
      code: '',
      name: '',
      description: '',
      sort_order: 1,
    });
    setEditOpen(true);
  };

  const openEdit = (row: UIRow) => {
    setEditContext({
      mode: 'edit',
      level: row.level,
      code: row.code,
      parent_code: row.parent_code,
    });
    form.setFieldsValue({
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      sort_order: row.sort_order ?? 1,
    });
    setEditOpen(true);
  };

  const handleDelete = async (row: UIRow) => {
    Modal.confirm({
      title: 'Delete row',
      content: `Are you sure you want to delete ${row.level} "${row.name}"?`,
      okType: 'danger',
      async onOk() {
        setLoading(true);
        try {
          if (row.level === 'pillar') {
            // delete pillar + its children (themes/subthemes via FKs or cascades if set)
            const { error } = await supabase.from('pillars').delete().eq('code', row.code);
            if (error) throw error;
          } else if (row.level === 'theme') {
            const { error } = await supabase.from('themes').delete().eq('code', row.code);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('subthemes').delete().eq('code', row.code);
            if (error) throw error;
          }
          message.success('Deleted');
          await loadAll();
        } catch (e: any) {
          console.error(e);
          message.error(e?.message || 'Delete failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      const ctx = editContext!;
      setLoading(true);

      if (ctx.mode === 'add') {
        if (ctx.level === 'pillar') {
          const { error } = await supabase.from('pillars').insert({
            code: vals.code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        } else if (ctx.level === 'theme') {
          if (!ctx.parent_code) throw new Error('Missing parent pillar_code');
          const { error } = await supabase.from('themes').insert({
            code: vals.code,
            pillar_code: ctx.parent_code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        } else {
          if (!ctx.parent_code) throw new Error('Missing parent theme_code');
          const { error } = await supabase.from('subthemes').insert({
            code: vals.code,
            theme_code: ctx.parent_code,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: vals.sort_order ?? 1,
          });
          if (error) throw error;
        }
      } else {
        // EDIT
        if (ctx.level === 'pillar') {
          const { error } = await supabase
            .from('pillars')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('code', ctx.code);
          if (error) throw error;
        } else if (ctx.level === 'theme') {
          const { error } = await supabase
            .from('themes')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('code', ctx.code);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('subthemes')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('code', ctx.code);
          if (error) throw error;
        }
      }

      message.success('Saved');
      setEditOpen(false);
      setEditContext(null);
      await loadAll();
    } catch (e: any) {
      if (e?.errorFields) return; // form validation error
      console.error(e);
      message.error(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  // ----- CSV Export / Import -------------------------------------------------
  const toCSV = (rows: UIRow[]) => {
    const flat = flatten(rows);
    const header = 'level,code,parent_code,name,description,sort_order';
    const lines = flat.map((r) =>
      [
        r.level,
        r.code,
        r.parent_code ?? '',
        (r.name || '').replaceAll('"', '""'),
        (r.description || '').replaceAll('"', '""'),
        r.sort_order ?? 1,
      ]
        .map((v) => (typeof v === 'string' ? `"${v}"` : String(v)))
        .join(',')
    );
    return [header, ...lines].join('\n');
  };

  const downloadCSV = () => {
    const blob = new Blob([toCSV(data)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'framework.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    // minimal CSV parser (quotes supported)
    const rows: string[][] = [];
    let i = 0,
      cur = '',
      inQ = false,
      row: string[] = [];
    const pushCell = () => {
      row.push(cur);
      cur = '';
    };
    const pushRow = () => {
      if (row.length) rows.push(row);
      row = [];
    };

    while (i < text.length) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            cur += '"';
            i += 2;
            continue;
          } else {
            inQ = false;
            i++;
            continue;
          }
        }
        cur += ch;
        i++;
        continue;
      }
      if (ch === '"') {
        inQ = true;
        i++;
        continue;
      }
      if (ch === ',') {
        pushCell();
        i++;
        continue;
      }
      if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        pushCell();
        pushRow();
        i++;
        continue;
      }
      cur += ch;
      i++;
    }
    if (cur.length || row.length) {
      pushCell();
      pushRow();
    }
    return rows;
  };

  const uploadCSV = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (!rows.length) throw new Error('Empty CSV');
      const [h, ...dataRows] = rows;
      const idx = {
        level: h.indexOf('level'),
        code: h.indexOf('code'),
        parent_code: h.indexOf('parent_code'),
        name: h.indexOf('name'),
        description: h.indexOf('description'),
        sort_order: h.indexOf('sort_order'),
      };
      if (
        idx.level < 0 ||
        idx.code < 0 ||
        idx.name < 0 ||
        idx.sort_order < 0
      )
        throw new Error(
          'Header must include: level, code, parent_code, name, description, sort_order'
        );

      setLoading(true);

      // Upsert one-by-one (clear and simple; avoids type issues with Promise arrays)
      for (const r of dataRows) {
        if (!r.length) continue;
        const lvl = (r[idx.level] || '').trim() as Level;
        const code = (r[idx.code] || '').trim();
        const parent = (r[idx.parent_code] || '').trim();
        const name = (r[idx.name] || '').trim();
        const description = (r[idx.description] || '').trim();
        const sort_order = Number(r[idx.sort_order] || '1') || 1;

        if (!code || !name) continue;

        if (lvl === 'pillar') {
          // try update; if 0 rows affected, insert
          const { data: existing, error: qe } = await supabase
            .from('pillars')
            .select('id')
            .eq('code', code)
            .maybeSingle();
          if (qe) throw qe;

          if (existing) {
            const { error } = await supabase
              .from('pillars')
              .update({ code, name, description, sort_order })
              .eq('code', code);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('pillars')
              .insert({ code, name, description, sort_order });
            if (error) throw error;
          }
        } else if (lvl === 'theme') {
          if (!parent) throw new Error(`Theme ${code} missing parent pillar_code`);
          const { data: existing, error: qe } = await supabase
            .from('themes')
            .select('id')
            .eq('code', code)
            .maybeSingle();
          if (qe) throw qe;

          if (existing) {
            const { error } = await supabase
              .from('themes')
              .update({ code, pillar_code: parent, name, description, sort_order })
              .eq('code', code);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('themes')
              .insert({ code, pillar_code: parent, name, description, sort_order });
            if (error) throw error;
          }
        } else if (lvl === 'subtheme') {
          if (!parent) throw new Error(`Sub-theme ${code} missing parent theme_code`);
          const { data: existing, error: qe } = await supabase
            .from('subthemes')
            .select('id')
            .eq('code', code)
            .maybeSingle();
          if (qe) throw qe;

          if (existing) {
            const { error } = await supabase
              .from('subthemes')
              .update({ code, theme_code: parent, name, description, sort_order })
              .eq('code', code);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('subthemes')
              .insert({ code, theme_code: parent, name, description, sort_order });
            if (error) throw error;
          }
        }
      }

      message.success('CSV imported');
      await loadAll();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'CSV import failed');
    } finally {
      setLoading(false);
    }
  };

  // ----- Columns ------------------------------------------------------------
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type / Code',
      dataIndex: 'level',
      key: 'type',
      width: '20%',
      render: (_: any, rec: UIRow) => levelTag(rec.level, rec.code),
    },
    {
      title: 'Name & Description',
      key: 'name',
      width: '60%',
      render: (_: any, rec: UIRow) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography.Text strong style={{ lineHeight: 1.2 }}>
            {rec.name}
          </Typography.Text>
          {rec.description ? (
            <Typography.Text type="secondary" style={{ lineHeight: 1.2 }}>
              {rec.description}
            </Typography.Text>
          ) : null}
        </div>
      ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort',
      width: '8%',
      render: (v: any) => v ?? 1,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, rec: UIRow) => (
        <Space size="small" wrap>
          {/* Add buttons depend on level */}
          {rec.level === 'pillar' && (
            <Button
              icon={<PlusOutlined />}
              size="small"
              onClick={() => openAdd('theme', rec)}
            >
              Theme
            </Button>
          )}
          {rec.level === 'theme' && (
            <Button
              icon={<PlusOutlined />}
              size="small"
              onClick={() => openAdd('subtheme', rec)}
            >
              Sub-theme
            </Button>
          )}
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(rec)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(rec)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Compute tree on every data
  const treeData = data;

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12 }}>
        <Link href="/" prefetch={false}>
          <Button icon={<ArrowLeftOutlined />}>Back to Dashboard</Button>
        </Link>

        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => openAdd('pillar')}
        >
          Add Pillar
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => loadAll()}
        >
          Refresh
        </Button>

        <Button
          icon={<DownloadOutlined />}
          onClick={downloadCSV}
        >
          Export CSV
        </Button>

        <Upload
          accept=".csv,text/csv"
          showUploadList={false}
          beforeUpload={(file) => {
            uploadCSV(file);
            return false; // prevent auto-upload
          }}
        >
          <Button icon={<UploadOutlined />}>Import CSV</Button>
        </Upload>
      </Space>

      <Table<UIRow>
        dataSource={treeData}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            setExpandedKeys((prev) =>
              expanded
                ? Array.from(new Set([...prev, record.key]))
                : prev.filter((k) => k !== record.key)
            );
          },
          rowExpandable: (rec) => Array.isArray(rec.children) && rec.children.length > 0,
        }}
        // column widths are % above; make rows tighter:
        size="small"
      />

      <Modal
        open={editOpen}
        title={
          editContext?.mode === 'add'
            ? `Add ${editContext.level}`
            : `Edit ${editContext?.level}`
        }
        onCancel={() => {
          setEditOpen(false);
          setEditContext(null);
        }}
        onOk={handleSave}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input placeholder="e.g., P1 or T1.2 or S1.2.3" />
          </Form.Item>
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
          <Form.Item label="Sort order" name="sort_order" initialValue={1}>
            <InputNumber min={1} />
          </Form.Item>
          {editContext?.mode === 'add' && editContext?.level !== 'pillar' && (
            <Form.Item label="Parent (fixed)">
              <Input disabled value={editContext?.parent_code ?? ''} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
