"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";
import { getBrowserClient } from "@/lib/supabaseClient";

type PillarRow = { id: string; code: string; name: string; description: string | null; sort_order: number | null; };
type ThemeRow  = { id: string; code: string; pillar_code: string; name: string; description: string | null; sort_order: number | null; };
type SubRow    = { id: string; code: string; theme_code: string; pillar_code: string; name: string; description: string | null; sort_order: number | null; };

type Level = "pillar" | "theme" | "subtheme";

type UIRow = {
  key: string;                 // e.g. P:P1 / T:T1.2 / S:S1.2.3
  level: Level;
  id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  parentKey?: string | null;   // for tree relation in UI
  // for grouping relations
  pillar_code?: string | null;
  theme_code?: string | null;
  children?: UIRow[];
};

const levelTag = (level: Level, code?: string) => {
  const color = level === "pillar" ? "blue" : level === "theme" ? "green" : "red";
  return (
    <Space size={6}>
      <Tag color={color} style={{ fontSize: 12 }}>
        {level[0].toUpperCase() + level.slice(1)}
      </Tag>
      {code ? <span style={{ color: "#999", fontSize: 12 }}>[{code}]</span> : null}
    </Space>
  );
};

export default function FrameworkEditorPage() {
  // HARD GUARD against SSR/prerender
  if (typeof window === "undefined") return null;

  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UIRow[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<{ open: boolean; level: Level; parent?: UIRow | null; editing?: UIRow | null }>({
    open: false,
    level: "pillar",
    parent: null,
    editing: undefined,
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subs, error: se }] = await Promise.all([
      supabase.from("pillars").select("*").order("sort_order", { ascending: true }),
      supabase.from("themes").select("*").order("sort_order", { ascending: true }),
      supabase.from("subthemes").select("*").order("sort_order", { ascending: true }),
    ]);
    if (pe || te || se) {
      message.error(pe?.message || te?.message || se?.message || "Failed to load framework.");
      setLoading(false);
      return;
    }

    const pByCode = new Map<string, PillarRow>();
    pillars?.forEach((p) => pByCode.set(p.code, p));

    const tByCode = new Map<string, ThemeRow>();
    themes?.forEach((t) => tByCode.set(t.code, t));

    // Build UIRows grouped
    const pNodes: UIRow[] = (pillars ?? []).map((p) => ({
      key: `P:${p.code}`,
      level: "pillar",
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description ?? "",
      sort_order: p.sort_order ?? 0,
      pillar_code: p.code,
      theme_code: null,
      children: [],
    }));

    const pChildren = new Map<string, UIRow>();
    pNodes.forEach((pn) => pChildren.set(pn.pillar_code!, pn));

    // Themes under pillars
    (themes ?? []).forEach((t) => {
      const parent = pChildren.get(t.pillar_code);
      const node: UIRow = {
        key: `T:${t.code}`,
        level: "theme",
        id: t.id,
        code: t.code,
        name: t.name,
        description: t.description ?? "",
        sort_order: t.sort_order ?? 0,
        pillar_code: t.pillar_code,
        theme_code: t.code,
        parentKey: `P:${t.pillar_code}`,
        children: [],
      };
      parent?.children?.push(node);
    });

    // Subthemes under themes
    const tChildren = new Map<string, UIRow>();
    pNodes.forEach((p) => p.children?.forEach((t) => tChildren.set(t.theme_code!, t)));

    (subs ?? []).forEach((s) => {
      const parent = tChildren.get(s.theme_code);
      const node: UIRow = {
        key: `S:${s.code}`,
        level: "subtheme",
        id: s.id,
        code: s.code,
        name: s.name,
        description: s.description ?? "",
        sort_order: s.sort_order ?? 0,
        pillar_code: s.pillar_code,
        theme_code: s.theme_code,
        parentKey: `T:${s.theme_code}`,
        children: [],
      };
      parent?.children?.push(node);
    });

    // Sort children by sort_order then name (defensive)
    const sortFn = (a: UIRow, b: UIRow) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name);

    pNodes.sort(sortFn);
    pNodes.forEach((p) => p.children?.sort(sortFn));
    pNodes.forEach((p) => p.children?.forEach((t) => t.children?.sort(sortFn)));

    setRows(pNodes);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = (level: Level, parent?: UIRow | null) =>
    setModal({ open: true, level, parent: parent ?? null, editing: undefined });

  const openEdit = (record: UIRow) =>
    setModal({ open: true, level: record.level, parent: null, editing: record });

  const closeModal = () => setModal((m) => ({ ...m, open: false, editing: undefined }));

  // Save handler (create or edit)
  const [form] = Form.useForm();
  const onSubmit = async () => {
    try {
      const vals = await form.validateFields();
      const { level, parent, editing } = modal;
      let err: string | null = null;

      if (editing) {
        // UPDATE
        if (level === "pillar") {
          const { error } = await supabase.from("pillars").update({
            name: vals.name,
            description: vals.description ?? "",
            sort_order: vals.sort_order ?? 1,
          }).eq("id", editing.id);
          err = error?.message ?? null;
        } else if (level === "theme") {
          const { error } = await supabase.from("themes").update({
            name: vals.name,
            description: vals.description ?? "",
            sort_order: vals.sort_order ?? 1,
          }).eq("id", editing.id);
          err = error?.message ?? null;
        } else {
          const { error } = await supabase.from("subthemes").update({
            name: vals.name,
            description: vals.description ?? "",
            sort_order: vals.sort_order ?? 1,
          }).eq("id", editing.id);
          err = error?.message ?? null;
        }
      } else {
        // INSERT
        if (level === "pillar") {
          const { error } = await supabase.from("pillars").insert({
            code: vals.code,
            name: vals.name,
            description: vals.description ?? "",
            sort_order: vals.sort_order ?? 1,
          });
          err = error?.message ?? null;
        } else if (level === "theme") {
          if (!parent?.pillar_code) return message.error("Parent pillar missing.");
          const { error } = await supabase.from("themes").insert({
            code: vals.code,
            pillar_code: parent.pillar_code,
            name: vals.name,
            description: vals.description ?? "",
            sort_order: vals.sort_order ?? 1,
          });
          err = error?.message ?? null;
        } else {
          if (!parent?.pillar_code || !parent?.theme_code) return message.error("Parent theme missing.");
          const { error } = await supabase.from("subthemes").insert({
            code: vals.code,
            pillar_code: parent.pillar_code,
            theme_code: parent.theme_code,
            name: vals.name,
            description: vals.description ?? "",
            sort_order: vals.sort_order ?? 1,
          });
          err = error?.message ?? null;
        }
      }

      if (err) {
        message.error(err);
        return;
      }
      message.success("Saved.");
      closeModal();
      fetchAll();
    } catch {
      // validation cancelled
    }
  };

  const onDelete = async (record: UIRow) => {
    let err: string | null = null;
    if (record.level === "pillar") {
      const { error } = await supabase.from("pillars").delete().eq("id", record.id);
      err = error?.message ?? null;
    } else if (record.level === "theme") {
      const { error } = await supabase.from("themes").delete().eq("id", record.id);
      err = error?.message ?? null;
    } else {
      const { error } = await supabase.from("subthemes").delete().eq("id", record.id);
      err = error?.message ?? null;
    }
    if (err) return message.error(err);
    message.success("Deleted.");
    fetchAll();
  };

  // CSV export (flat dump)
  const exportCSV = () => {
    // Flatten into three sheets-in-one with Level column
    const flat: any[] = [];
    const walk = (n: UIRow) => {
      flat.push({
        level: n.level,
        id: n.id,
        code: n.code,
        name: n.name,
        description: n.description,
        sort_order: n.sort_order,
        pillar_code: n.pillar_code ?? "",
        theme_code: n.theme_code ?? "",
      });
      n.children?.forEach(walk);
    };
    rows.forEach(walk);
    const csv = Papa.unparse(flat);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "framework_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // CSV import (idempotent-ish): upserts by (level, code)
  const importCSV = async (file: File) => {
    const text = await file.text();
    const { data, errors } = Papa.parse(text, { header: true, skipEmptyLines: true });
    if (errors.length) return message.error("CSV parse error.");
    const rows = (data as any[]).filter(Boolean);

    // Index existing by code
    const [{ data: pillars }, { data: themes }, { data: subs }] = await Promise.all([
      supabase.from("pillars").select("*"),
      supabase.from("themes").select("*"),
      supabase.from("subthemes").select("*"),
    ]);

    const pByCode = new Map((pillars ?? []).map((p) => [p.code, p]));
    const tByCode = new Map((themes ?? []).map((t) => [t.code, t]));
    const sByCode = new Map((subs ?? []).map((s) => [s.code, s]));

    // Upsert minimal
    for (const r of rows) {
      const level = String(r.level ?? "").toLowerCase() as Level;
      const patch = {
        name: r.name ?? "",
        description: r.description ?? "",
        sort_order: r.sort_order ? Number(r.sort_order) : 1,
      };
      const code = r.code;

      if (!code || !level) continue;

      if (level === "pillar") {
        if (pByCode.has(code)) {
          await supabase.from("pillars").update({ code, ...patch }).eq("id", pByCode.get(code)!.id);
        } else {
          await supabase.from("pillars").insert({ code, ...patch });
        }
      } else if (level === "theme") {
        if (!r.pillar_code) continue;
        if (tByCode.has(code)) {
          await supabase.from("themes").update({ code, pillar_code: r.pillar_code, ...patch }).eq("id", tByCode.get(code)!.id);
        } else {
          await supabase.from("themes").insert({ code, pillar_code: r.pillar_code, ...patch });
        }
      } else if (level === "subtheme") {
        if (!r.pillar_code || !r.theme_code) continue;
        if (sByCode.has(code)) {
          await supabase.from("subthemes").update({ code, pillar_code: r.pillar_code, theme_code: r.theme_code, ...patch }).eq("id", sByCode.get(code)!.id);
        } else {
          await supabase.from("subthemes").insert({ code, pillar_code: r.pillar_code, theme_code: r.theme_code, ...patch });
        }
      }
    }

    message.success("Import complete.");
    fetchAll();
  };

  const columns: ColumnsType<UIRow> = [
    {
      title: "Type / Code",
      dataIndex: "level",
      width: "18%",
      render: (_: any, rec) => levelTag(rec.level, rec.code),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "32%",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "35%",
      ellipsis: true,
    },
    {
      title: "Sort",
      dataIndex: "sort_order",
      width: "7%",
      align: "right",
      render: (v: number) => v ?? 0,
    },
    {
      title: "Actions",
      key: "actions",
      width: "8%",
      render: (_: any, rec) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setModal({ open: true, level: rec.level, editing: rec, parent: null });
            setTimeout(() => {
              form.setFieldsValue({
                code: rec.code,
                name: rec.name,
                description: rec.description,
                sort_order: rec.sort_order ?? 1,
              });
            }, 0);
          }} />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(rec)}
          />
          {rec.level === "pillar" && (
            <Button size="small" onClick={() => openCreate("theme", rec)} icon={<PlusOutlined />}>
              Theme
            </Button>
          )}
          {rec.level === "theme" && (
            <Button size="small" onClick={() => openCreate("subtheme", rec)} icon={<PlusOutlined />}>
              Sub
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Link href="/" prefetch={false}>
            <Button icon={<ArrowLeftOutlined />}>Dashboard</Button>
          </Link>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Primary Framework Editor
          </Typography.Title>
        </Space>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAll}>Refresh</Button>
          <Upload
            accept=".csv"
            beforeUpload={(file) => {
              importCSV(file);
              return false; // prevent auto upload
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Import CSV</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate("pillar")}>
            New Pillar
          </Button>
        </Space>
      </Space>

      <div className="framework-table">
        <Table<UIRow>
          loading={loading}
          columns={columns}
          dataSource={rows}
          rowKey={(rec) => rec.key}
          pagination={false}
          expandable={{
            // make the caret larger via CSS class below
            expandIconColumnIndex: 1,
            indentSize: 18,
          }}
        />
      </div>

      <Modal
        title={
          modal.editing
            ? `Edit ${modal.level.toUpperCase()}`
            : `Add ${modal.level.toUpperCase()}`
        }
        open={modal.open}
        onCancel={closeModal}
        onOk={onSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ sort_order: 1 }}>
          {!modal.editing && (
            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input placeholder="Unique code (e.g., P1, T1.2, S1.2.3)" />
            </Form.Item>
          )}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Sort Order" name="sort_order">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-table-row-indent + .ant-table-row-expand-icon {
          transform: scale(1.25); /* bigger caret */
        }
      `}</style>
    </div>
  );
}
