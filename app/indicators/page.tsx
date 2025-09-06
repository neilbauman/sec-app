'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, InputNumber, message, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
import { getBrowserClient } from '@/lib/supabaseClient';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';
type IndicatorRow = {
  id: string;
  level: IndicatorLevel;
  ref_code: string; // P#/T#/S#
  name: string;
  description: string | null;
  sort_order: number | null;
};

export default function IndicatorsPage() {
  const supabaseRef = useRef<any>(null);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<IndicatorRow | null>(null);
  const [form] = Form.useForm<Partial<IndicatorRow>>();

  useEffect(() => {
    try {
      supabaseRef.current = getBrowserClient();
    } catch {
      // no-op until hydration
    }
  }, []);

  async function load() {
    if (!supabaseRef.current) return;
    setLoading(true);
    const { data, error } = await supabaseRef.current.from('indicators').select('*').order('level').order('sort_order');
    if (error) message.error(error.message);
    setRows((data ?? []) as any);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseRef.current) load();
  }, [supabaseRef.current]);

  const cols: ColumnsType<IndicatorRow> = [
    { title: 'Level', dataIndex: 'level', width: '14%' },
    { title: 'Ref Code', dataIndex: 'ref_code', width: '16%' },
    { title: 'Name', dataIndex: 'name', width: '28%' },
    { title: 'Description', dataIndex: 'description', width: '30%', ellipsis: true },
    { title: 'Sort', dataIndex: 'sort_order', width: '6%' },
    {
      title: 'Actions',
      key: 'actions',
      width: '6%',
      render: (_: any, r) => (
        <Space size="small">
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditing(r); form.setFieldsValue(r as any); }} />
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => remove(r)} />
        </Space>
      ),
    },
  ];

  async function remove(r: IndicatorRow) {
    if (!supabaseRef.current) return;
    const { error } = await supabaseRef.current.from('indicators').delete().eq('id', r.id);
    if (error) return message.error(error.message);
    message.success('Deleted');
    load();
  }

  async function save(values: Partial<IndicatorRow>) {
    if (!supabaseRef.current) return;
    const payload = {
      level: values.level!,
      ref_code: values.ref_code!.trim(),
      name: values.name!.trim(),
      description: values.description ?? '',
      sort_order: values.sort_order ?? 1,
    };
    if (editing) {
      const { error } = await supabaseRef.current.from('indicators').update(payload as any).eq('id', editing.id);
      if (error) return message.error(error.message);
      message.success('Saved');
    } else {
      const { error } = await supabaseRef.current.from('indicators').insert(payload as any);
      if (error) return message.error(error.message);
      message.success('Added');
    }
    setEditing(null);
    form.resetFields();
    load();
  }

  function exportCSV() {
    const csv = Papa.unparse(
      rows.map((r) => ({
        id: r.id,
        level: r.level,
        ref_code: r.ref_code,
        name: r.name,
        description: r.description ?? '',
        sort_order: r.sort_order ?? '',
      })),
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'indicators.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importCSV(file: File) {
    if (!supabaseRef.current) return;
    const rows = await new Promise<any[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => resolve(res.data as any[]),
        error: reject,
      });
    });

    // Upsert by (level, ref_code)
    for (const row of rows) {
      const level = (row.level ?? '').trim() as IndicatorLevel;
      const ref_code = (row.ref_code ?? '').trim();
      if (!level || !ref_code) continue;
      const patch = {
        level,
        ref_code,
        name: (row.name ?? '').trim(),
        description: row.description ?? '',
        sort_order: row.sort_order ? Number(row.sort_order) : 1,
      };
      const { data } = await supabaseRef.current
        .from('indicators')
        .select('id')
        .eq('level', level)
        .eq('ref_code', ref_code)
        .maybeSingle();

      if (data?.id) {
        await supabaseRef.current.from('indicators').update(patch as any).eq('id', data.id);
      } else {
        await supabaseRef.current.from('indicators').insert(patch as any);
      }
    }
    message.success('Indicators import complete');
    load();
  }

  if (!supabaseRef.current) return null;

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<ReloadOutlined />} onClick={load}>
          Refresh
        </Button>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => { setEditing(null); form.resetFields(); Modal.confirm({
          title: 'Create Indicator',
          icon: null,
          content: (
            <Form
              form={form}
              layout="vertical"
              onFinish={(vals) => {
                save(vals);
                Modal.destroyAll();
              }}
            >
              <Form.Item name="level" label="Level" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'pillar', label: 'pillar' },
                    { value: 'theme', label: 'theme' },
                    { value: 'subtheme', label: 'subtheme' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="ref_code" label="Reference Code (P#/T#/S#)" rules={[{ required: true }]}>
                <Input placeholder="e.g., P1 or T1.2 or S1.2.3" />
              </Form.Item>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item name="sort_order" label="Sort order" initialValue={1}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button onClick={() => Modal.destroyAll()}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Save</Button>
                </Space>
              </Form.Item>
            </Form>
          ),
          okButtonProps: { style: { display: 'none' } },
          cancelButtonProps: { style: { display: 'none' } },
        }); }}>
          Add
        </Button>

        <Button icon={<DownloadOutlined />} onClick={exportCSV}>
          Export CSV
        </Button>
        <Upload
          accept=".csv"
          maxCount={1}
          beforeUpload={(file) => {
            importCSV(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Import CSV</Button>
        </Upload>
      </Space>

      <Table<IndicatorRow>
        dataSource={rows}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        pagination={false}
        size="small"
      />
    </div>
  );
}
