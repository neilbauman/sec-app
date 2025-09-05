"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button, Form, Input, Space, Spin, message } from "antd";
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabaseClient";

type Level = "pillar" | "theme" | "subtheme";

interface Row {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  level: Level;
  parent_id: string | null;
  ref_code: string;
}

export default function FrameworkPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form] = Form.useForm();
  const supabase = getBrowserClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("indicators").select("*").order("sort_order", { ascending: true });
    if (error) {
      message.error("Failed to load data");
    } else {
      setRows(data as Row[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (values: any) => {
    if (!editing) return;
    const { error } = await supabase.from("indicators").update(values).eq("id", editing.id);
    if (error) {
      message.error("Error saving row");
    } else {
      message.success("Row saved");
      fetchData();
      setEditing(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, rec: Row) => (
        <span>
          {rec.name}
          <br />
          <Tag
            color={
              rec.level === "pillar"
                ? "blue"
                : rec.level === "theme"
                ? "green"
                : "red"
            }
          >
            {rec.level.toUpperCase()}
          </Tag>
          <span style={{ color: "grey", fontSize: "0.8em", marginLeft: 6 }}>
            {rec.ref_code}
          </span>
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, rec: Row) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => setEditing(rec)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              const { error } = await supabase.from("indicators").delete().eq("id", rec.id);
              if (error) {
                message.error("Delete failed");
              } else {
                message.success("Row deleted");
                fetchData();
              }
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Link href="/">
          <Button icon={<ArrowLeftOutlined />}>Back to Dashboard</Button>
        </Link>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing({
              id: "",
              name: "",
              description: "",
              sort_order: 0,
              level: "pillar",
              parent_id: null,
              ref_code: "",
            });
            form.resetFields();
          }}
        >
          Add Row
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table<Row> dataSource={rows} columns={columns} rowKey="id" pagination={false} />
      </Spin>

      {editing && (
        <Form
          form={form}
          initialValues={editing}
          onFinish={handleSave}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort Order">
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={() => setEditing(null)} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form>
      )}
    </div>
  );
}
