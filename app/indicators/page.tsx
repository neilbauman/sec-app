'use client';

import React, { useEffect, useMemo, useState } from 'react';
import getBrowserClient from '@/lib/supabaseClient';
import {
  Table,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

type IndicatorRow = {
  id: string;
  level: IndicatorLevel;
  ref_code: string | null;
  name: string;
  description: string | null;
  sort_order: number | null;
};

const levelOptions: { label: string; value: IndicatorLevel }[] = [
  { label: 'Pillar', value: 'pillar' },
  { label: 'Theme', value: 'theme' },
  { label: 'Sub-theme', value: 'subtheme' },
];

export default function IndicatorsPage() {
  const supabase = getBrowserClient();
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);
  const [form] = Form.useForm<IndicatorRow>();

  async function load() {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('indicators')
      .select('*')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(error);
      message.error(error.message || 'Failed to load indicators');
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(row: IndicatorRow) {
    setEditing(row);
    form.setFieldsValue({
      id: row.id,
      level: row.level,
      ref_code: row.ref_code ?? '',
      name: row.name,
      description: row.description ?? '',
      sort_order: row.sort_order ?? 1,
    } as any);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    const { error } = await (supabase as any).from('indicators').delete().eq('id', id);
    if (error) {
      console.error(error);
      message.error(error.message || 'Delete failed');
    } else {
      message.success('Deleted');
      load();
    }
  }

  async function handleSubmit() {
    try {
      const vals = await form.validateFields();
      const payload = {
        level: vals.level as IndicatorLevel,
        ref_code: (vals.ref_code ?? '') || null,
        name: vals.name,
        description: (vals.description ?? '') || null,
        sort_order: vals.sort_order ?? 1,
      };

      let err: string | null = null;

      if (editing) {
        const { error } = await (supabase as any)
          .from('indicators')
          .update(payload)
          .eq('id', editing.id);
        err = error?.message ?? null;
      } else {
        const { error } = await (supabase as any).from('indicators').insert(payload);
        err = error?.message ?? null;
      }

      if (err) {
        message.error(err);
        return;
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      load();
      message.success('Saved');
    } catch {
      // validation failed
    }
  }

  const columns: ColumnsType<IndicatorRow> = useMemo(
    () => [
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        width: 120,
        render: (v: IndicatorLevel) => {
          const l = levelOptions.find((x) => x.value === v)?.label ?? v;
          return <span style={{ fontWeight: 500 }}>{l}</span>;
        },
      },
      {
        title: 'Ref Code',
        dataIndex: 'ref_code',
        key: 'ref_code',
        width: 160,
        render: (v?: string | null) => v || <span style={{ color: '#999' }}>—</span>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        render: (v?: string | null) => v || <span style={{ color: '#999' }}>—</span>,
      },
      {
        title: 'Sort',
        dataIndex: 'sort_order',
        key: 'sort_order',
        width: 80,
        render: (v?: number | null) => v ?? <span style={{ color: '#999' }}>—</span>,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 140,
        render: (_, row) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => openEdit(row)} size="small">
              Edit
            </Button>
            <Popconfirm
              title="Delete this indicator?"
              onConfirm={() => handleDelete(row.id)}
              okButtonProps={{ danger: true }}
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Indicators
        </Typography.Title>
        <Button icon={<ReloadOutlined />} onClick={load}>
          Refresh
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Indicator
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />

      <Modal
        title={editing ? 'Edit Indicator' : 'New Indicator'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ level: 'pillar', sort_order: 1 }}
        >
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: 'Level is required' }]}
          >
            <Select options={levelOptions} />
          </Form.Item>

          <Form.Item name="ref_code" label="Ref Code">
            <Input placeholder="Optional e.g. P1-T1" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>

          <Form.Item name="sort_order" label="Sort Order">
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
