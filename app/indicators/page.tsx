"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag, Space, Button, Input, Select, Typography, message } from "antd";
import { EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabaseClient";

type Level = "pillar" | "theme" | "subtheme";

type Indicator = {
  id: number;
  level: Level;
  ref_code: string;     // points to pillars.code OR themes.code OR subthemes.code
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Pillar = { code: string; name: string };
type Theme = { code: string; name: string };
type Subtheme = { code: string; name: string };

const levelColors: Record<Level, string> = {
  pillar: "geekblue",
  theme: "green",
  subtheme: "purple",
};

export default function IndicatorsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Indicator[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subthemes, setSubthemes] = useState<Subtheme[]>([]);

  // simple client-side search/filter
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState<Level | "all">("all");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ind, ps, ts, sts] = await Promise.all([
        supabase.from("indicators").select("*").order("sort_order", { ascending: true }),
        supabase.from("pillars").select("code, name").order("sort_order", { ascending: true }),
        supabase.from("themes").select("code, name").order("sort_order", { ascending: true }),
        supabase.from("subthemes").select("code, name").order("sort_order", { ascending: true }),
      ]);

      if (ind.error) throw ind.error;
      if (ps.error) throw ps.error;
      if (ts.error) throw ts.error;
      if (sts.error) throw sts.error;

      setRows((ind.data ?? []) as Indicator[]);
      setPillars((ps.data ?? []) as Pillar[]);
      setThemes((ts.data ?? []) as Theme[]);
      setSubthemes((sts.data ?? []) as Subtheme[]);
    } catch (e: any) {
      console.error(e);
      message.error("Failed to load indicators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // quick lookup maps
  const pByCode = useMemo(() => Object.fromEntries(pillars.map(p => [p.code, p.name])), [pillars]);
  const tByCode = useMemo(() => Object.fromEntries(themes.map(t => [t.code, t.name])), [themes]);
  const stByCode = useMemo(() => Object.fromEntries(subthemes.map(s => [s.code, s.name])), [subthemes]);

  const data = useMemo(() => {
    const filtered = rows.filter(r => {
      const matchesLevel = lvl === "all" ? true : r.level === lvl;
      const text = `${r.ref_code} ${r.name} ${r.description ?? ""}`.toLowerCase();
      const matchesQ = q.trim() ? text.includes(q.trim().toLowerCase()) : true;
      return matchesLevel && matchesQ;
    });
    return filtered;
  }, [rows, lvl, q]);

  const columns = [
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 120,
      render: (v: Level) => <Tag color={levelColors[v]}>{v}</Tag>,
      filters: [
        { text: "Pillar", value: "pillar" },
        { text: "Theme", value: "theme" },
        { text: "Sub-theme", value: "subtheme" },
      ],
      onFilter: (val: any, rec: Indicator) => rec.level === val,
    },
    {
      title: "Parent (Code → Name)",
      key: "parent",
      render: (_: any, r: Indicator) => {
        let name = "";
        if (r.level === "pillar") name = pByCode[r.ref_code] ?? "";
        if (r.level === "theme") name = tByCode[r.ref_code] ?? "";
        if (r.level === "subtheme") name = stByCode[r.ref_code] ?? "";
        return (
          <Space direction="vertical" size={0}>
            <Typography.Text code>{r.ref_code}</Typography.Text>
            <Typography.Text type="secondary">{name || "—"}</Typography.Text>
          </Space>
        );
      },
      sorter: (a: Indicator, b: Indicator) => a.ref_code.localeCompare(b.ref_code),
    },
    {
      title: "Indicator Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Indicator, b: Indicator) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (v: string | null) => v ?? "—",
    },
    {
      title: "Sort",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 90,
      render: (v: number | null) => v ?? "—",
      sorter: (a: Indicator, b: Indicator) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, r: Indicator) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => message.info(`Edit ${r.name}`)} />
          <Button type="link" icon={<DeleteOutlined />} danger onClick={() => message.info(`Delete ${r.name}`)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          allowClear
          placeholder="Search indicators…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 320 }}
        />
        <Select
          value={lvl}
          onChange={(v) => setLvl(v as any)}
          style={{ width: 160 }}
          options={[
            { value: "all", label: "All levels" },
            { value: "pillar", label: "Pillar" },
            { value: "theme", label: "Theme" },
            { value: "subtheme", label: "Sub-theme" },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
          Refresh
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />
    </div>
  );
}
