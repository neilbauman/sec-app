// /app/indicators/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getBrowserClient } from '@/lib/supabaseClient';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

type IndicatorRow = {
  id: string;
  ref_code: string;         // e.g. ties to pillar/theme/subtheme code
  level: IndicatorLevel;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export default function IndicatorsPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);
  const [form] = Form.useForm<Partial<IndicatorRow>>();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('indicators').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      setRows(data || []);
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Failed to load indicators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue({ level: 'pillar', sort_order: 1 });
    setModalOpen(true);
  };

  const openEdit = (row: IndicatorRow) => {
    setEditing(row);
    form.setFieldsValue({
      ref_code: row.ref_code,
      level: row.level,
      name: row.name,
      description: row.description ?? '',
      sort_order: row.sort_order ?? 1,
    });
    setModalOpen(true);
  };

  const onDelete = (row: IndicatorRow) => {
    Modal.confirm({
      title: 'Delete indicator?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.from('indicators').delete().eq('id', row.id);
          if (error) throw error;
          message.success('Deleted');
          await load();
        } catch (e: any) {
          console.error(e);
          message.error(e?.message ?? 'Delete failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submit = async () => {
    const vals = await form.validateFields();
    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from('indicators')
          .update({
            ref_code: vals.ref_code,
            level: vals.level,
            name: vals.name,
            description: vals.description ?? '',
            sort_order: Number(vals.sort_order ?? 1),
          })
          .eq('id', editing.id);
        if (error) throw error;
        message.success('Saved');
      } else {
        const { error } = await supabase.from('indicators').insert({
          ref_code: vals.ref_code,
          level: vals.level,
          name: vals.name,
          description: vals.description ?? '',
          sort_order: Number(vals.sort_order ?? 1),
        });
        if (error) throw error;
        message.success('Created');
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      await load();
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<IndicatorRow> = [
    { title: 'Level', dataIndex: 'level', key: 'level', width: '12%' },
    { title: 'Ref Code', dataIndex: 'ref_code', key: 'ref_code', width: '16%' },
    { title: 'Name', dataIndex: 'name', key: 'name', width: '32%' },
    { title: 'Description', dataIndex: 'description', key: 'description', width: '28%', render: (v) => v || <span style={{ color: '#bbb' }}>—</span> },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, rec) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>Edit</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(rec)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Indicators</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={load}>Reload</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Indicator</Button>
        </Space>
      </div>

      <Table
        loading={loading}
        dataSource={rows}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="middle"
      />

      <Modal
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={submit}
        title={editing ? 'Edit Indicator' : 'Create Indicator'}
        okText={editing ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="level" label="Level" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'pillar', label: 'Pillar' },
                { value: 'theme', label: 'Theme' },
                { value: 'subtheme', label: 'Subtheme' },
              ]}
            />
          </Form.Item>
          <Form.Item name="ref_code" label="Ref Code" rules={[{ required: true }]}>
            <Input placeholder="Matches a pillar/theme/subtheme code (e.g. P1, T1.2)" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort Order">
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
