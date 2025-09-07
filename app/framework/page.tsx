'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space } from 'antd';

type Row = {
  id: string;
  level: 'pillar' | 'theme' | 'subtheme';
  code: string;
  name: string;
  description?: string;
  parent_id?: string;
};

export default function FrameworkPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/framework/list');
    const data = await res.json();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Level', dataIndex: 'level', key: 'level',
      render: (level: string) => <Tag color={level==='pillar'?'red':level==='theme'?'blue':'green'}>{level}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Row) => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Primary Framework Editor</h1>
      <Table
        dataSource={rows}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
