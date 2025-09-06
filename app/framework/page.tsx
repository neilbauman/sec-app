'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  Divider,
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
import Papa from 'papaparse';
import { getBrowserClient } from '@/lib/supabaseClient';

const { Text } = Typography;

/** ─────────────────────────────────────────────────────────────────────────────
 * Types (loose enough to avoid TS build errors across environments)
 * ────────────────────────────────────────────────────────────────────────────*/
type PillarRow = {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order?: number | null;
};
type ThemeRow = {
  id: string;
  code: string;
  pillar_code: string;      // we key relationships by *_code (your CSVs)
  name: string;
  description?: string;
  sort_order?: number | null;
};
type SubthemeRow = {
  id: string;
  code: string;
  theme_code: string;
  pillar_code?: string;     // tolerate presence/absence
  name: string;
  description?: string;
  sort_order?: number | null;
};

type Level = 'pillar' | 'theme' | 'subtheme';

type UIRow = {
  key: string;              // e.g. P:P1, T:T1.2, S:S1.2.3
  level: Level;
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order?: number | null;
  pillar_code?: string;
  theme_code?: string;
  children?: UIRow[];
};

/** ─────────────────────────────────────────────────────────────────────────────
 * Color tags
 * ────────────────────────────────────────────────────────────────────────────*/
const LevelTag: React.FC<{ level: Level; code?: string }> = ({ level, code }) => {
  const color =
    level === 'pillar' ? 'geekblue' : level === 'theme' ? 'green' : 'red';
  return (
    <Space size={6}>
      <Tag color={color} style={{ fontWeight: 600 }}>
        {level === 'pillar' ? 'Pillar' : level === 'theme' ? 'Theme' : 'Sub-theme'}
      </Tag>
      {code ? (
        <span style={{ color: '#999', fontSize: 12 }}>[{code}]</span>
      ) : null}
    </Space>
  );
};

/** ─────────────────────────────────────────────────────────────────────────────
 * Utils
 * ────────────────────────────────────────────────────────────────────────────*/
const supabase = getBrowserClient(); // must run in the browser; page is 'use client'

const toUI = (
  pillars: PillarRow[],
  themes: ThemeRow[],
  subs: SubthemeRow[],
): UIRow[] => {
  const themesByPillar = new Map<string, ThemeRow[]>();
  for (const t of themes) {
    const arr = themesByPillar.get(t.pillar_code) ?? [];
    arr.push(t);
    themesByPillar.set(t.pillar_code, arr);
  }
  const subsByTheme = new Map<string, SubthemeRow[]>();
  for (const s of subs) {
    const arr = subsByTheme.get(s.theme_code) ?? [];
    arr.push(s);
    subsByTheme.set(s.theme_code, arr);
  }

  const sortBy = <T extends { sort_order?: number | null; name: string }>(a: T, b: T) => {
    const sa = a.sort_order ?? 999999, sb = b.sort_order ?? 999999;
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  };

  return pillars
    .slice()
    .sort(sortBy)
    .map<UIRow>((p) => {
      const tChildren = (themesByPillar.get(p.code) ?? []).slice().sort(sortBy).map<UIRow>((t) => {
        const sChildren = (subsByTheme.get(t.code) ?? []).slice().sort(sortBy).map<UIRow>((s) => ({
          key: `S:${s.code}`,
          level: 'subtheme',
          id: s.id,
          code: s.code,
          name: s.name,
          description: s.description ?? '',
          sort_order: s.sort_order ?? null,
          pillar_code: s.pillar_code ?? p.code,
          theme_code: s.theme_code,
          children: undefined, // no children for subthemes
        }));
        return {
          key: `T:${t.code}`,
          level: 'theme',
          id: t.id,
          code: t.code,
          name: t.name,
          description: t.description ?? '',
          sort_order: t.sort_order ?? null,
          pillar_code: t.pillar_code,
          theme_code: t.code,
          children: sChildren.length ? sChildren : undefined,
        };
      });

      return {
        key: `P:${p.code}`,
        level: 'pillar',
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description ?? '',
        sort_order: p.sort_order ?? null,
        pillar_code: p.code,
        theme_code: undefined,
        children: tChildren.length ? tChildren : undefined,
      };
    });
};

