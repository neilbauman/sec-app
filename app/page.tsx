'use client';

import { Card, Typography, Space, Button } from 'antd';
import Link from 'next/link';

export default function Page() {
  return (
    <div style={{ maxWidth: 960, margin: '32px auto', padding: 16 }}>
      <Typography.Title level={2} style={{ marginBottom: 12 }}>
        SSC Dashboard
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Welcome. Start by managing the SSC Framework. Later, we’ll add SSC Instance creation and analysis.
      </Typography.Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical">
            <Typography.Title level={4} style={{ margin: 0 }}>
              Framework
            </Typography.Title>
            <Typography.Paragraph style={{ margin: 0 }}>
              Create, browse, and edit Pillars, Themes, Sub-themes, and Standards.
            </Typography.Paragraph>
            <div>
              <Link href="/framework">
                <Button type="primary">Open Framework Editor</Button>
              </Link>
            </div>
          </Space>
        </Card>

        <Card>
          <Space direction="vertical">
            <Typography.Title level={4} style={{ margin: 0 }}>
              SSC Instances (coming soon)
            </Typography.Title>
            <Typography.Paragraph style={{ margin: 0 }}>
              Create and score instances against the framework. Access reports and exports.
            </Typography.Paragraph>
            <Button disabled>View Instances</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
