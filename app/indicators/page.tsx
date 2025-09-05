'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Table, Typography, Space, Modal, Form, Input, Select, InputNumber, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { z } from 'zod';
import { createClient } from '@/lib/supabaseClient'; // <- your existing export (browser client)

// ---------- Types & Validation ----------
export type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

const IndicatorRowSchema = z.object({
  id: z.number(),
  level: z.enum(['pillar', 'theme', 'subtheme']),
  ref_code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  sort_order: z.number().nullable().optional(),
});

type IndicatorRow = z.infer<typeof IndicatorRowSchema>;

const emptyRow: Omit<IndicatorRow, 'id'> = {
  level: 'pillar',
  ref_code: '',
  name: '',
  description: '',
  sort_order: 1,
};

// ---------- Component ----------
export default function IndicatorsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<Omit<IndicatorRow, 'id'>>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);

  // ---- Load
  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('indicators')
      .select('*')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true });

    setLoading(false);

    if (error) {
      message.error(`Failed to load indicators: ${error.message}`);
      return;
    }
    // Runtime validation & sanitization
    const parsed: IndicatorRow[] = [];
    (data ?? []).forEach((d: any) => {
      const safe = IndicatorRowSchema.safeParse(d);
      if (safe.success) parsed.push(safe.data);
    });
    setRows(parsed);
  }, [supabase]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // ---- Open create / edit
  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue(emptyRow);
    setModalOpen(true);
  };

  const openEdit = (row: IndicatorRow) => {
    setEditing(row);
    // Ensure defaults to satisfy form control types
    form.setFieldsValue({
      level: row.level,
      ref_code: row.ref_code ?? '',
      name: row.name ?? '',
      description: row.description ?? '',
      sort_order: row.sort_order ?? 1,
    });
    setModalOpen(true);
  };

  // ---- Submit create / update
  const onSubmit = async () => {
    const values = await form.validateFields();
    // Normalize
    const payload: Omit<IndicatorRow, 'id'> = {
      level: values.level,
      ref_code: values.ref_code.trim(),
      name: values.name.trim(),
      description: (values.description ?? '').toString(),
      sort_order: Number(values.sort_order ?? 1),
    };

    let err: string | null = null;

    if (editing) {
      const { error } = await supabase
        .from('indicators')
        .update(payload as any)
        .eq('id', editing.id);
      err = error?.message ?? null;
    } else {
      const { error } = await supabase.from('indicators').insert(payload as any);
      err = error?.message ?? null;
    }

    if (err) {
      message.error(err);
      return;
    }

    setModalOpen(false);
    setEditing(null);
    message.success('Saved');
    fetchRows();
  };

  // ---- Delete
  const remove = async (row: IndicatorRow) => {
    const { error } = await supabase.from('indicators').delete().eq('id', row.id);
    if (error) {
      message.error(error.message);
      return;
    }
    message.success('Deleted');
    fetchRows();
  };

  // ---- Columns
  const columns: ColumnsType<IndicatorRow> = [
    {
      title: 'Level',
      dataIndex: 'level',
      width: 120,
      filters: [
        { text: 'Pillar', value: 'pillar' },
        { text: 'Theme', value: 'theme' },
        { text: 'Sub-theme', value: 'subtheme' },
      ],
      onFilter: (v, record) => record.level === v,
      render: (v: IndicatorLevel) => {
        const label =
          v === 'pillar' ? 'Pillar' : v === 'theme' ? 'Theme' : 'Sub-theme';
        return <Typography.Text>{label}</Typography.Text>;
      },
    },
    {
      title: 'Code',
      dataIndex: 'ref_code',
      width: 140,
      render: (text: string) => <Typography.Text code>{text}</Typography.Text>,
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
      render: (t?: string | null) => t ?? '',
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      width: 90,
      sorter: (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      render: (n?: number | null) => n ?? '',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: 160,
      render: (_: any, row) => (
        <Space>
          <Button size="small" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete indicator?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => remove(row)}
          >
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Indicators
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Indicator
        </Button>
        <Button onClick={fetchRows}>Refresh</Button>
      </Space>

      <Table<IndicatorRow>
        rowKey="id"
        size="middle"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 20, showSizeChanger: false }}
      />

      <Modal
        title={editing ? 'Edit Indicator' : 'Add Indicator'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onOk={onSubmit}
        okText="Save"
        destroyOnClose
      >
        <Form<Omit<IndicatorRow, 'id'>>
          form={form}
          layout="vertical"
          initialValues={emptyRow}
        >
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: 'Please choose a level' }]}
          >
            <Select
              options={[
                { value: 'pillar', label: 'Pillar' },
                { value: 'theme', label: 'Theme' },
                { value: 'subtheme', label: 'Sub-theme' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="ref_code"
            label="Reference Code"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input placeholder="e.g., P2, T1.3, ST2.1.1" />
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
            label="Sort Order"
            rules={[{ required: true, message: 'Sort order is required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
