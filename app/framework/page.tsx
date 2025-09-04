'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import {
  Table, Typography, Space, Button, message, Modal, Form, Input, Popconfirm, Tag, Segmented
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

type Row = {
  key: string;
  level: 'pillar'|'theme'|'subtheme'|'standard';
  pillar_code?: string; pillar_name?: string; pillar_description?: string;
  theme_code?: string; theme_name?: string; theme_description?: string;
  subtheme_code?: string; subtheme_name?: string; subtheme_description?: string;
  standard_code?: string; standard_description?: string; standard_notes?: string;
  sort_order?: number;
  children?: Row[];
};

type EditPayload = {
  level: 'pillar'|'theme'|'subtheme'|'standard';
  code?: string; // for pillar/theme/subtheme
  standard_code?: string; // for standard
  name?: string;
  description?: string;
  notes?: string;
};

export default function FrameworkPage() {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [scopeFilter, setScopeFilter] = useState<'All'|'Pillars'|'Themes'|'Sub-themes'|'Standards'>('All');

  // Edit modal state
  const [openModal, setOpenModal] = useState(false);
  const [editLevel, setEditLevel] = useState<EditPayload['level']>('pillar');
  const [editCode, setEditCode] = useState<string>('');
  const [editStdCode, setEditStdCode] = useState<string>('');
  const [form] = Form.useForm();

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('v_full_framework')
        .select('*')
        .order('pillar_sort', { ascending: true, nullsFirst: false })
        .order('theme_sort', { ascending: true, nullsFirst: false })
        .order('subtheme_sort', { ascending: true, nullsFirst: false })
        .order('standard_sort', { ascending: true, nullsFirst: false });

      if (error) throw error;

      // Build hierarchy
      const pillarsMap = new Map<string, Row>();
      const themesMap = new Map<string, Row>();
      const subthemesMap = new Map<string, Row>();

      (data ?? []).forEach((r: any) => {
        // Pillar
        if (r.pillar_code && !pillarsMap.has(r.pillar_code)) {
          pillarsMap.set(r.pillar_code, {
            key: r.pillar_code,
            level: 'pillar',
            pillar_code: r.pillar_code,
            pillar_name: r.pillar_name,
            pillar_description: r.pillar_description,
            sort_order: r.pillar_sort ?? 0,
            children: []
          });
        }
        // Theme
        if (r.theme_code && !themesMap.has(r.theme_code)) {
          const p = pillarsMap.get(r.pillar_code);
          const node: Row = {
            key: r.theme_code,
            level: 'theme',
            pillar_code: r.pillar_code,
            theme_code: r.theme_code,
            theme_name: r.theme_name,
            theme_description: r.theme_description,
            sort_order: r.theme_sort ?? 0,
            children: []
          };
          themesMap.set(r.theme_code, node);
          if (p) p.children!.push(node);
        }
        // Subtheme
        if (r.subtheme_code && !subthemesMap.has(r.subtheme_code)) {
          const t = themesMap.get(r.theme_code);
          const node: Row = {
            key: r.subtheme_code,
            level: 'subtheme',
            pillar_code: r.pillar_code,
            theme_code: r.theme_code,
            subtheme_code: r.subtheme_code,
            subtheme_name: r.subtheme_name,
            subtheme_description: r.subtheme_description,
            sort_order: r.subtheme_sort ?? 0,
            children: []
          };
          subthemesMap.set(r.subtheme_code, node);
          if (t) t.children!.push(node);
        }
        // Standard (leaf)
        if (r.standard_code) {
          const parentKey = r.subtheme_code ?? r.theme_code ?? r.pillar_code; // safety
          const parent =
            subthemesMap.get(r.subtheme_code) ||
            themesMap.get(r.theme_code) ||
            pillarsMap.get(r.pillar_code);
          const node: Row = {
            key: r.standard_code,
            level: 'standard',
            pillar_code: r.pillar_code,
            theme_code: r.theme_code,
            subtheme_code: r.subtheme_code ?? undefined,
            standard_code: r.standard_code,
            standard_description: r.standard_description,
            standard_notes: r.standard_notes,
            sort_order: r.standard_sort ?? 0
          };
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(node);
          }
        }
      });

      // Sort children by sort_order then code/name
      const sortChildren = (node: Row) => {
        if (node.children && node.children.length) {
          node.children.sort((a, b) => {
            const ao = a.sort_order ?? 0, bo = b.sort_order ?? 0;
            if (ao !== bo) return ao - bo;
            return String(a.key).localeCompare(String(b.key));
          });
          node.children.forEach(sortChildren);
        }
      };

      const roots = Array.from(pillarsMap.values())
        .sort((a, b) => {
          const ao = a.sort_order ?? 0, bo = b.sort_order ?? 0;
          if (ao !== bo) return ao - bo;
          return String(a.pillar_code).localeCompare(String(b.pillar_code));
        });
      roots.forEach(sortChildren);
      setRows(roots);
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter by scope
  const filteredRows = useMemo(() => {
    if (scopeFilter === 'All') return rows;
    const want: Row['level'][] =
      scopeFilter === 'Pillars' ? ['pillar'] :
      scopeFilter === 'Themes' ? ['theme'] :
      scopeFilter === 'Sub-themes' ? ['subtheme'] :
      ['standard'];
    // Show only rows whose level is in want; keep ancestors so tree renders.
    const keep = new Set<string>();
    const dfs = (node: Row, parentKept: boolean): Row | null => {
      const isMatch = want.includes(node.level);
      const keepNode = isMatch || parentKept;
      const kids = (node.children || [])
        .map(ch => dfs(ch, keepNode))
        .filter(Boolean) as Row[];
      if (keepNode || kids.length) {
        const clone = { ...node, children: kids } as Row;
        keep.add(String(clone.key));
        return clone;
      }
      return null;
    };
    return rows.map(r => dfs(r, false)).filter(Boolean) as Row[];
  }, [rows, scopeFilter]);

  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (v: Row['level']) => {
        const m: Record<string, 'magenta'|'geekblue'|'cyan'|'gold'> = {
          pillar: 'magenta', theme: 'geekblue', subtheme: 'cyan', standard: 'gold'
        };
        return <Tag color={m[v]} style={{ textTransform: 'capitalize' }}>{v}</Tag>;
      }
    },
    {
      title: 'Name / Code',
      key: 'name',
      render: (_: any, r: Row) => {
        if (r.level === 'pillar') {
          return <span><b>{r.pillar_name}</b> <Typography.Text type="secondary">({r.pillar_code})</Typography.Text></span>;
        }
        if (r.level === 'theme') {
          return <span><b>{r.theme_name}</b> <Typography.Text type="secondary">({r.theme_code})</Typography.Text></span>;
        }
        if (r.level === 'subtheme') {
          return <span><b>{r.subtheme_name}</b> <Typography.Text type="secondary">({r.subtheme_code})</Typography.Text></span>;
        }
        return <span><b>{r.standard_code}</b></span>;
      }
    },
    {
      title: 'Description / Notes',
      key: 'desc',
      render: (_: any, r: Row) => {
        if (r.level === 'pillar') return r.pillar_description || <Typography.Text type="secondary">—</Typography.Text>;
        if (r.level === 'theme') return r.theme_description || <Typography.Text type="secondary">—</Typography.Text>;
        if (r.level === 'subtheme') return r.subtheme_description || <Typography.Text type="secondary">—</Typography.Text>;
        return (
          <div>
            <div>{r.standard_description || <Typography.Text type="secondary">—</Typography.Text>}</div>
            {r.standard_notes ? <Typography.Text type="secondary">Notes: {r.standard_notes}</Typography.Text> : null}
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      render: (_: any, r: Row) => {
        return (
          <Space>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(r)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete this item?"
              onConfirm={() => doDelete(r)}
            >
              <Button size="small" danger icon={<DeleteOutlined />}/>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const openEdit = (r: Row) => {
    if (r.level === 'pillar') {
      setEditLevel('pillar'); setEditCode(r.pillar_code!); setEditStdCode('');
      form.setFieldsValue({ name: r.pillar_name, description: r.pillar_description });
    } else if (r.level === 'theme') {
      setEditLevel('theme'); setEditCode(r.theme_code!); setEditStdCode('');
      form.setFieldsValue({ name: r.theme_name, description: r.theme_description });
    } else if (r.level === 'subtheme') {
      setEditLevel('subtheme'); setEditCode(r.subtheme_code!); setEditStdCode('');
      form.setFieldsValue({ name: r.subtheme_name, description: r.subtheme_description });
    } else {
      setEditLevel('standard'); setEditCode(''); setEditStdCode(r.standard_code!);
      form.setFieldsValue({ description: r.standard_description, notes: r.standard_notes });
    }
    setOpenModal(true);
  };

  const doDelete = async (r: Row) => {
    try {
      if (r.level === 'pillar') {
        const { error } = await supabase.from('pillars').delete().eq('code', r.pillar_code);
        if (error) throw error;
      } else if (r.level === 'theme') {
        const { error } = await supabase.from('themes').delete().eq('code', r.theme_code);
        if (error) throw error;
      } else if (r.level === 'subtheme') {
        const { error } = await supabase.from('subthemes').delete().eq('code', r.subtheme_code);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('standards').delete().eq('code', r.standard_code);
        if (error) throw error;
      }
      message.success('Deleted');
      await load();
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Delete failed');
    }
  };

  const onSaveModal = async () => {
    try {
      const v = await form.validateFields();
      if (editLevel === 'pillar') {
        const { error } = await supabase.from('pillars')
          .update({ name: v.name, description: v.description })
          .eq('code', editCode);
        if (error) throw error;
      } else if (editLevel === 'theme') {
        const { error } = await supabase.from('themes')
          .update({ name: v.name, description: v.description })
          .eq('code', editCode);
        if (error) throw error;
      } else if (editLevel === 'subtheme') {
        const { error } = await supabase.from('subthemes')
          .update({ name: v.name, description: v.description })
          .eq('code', editCode);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('standards')
          .update({ description: v.description, notes: v.notes ?? null })
          .eq('code', editStdCode);
        if (error) throw error;
      }
      message.success('Saved');
      setOpenModal(false);
      await load();
    } catch (e: any) {
      if (e?.errorFields) return; // form validation
      console.error(e);
      message.error(e.message || 'Save failed');
    }
  };

  const addItem = async (level: 'pillar'|'theme'|'subtheme'|'standard', parent?: Row) => {
    try {
      if (level === 'pillar') {
        const code = prompt('New Pillar code (e.g., P4):');
        const name = prompt('Pillar name:') || '';
        if (!code) return;
        const { error } = await supabase.from('pillars').insert({ code, name });
        if (error) throw error;
      } else if (level === 'theme' && parent?.pillar_code) {
        const code = prompt('New Theme code (e.g., T1.6):');
        const name = prompt('Theme name:') || '';
        if (!code) return;
        const { error } = await supabase.from('themes')
          .insert({ pillar_code: parent.pillar_code, code, name });
        if (error) throw error;
      } else if (level === 'subtheme' && parent?.theme_code) {
        const code = prompt('New Sub-theme code (e.g., ST2.1c):');
        const name = prompt('Sub-theme name:') || '';
        if (!code) return;
        const { error } = await supabase.from('subthemes')
          .insert({ theme_code: parent.theme_code, code, name });
        if (error) throw error;
      } else if (level === 'standard') {
        // standards attach to subtheme (your current CSV)
        const code = prompt('New Standard code (e.g., STD-ST2.1a):');
        const desc = prompt('Standard description:') || '';
        if (!code) return;
        const subtheme_code = parent?.subtheme_code || prompt('Parent subtheme code (e.g., ST2.1a):') || '';
        const { error } = await supabase.from('standards')
          .insert({ code, subtheme_code, description: desc });
        if (error) throw error;
      }
      message.success('Added');
      await load();
    } catch (e: any) {
      console.error(e);
      message.error(e.message || 'Add failed');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '24px auto', padding: 12 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Framework Editor
          </Typography.Title>
          <Space>
            <Segmented
              value={scopeFilter}
              onChange={(val) => setScopeFilter(val as any)}
              options={['All','Pillars','Themes','Sub-themes','Standards']}
            />
            <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
            <Button onClick={() => addItem('pillar')} icon={<PlusOutlined />}>Add Pillar</Button>
          </Space>
        </Space>

        <Table<Row>
          columns={columns as any}
          dataSource={filteredRows}
          loading={loading}
          rowKey="key"
          pagination={false}
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: (keys) => setExpandedKeys(keys as React.Key[]),
          }}
          bordered
          size="small"
          style={{ background: 'white' }}
          onRow={(record) => ({
            onDoubleClick: () => openEdit(record)
          })}
        />

        {/* Quick add row controls */}
        <Space wrap>
          <Typography.Text type="secondary">Quick add in context:</Typography.Text>
          <Button onClick={() => {
            const code = prompt('Parent Pillar code for new Theme (e.g., P1):') || '';
            if (!code) return;
            addItem('theme', { level:'pillar', key: code, pillar_code: code });
          }}>
            + Theme under Pillar
          </Button>
          <Button onClick={() => {
            const code = prompt('Parent Theme code for new Sub-theme (e.g., T2.1):') || '';
            if (!code) return;
            addItem('subtheme', { level:'theme', key: code, theme_code: code });
          }}>
            + Sub-theme under Theme
          </Button>
          <Button onClick={() => {
            const code = prompt('Parent Sub-theme code for new Standard (e.g., ST2.1a):') || '';
            if (!code) return;
            addItem('standard', { level:'subtheme', key: code, subtheme_code: code });
          }}>
            + Standard under Sub-theme
          </Button>
        </Space>
      </Space>

      <Modal
        title={`Edit ${editLevel}`}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={onSaveModal}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          {editLevel !== 'standard' ? (
            <>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="description" label="Standard description">
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </Form.Item>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea autoSize={{ minRows: 2 }} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