const downloadCSV = (rows: object[], filename: string) => {
  const csv = Papa.unparse(rows, { quotes: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/** ─────────────────────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────────────────────*/
export default function FrameworkPage() {
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<UIRow[]>([]);

  // editing/adding
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UIRow | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form] = Form.useForm<{
    level: Level;
    code: string;
    name: string;
    description?: string;
    sort_order?: number;
    pillar_code?: string;
    theme_code?: string;
  }>();

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: p, error: pe }, { data: t, error: te }, { data: s, error: se }] =
      await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);
    if (pe || te || se) {
      message.error(pe?.message || te?.message || se?.message || 'Load failed');
      setLoading(false);
      return;
    }
    setTree(toUI((p ?? []) as PillarRow[], (t ?? []) as ThemeRow[], (s ?? []) as SubthemeRow[]));
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /** ── Actions ───────────────────────────────────────────────────────────*/
  const openAdd = (level: Level, parent?: UIRow) => {
    setMode('add');
    setEditing(null);
    form.resetFields();
    if (level === 'pillar') {
      form.setFieldsValue({ level: 'pillar', sort_order: 1 });
    } else if (level === 'theme' && parent) {
      form.setFieldsValue({
        level: 'theme',
        pillar_code: parent.pillar_code,
        sort_order: 1,
      });
    } else if (level === 'subtheme' && parent) {
      form.setFieldsValue({
        level: 'subtheme',
        pillar_code: parent.pillar_code,
        theme_code: parent.level === 'theme' ? parent.code : parent.theme_code,
        sort_order: 1,
      });
    }
    setModalOpen(true);
  };

  const openEdit = (row: UIRow) => {
    setMode('edit');
    setEditing(row);
    form.setFieldsValue({
      level: row.level,
      code: row.code,
      name: row.name,
      description: row.description,
      sort_order: row.sort_order ?? undefined,
      pillar_code: row.pillar_code,
      theme_code: row.theme_code,
    });
    setModalOpen(true);
  };

  const doDelete = async (row: UIRow) => {
    Modal.confirm({
      title: `Delete this ${row.level}?`,
      content: 'This cannot be undone.',
      okButtonProps: { danger: true },
      okText: 'Delete',
      onOk: async () => {
        let err: string | null = null;
        if (row.level === 'pillar') {
          const { error } = await supabase.from('pillars').delete().eq('id', row.id);
          err = error?.message ?? null;
        } else if (row.level === 'theme') {
          const { error } = await supabase.from('themes').delete().eq('id', row.id);
          err = error?.message ?? null;
        } else {
          const { error } = await supabase.from('subthemes').delete().eq('id', row.id);
          err = error?.message ?? null;
        }
        if (err) message.error(err);
        else {
          message.success('Deleted');
          fetchAll();
        }
      },
    });
  };

  const submitForm = async () => {
    try {
      const vals = await form.validateFields();
      let err: string | null = null;

      if (mode === 'edit' && editing) {
        if (editing.level === 'pillar') {
          const { error } = await supabase
            .from('pillars')
            .update({
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', editing.id);
          err = error?.message ?? null;
        } else if (editing.level === 'theme') {
          const { error } = await supabase
            .from('themes')
            .update({
              code: vals.code,
              pillar_code: vals.pillar_code!,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', editing.id);
          err = error?.message ?? null;
        } else {
          const { error } = await supabase
            .from('subthemes')
            .update({
              code: vals.code,
              pillar_code: vals.pillar_code!,
              theme_code: vals.theme_code!,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            })
            .eq('id', editing.id);
          err = error?.message ?? null;
        }
      } else {
        // add
        if (vals.level === 'pillar') {
          const { error } = await supabase.from('pillars').insert([
            {
              code: vals.code,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            },
          ]);
          err = error?.message ?? null;
        } else if (vals.level === 'theme') {
          const { error } = await supabase.from('themes').insert([
            {
              code: vals.code,
              pillar_code: vals.pillar_code!,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            },
          ]);
          err = error?.message ?? null;
        } else {
          const { error } = await supabase.from('subthemes').insert([
            {
              code: vals.code,
              pillar_code: vals.pillar_code!,
              theme_code: vals.theme_code!,
              name: vals.name,
              description: vals.description ?? '',
              sort_order: vals.sort_order ?? 1,
            },
          ]);
          err = error?.message ?? null;
        }
      }

      if (err) {
        message.error(err);
      } else {
        setModalOpen(false);
        setEditing(null);
        form.resetFields();
        message.success('Saved');
        fetchAll();
      }
    } catch {
      // validation blocked submission
    }
  };

  /** ── CSV Import/Export ─────────────────────────────────────────────────*/
  const exportLevel = (level: Level) => {
    if (level === 'pillar') {
      // flatten pillars only
      const rows: PillarRow[] = [];
      tree.forEach((p) =>
        rows.push({
          id: p.id,
          code: p.code,
          name: p.name,
          description: p.description ?? '',
          sort_order: p.sort_order ?? null,
        }),
      );
      downloadCSV(rows, 'pillars_export.csv');
    } else if (level === 'theme') {
      const rows: ThemeRow[] = [];
      tree.forEach((p) =>
        (p.children ?? []).forEach((t) =>
          rows.push({
            id: t.id,
            code: t.code,
            pillar_code: t.pillar_code!,
            name: t.name,
            description: t.description ?? '',
            sort_order: t.sort_order ?? null,
          }),
        ),
      );
      downloadCSV(rows, 'themes_export.csv');
    } else {
      const rows: SubthemeRow[] = [];
      tree.forEach((p) =>
        (p.children ?? []).forEach((t) =>
          (t.children ?? []).forEach((s) =>
            rows.push({
              id: s.id,
              code: s.code,
              pillar_code: s.pillar_code,
              theme_code: s.theme_code!,
              name: s.name,
              description: s.description ?? '',
              sort_order: s.sort_order ?? null,
            }),
          ),
        ),
      );
      downloadCSV(rows, 'subthemes_export.csv');
    }
  };

  const importLevel = (level: Level, file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        const rows = res.data as any[];
        let err: string | null = null;

        // Upsert by code (simple + safe)
        try {
          if (level === 'pillar') {
            for (const r of rows) {
              const patch = {
                code: String(r.code ?? '').trim(),
                name: String(r.name ?? '').trim(),
                description: String(r.description ?? ''),
                sort_order: r.sort_order ? Number(r.sort_order) : 1,
              };
              if (!patch.code || !patch.name) continue;

              // Try update by code first, else insert
              const { data: found } = await supabase
                .from('pillars')
                .select('id')
                .eq('code', patch.code)
                .maybeSingle();

              if (found?.id) {
                await supabase.from('pillars').update(patch).eq('id', found.id);
              } else {
                await supabase.from('pillars').insert([patch]);
              }
            }
          } else if (level === 'theme') {
            for (const r of rows) {
              const patch = {
                code: String(r.code ?? '').trim(),
                pillar_code: String(r.pillar_code ?? '').trim(),
                name: String(r.name ?? '').trim(),
                description: String(r.description ?? ''),
                sort_order: r.sort_order ? Number(r.sort_order) : 1,
              };
              if (!patch.code || !patch.name || !patch.pillar_code) continue;

              const { data: found } = await supabase
                .from('themes')
                .select('id')
                .eq('code', patch.code)
                .maybeSingle();

              if (found?.id) {
                await supabase.from('themes').update(patch).eq('id', found.id);
              } else {
                await supabase.from('themes').insert([patch]);
              }
            }
          } else {
            for (const r of rows) {
              const patch = {
                code: String(r.code ?? '').trim(),
                pillar_code: String(r.pillar_code ?? '').trim(),
                theme_code: String(r.theme_code ?? '').trim(),
                name: String(r.name ?? '').trim(),
                description: String(r.description ?? ''),
                sort_order: r.sort_order ? Number(r.sort_order) : 1,
              };
              if (!patch.code || !patch.name || !patch.theme_code) continue;

              const { data: found } = await supabase
                .from('subthemes')
                .select('id')
                .eq('code', patch.code)
                .maybeSingle();

              if (found?.id) {
                await supabase.from('subthemes').update(patch).eq('id', found.id);
              } else {
                await supabase.from('subthemes').insert([patch]);
              }
            }
          }
        } catch (e: any) {
          err = e?.message ?? 'Import failed';
        }

        if (err) message.error(err);
        else {
          message.success('Import complete');
          fetchAll();
        }
      },
      error: (e) => {
        message.error(e.message || 'CSV parse error');
      },
    });
  };

  /** ── Table columns ─────────────────────────────────────────────────────*/
  const columns: ColumnsType<UIRow> = [
    {
      title: 'Type / Code',
      dataIndex: 'level',
      key: 'type',
      width: '20%',
      render: (_: any, rec: UIRow) => <LevelTag level={rec.level} code={rec.code} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '28%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '34%',
      render: (v?: string) => <span style={{ color: '#555' }}>{v || ''}</span>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: '6%',
      render: (v: any) => (v ?? '') as any,
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, rec: UIRow) => {
        const addChildrenTo =
          rec.level === 'pillar' ? 'theme' : rec.level === 'theme' ? 'subtheme' : null;
        return (
          <Space size={8} wrap>
            {addChildrenTo && (
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => openAdd(addChildrenTo as Level, rec)}
              >
                Add {addChildrenTo}
              </Button>
            )}
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
              Edit
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => doDelete(rec)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  /** ── Render ────────────────────────────────────────────────────────────*/
  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <Space align="center" style={{ marginBottom: 12 }}>
        <Link href="/" style={{ fontSize: 18 }}>
          <ArrowLeftOutlined />
        </Link>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Primary Framework Editor
        </Typography.Title>
      </Space>

      {/* Toolbar */}
      <Space wrap style={{ marginBottom: 12 }}>
        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
          Refresh
        </Button>

        {/* Pillars */}
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => openAdd('pillar')}>
            Add Pillar
          </Button>
          <Upload
            beforeUpload={(f) => {
              importLevel('pillar', f);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Import Pillars CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={() => exportLevel('pillar')}>
            Export Pillars
          </Button>
        </Space>

        <Divider type="vertical" />

        {/* Themes */}
        <Space>
          <Upload
            beforeUpload={(f) => {
              importLevel('theme', f);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Import Themes CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={() => exportLevel('theme')}>
            Export Themes
          </Button>
        </Space>

        <Divider type="vertical" />

        {/* Sub-themes */}
        <Space>
          <Upload
            beforeUpload={(f) => {
              importLevel('subtheme', f);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Import Sub-themes CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={() => exportLevel('subtheme')}>
            Export Sub-themes
          </Button>
        </Space>
      </Space>

      {/* Table */}
      <Table<UIRow>
        dataSource={tree}
        columns={columns}
        loading={loading}
        rowKey={(rec) => rec.key}
        pagination={false}
        style={{ background: '#fff' }}
        size="small"
        expandable={{
          defaultExpandAllRows: false,
          // Bigger expand/collapse caret
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.level === 'subtheme') return <span style={{ paddingLeft: 24 }} />;
            return (
              <span
                onClick={(e) => onExpand(record, e)}
                style={{
                  display: 'inline-block',
                  width: 24,
                  textAlign: 'center',
                  fontSize: 16,
                  cursor: 'pointer',
                  userSelect: 'none',
                  marginRight: 6,
                }}
              >
                {expanded ? '▾' : '▸'}
              </span>
            );
          },
          indentSize: 16,
        }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={mode === 'edit' ? 'Edit' : 'Add'}
        open={modalOpen}
        onOk={submitForm}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="level" label="Level" rules={[{ required: true }]}>
            <Input readOnly />
          </Form.Item>

          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input placeholder="Unique code (e.g., P1, T1.2, S1.2.3)" />
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

          <Form.Item name="sort_order" label="Sort order">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          {/* Parents only when needed */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              const level = form.getFieldValue('level') as Level | undefined;
              if (level === 'theme' || level === 'subtheme') {
                return (
                  <Form.Item
                    name="pillar_code"
                    label="Parent pillar_code"
                    rules={[{ required: true, message: 'pillar_code is required' }]}
                  >
                    <Input placeholder="e.g., P1" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {() => {
              const level = form.getFieldValue('level') as Level | undefined;
              if (level === 'subtheme') {
                return (
                  <Form.Item
                    name="theme_code"
                    label="Parent theme_code"
                    rules={[{ required: true, message: 'theme_code is required' }]}
                  >
                    <Input placeholder="e.g., T1.2" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* Footnote */}
      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          • Themes do not need sub-themes. • Sub-themes never show a caret. • Edits save directly
          to <code>pillars</code>, <code>themes</code>, and <code>subthemes</code>.
        </Text>
      </div>
    </div>
  );
}
