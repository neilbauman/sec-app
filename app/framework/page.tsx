'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Tag,
  Space,
  Tooltip,
  Popconfirm,
  message,
} from 'antd';

// IMPORTANT: your supabase helper must export a *default* client instance.
import supabase from '@/lib/supabaseClient';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

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

type UIRow =
  | { level: 'pillar'; id: string; code: string; name: string; description: string; sort: number; }
  | { level: 'theme'; id: string; code: string; name: string; description: string; sort: number; parent: string; }
  | { level: 'subtheme'; id: string; code: string; name: string; description: string; sort: number; parent: string };

type EditTarget =
  | { level: 'pillar'; rec: PillarRow }
  | { level: 'theme'; rec: ThemeRow }
  | { level: 'subtheme'; rec: SubthemeRow };

/* -------------------------------------------------------------------------- */
/*                                   Utils                                    */
/* -------------------------------------------------------------------------- */

const keyFor = (lvl: Level, id: string | number) => `${lvl}:${id}`;

const labelFor = (lvl: Level) =>
  lvl === 'pillar' ? 'pillar' : lvl === 'theme' ? 'theme' : 'sub-theme';

const tagStyle = (lvl: Level) => {
  switch (lvl) {
    case 'pillar':
      return { color: '#1677ff', bg: '#e6f4ff' }; // light blue
    case 'theme':
      return { color: '#389e0d', bg: '#f6ffed' }; // light green
    default:
      return { color: '#d4380d', bg: '#fff2e8' }; // light red / orange
  }
};

/* -------------------------------------------------------------------------- */
/*                               Main component                               */
/* -------------------------------------------------------------------------- */

