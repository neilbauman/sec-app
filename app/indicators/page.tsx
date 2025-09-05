// app/indicators/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

type IndicatorRow = {
  id: number;
  level: IndicatorLevel;
  ref_code: string | null;
  name: string;
  description: string | null;
  sort_order: number | null;
  criteria_count?: number;
};

const levelColor: Record<IndicatorLevel, string> = {
  pillar: 'gold',
  theme: 'blue',
  subtheme: 'purple',
};

export default function IndicatorsPage() {
  const supabase = getSupabase();
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);
  const [form] = Form.useForm<IndicatorRow>();

  const fetchRows = async () => {
    setLoading(true);
    // Grab indicators + criteria count
    const { data, error } = await supabase
      .from('indicators')
      .select('id, level, ref_code, name, description, sort_order, criteria_levels ( id )')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true, nullsFirst: true });

    if (error) {
      message.error(error.message);
      setLoading(false);
      return;
    }

    const mapped: IndicatorRow[] =
      (data ?? []).map((r: any) => ({
        id: r.id,
        level: r.level as IndicatorLevel,
        ref_code: r.ref_code,
        name: r.name,
        description: r.description,
        sort_order: r.sort_order,
        criteria_count: Array.isArray(r.criteria_levels) ? r.criteria_levels.length : 0,
      })) ?? [];

    setRows(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<IndicatorRow> = useMemo(
    () => [
      {
        title: 'Level',
        dataIndex: 'level',
        width: 120,
        render: (lvl: IndicatorLevel) => <Tag color={levelColor[lvl]}>{lvl}</Tag>,
        sorter: (a, b) => a.level.localeCompare(b.level),
      },
      {
        title: 'Code',
        dataIndex: 'ref_code',
        width: 140,
        render: (c: string | null) => c ?? <span style={{ opacity: 0.5 }}>—</span>,
        sorter: (a, b) => (a.ref_code ?? '').localeCompare(b.ref_code ?? ''),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        render: (v) => <Typography.Text strong>{v}</Typography.Text>,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (v: string | null) => v ?? <span style={{ opacity: 0.5 }}>—</span>,
      },
      {
        title: 'Sort',
        dataIndex: 'sort_order',
        width: 90,
        align: 'right',
        render: (n: number | null) => n ?? <span style={{ opacity: 0.5 }}>—</span>,
        sorter: (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      },
      {
        title: 'Criteria',
        dataIndex: 'criteria_count',
        width: 100,
        align: 'right',
        render: (n: number | undefined) => n ?? 0,
        sorter: (a, b) => (a.criteria_count ?? 0) - (b.criteria_count ?? 0),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 160,
        render: (_, rec) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setEditing(rec);
                form.setFieldsValue({
                  ...rec,
                });
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete indicator"
              description="Are you sure?"
              onConfirm={() => handleDelete(rec.id)}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows]
  );

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('indicators').delete().eq('id', id);
    if (error) return message.error(error.message);
    message.success('Deleted');
    fetchRows();
  };

  const handleOpenNew = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      level: values.level as IndicatorLevel,
      ref_code: values.ref_code || null,
      name: values.name,
      description: values.description || null,
      sort_order: values.sort_order ?? null,
    };

    let errorMsg: string | null = null;

    if (editing) {
      const { error } = await supabase.from('indicators').update(payload).eq('id', editing.id);
      errorMsg = error?.message ?? null;
    } else {
      const { error } = await supabase.from('indicators').insert(payload);
      errorMsg = error?.message ?? null;
    }

    if (errorMsg) return message.error(errorMsg);
    setModalOpen(false);
    message.success(editing ? 'Saved' : 'Added');
    fetchRows();
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleOpenNew}>
          New indicator
        </Button>
        <Button onClick={fetchRows}>Refresh</Button>
      </Space>

      <Table<IndicatorRow>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />

      <Modal
        title={editing ? 'Edit indicator' : 'New indicator'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Please pick a level' }]}
          >
            <Select
              options={[
                { value: 'pillar', label: 'Pillar' },
                { value: 'theme', label: 'Theme' },
                { value: 'subtheme', label: 'Sub-theme' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Code (optional)" name="ref_code">
            <Input placeholder="e.g. I-P1 (optional)" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Sort order" name="sort_order">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
