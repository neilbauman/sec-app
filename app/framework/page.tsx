'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CaretRightFilled,
  CaretDownFilled,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import createClient from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

type Row = {
  id: string;           // = code
  level: Level;
  name: string;
  description: string | null;
  sort_order: number | null;
  parent?: string | null;   // pillar_code for theme; theme_code for subtheme
  pillar_code?: string | null;
};

const typeTag = (level: Level) => {
  if (level === 'pillar') return <Tag color="blue">Pillar</Tag>;
  if (level === 'theme') return <Tag color="green">Theme</Tag>;
  return <Tag color="red">Sub-theme</Tag>;
};

export default function FrameworkEditorPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [mode, setMode] = useState<'edit' | 'add'>('edit');
  const [form] = Form.useForm();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // Pull all 3 tables, then stitch in-memory — keeps it simple and robust.
      const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        ]);

      if (pe || te || se) throw new Error((pe || te || se)?.message);

      const pillarRows: Row[] =
        (pillars || []).map((p: any) => ({
          id: p.code,
          level: 'pillar',
          name: p.name,
          description: p.description ?? null,
          sort_order: p.sort_order ?? null,
        }));

      const themeRows: Row[] =
        (themes || []).map((t: any) => ({
          id: t.code,
          level: 'theme',
          name: t.name,
          description: t.description ?? null,
          sort_order: t.sort_order ?? null,
          parent: t.pillar_code,
          pillar_code: t.pillar_code,
        }));

      const subRows: Row[] =
        (subs || []).map((s: any) => ({
          id: s.code,
          level: 'subtheme',
          name: s.name,
          description: s.description ?? null,
          sort_order: s.sort_order ?? null,
          parent: s.theme_code,
          pillar_code: s.pillar_code,
        }));

      // Flatten as: each pillar, followed by its themes, then its subthemes.
      const flat: Row[] = [];
      for (const p of pillarRows) {
        flat.push(p);
        const tUnder = themeRows.filter(t => t.pillar_code === p.id);
        for (const t of tUnder) {
          flat.push(t);
          const sUnder = subRows.filter(s => s.parent === t.id);
          for (const s of sUnder) flat.push(s);
        }
      }

      setRows(flat);
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ---------- Expand / Collapse ----------
  const isVisible = (row: Row, idx: number) => {
    if (row.level === 'pillar') return true;
    if (row.level === 'theme') {
      const pillar = rows.slice(0, idx).reverse().find(r => r.level === 'pillar');
      return !!pillar && expanded[pillar.id];
    }
    // subtheme: require pillar and theme both expanded
    const theme = rows.slice(0, idx).reverse().find(r => r.level === 'theme');
    const pillar = rows.slice(0, idx).reverse().find(r => r.level === 'pillar');
    return !!pillar && !!theme && expanded[pillar.id] && expanded[theme.id];
  };

  const toggleRow = (row: Row) => {
    setExpanded(prev => ({ ...prev, [row.id]: !prev[row.id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    rows.forEach(r => (all[r.id] = true));
    setExpanded(all);
  };
  const collapseAll = () => setExpanded({});

  // ---------- Add / Edit / Delete ----------
  const openAddUnder = (parent?: Row) => {
    const nextLevel: Level =
      !parent ? 'pillar' : parent.level === 'pillar' ? 'theme' : 'subtheme';

    setMode('add');
    setEditing(
      parent
        ? {
            id: '',
            level: nextLevel,
            name: '',
            description: '',
            sort_order: 1,
            parent: parent.level === 'pillar' ? parent.id : parent.id,
            pillar_code:
              parent.level === 'pillar' ? parent.id : parent.pillar_code || null,
          }
        : { id: '', level: 'pillar', name: '', description: '', sort_order: 1 },
    );
    form.setFieldsValue({
      code: '',
      name: '',
      description: '',
      sort_order: 1,
    });
    setEditOpen(true);
  };

  const openEdit = (row: Row) => {
    setMode('edit');
    setEditing(row);
    form.setFieldsValue({
      code: row.id,
      name: row.name,
      description: row.description ?? '',
      sort_order: row.sort_order ?? 1,
    });
    setEditOpen(true);
  };

  const handleDelete = async (row: Row) => {
    const table = row.level === 'pillar' ? 'pillars' : row.level === 'theme' ? 'themes' : 'subthemes';
    const { error } = await supabase.from(table).delete().eq('code', row.id);
    if (error) {
      message.error(error.message);
    } else {
      message.success('Deleted');
      fetchAll();
    }
  };

  const onSubmit = async () => {
    try {
      const vals = await form.validateFields();
      if (!editing) return;

      const isAdd = mode === 'add';
      const table =
        editing.level === 'pillar' ? 'pillars' : editing.level === 'theme' ? 'themes' : 'subthemes';

      if (isAdd) {
        // Insert
        if (editing.level === 'pillar') {
          const { error } = await supabase.from('pillars').insert({
            code: vals.code,
            name: vals.name,
            description: vals.description || '',
            sort_order: vals.sort_order || 1,
          });
          if (error) throw error;
        } else if (editing.level === 'theme') {
          if (!editing.pillar_code) throw new Error('Missing pillar_code for theme');
          const { error } = await supabase.from('themes').insert({
            code: vals.code,
            pillar_code: editing.pillar_code,
            name: vals.name,
            description: vals.description || '',
            sort_order: vals.sort_order || 1,
          });
          if (error) throw error;
        } else {
          // subtheme
          if (!editing.parent || !editing.pillar_code) {
            throw new Error('Missing theme_code or pillar_code for sub-theme');
          }
          const { error } = await supabase.from('subthemes').insert({
            code: vals.code,
            theme_code: editing.parent,
            pillar_code: editing.pillar_code,
            name: vals.name,
            description: vals.description || '',
            sort_order: vals.sort_order || 1,
          });
          if (error) throw error;
        }
        message.success('Added');
      } else {
        // Update
        if (editing.level === 'pillar') {
          const { error } = await supabase
            .from('pillars')
            .update({
              name: vals.name,
              description: vals.description || '',
              sort_order: vals.sort_order || 1,
            })
            .eq('code', editing.id);
          if (error) throw error;
        } else if (editing.level === 'theme') {
          const { error } = await supabase
            .from('themes')
            .update({
              name: vals.name,
              description: vals.description || '',
              sort_order: vals.sort_order || 1,
            })
            .eq('code', editing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('subthemes')
            .update({
              name: vals.name,
              description: vals.description || '',
              sort_order: vals.sort_order || 1,
            })
            .eq('code', editing.id);
          if (error) throw error;
        }
        message.success('Saved');
      }

      setEditOpen(false);
      setEditing(null);
      fetchAll();
    } catch (e: any) {
      message.error(e.message || 'Save failed');
    }
  };

  // ---------- Render ----------
  const RowItem: React.FC<{ row: Row; idx: number }> = ({ row, idx }) => {
    if (!isVisible(row, idx)) return null;

    const leftPad =
      row.level === 'pillar' ? 0 : row.level === 'theme' ? 32 : 64;

    const hasChildren =
      row.level !== 'subtheme' &&
      rows.some(r =>
        row.level === 'pillar'
          ? r.level === 'theme' && r.pillar_code === row.id
          : r.level === 'subtheme' && r.parent === row.id,
      );

    const expandedHere = !!expanded[row.id];

    return (
      <div
        className="fw-row"
        style={{
          paddingLeft: leftPad,
          display: 'grid',
          gridTemplateColumns: '220px 1fr auto',
          alignItems: 'center',
        }}
      >
        <div className="fw-type">
          <Space size="small">
            {hasChildren ? (
              <a onClick={() => toggleRow(row)} className="caret">
                {expandedHere ? <CaretDownFilled /> : <CaretRightFilled />}
              </a>
            ) : (
              <span className="caret-placeholder" />
            )}
            {typeTag(row.level)}
          </Space>
        </div>

        <div className="fw-main">
          <Typography.Text strong>{row.name}</Typography.Text>
          <div className="code"> (code: {row.id})</div>
        </div>

        <div className="fw-actions">
          <Space size="small">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(row)}
            />
            <Popconfirm
              title="Delete this item?"
              onConfirm={() => handleDelete(row)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
            {row.level !== 'subtheme' && (
              <Button
                size="small"
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={() => openAddUnder(row)}
              >
                Add {row.level === 'pillar' ? 'Theme' : 'Sub-theme'}
              </Button>
            )}
          </Space>
        </div>

        <div className="fw-desc" style={{ gridColumn: '1 / span 3', paddingLeft: leftPad + 36 }}>
          <Typography.Paragraph style={{ margin: 0 }}>
            {row.description || <span style={{ color: '#999' }}>No description</span>}
          </Typography.Paragraph>
        </div>
      </div>
    );
  };

  return (
    <div className="wrap">
      <div className="topbar">
        <Space>
          <Button href="/" icon={<ArrowLeftOutlined />}>
            Back to dashboard
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>
            Refresh
          </Button>
          <Button onClick={collapseAll}>Collapse all</Button>
          <Button onClick={expandAll}>Expand all</Button>
          <Divider type="vertical" />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openAddUnder()}>
            Add Pillar
          </Button>
        </Space>
      </div>

      <div className="header">
        <div>Type</div>
        <div>Name</div>
        <div style={{ textAlign: 'right' }}>Actions</div>
      </div>

      <div className="list">
        {rows.map((r, i) => (
          <RowItem key={`${r.level}-${r.id}-${i}`} row={r} idx={i} />
        ))}
      </div>

      <Modal
        title={mode === 'add' ? 'Add item' : 'Edit item'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={onSubmit}
        okText={mode === 'add' ? 'Add' : 'Save'}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input disabled={mode === 'edit'} />
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
            label="Sort order"
            tooltip="1, 2, 3…"
            rules={[{ required: true, message: 'Sort order required' }]}
          >
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>
          {editing?.level !== 'pillar' && (
            <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
              Parent is fixed automatically from context.
            </Typography.Paragraph>
          )}
        </Form>
      </Modal>

      <style jsx>{`
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 16px 12px 40px;
        }
        .topbar { margin-bottom: 12px; }
        .header {
          display: grid;
          grid-template-columns: 220px 1fr auto;
          font-weight: 600;
          padding: 8px 10px;
          border-bottom: 1px solid #eee;
          color: #7a7a7a;
        }
        .list { margin-top: 4px; }
        .fw-row {
          padding: 6px 10px;
          border-bottom: 1px dashed #f0f0f0;
        }
        .fw-type .caret {
          color: rgba(0,0,0,.65);
        }
        .caret-placeholder {
          display: inline-block;
          width: 12px;
        }
        .fw-main { display: flex; align-items: center; gap: 8px; }
        .code { color: #888; }
        .fw-actions { text-align: right; }
        .fw-desc { padding: 6px 0 12px; color: #444; }
      `}</style>
    </div>
  );
}
