// app/indicators/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient'; // ✅ this exists in your repo
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

type Pillar = { code: string; name: string };
type Theme = { code: string; pillar_code: string; name: string };
type Subtheme = { code: string; theme_code: string; pillar_code: string; name: string };
type Indicator = {
  code: string;
  level: 'pillar' | 'theme' | 'subtheme';
  pillar_code: string | null;
  theme_code: string | null;
  subtheme_code: string | null;
  name: string;
  description: string | null;
  sort_order: number | null;
};

const { Title, Text } = Typography;

export default function IndicatorsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
          supabase.from('pillars').select('code,name').order('sort_order', { ascending: true }),
          supabase.from('themes').select('code,pillar_code,name').order('sort_order', { ascending: true }),
          supabase.from('subthemes')
            .select('code,theme_code,pillar_code,name')
            .order('sort_order', { ascending: true }),
        ]);

        setPillars(p || []);
        setThemes(t || []);
        setSubs(s || []);

        const { data: indicators, error } = await supabase
          .from('indicators')
          .select(
            'code,level,pillar_code,theme_code,subtheme_code,name,description,sort_order',
          )
          .order('sort_order', { ascending: true });

        if (error) throw error;

        const nameOfPillar = Object.fromEntries((p || []).map(x => [x.code, x.name]));
        const nameOfTheme = Object.fromEntries((t || []).map(x => [x.code, x.name]));
        const nameOfSub = Object.fromEntries((s || []).map(x => [x.code, x.name]));

        const enriched = (indicators || []).map((it) => ({
          key: it.code,
          code: it.code,
          level: it.level,
          pillar: it.pillar_code ? nameOfPillar[it.pillar_code] || it.pillar_code : '',
          theme: it.theme_code ? nameOfTheme[it.theme_code] || it.theme_code : '',
          subtheme: it.subtheme_code ? nameOfSub[it.subtheme_code] || it.subtheme_code : '',
          name: it.name,
          description: it.description || '',
          sort_order: it.sort_order ?? null,
        }));

        setRows(enriched);
      } catch (e: any) {
        console.error(e);
        message.error(e.message || 'Failed to load indicators');
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  const columns = [
    { title: 'Level', dataIndex: 'level', width: 110 },
    { title: 'Pillar', dataIndex: 'pillar', width: 220 },
    { title: 'Theme', dataIndex: 'theme', width: 260 },
    { title: 'Sub-theme', dataIndex: 'subtheme', width: 260 },
    { title: 'Indicator Name', dataIndex: 'name', width: 320 },
    { title: 'Description', dataIndex: 'description' },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Title level={3} style={{ margin: 0 }}>Indicators</Title>
      <Text type="secondary">
        Read-only listing for now. This page exists to satisfy the build and let you review data.
      </Text>
      <Divider style={{ margin: '8px 0' }} />
      <Table
        loading={loading}
        rowKey="key"
        dataSource={rows}
        columns={columns as any}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1200 }}
      />
    </Space>
  );
}
