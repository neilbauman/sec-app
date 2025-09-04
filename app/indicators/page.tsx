'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import {
  Table, Typography, Space, Button, message, Modal, Form, Input,
  Select, Popconfirm, Tabs, Divider, InputNumber
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined
} from '@ant-design/icons';

type Indicator = {
  scope: 'pillar'|'theme'|'subtheme'|'standard';
  scope_code: string;
  code: string;
  name: string;
  description?: string;
  is_default?: boolean;
  weight?: number|null;
  sort_order?: number|null;
};

type Criterion = {
  id: number;
  indicator_code: string;
  level_order: number;
  label: string;
  description?: string;
  default_score: number;
};

const scopeOptions = [
  { label: 'Pillar', value: 'pillar' },
  { label: 'Theme', value: 'theme' },
  { label: 'Sub-theme', value: 'subtheme' },
  { label: 'Standard', value: 'standard' },
];

export default function IndicatorsPage() {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Indicator[]>([]);
  const [activeScope, setActiveScope] = useState<'pillar'|'theme'|'subtheme'|'standard'|'all'>('all');

  // indicator modal
  const [showIndModal, setShowIndModal] = useState(false);
  const [editingInd, setEditingInd] = useState<Indicator|null>(null);
  const [indForm] = Form.useForm<Indicator>();

  // criteria modal
  const [showCritModal, setShowCritModal] = useState(false);
  const [critIndicator, setCritIndicator] = useState<Indicator|null>(null);
  const [critRows, setCritRows] = useState<Criterion[]>([]);
  const [critForm] = Form.useForm<Criterion>();
  const [editingCrit, setEditingCrit] = useState<Criterion|null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('indicators')
        .select('*')
        .order('scope', { ascending: true })
        .order('scope_code', { ascending: true })
        .order('sort_order', { ascending: true, nullsFirst: false });
      if (error) throw error;
      setRows(data as Indicator[]);
    } catch (e:any) {
      console.error(e);
      message.error(e.message || 'Failed to load indicators');
    } finally {
      setLoading(false);
    }
  };

  const loadCriteria = async (indicator_code: string) => {
    try {
      const { data, error } = await supabase
        .from('criteria_levels')
        .select('*')
        .eq('indicator_code', indicator_code)
        .order('level_order', { ascending: true });
      if (error) throw error;
      setCritRows(data as Criterion[]);
    } catch (e:any) {
      console.error(e);
      message.error(e.message || 'Failed to load criteria');
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (activeScope === 'all') return rows;
    return rows.filter(r => r.scope === activeScope);
  }, [rows, activeScope]);

  // ===== INDICATOR CRUD =====
  const openCreateIndicator = () => {
    setEditingInd(null);
    indForm.resetFields();
    setShowIndModal(true);
  };

  const openEditIndicator = (rec: Indicator) => {
    setEditingInd(rec);
    indForm.setFieldsValue({
      ...rec,
      is_default: !!rec.is_default
    });
    setShowIndModal(true);
  };

  const saveIndicator = async () => {
    const v = await indForm.validateFields();
    const payload: Indicator = {
      scope: v.scope,
      scope_code: v.scope_code,
      code: v.code,
      name: v.name,
      description: v.description || '',
      is_default: !!v.is_default,
      weight: v.weight ?? null,
      sort_order: v.sort_order ?? null
    };
    try {
      if (editingInd) {
        // Update
        const { error } = await supabase.from('indicators')
          .update(payload)
          .eq('code', editingInd.code);
        if (error) throw error;
        message.success('Indicator updated');
      } else {
        // Insert
        const { error } = await supabase.from('indicators').insert(payload);
        if (error) throw error;
        message.success('Indicator created');
      }
      setShowIndModal(false);
      await load();
    } catch (e:any) {
      console.error(e);
      message.error(e.message || 'Save failed');
    }
  };

  const deleteIndicator = async (rec: Indicator) => {
    try {
      const { error } = await supabase.from('indicators').delete().eq('code', rec.code);
      if (error) throw error;
      message.success('Indicator deleted');
      await load();
    } catch (e:any) {
      console.error(e);
      message.error(e.message || 'Delete failed');
    }
  };

  // ===== CRITERIA CRUD =====
  const openCriteria = async (rec: Indicator) => {
    setCritIndicator(rec);
    setEditingCrit(null);
    critForm.resetFields();
    await loadCriteria(rec.code);
    setShowCritModal(true);
  };

  const openEditCriterion = (row: Criterion) => {
    setEditingCrit(row);
    critForm.setFieldsValue(row);
  };

  const saveCriterion = async () => {
    const v = await critForm.validateFields();
    try {
      if (!critIndicator) return;
      if (editingCrit) {
        const { error } = await supabase.from('criteria_levels')
          .update({
            level_order: v.level_order,
            label: v.label,
            description: v.description || '',
            default_score: v.default_score,
          })
          .eq('id', editingCrit.id);
        if (error) throw error;
        message.success('Criterion updated');
      } else {
        const { error } = await supabase.from('criteria_levels')
          .insert({
            indicator_code: critIndicator.code,
            level_order: v.level_order,
            label: v.label,
            description: v.description || '',
            default_score: v.default_score,
          });
        if (error) throw error;
        message.success('Criterion added');
      }
      setEditingCrit(null);
      critForm.resetFields();
      await loadCriteria(critIndicator.code);
    } catch (e:any) {
      console.error(e);
      message.error(e.message || 'Save failed');
    }
  };

  const deleteCriterion = async (row: Criterion) => {
    try {
      const { error } = await supabase.from('criteria_levels').delete().eq('id', row.id);
      if (error) throw error;
      message.success('Criterion deleted');
      if (critIndicator) await loadCriteria(critIndicator.code);
    } catch (e:any) {
      console.error(e);
      message.error(e.message || 'Delete failed');
    }
  };

  const columns = [
    { title: 'Scope', dataIndex: 'scope', key: 'scope', width: 120 },
    { title: 'Scope code', dataIndex: 'scope_code', key: 'scope_code', width: 140 },
    { title: 'Code', dataIndex: 'code', key: 'code', width: 140 },
    { title: 'Name', dataIndex: 'name', key: 'name',
      render: (v:string) => <b>{v}</b>
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Default?', dataIndex: 'is_default', key: 'is_default', width: 100,
      render: (v:boolean) => v ? 'Yes' : 'No'
    },
    { title: 'Weight', dataIndex: 'weight', key: 'weight', width: 90 },
    {
      title: 'Actions', key: 'actions', width: 220,
      render: (_: any, rec: Indicator) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditIndicator(rec)}>Edit</Button>
          <Button size="small" onClick={() => openCriteria(rec)}>Criteria</Button>
          <Popconfirm title="Delete this indicator?" onConfirm={() => deleteIndicator(rec)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '24px auto', padding: 12, background: 'transparent' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Indicators & Scoring</Typography.Title>
        <Space>
          <Select
            value={activeScope}
            onChange={(v) => setActiveScope(v)}
            style={{ width: 180 }}
            options={[
              { label: 'All', value: 'all' },
              ...scopeOptions
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateIndicator}>
            New indicator
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns as any}
        dataSource={filtered}
        rowKey="code"
        loading={loading}
        pagination={{ pageSize: 20 }}
        bordered
        size="small"
      />

      {/* Indicator modal */}
      <Modal
        title={editingInd ? `Edit indicator: ${editingInd.code}` : 'Create indicator'}
        open={showIndModal}
        onCancel={() => setShowIndModal(false)}
        onOk={saveIndicator}
        okText="Save"
      >
        <Form form={indForm} layout="vertical">
          <Form.Item name="scope" label="Scope" rules={[{ required: true }]}>
            <Select options={scopeOptions} />
          </Form.Item>
          <Form.Item name="scope_code" label="Scope code" rules={[{ required: true }]}>
            <Input placeholder="e.g. P1, T1.1, ST2.1a, or a standard code" />
          </Form.Item>
          <Form.Item name="code" label="Indicator code" rules={[{ required: true }]}>
            <Input placeholder="Unique code, e.g. I-P1" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea autoSize={{ minRows: 2 }} />
          </Form.Item>
          <Form.Item name="is_default" label="Default?">
            <Select
              options={[
                { label: 'No', value: false },
                { label: 'Yes', value: true }
              ]}
            />
          </Form.Item>
          <Form.Item name="weight" label="Weight">
            <InputNumber style={{ width: '100%' }} placeholder="optional (e.g. 1.0)" />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort order">
            <InputNumber style={{ width: '100%' }} placeholder="optional (e.g. 1,2,3…)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Criteria (thresholds) modal */}
      <Modal
        title={critIndicator ? `Criteria for ${critIndicator.code}` : 'Criteria'}
        open={showCritModal}
        onCancel={() => setShowCritModal(false)}
        footer={null}
        width={800}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form form={critForm} layout="inline" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Form.Item name="level_order" label="Order" rules={[{ required: true }]}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item name="label" label="Label" rules={[{ required: true }]}>
              <Input placeholder="e.g., Yes / No / Severe" />
            </Form.Item>
            <Form.Item name="default_score" label="Default score" rules={[{ required: true }]}>
              <InputNumber step={0.05} />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input placeholder="optional" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={saveCriterion}>{editingCrit ? 'Update' : 'Add'}</Button>
                <Button onClick={() => { setEditingCrit(null); critForm.resetFields(); }}>Clear</Button>
              </Space>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '8px 0' }} />

          <Table
            dataSource={critRows}
            rowKey="id"
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: 'Order', dataIndex: 'level_order', width: 80 },
              { title: 'Label', dataIndex: 'label', width: 160 },
              { title: 'Score', dataIndex: 'default_score', width: 100 },
              { title: 'Description', dataIndex: 'description' },
              {
                title: 'Actions', key: 'act', width: 160,
                render: (_:any, rec: Criterion) => (
                  <Space>
                    <Button size="small" onClick={() => openEditCriterion(rec)} icon={<EditOutlined />}>Edit</Button>
                    <Popconfirm title="Delete this level?" onConfirm={() => deleteCriterion(rec)}>
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                )
              },
            ]}
          />
        </Space>
      </Modal>
    </div>
  );
}
