'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

// Robust import: works no matter how the helper exports
import * as Sb from '@/lib/supabaseClient';
const getSb =
  ((Sb as any).getBrowserClient ??
    (Sb as any).createClient ??
    (Sb as any).getSupabase ??
    (Sb as any).default) as () => any;

type Level = 'pillar' | 'theme' | 'subtheme';

type Row = {
  key: string;
  id: string;
  level: Level;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  // For hierarchy
  children?: Row[];
  pillar_code?: string;   // on themes
  theme_code?: string;    // on subthemes
};

type EditState =
  | null
  | {
      level: Level;
      id?: string; // undefined when creating
      parentCode?: string; // for creates
      initial: { name: string; description: string; sort_order: number };
    };

export default function PrimaryFrameworkEditorPage() {
  const supabaseRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [pillars, setPillars] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  const [editing, setEditing] = useState<EditState>(null);
  const [form] = Form.useForm();

  // init client once
  useEffect(() => {
    try {
      supabaseRef.current = getSb();
    } catch (e: any) {
      console.error(e);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    const supabase = supabaseRef.current;
    if (!supabase) return;

    setLoading(true);
    try {
      const [{ data: pData, error: pErr }, { data: tData, error: tErr }, { data: sData, error: sErr }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
        ]);

      if (pErr || tErr || sErr) {
        throw new Error(pErr?.message ?? tErr?.message ?? sErr?.message ?? 'Load failed');
      }
      setPillars(pData ?? []);
      setThemes(tData ?? []);
      setSubs(sData ?? []);
    } catch (err: any) {
      console.error(err);
      message.error(err.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Build tree hierarchically and correctly map children to parents
  const treeData: Row[] = useMemo(() => {
    const pByCode = new Map<string, Row>();
    const tByCode = new Map<string, Row>();

    const pillarRows: Row[] = (pillars ?? []).map((p: any) => {
      const row: Row = {
        key: `P:${p.id}`,
        id: String(p.id),
        level: 'pillar',
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? 1,
        children: [],
      };
      pByCode.set(p.code, row);
      return row;
    });

    (themes ?? []).forEach((t: any) => {
      const parent = pByCode.get(t.pillar_code);
      const row: Row = {
        key: `T:${t.id}`,
        id: String(t.id),
        level: 'theme',
        code: t.code,
        name: t.name,
        description: t.description ?? '',
        sort_order: t.sort_order ?? 1,
        children: [],
        pillar_code: t.pillar_code,
      };
      tByCode.set(t.code, row);
      if (parent) {
        parent.children!.push(row);
      } else {
        // orphan theme (no matching pillar) – show at root to avoid hiding data
        pillarRows.push(row);
      }
    });

    (subs ?? []).forEach((s: any) => {
      const parent = tByCode.get(s.theme_code);
      const row: Row = {
        key: `S:${s.id}`,
        id: String(s.id),
        level: 'subtheme',
        code: s.code,
        name: s.name,
        description: s.description ?? '',
        sort_order: s.sort_order ?? 1,
        theme_code: s.theme_code,
      };
      if (parent) {
        parent.children!.push(row);
      } else {
        // orphan subtheme – also show at root (very rare)
        pillarRows.push(row);
      }
    });

    // Sort children by sort_order then code for stability
    const sorter = (a: Row, b: Row) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.code.localeCompare(b.code);

    pillarRows.sort(sorter);
    pillarRows.forEach((p) => p.children?.sort(sorter));
    pillarRows.forEach((p) => p.children?.forEach((t) => t.children?.sort(sorter)));

    return pillarRows;
  }, [pillars, themes, subs]);

  const openEdit = (rec: Row) => {
    setEditing({
      level: rec.level,
      id: rec.id,
      parentCode: rec.level === 'theme' ? rec.pillar_code : rec.level === 'subtheme' ? rec.theme_code : undefined,
      initial: {
        name: rec.name,
        description: rec.description ?? '',
        sort_order: rec.sort_order ?? 1,
      },
    });
    form.setFieldsValue({
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
  };

  const openCreate = (level: Level, parent: Row | null) => {
    const parentCode =
      level === 'theme' ? parent?.code :
      level === 'subtheme' ? parent?.code :
      undefined;

    setEditing({
      level,
      id: undefined,
      parentCode,
      initial: { name: '', description: '', sort_order: 1 },
    });
    form.setFieldsValue({ name: '', description: '', sort_order: 1 });
  };

  const handleDelete = async (rec: Row) => {
    const supabase = supabaseRef.current;
    if (!supabase) return;

    try {
      const table =
        rec.level === 'pillar' ? 'pillars' :
        rec.level === 'theme' ? 'themes' : 'subthemes';

      const { error } = await supabase.from(table).delete().eq('id', rec.id);
      if (error) throw error;

      // Update local state
      if (rec.level === 'pillar') setPillars((x) => x.filter((r: any) => String(r.id) !== rec.id));
      if (rec.level === 'theme') setThemes((x) => x.filter((r: any) => String(r.id) !== rec.id));
      if (rec.level === 'subtheme') setSubs((x) => x.filter((r: any) => String(r.id) !== rec.id));

      message.success('Deleted');
    } catch (err: any) {
      console.error(err);
      message.error(err.message ?? 'Delete failed');
    }
  };

  // Generate a next code like "P1.3" or "P2.1.2"
  const nextChildCode = (parentCode: string, siblings: any[]) => {
    // find numeric suffix among siblings under same parent
    let maxN = 0;
    siblings.forEach((s) => {
      const after = s.code.replace(`${parentCode}.`, '');
      const n = parseInt(after.split('.')[0], 10);
      if (!isNaN(n)) maxN = Math.max(maxN, n);
    });
    return `${parentCode}.${maxN + 1}`;
  };

  const onSave = async () => {
    const supabase = supabaseRef.current;
    if (!supabase || !editing) return;

    try {
      const vals = await form.validateFields();
      const payload = {
        name: vals.name?.trim() ?? '',
        description: vals.description?.trim() ?? '',
        sort_order: Number(vals.sort_order ?? 1),
      };

      if (editing.id) {
        // Update existing
        const table =
          editing.level === 'pillar' ? 'pillars' :
          editing.level === 'theme' ? 'themes' : 'subthemes';

        const { error } = await supabase.from(table).update(payload as any).eq('id', editing.id);
        if (error) throw error;

        // reflect locally
        if (editing.level === 'pillar') {
          setPillars((arr) => arr.map((r: any) => (String(r.id) === editing.id ? { ...r, ...payload } : r)));
        } else if (editing.level === 'theme') {
          setThemes((arr) => arr.map((r: any) => (String(r.id) === editing.id ? { ...r, ...payload } : r)));
        } else {
          setSubs((arr) => arr.map((r: any) => (String(r.id) === editing.id ? { ...r, ...payload } : r)));
        }

        message.success('Saved');
      } else {
        // Create new
        if (editing.level === 'pillar') {
          // Generate code P{n}
          const nums = (pillars ?? [])
            .map((p: any) => parseInt(String(p.code).replace(/^P/i, ''), 10))
            .filter((n: number) => !isNaN(n));
          const next = (nums.length ? Math.max(...nums) : 0) + 1;
          const code = `P${next}`;

          const { data, error } = await supabase
            .from('pillars')
            .insert({ code, ...payload } as any)
            .select()
            .single();
          if (error) throw error;
          setPillars((arr) => [...arr, data]);
          message.success('Pillar created');
        }

        if (editing.level === 'theme') {
          const parentCode = editing.parentCode!;
          const siblings = (themes ?? []).filter((t: any) => t.pillar_code === parentCode);
          const code = nextChildCode(parentCode, siblings);

          const { data, error } = await supabase
            .from('themes')
            .insert({ code, pillar_code: parentCode, ...payload } as any)
            .select()
            .single();
          if (error) throw error;
          setThemes((arr) => [...arr, data]);
          message.success('Theme created');
        }

        if (editing.level === 'subtheme') {
          const parentCode = editing.parentCode!;
          const siblings = (subs ?? []).filter((s: any) => s.theme_code === parentCode);
          const code = nextChildCode(parentCode, siblings);

          const { data, error } = await supabase
            .from('subthemes')
            .insert({ code, theme_code: parentCode, ...payload } as any)
            .select()
            .single();
          if (error) throw error;
          setSubs((arr) => [...arr, data]);
          message.success('Sub-theme created');
        }
      }

      setEditing(null);
    } catch (err: any) {
      if (err?.errorFields) {
        // antd validation error – ignore toast
        return;
      }
      console.error(err);
      message.error(err.message ?? 'Save failed');
    }
  };

  const columns: ColumnsType<Row> = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'type',
      width: '18%',
      render: (_: any, rec: Row) => {
        const color = rec.level === 'pillar' ? 'blue' : rec.level === 'theme' ? 'green' : 'red';
        const label = rec.level === 'pillar' ? 'Pillar' : rec.level === 'theme' ? 'Theme' : 'Sub-theme';
        return (
          <Space size={6}>
            <Tag color={color} style={{ fontWeight: 600, padding: '2px 8px' }}>{label}</Tag>
            <span style={{ color: '#8c8c8c', fontSize: 12 }}>[{rec.code}]</span>
          </Space>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '24%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '41%',
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort',
      width: '7%',
      align: 'right',
      render: (v: any) => String(v ?? 1),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, rec: Row) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>

          {rec.level === 'pillar' && (
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => openCreate('theme', rec)}
            >
              Theme
            </Button>
          )}

          {rec.level === 'theme' && (
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => openCreate('subtheme', rec)}
            >
              Sub
            </Button>
          )}

          <Popconfirm
            title="Delete this row?"
            placement="left"
            onConfirm={() => handleDelete(rec)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space align="center" style={{ marginBottom: 12 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} />
        </Link>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Primary Framework Editor
        </Typography.Title>
        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
          Refresh
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openCreate('pillar', null)}
        >
          Add Pillar
        </Button>
      </Space>

      <Table<Row>
        dataSource={treeData}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        size="middle"
        expandable={{
          // Only rows with children should display a caret; sub-themes have none
          rowExpandable: (rec) => rec.level !== 'subtheme' && !!rec.children && rec.children.length > 0,
          expandRowByClick: true,
        }}
      />

      <Modal
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={onSave}
        okText="Save"
        title={editing?.id ? 'Edit' : `Add ${editing?.level === 'pillar' ? 'Pillar' : editing?.level === 'theme' ? 'Theme' : 'Sub-theme'}`}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={editing?.initial}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="sort_order"
            label="Sort order"
            rules={[{ required: true, message: 'Sort order is required' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* UI tweaks */}
      <style jsx global>{`
        /* Make the carets larger */
        .ant-table-row-expand-icon {
          transform: scale(1.35);
        }
        /* Tighten row height a bit */
        .ant-table-cell {
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
      `}</style>
    </div>
  );
}
