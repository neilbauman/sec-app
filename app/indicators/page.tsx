"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { getBrowserClient } from "@/lib/supabaseClient";

type IndicatorLevel = "pillar" | "theme" | "subtheme";
type IndicatorRow = {
  id: string;
  level: IndicatorLevel;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

const levelTag = (level: IndicatorLevel, ref?: string) => {
  const color = level === "pillar" ? "blue" : level === "theme" ? "green" : "red";
  return (
    <Space size={6}>
      <Tag color={color} style={{ fontSize: 12 }}>
        {level[0].toUpperCase() + level.slice(1)}
      </Tag>
      {ref ? <span style={{ color: "#999", fontSize: 12 }}>[{ref}]</span> : null}
    </Space>
  );
};

export default function IndicatorsPage() {
  if (typeof window === "undefined") return null;

  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing?: IndicatorRow | null }>({ open: false });

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("indicators").select("*").order("level", { ascending: true }).order("sort_order", { ascending: true });
    if (error) {
      message.error(error.message);
    } else {
      setRows((data ?? []).map((d) => ({
        id: d.id,
        level: d.level,
        ref_code: d.ref_code,
        name: d.name,
        description: d.description ?? "",
        sort_order: d.sort_order ?? 0,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const [form] = Form.useForm();

  const openCreate = () => {
    setModal({ open: true, editing: null });
    setTimeout(() => form.setFieldsValue({ sort_order: 1 }), 0);
  };

  const openEdit = (rec: IndicatorRow) => {
    setModal({ open: true, editing: rec });
    setTimeout(() => {
      form.setFieldsValue({
        level: rec.level,
        ref_code: rec.ref_code,
        name: rec.name,
        description: rec.description ?? "",
        sort_order: rec.sort_order ?? 1,
      });
    }, 0);
  };

  const onSubmit = async () => {
    try {
      const vals = await form.validateFields();
      let err: string | null = null;

      if (modal.editing) {
        const { error } = await supabase.from("indicators").update({
          level: vals.level,
          ref_code: vals.ref_code,
          name: vals.name,
          description: vals.description ?? "",
          sort_order: vals.sort_order ?? 1,
        }).eq("id", modal.editing.id);
        err = error?.message ?? null;
      } else {
        const { error } = await supabase.from("indicators").insert({
          level: vals.level,
          ref_code: vals.ref_code,
          name: vals.name,
          description: vals.description ?? "",
          sort_order: vals.sort_order ?? 1,
        });
        err = error?.message ?? null;
      }

      if (err) return message.error(err);
      message.success("Saved.");
      setModal({ open: false, editing: null });
      fetchAll();
    } catch {
      /* validation cancelled */
    }
  };

  const onDelete = async (rec: IndicatorRow) => {
    const { error } = await supabase.from("indicators").delete().eq("id", rec.id);
    if (error) return message.error(error.message);
    message.success("Deleted.");
    fetchAll();
  };

  const columns: ColumnsType<IndicatorRow> = [
    {
      title: "Type / Code",
      dataIndex: "level",
      width: "20%",
      render: (_: any, rec) => levelTag(rec.level, rec.ref_code),
    },
    { title: "Name", dataIndex: "name", width: "36%", render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: "Description", dataIndex: "description", width: "36%", ellipsis: true },
    { title: "Sort", dataIndex: "sort_order", align: "right", width: "8%", render: (v: number) => v ?? 0 },
    {
      title: "Actions",
      key: "actions",
      width: "12%",
      render: (_: any, rec) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(rec)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Indicators</Typography.Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Indicator
          </Button>
        </Space>
      </Space>

      <Table<IndicatorRow>
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowKey={(r) => r.id}
        pagination={false}
      />

      <Modal
        title={modal.editing ? "Edit Indicator" : "Add Indicator"}
        open={modal.open}
        onCancel={() => setModal({ open: false, editing: null })}
        onOk={onSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ sort_order: 1 }}>
          <Form.Item name="level" label="Level" rules={[{ required: true }]}>
            <Input placeholder="pillar | theme | subtheme" />
          </Form.Item>
          <Form.Item name="ref_code" label="Reference Code" rules={[{ required: true }]}>
            <Input placeholder="Unique indicator code" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort Order">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
