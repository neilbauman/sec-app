'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import {
  Table,
  Typography,
  Space,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  InputNumber,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

// ------------- Types -------------
export type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

export interface IndicatorRow {
  id: number;                  // PK
  level: IndicatorLevel;       // 'pillar' | 'theme' | 'subtheme'
  ref_code: string;            // P*, T*.*, ST*.*.*
  name: string;
  description: string;
  sort_order: number;          // integer
}

type NewIndicator = Omit<IndicatorRow, 'id'>;

// ------------- Component -------------
export default function IndicatorsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);
  const [form] = Form.useForm<NewIndicator>();

  // ---- Fetch ----
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<IndicatorRow>('indicators')
      .select('*')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true });

    setLoading(false);
    if (error) {
      message.error(error.message);
      return;
    }
    setRows(data ?? []);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Open / Close modal ----
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    // sensible defaults
    form.setFieldsValue({
      level: 'pillar',
      ref_code: '',
      name: '',
      description: '',
      sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
    } as NewIndicator);
    setModalOpen(true);
  };

  const openEdit = (row: IndicatorRow) => {
    setEditing(row);
    form.setFieldsValue({
      level: row.level,
      ref_code: row.ref_code,
      name: row.name,
      description: row.description,
      sort_order: row.sort_order,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  // ---- Submit ----
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      // ensure exact type
      const payload: NewIndicator = {
        level: values.level as IndicatorLevel,
        ref_code: String(values.ref_code).trim(),
        name: String(values.name).trim(),
        description: String(values.description ?? '').trim(),
        sort_order: Number(values.sort_order ?? 0),
      };

      let errorMsg: string | null = null;

      if (editing) {
        // Update typed call
        const { error } = await supabase
          .from<IndicatorRow>('indicators')
          .update(payload) // payload typed as NewIndicator, compatible with row
          .eq('id', editing.id);

        errorMsg = error?.message ?? null;
      } else {
        const { error } = await supabase
          .from<IndicatorRow>('indicators')
          .insert(payload);
        errorMsg = error?.message ?? null;
      }

      if (errorMsg) {
        message.error(errorMsg);
        return;
      }

      message.success(editing ? 'Indicator updated' : 'Indicator created');
      closeModal();
      fetchData();
    } catch (err) {
      // validation or unexpected
      const msg =
        err instanceof Error ? err.message : 'Validation failed. Check fields.';
      message.error(msg);
    }
  };

  // ---- Delete ----
  const onDelete = async (row: IndicatorRow) => {
    const { error } = await supabase.from('indicators').delete().eq('id', row.id);
    if (error) {
      message.error(error.message);
      return;
    }
    message.success('Indicator deleted');
    fetchData();
  };

  // ---- Columns ----
  const columns: ColumnsType<IndicatorRow> = [
    {
      title: 'Level',
      dataIndex: 'level',
      width: 120,
      render: (v: IndicatorLevel) => v.toUpperCase(),
      filters: [
        { text: 'Pillar', value: 'pillar' },
        { text: 'Theme', value: 'theme' },
        { text: 'Sub-theme', value: 'subtheme' },
      ],
      onFilter: (val, rec) => rec.level === val,
    },
    { title: 'Code', dataIndex: 'ref_code', width: 140 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      width: 90,
      sorter: (a, b) => a.sort_order - b.sort_order,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => onDelete(row)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
        <Title level={3} style={{ margin: 0 }}>
          Indicators
        </Title>
        <Space>
          <Button onClick={fetchData}>Refresh</Button>
          <Button type="primary" onClick={openCreate}>
            Add Indicator
          </Button>
        </Space>
      </Space>

      <Divider />

      <Table<IndicatorRow>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 20, size: 'small' }}
      />

      <Modal
        title={editing ? 'Edit Indicator' : 'New Indicator'}
        open={modalOpen}
        onCancel={closeModal}
        onOk={onSubmit}
        okText={editing ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form<NewIndicator> form={form} layout="vertical">
          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Select a level' }]}
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
            label="Reference Code"
            name="ref_code"
            rules={[{ required: true, message: 'Enter the reference code' }]}
          >
            <Input placeholder="e.g., P2, T1.3, ST2.1.1" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Enter a name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Sort order"
            name="sort_order"
            rules={[{ required: true, message: 'Provide sort order (integer)' }]}
          >
            <InputNumber min={0} step={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
