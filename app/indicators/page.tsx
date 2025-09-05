'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getBrowserClient } from '@/lib/supabaseClient';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

type IndicatorRow = {
  id: string;
  level: IndicatorLevel;
  ref_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

const LEVEL_COLOR: Record<IndicatorLevel, string> = {
  pillar: 'geekblue',
  theme: 'green',
  subtheme: 'volcano',
};

export default function IndicatorsPage() {
  const supabase = getBrowserClient();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('indicators')
        .select('*')
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setRows((data ?? []) as any);
    } catch (err: any) {
      console.error(err);
      message.error(err.message ?? 'Failed to load indicators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<IndicatorRow> = useMemo(() => [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (lvl: IndicatorLevel) => <Tag color={LEVEL_COLOR[lvl]}>{lvl}</Tag>,
    },
    { title: 'Ref code', dataIndex: 'ref_code', key: 'ref_code', width: 140 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (t) => <span style={{ opacity: 0.9 }}>{t}</span>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      align: 'right',
      width: 80,
      render: (n) => (n ?? 1),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, rec) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => del(rec)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ], []);

  const openNew = () => {
    setEditing(null);
    form.setFieldsValue({
      level: 'pillar',
      ref_code: '',
      name: '',
      description: '',
      sort_order: 1,
    });
    setEditOpen(true);
  };

  const openEdit = (rec: IndicatorRow) => {
    setEditing(rec);
    form.setFieldsValue({
      level: rec.level,
      ref_code: rec.ref_code ?? '',
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
    setEditOpen(true);
  };

  const save = async () => {
    const vals = await form.validateFields();
    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from('indicators')
          .update({
            level: vals.level,
            ref_code: vals.ref_code || null,
            name: vals.name,
            description: vals.description || null,
            sort_order: vals.sort_order ?? 1,
          } as any)
          .eq('id', editing.id);
        if (error) throw error;
        message.success('Updated');
      } else {
        const { error } = await supabase.from('indicators').insert({
          level: vals.level,
          ref_code: vals.ref_code || null,
          name: vals.name,
          description: vals.description || null,
          sort_order: vals.sort_order ?? 1,
        } as any);
        if (error) throw error;
        message.success('Created');
      }
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (err: any) {
      console.error(err);
      message.error(err.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const del = async (rec: IndicatorRow) => {
    Modal.confirm({
      title: 'Delete indicator?',
      content: rec.name,
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.from('indicators').delete().eq('id', rec.id);
          if (error) throw error;
          message.success('Deleted');
          await load();
        } catch (err: any) {
          console.error(err);
          message.error(err.message ?? 'Delete failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<ReloadOutlined />} onClick={load} disabled={loading}>
          Refresh
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
          New indicator
        </Button>
      </Space>

      <Table<IndicatorRow>
        loading={loading}
        dataSource={rows}
        rowKey="id"
        columns={columns}
        pagination={{ pageSize: 20 }}
        size="small"
      />

      <Modal
        title={editing ? 'Edit indicator' : 'New indicator'}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={save}
        okButtonProps={{ loading }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="level" label="Level" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Pillar', value: 'pillar' },
                { label: 'Theme', value: 'theme' },
                { label: 'Sub-theme', value: 'subtheme' },
              ]}
            />
          </Form.Item>
          <Form.Item name="ref_code" label="Reference code">
            <Input placeholder="optional" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort order" rules={[{ type: 'number', min: 1 }]}>
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
