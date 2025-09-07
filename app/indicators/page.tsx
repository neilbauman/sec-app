// /app/indicators/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button, Table, Space, Tag, Form, Input, InputNumber, Modal, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getBrowserClient } from '@/lib/supabaseClient';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

type Row = {
  id: string;
  level: IndicatorLevel;
  ref_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

const { Title, Text } = Typography;

const levelColor: Record<IndicatorLevel, string> = {
  pillar: 'geekblue',
  theme: 'green',
  subtheme: 'red',
};

export default function IndicatorsPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [form] = Form.useForm<Partial<Row>>();
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; rec?: Row } | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('indicators').select('*').order('level', { ascending: true }).order('sort_order', { ascending: true });
      if (error) throw error;
      setRows((data || []) as any);
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAdd = () => {
    setModal({ open: true, mode: 'add' });
    form.setFieldsValue({ level: 'pillar', ref_code: '', name: '', description: '', sort_order: 1 });
  };

  const openEdit = (rec: Row) => {
    setModal({ open: true, mode: 'edit', rec });
    form.setFieldsValue({
      level: rec.level,
      ref_code: rec.ref_code,
      name: rec.name,
      description: rec.description ?? '',
      sort_order: rec.sort_order ?? 1,
    });
  };

  const doDelete = async (rec: Row) => {
    Modal.confirm({
      title: 'Delete indicator',
      content: `Are you sure you want to delete "${rec.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.from('indicators' as any).delete().eq('id', rec.id);
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

      const body = {
        level: vals.level as IndicatorLevel,
        ref_code: String(vals.ref_code || '').trim(),
        name: String(vals.name || '').trim(),
        description: String(vals.description || '').trim(),
        sort_order: Number(vals.sort_order || 1),
      };

      if (modal?.mode === 'add') {
        const { error } = await supabase.from('indicators' as any).insert(body as any);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('indicators' as any).update(body as any).eq('id', modal!.rec!.id);
        if (error) throw error;
      }

      message.success('Saved');
      setModal(null);
      await fetchAll();
    } catch (e: any) {
      if (e?.errorFields) return;
      console.error(e);
      message.error(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Row> = [
    {
      title: 'Type',
      dataIndex: 'level',
      width: 120,
      render: (_: any, rec) => (
        <Space size={6}>
          <Tag color={levelColor[rec.level]} style={{ marginRight: 0 }}>{rec.level}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>({rec.ref_code})</Text>
        </Space>
      ),
    },
    { title: 'Name', dataIndex: 'name', ellipsis: true },
    { title: 'Description', dataIndex: 'description', ellipsis: true },
    { title: 'Sort', dataIndex: 'sort_order', width: 80, align: 'right', render: (v) => v ?? '' },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, rec) => (
        <Space size="small" wrap>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)}>
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => doDelete(rec)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }} align="center">
        <Title level={3} style={{ margin: 0 }}>Indicators</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Add
          </Button>
        </Space>
      </Space>

      <Table<Row>
        dataSource={rows}
        columns={columns}
        loading={loading}
        rowKey={(r) => r.id}
        size="middle"
        pagination={false}
      />

      <Modal
        title={modal?.mode === 'add' ? 'Add' : 'Edit'}
        open={!!modal?.open}
        onCancel={() => setModal(null)}
        onOk={submitModal}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="Type" name="level" rules={[{ required: true }]}>
            <Input placeholder="pillar | theme | subtheme" />
          </Form.Item>
          <Form.Item label="Code" name="ref_code" rules={[{ required: true }]}>
            <Input placeholder="Unique code" />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
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