export default function FrameworkEditorPage() {
  const [loading, setLoading] = useState(false);

  // raw tables
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);

  // expanded state (keys: "pillar:ID", "theme:ID")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // dialog state
  const [open, setOpen] = useState(false);
  const [addingUnder, setAddingUnder] = useState<Level | null>(null); // when adding, which level are we creating (based on parent)
  const [parentForAdd, setParentForAdd] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [form] = Form.useForm();

  /* ------------------------------ Fetch / load ----------------------------- */

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

      setPillars((p ?? []) as any);
      setThemes((t ?? []) as any);
      setSubs((s ?? []) as any);
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Failed to load framework.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ------------------------------- Flat rows ------------------------------- */

  const flatRows: UIRow[] = useMemo(() => {
    const out: UIRow[] = [];

    const byPillar = new Map<string | number, ThemeRow[]>();
    themes.forEach((t) => {
      const list = byPillar.get(t.pillar_id) || [];
      list.push(t);
      byPillar.set(t.pillar_id, list);
    });

    const byTheme = new Map<string | number, SubthemeRow[]>();
    subs.forEach((s) => {
      const list = byTheme.get(s.theme_id) || [];
      list.push(s);
      byTheme.set(s.theme_id, list);
    });

    const safe = (v: any) => (v ?? '') as string;
    const so = (v: any) => (typeof v === 'number' ? v : 0);

    for (const p of pillars) {
      out.push({
        level: 'pillar',
        id: keyFor('pillar', p.id),
        code: safe(p.code),
        name: safe(p.name),
        description: safe(p.description),
        sort: so(p.sort_order),
      });

      if (expanded[keyFor('pillar', p.id)]) {
        const kids = (byPillar.get(p.id) || []).slice().sort((a, b) => so(a.sort_order) - so(b.sort_order));
        for (const t of kids) {
          out.push({
            level: 'theme',
            id: keyFor('theme', t.id),
            parent: keyFor('pillar', p.id),
            code: safe(t.code),
            name: safe(t.name),
            description: safe(t.description),
            sort: so(t.sort_order),
          });

          if (expanded[keyFor('theme', t.id)]) {
            const gkids = (byTheme.get(t.id) || []).slice().sort((a, b) => so(a.sort_order) - so(b.sort_order));
            for (const s of gkids) {
              out.push({
                level: 'subtheme',
                id: keyFor('subtheme', s.id),
                parent: keyFor('theme', t.id),
                code: safe(s.code),
                name: safe(s.name),
                description: safe(s.description),
                sort: so(s.sort_order),
              });
            }
          }
        }
      }
    }
    return out;
  }, [pillars, themes, subs, expanded]);

  /* ------------------------------ Expand logic ----------------------------- */

  const toggle = (row: UIRow) => {
    if (row.level === 'subtheme') return; // no children
    const key = row.id;
    setExpanded((cur) => ({ ...cur, [key]: !cur[key] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    pillars.forEach((p) => (next[keyFor('pillar', p.id)] = true));
    themes.forEach((t) => (next[keyFor('theme', t.id)] = true));
    setExpanded(next);
  };

  const collapseAll = () => setExpanded({});

  /* ------------------------------- CRUD logic ------------------------------ */

  const startAddUnder = (row: UIRow) => {
    // If adding under pillar -> create theme
    // If adding under theme -> create subtheme
    const nextLevel: Level = row.level === 'pillar' ? 'theme' : 'subtheme';
    setAddingUnder(nextLevel);
    setParentForAdd(row.id);
    form.setFieldsValue({ name: '', code: '', description: '', sort_order: 1 });
    setEditing(null);
    setOpen(true);
  };

  const startEdit = (row: UIRow) => {
    if (row.level === 'pillar') {
      const rec = pillars.find((p) => keyFor('pillar', p.id) === row.id)!;
      setEditing({ level: 'pillar', rec });
      form.setFieldsValue({
        name: rec.name,
        code: rec.code,
        description: rec.description ?? '',
        sort_order: rec.sort_order ?? 1,
      });
    } else if (row.level === 'theme') {
      const rec = themes.find((t) => keyFor('theme', t.id) === row.id)!;
      setEditing({ level: 'theme', rec });
      form.setFieldsValue({
        name: rec.name,
        code: rec.code,
        description: rec.description ?? '',
        sort_order: rec.sort_order ?? 1,
      });
    } else {
      const rec = subs.find((s) => keyFor('subtheme', s.id) === row.id)!;
      setEditing({ level: 'subtheme', rec });
      form.setFieldsValue({
        name: rec.name,
        code: rec.code,
        description: rec.description ?? '',
        sort_order: rec.sort_order ?? 1,
      });
    }
    setAddingUnder(null);
    setParentForAdd(null);
    setOpen(true);
  };

  const doDelete = async (row: UIRow) => {
    setLoading(true);
    try {
      if (row.level === 'pillar') {
        const id = (row.id.split(':')[1]);
        const { error } = await supabase.from('pillars').delete().eq('id', id);
        if (error) throw error;
      } else if (row.level === 'theme') {
        const id = (row.id.split(':')[1]);
        const { error } = await supabase.from('themes').delete().eq('id', id);
        if (error) throw error;
      } else {
        const id = (row.id.split(':')[1]);
        const { error } = await supabase.from('subthemes').delete().eq('id', id);
        if (error) throw error;
      }
      message.success('Deleted.');
      await loadAll();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async () => {
    const vals = await form.validateFields();
    setLoading(true);
    try {
      if (editing) {
        // update
        if (editing.level === 'pillar') {
          const { error } = await supabase
            .from('pillars')
            .update({
              name: vals.name,
              code: vals.code,
              description: vals.description ?? '',
              sort_order: Number(vals.sort_order ?? 1),
            })
            .eq('id', (editing.rec as PillarRow).id);
          if (error) throw error;
        } else if (editing.level === 'theme') {
          const { error } = await supabase
            .from('themes')
            .update({
              name: vals.name,
              code: vals.code,
              description: vals.description ?? '',
              sort_order: Number(vals.sort_order ?? 1),
            })
            .eq('id', (editing.rec as ThemeRow).id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('subthemes')
            .update({
              name: vals.name,
              code: vals.code,
              description: vals.description ?? '',
              sort_order: Number(vals.sort_order ?? 1),
            })
            .eq('id', (editing.rec as SubthemeRow).id);
          if (error) throw error;
        }
        message.success('Saved.');
      } else if (addingUnder) {
        // insert under parent
        if (addingUnder === 'theme') {
          // parent is a pillar
          const pillarId = parentForAdd!.split(':')[1];
          const { error } = await supabase.from('themes').insert({
            pillar_id: pillarId,
            name: vals.name,
            code: vals.code,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
          } as any);
          if (error) throw error;
        } else {
          // adding subtheme (parent is theme)
          const themeId = parentForAdd!.split(':')[1];
          const { error } = await supabase.from('subthemes').insert({
            theme_id: themeId,
            name: vals.name,
            code: vals.code,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
          } as any);
          if (error) throw error;
        }
        message.success('Added.');
      } else {
        // adding a brand new pillar (via top-level +)
        const { error } = await supabase.from('pillars').insert({
          name: vals.name,
          code: vals.code,
          description: vals.description ?? '',
          sort_order: Number(vals.sort_order ?? 1),
        } as any);
        if (error) throw error;
        message.success('Added pillar.');
      }

      setOpen(false);
      setEditing(null);
      setAddingUnder(null);
      setParentForAdd(null);
      await loadAll();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------- Render -------------------------------- */

  const Header = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      background: '#fff'
    }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1677ff' }}>
        <ArrowLeftOutlined /> Dashboard
      </Link>
      <div style={{ fontSize: 22, fontWeight: 700, marginLeft: 6 }}>Framework Editor</div>
      <div style={{ flex: 1 }} />
      <Space>
        <Button icon={<ReloadOutlined />} onClick={loadAll}>Refresh</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true); setEditing(null); setAddingUnder(null); setParentForAdd(null); form.setFieldsValue({ name: '', code: '', description: '', sort_order: 1 }); }}>
          Add pillar
        </Button>
      </Space>
    </div>
  );

  const Row = ({ row }: { row: UIRow }) => {
    const isParent = row.level !== 'subtheme';
    const caretOpen = !!expanded[row.id];

    const lvl = row.level;
    const tag = tagStyle(lvl);

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 35% 5%',
          padding: '12px 16px',
          borderBottom: '1px solid #f5f5f5',
          alignItems: 'flex-start',
          background: '#fff'
        }}
      >
        {/* Name column */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* indent + caret */}
          <div style={{ width: 18, textAlign: 'center' }}>
            {row.level === 'pillar' && (
              <button
                aria-label="toggle"
                onClick={() => toggle(row)}
                style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 16 }}
              >
                {caretOpen ? '▾' : '▸'}
              </button>
            )}
            {row.level === 'theme' && (
              <button
                aria-label="toggle"
                onClick={() => toggle(row)}
                style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 16 }}
              >
                {caretOpen ? '▾' : '▸'}
              </button>
            )}
          </div>

          {/* type tag + code */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                textTransform: 'lowercase',
                fontSize: 12,
                color: tag.color,
                background: tag.bg,
                border: `1px solid ${tag.color}`,
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {labelFor(row.level)}
            </span>
            <span style={{ fontSize: 12, color: '#999' }}>[{row.code}]</span>
          </div>

          {/* name */}
          <div style={{ fontWeight: 600 }}>
            {row.name}
          </div>
        </div>

        {/* Description column */}
        <div style={{ color: '#555' }}>
          {row.description}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {isParent && (
            <Tooltip title={row.level === 'pillar' ? 'Add theme' : 'Add sub-theme'}>
              <Button size="small" icon={<PlusOutlined />} onClick={() => startAddUnder(row)} />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => startEdit(row)} />
          </Tooltip>
          <Popconfirm title="Delete this row?" onConfirm={() => doDelete(row)}>
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {Header}

      {/* Column header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 35% 5%',
          padding: '10px 16px',
          borderBottom: '1px solid #eaeaea',
          color: '#888',
          fontSize: 12,
          background: '#fcfcfc',
        }}
      >
        <div>Name</div>
        <div>Description / Notes</div>
        <div />
      </div>

      {/* Rows */}
      <div>
        {flatRows.map((r) => (
          <Row key={r.id} row={r} />
        ))}
        {!loading && flatRows.length === 0 && (
          <div style={{ padding: 24, color: '#999' }}>No data</div>
        )}
      </div>

      {/* Editor dialog (used for Add & Edit) */}
      <Modal
        open={open}
        title={
          editing
            ? `Edit ${labelFor(editing.level)}`
            : addingUnder
              ? `Add ${labelFor(addingUnder)}`
              : 'Add pillar'
        }
        okText="Save"
        onOk={submitForm}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          setAddingUnder(null);
          setParentForAdd(null);
        }}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input placeholder="Code (e.g., P1, T1.2, ST1.2.1)" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Description / notes" />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort order" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
