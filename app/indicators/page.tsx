'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

// IMPORTANT: this must exist in your repo (you already added it earlier)
import { getBrowserClient } from '@/lib/supabaseClient';

// If you style with Ant Design elsewhere and want the same look,
// you can keep these. Otherwise, remove them — they aren’t required.
import { Table, Button, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type IndicatorLevel = 'pillar' | 'theme' | 'subtheme';

type IndicatorRow = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  level: IndicatorLevel;
  pillar_id?: string | null;
  theme_id?: string | null;
  subtheme_id?: string | null;
  sort_order?: number | null;
};

export default function IndicatorsPage() {
  // Create the Supabase browser client ONLY in the browser
  const supabase = useMemo(() => getBrowserClient(), []);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Browser-only data load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust table name/columns to match your schema.
        // If your “indicators” are stored in several tables, you can
        // fetch each and join on the client, but this keeps it simple.
        const { data, error } = await supabase
          .from<IndicatorRow>('indicators')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (!cancelled) setRows(data ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load indicators');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const columns: ColumnsType<IndicatorRow> = [
    {
      title: 'Type',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: IndicatorLevel) => {
        const color =
          level === 'pillar' ? 'geekblue' : level === 'theme' ? 'green' : 'orange';
        return <Tag color={color} style={{ fontWeight: 600 }}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (code: string) => <span style={{ color: '#999' }}>[{code}]</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v) => v ?? '',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => alert(`Edit ${rec.name}`)}>Edit</Button>
          <Button size="small" danger onClick={() => alert(`Delete ${rec.name}`)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
      }}>
        <h1 style={{ margin: 0 }}>Indicators</h1>
        <Space>
          <Link href="/">Dashboard</Link>
          <Button type="primary" onClick={() => alert('Add new indicator')}>
            Add
          </Button>
        </Space>
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: '#c00' }}>
          {error}
        </div>
      )}

      <Table<IndicatorRow>
        dataSource={rows}
        columns={columns}
        loading={loading}
        rowKey={(r) => r.id}
        pagination={{ pageSize: 20, showSizeChanger: false }}
      />
    </div>
  );
}
