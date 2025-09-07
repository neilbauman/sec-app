// /app/framework/page.tsx
'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Button,
  Table,
  Tag,
  Space,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Papa from 'papaparse';
import { getBrowserClient } from '@/lib/supabaseClient';

type Level = 'pillar' | 'theme' | 'subtheme';

type Pillar = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null };
type Theme = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null; pillar_id?: string | null; parent_pillar_id?: string | null; parent?: string | null };
type Subtheme = { id: string; code: string; name: string; description?: string | null; sort_order?: number | null; theme_id?: string | null; parent_theme_id?: string | null; parent?: string | null };

type UIRow = {
  key: string;              // unique tree key, e.g. P:<id>, T:<id>, S:<id>
  id: string;               // db id
  level: Level;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  parentKeys?: string[];    // for internal mapping
  parent_id?: string | null;
};

const levelColor: Record<Level, string> = {
  pillar: 'geekblue',
  theme: 'green',
  subtheme: 'red',
};

const { Title, Text } = Typography;

export default function FrameworkPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [data, setData] = useState<UIRow[]>([]);
  const [form] = Form.useForm<Partial<UIRow>>();
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; level: Level; record?: UIRow; parent?: UIRow } | null>(null);

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

      const pById = new Map<string, Pillar>();
      const tById = new Map<string, Theme>();

      (pillars || []).forEach((p: any) => pById.set(p.id, p));
      (themes || []).forEach((t: any) => tById.set(t.id, t));

      // Build tree keys
      const asRowP = (p: any): UIRow => ({
        key: `P:${p.id}`,
        id: p.id,
        level: 'pillar',
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? null,
      });

      const asRowT = (t: any): UIRow => {
        const parentId =
          t.pillar_id ?? t.parent_pillar_id ?? t.parent ?? null;
        return {
          key: `T:${t.id}`,
          id: t.id,
          level: 'theme',
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? null,
          parent_id: parentId,
        };
      };

      const asRowS = (s: any): UIRow => {
        const parentId =
          s.theme_id ?? s.parent_theme_id ?? s.parent ?? null;
        return {
          key: `S:${s.id}`,
          id: s.id,
          level: 'subtheme',
          code: s.code,
          name: s.name,
          description: s.description ?? '',
          sort_order: s.sort_order ?? null,
          parent_id: parentId,
        };
      };

      const pRows = (pillars || []).map(asRowP);
      const tRows = (themes || []).map(asRowT);
      const sRows = (subs || []).map(asRowS);

      // Attach children by explicit parent id mapping
      const tByPillar = new Map<string, UIRow[]>();
      tRows.forEach((t) => {
        if (!t.parent_id) return;
        const arr = tByPillar.get(t.parent_id) || [];
        arr.push(t);
        tByPillar.set(t.parent_id, arr);
      });

      const sByTheme = new Map<string, UIRow[]>();
      sRows.forEach((s) => {
        if (!s.parent_id) return;
        const arr = sByTheme.get(s.parent_id) || [];
        arr.push(s);
        sByTheme.set(s.parent_id, arr);
      });

      // Create nested structure for Ant Table
      const nested: any[] = pRows.map((p) => {
        const themesForP = tByPillar.get(p.id) || [];
        const themeNodes = themesForP
          .sort(sorter)
          .map((t) => {
            const subsForT = sByTheme.get(t.id) || [];
            const subNodes = subsForT.sort(sorter).map((s) => ({
              ...s,
              children: undefined, // subthemes are leafs
            }));
            return {
              ...t,
              children: subNodes.length ? subNodes : undefined,
            };
          });
        return {
          ...p,
          children: themeNodes.length ? themeNodes : undefined,
        };
      });

      setData(nested);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const sorter = (a: UIRow, b: UIRow) => {
    const sa = a.sort_order ?? 0;
    const sb = b.sort_order ?? 0;
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  };

  // ---------- CRUD ----------
  const openAdd = (level: Level, parent?: UIRow) => {
    setModal({ open: true, mode: 'add', level, parent });
    form.setFieldsValue({
      code: '',
      name: '',
      description: '',
      sort_order: 1,
    });
  };

  const openEdit = (rec: UIRow) => {
    setModal({ open: true, mode: 'edit', level: rec.level, record: rec });
    form.setFieldsValue({
      code: rec.code,
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
  };

  const doDelete = async (rec: UIRow) => {
    Modal.confirm({
      title: `Delete ${rec.level}`,
      content: `Are you sure you want to delete "${rec.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const table =
            rec.level === 'pillar' ? 'pillars' : rec.level === 'theme' ? 'themes' : 'subthemes';
          const { error } = await supabase.from(table as any).delete().eq('id', rec.id);
          if (error) throw error;
          message.success('Deleted');
          await fetchAll();
        } catch (e: any) {
          message.error(e?.message || 'Delete failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submitModal = async () => {
    try {
      const vals = await form.validateFields();
      setLoading(true);
      const m = modal!;
      const patch = {
        code: vals.code?.trim(),
        name: vals.name?.trim(),
        description: (vals.description ?? '').trim(),
        sort_order: Number(vals.sort_order ?? 1),
      };

      if (m.mode === 'add') {
        if (m.level === 'pillar') {
          const { error } = await supabase.from('pillars' as any).insert(patch as any);
          if (error) throw error;
        } else if (m.level === 'theme') {
          const parentId = m.parent?.id ?? null;
          const body = { ...patch, pillar_id: parentId };
          const { error } = await supabase.from('themes' as any).insert(body as any);
          if (error) throw error;
        } else {
          const parentId = m.parent?.id ?? null;
          const body = { ...patch, theme_id: parentId };
          const { error } = await supabase.from('subthemes' as any).insert(body as any);
          if (error) throw error;
        }
      } else {
        const table =
          m.level === 'pillar' ? 'pillars' : m.level === 'theme' ? 'themes' : 'subthemes';
        const { error } = await supabase.from(table as any).update(patch as any).eq('id', m.record!.id);
        if (error) throw error;
      }

      message.success('Saved');
      setModal(null);
      await fetchAll();
    } catch (e: any) {
      if (e?.errorFields) return; // form validation error
      console.error(e);
      message.error(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------- CSV Import/Export ----------
  const exportCSV = () => {
    // Flatten the current nested data back into rows
    const rows: any[] = [];
    (data as any[]).forEach((p: UIRow & { children?: any[] }) => {
      rows.push({
        level: 'pillar',
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? 1,
        parent_code: '',
      });
      (p.children || []).forEach((t: UIRow & { children?: any[] }) => {
        rows.push({
          level: 'theme',
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? 1,
          parent_code: p.code,
        });
        (t.children || []).forEach((s: UIRow) => {
          rows.push({
            level: 'subtheme',
            code: s.code,
            name: s.name,
            description: s.description ?? '',
            sort_order: s.sort_order ?? 1,
            parent_code: t.code,
          });
        });
      });
    });
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'framework.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importCSV = async (file: File) => {
    return new Promise<void>((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          try {
            const rows = (result.data as any[]).map((r) => ({
              level: String(r.level || '').toLowerCase() as Level,
              code: String(r.code || '').trim(),
              name: String(r.name || '').trim(),
              description: String(r.description || '').trim(),
              sort_order: Number(r.sort_order || 1),
              parent_code: String(r.parent_code || '').trim(),
            }));

            // Build code maps from DB to resolve parents and upsert
            const [{ data: pillars }, { data: themes }] = await Promise.all([
              supabase.from('pillars').select('*'),
              supabase.from('themes').select('*'),
            ]);

            const pByCode = new Map<string, any>();
            (pillars || []).forEach((p: any) => pByCode.set(p.code, p));

            const tByCode = new Map<string, any>();
            (themes || []).forEach((t: any) => tByCode.set(t.code, t));

            // Upsert pillars first
            for (const r of rows.filter((r) => r.level === 'pillar')) {
              const body = { code: r.code, name: r.name, description: r.description, sort_order: r.sort_order };
              if (pByCode.has(r.code)) {
                await supabase.from('pillars' as any).update(body as any).eq('id', pByCode.get(r.code).id);
              } else {
                const { data, error } = await supabase.from('pillars' as any).insert(body as any).select().limit(1);
                if (error) throw error;
                if (data && data[0]) pByCode.set(data[0].code, data[0]);
              }
            }

            // Refresh themes map if needed
            const { data: themes2 } = await supabase.from('themes').select('*');
            tByCode.clear();
            (themes2 || []).forEach((t: any) => tByCode.set(t.code, t));

            // Upsert themes
            for (const r of rows.filter((r) => r.level === 'theme')) {
              const parent = pByCode.get(r.parent_code);
              if (!parent) continue;
              const body = { code: r.code, name: r.name, description: r.description, sort_order: r.sort_order, pillar_id: parent.id };
              if (tByCode.has(r.code)) {
                await supabase.from('themes' as any).update(body as any).eq('id', tByCode.get(r.code).id);
              } else {
                const { data, error } = await supabase.from('themes' as any).insert(body as any).select().limit(1);
                if (error) throw error;
                if (data && data[0]) tByCode.set(data[0].code, data[0]);
              }
            }

            // Upsert subthemes
            const { data: subs0 } = await supabase.from('subthemes').select('*');
            const sByCode = new Map<string, any>();
            (subs0 || []).forEach((s: any) => sByCode.set(s.code, s));

            for (const r of rows.filter((r) => r.level === 'subtheme')) {
              const parentT = tByCode.get(r.parent_code);
              if (!parentT) continue;
              const body = { code: r.code, name: r.name, description: r.description, sort_order: r.sort_order, theme_id: parentT.id };
              if (sByCode.has(r.code)) {
                await supabase.from('subthemes' as any).update(body as any).eq('id', sByCode.get(r.code).id);
              } else {
                await supabase.from('subthemes' as any).insert(body as any);
              }
            }

            message.success('Import complete');
            await fetchAll();
            resolve();
          } catch (e: any) {
            console.error(e);
            message.error(e?.message || 'Import failed');
            resolve();
          }
        },
      });
    });
  };

  // ---------- Columns ----------
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type',
      dataIndex: 'level',
      width: 120,
      render: (_: any, rec: UIRow) => (
        <Space size={6} wrap>
          <Tag color={levelColor[rec.level]} style={{ marginRight: 0 }}>{rec.level}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>({rec.code})</Text>
        </Space>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      width: 80,
      align: 'right',
      render: (v: any) => v ?? '',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: any, rec: UIRow) => (
        <Space size="small" wrap>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>
          {rec.level !== 'subtheme' && (
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() =>
                openAdd(rec.level === 'pillar' ? 'theme' : 'subtheme', rec)
              }
            >
              Add {rec.level === 'pillar' ? 'Theme' : 'Subtheme'}
            </Button>
          )}
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => doDelete(rec)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Custom expand icon with bigger caret and correct toggle behavior
  const expandIcon = (props: any) => {
    const { expanded, onExpand, record } = props;
    const hasChildren = Array.isArray(record.children) && record.children.length > 0;
    if (!hasChildren) return <span style={{ display: 'inline-block', width: 16 }} />;

    const Icon = expanded ? DownOutlined : RightOutlined;
    return (
      <span
        onClick={(e) => onExpand(record, e)}
        style={{ cursor: 'pointer', fontSize: 16, marginRight: 6 }}
      >
        <Icon />
      </span>
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }} align="center">
        <Space>
          <Link href="/" prefetch={false}>
            <Button icon={<ArrowLeftOutlined />}>Dashboard</Button>
          </Link>
          <Title level={3} style={{ margin: 0 }}>Primary Framework Editor</Title>
        </Space>

        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Upload
            accept=".csv"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              importCSV(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Import CSV</Button>
          </Upload>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openAdd('pillar')}>
            Add Pillar
          </Button>
        </Space>
      </Space>

      <Table<UIRow>
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey={(r) => r.key}
        size="middle"
        pagination={false}
        expandable={{
          expandIcon,
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
          rowExpandable: (rec) => Array.isArray((rec as any).children) && (rec as any).children.length > 0,
        }}
      />

      <Modal
        title={modal?.mode === 'add' ? `Add ${modal?.level}` : `Edit ${modal?.level}`}
        open={!!modal?.open}
        onCancel={() => setModal(null)}
        onOk={submitModal}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input placeholder="Unique code" />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Display name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Optional" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Form.Item label="Sort Order" name="sort_order" initialValue={1}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
