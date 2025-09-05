"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  Table,
  Typography,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

type FrameworkRow = {
  id: string;
  level: "pillar" | "theme" | "subtheme" | "indicator" | "criteria";
  ref_code: string;
  name: string;
  description: string;
  parent_id?: string;
  sort_order?: number;
  children?: FrameworkRow[];
};

export default function FrameworkPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<FrameworkRow[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch all framework data
  const fetchFramework = async () => {
    setLoading(true);

    try {
      // 1. Get all tables
      const [pillars, themes, subthemes, indicators, criteria] =
        await Promise.all([
          supabase.from("pillars").select("*").order("sort_order"),
          supabase.from("themes").select("*").order("sort_order"),
          supabase.from("subthemes").select("*").order("sort_order"),
          supabase.from("indicators").select("*").order("sort_order"),
          supabase.from("criteria_levels").select("*").order("sort_order"),
        ]);

      if (pillars.error) throw pillars.error;
      if (themes.error) throw themes.error;
      if (subthemes.error) throw subthemes.error;
      if (indicators.error) throw indicators.error;
      if (criteria.error) throw criteria.error;

      // 2. Nest hierarchy
      const framework: FrameworkRow[] = (pillars.data || []).map((p: any) => {
        const pillarThemes = (themes.data || [])
          .filter((t: any) => t.pillar_code === p.code)
          .map((t: any) => {
            const themeSubs = (subthemes.data || [])
              .filter((st: any) => st.theme_code === t.code)
              .map((st: any) => {
                const subIndicators = (indicators.data || [])
                  .filter((i: any) => i.ref_code.startsWith(st.code))
                  .map((i: any) => {
                    const iCriteria = (criteria.data || [])
                      .filter((c: any) => c.indicator_id === i.id)
                      .map((c: any) => ({
                        id: c.id,
                        level: "criteria",
                        ref_code: "",
                        name: c.label,
                        description: `Default score: ${c.default_score}`,
                        parent_id: i.id,
                        sort_order: c.sort_order,
                      }));

                    return {
                      id: i.id,
                      level: "indicator",
                      ref_code: i.ref_code,
                      name: i.name,
                      description: i.description,
                      parent_id: st.id,
                      sort_order: i.sort_order,
                      children: iCriteria,
                    } as FrameworkRow;
                  });

                return {
                  id: st.id,
                  level: "subtheme",
                  ref_code: st.code,
                  name: st.name,
                  description: st.description,
                  parent_id: t.id,
                  sort_order: st.sort_order,
                  children: subIndicators,
                } as FrameworkRow;
              });

            const themeIndicators = (indicators.data || [])
              .filter((i: any) => i.ref_code.startsWith(t.code))
              .map((i: any) => {
                const iCriteria = (criteria.data || [])
                  .filter((c: any) => c.indicator_id === i.id)
                  .map((c: any) => ({
                    id: c.id,
                    level: "criteria",
                    ref_code: "",
                    name: c.label,
                    description: `Default score: ${c.default_score}`,
                    parent_id: i.id,
                    sort_order: c.sort_order,
                  }));

                return {
                  id: i.id,
                  level: "indicator",
                  ref_code: i.ref_code,
                  name: i.name,
                  description: i.description,
                  parent_id: t.id,
                  sort_order: i.sort_order,
                  children: iCriteria,
                } as FrameworkRow;
              });

            return {
              id: t.id,
              level: "theme",
              ref_code: t.code,
              name: t.name,
              description: t.description,
              parent_id: p.id,
              sort_order: t.sort_order,
              children: [...themeSubs, ...themeIndicators],
            } as FrameworkRow;
          });

        const pillarIndicators = (indicators.data || [])
          .filter((i: any) => i.ref_code.startsWith(p.code))
          .map((i: any) => {
            const iCriteria = (criteria.data || [])
              .filter((c: any) => c.indicator_id === i.id)
              .map((c: any) => ({
                id: c.id,
                level: "criteria",
                ref_code: "",
                name: c.label,
                description: `Default score: ${c.default_score}`,
                parent_id: i.id,
                sort_order: c.sort_order,
              }));

            return {
              id: i.id,
              level: "indicator",
              ref_code: i.ref_code,
              name: i.name,
              description: i.description,
              parent_id: p.id,
              sort_order: i.sort_order,
              children: iCriteria,
            } as FrameworkRow;
          });

        return {
          id: p.id,
          level: "pillar",
          ref_code: p.code,
          name: p.name,
          description: p.description,
          sort_order: p.sort_order,
          children: [...pillarThemes, ...pillarIndicators],
        } as FrameworkRow;
      });

      setRows(framework);
    } catch (err: any) {
      console.error(err);
      message.error("Failed to fetch framework");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFramework();
  }, []);

  const columns = [
    {
      title: "Code",
      dataIndex: "ref_code",
      key: "ref_code",
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: FrameworkRow) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info(`Edit ${record.name}`)}
          />
          <Popconfirm
            title="Delete?"
            onConfirm={() => message.info(`Delete ${record.name}`)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Framework Editor</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Add Item
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={false}
        expandable={{ childrenColumnName: "children" }}
      />
    </div>
  );
}
